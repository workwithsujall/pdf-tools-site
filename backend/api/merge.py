from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
import uuid
from typing import List

# Fix the import statement
from pdf_utils import merge_pdfs, cleanup_temp_file

router = APIRouter(
    prefix="/api",
    tags=["pdf"]
)

@router.post("/merge")
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