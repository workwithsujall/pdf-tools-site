from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, Form
from fastapi.responses import FileResponse
import uuid
import os
from typing import List, Optional
import tempfile
import zipfile
import fitz  # PyMuPDF

from pdf_utils import cleanup_temp_file

router = APIRouter(
    prefix="/api",
    tags=["pdf"]
)

@router.post("/split")
async def split_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    pages: Optional[str] = Form(None),
    split_all: Optional[bool] = Form(False)
):
    """
    Split a PDF file into individual pages or a specific range
    
    - **file**: PDF file to split
    - **pages**: Optional page range(s) in format "1,3-5,7" (1-based indexing)
    - **split_all**: If true, splits into all individual pages
    """
    # Check if file is a PDF
    if not file.content_type == "application/pdf" and not (file.filename and file.filename.lower().endswith('.pdf')):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read the file content
        content = await file.read()
        
        # Create a PDF document object
        doc = fitz.open(stream=content, filetype="pdf")
        total_pages = doc.page_count
        
        if total_pages == 0:
            raise HTTPException(status_code=400, detail="The PDF has no pages")
        
        # Create a temporary directory to store split pages
        temp_dir = tempfile.mkdtemp()
        output_files = []
        
        # Process based on parameters
        if split_all:
            # Split into all individual pages
            for page_num in range(total_pages):
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
                output_path = os.path.join(temp_dir, f"page_{page_num+1}.pdf")
                new_doc.save(output_path)
                new_doc.close()
                output_files.append(output_path)
        elif pages:
            # Split according to specified page ranges
            ranges = []
            for part in pages.split(','):
                if '-' in part:
                    start, end = part.split('-')
                    try:
                        start_page = int(start.strip()) - 1  # Convert to 0-based
                        end_page = int(end.strip()) - 1
                        if start_page < 0 or end_page >= total_pages or start_page > end_page:
                            raise HTTPException(status_code=400, detail=f"Invalid page range: {part}")
                        ranges.append((start_page, end_page))
                    except ValueError:
                        raise HTTPException(status_code=400, detail=f"Invalid page range format: {part}")
                else:
                    try:
                        page = int(part.strip()) - 1  # Convert to 0-based
                        if page < 0 or page >= total_pages:
                            raise HTTPException(status_code=400, detail=f"Page {page+1} out of range")
                        ranges.append((page, page))
                    except ValueError:
                        raise HTTPException(status_code=400, detail=f"Invalid page number: {part}")
            
            # Create PDFs for each specified range
            for i, (start_page, end_page) in enumerate(ranges):
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=start_page, to_page=end_page)
                range_name = f"page_{start_page+1}" if start_page == end_page else f"pages_{start_page+1}-{end_page+1}"
                output_path = os.path.join(temp_dir, f"{range_name}.pdf")
                new_doc.save(output_path)
                new_doc.close()
                output_files.append(output_path)
        else:
            # Default behavior: split into all pages
            for page_num in range(total_pages):
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
                output_path = os.path.join(temp_dir, f"page_{page_num+1}.pdf")
                new_doc.save(output_path)
                new_doc.close()
                output_files.append(output_path)
        
        # Close the original document
        doc.close()
        
        # Create a ZIP file with all the split PDFs
        timestamp = uuid.uuid4().hex[:8]
        original_name = os.path.splitext(file.filename)[0] if file.filename else "document"
        zip_filename = f"{original_name}_split_{timestamp}.zip"
        zip_path = os.path.join(temp_dir, zip_filename)
        
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for output_file in output_files:
                zipf.write(output_file, arcname=os.path.basename(output_file))
        
        # Schedule cleanup of temporary directory after response is sent
        background_tasks.add_task(lambda: cleanup_temp_dir(temp_dir))
        
        # Return the ZIP file
        return FileResponse(
            path=zip_path,
            filename=zip_filename,
            media_type="application/zip"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to split PDF: {str(e)}")


def cleanup_temp_dir(directory: str) -> None:
    """Delete a temporary directory and all its contents"""
    try:
        for file in os.listdir(directory):
            file_path = os.path.join(directory, file)
            if os.path.isfile(file_path):
                os.unlink(file_path)
        os.rmdir(directory)
    except Exception as e:
        print(f"Error cleaning up temporary directory {directory}: {str(e)}") 