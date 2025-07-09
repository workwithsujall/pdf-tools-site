#!/usr/bin/env python3
# type: ignore
# IDE: FastAPI, uvicorn imports are provided when requirements are installed

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from typing import Optional, List

from pdf_utils import compress_pdf, merge_pdfs, cleanup_temp_file
from api.merge import router as merge_router
from api.split import router as split_router

app = FastAPI(
    title="PDF Tools API",
    description="API for PDF manipulation tools",
    version="1.0.0"
)

# Get allowed origins from environment variable or use default
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Use environment variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(merge_router)
app.include_router(split_router)

@app.post("/compress-pdf")
async def compress_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    compression_level: Optional[int] = Form(1)
):
    """
    Compress a PDF file
    
    - **file**: PDF file to compress
    - **compression_level**: Compression level (1-4, higher = more compression)
    """
    # Check if file is a PDF
    if not file.content_type == "application/pdf" and not (file.filename and file.filename.lower().endswith('.pdf')):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Convert None to default value and ensure it's between 1-4
        level = 1 if compression_level is None else max(1, min(4, compression_level))
        
        # Process the PDF file
        temp_file_path = await compress_pdf(file.file, compression_level=level)
        
        # Get original filename without extension
        original_name = os.path.splitext(file.filename)[0]
        
        # Create output filename
        output_filename = f"{original_name}_compressed.pdf"
        
        # Schedule cleanup of temporary file after response is sent
        background_tasks.add_task(cleanup_temp_file, temp_file_path)
        
        # Return the compressed file
        return FileResponse(
            path=temp_file_path,
            filename=output_filename,
            media_type="application/pdf"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compress PDF: {str(e)}")


@app.post("/merge-pdfs")
async def merge_pdfs_endpoint(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Merge multiple PDF files into one
    
    - **files**: List of PDF files to merge
    """
    # Check if we have at least 2 files
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required")
        
    # Check if all files are PDFs
    for file in files:
        if not file.content_type == "application/pdf" and not (file.filename and file.filename.lower().endswith('.pdf')):
            raise HTTPException(status_code=400, detail=f"File '{file.filename}' is not a PDF. Only PDF files are supported.")
    
    try:
        # Load file contents into memory
        pdf_files = []
        for file in files:
            # Read the file content
            content = await file.read()
            # Reset the file position
            await file.seek(0)
            # Store the file content
            pdf_files.append(file.file)
        
        # Process the PDF files
        temp_file_path = await merge_pdfs(pdf_files)
        
        # Create output filename
        timestamp = uuid.uuid4().hex[:8]
        output_filename = f"merged_document_{timestamp}.pdf"
        
        # Schedule cleanup of temporary file after response is sent
        background_tasks.add_task(cleanup_temp_file, temp_file_path)
        
        # Return the merged file
        return FileResponse(
            path=temp_file_path,
            filename=output_filename,
            media_type="application/pdf"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to merge PDFs: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "PDF Tools API",
        "version": "1.0.0",
        "endpoints": [
            {
                "path": "/compress-pdf",
                "method": "POST",
                "description": "Compress PDF files"
            },
            {
                "path": "/merge-pdfs",
                "method": "POST",
                "description": "Merge multiple PDF files"
            },
            {
                "path": "/api/merge",
                "method": "POST",
                "description": "Merge multiple PDF files (modular router)"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 