# type: ignore
import fitz  # PyMuPDF
import os
import logging
from tempfile import NamedTemporaryFile
from typing import BinaryIO, List


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def compress_pdf(pdf_file: BinaryIO, compression_level: int = 1) -> str:
    """
    Compress a PDF file using PyMuPDF.
    
    Args:
        pdf_file: The input PDF file as a file-like object
        compression_level: Compression level (1-4), higher means more compression but potentially lower quality
        
    Returns:
        Path to the compressed PDF file
    """
    # Create a temporary file for the compressed PDF
    temp_output = NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_output.close()
    
    try:
        # Open the PDF using PyMuPDF
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        
        # Configure compression options based on level
        if compression_level == 1:
            # Light compression
            compression_options = {
                "deflate": True,  # Use deflate compression for streams
                "garbage": 0,     # No garbage collection
                "clean": False    # Don't clean document structure
            }
        elif compression_level == 2:
            # Medium compression
            compression_options = {
                "deflate": True,
                "garbage": 1,     # Clean unused objects
                "clean": True     # Clean document structure
            }
        elif compression_level == 3:
            # High compression
            compression_options = {
                "deflate": True,
                "garbage": 2,     # More aggressive cleaning
                "clean": True
            }
        else:  # compression_level >= 4
            # Maximum compression
            compression_options = {
                "deflate": True,
                "garbage": 3,     # Most aggressive cleaning
                "clean": True
            }
        
        # Save with compression options
        doc.save(temp_output.name, **compression_options)
        doc.close()
        
        return temp_output.name
    except Exception as e:
        # If there's an error, clean up the temporary file and re-raise
        logger.error(f"Error compressing PDF: {str(e)}")
        if os.path.exists(temp_output.name):
            os.unlink(temp_output.name)
        raise e


async def merge_pdfs(pdf_files: List[BinaryIO]) -> str:
    """
    Merge multiple PDF files into a single PDF using PyMuPDF.
    
    Args:
        pdf_files: List of input PDF files as file-like objects
        
    Returns:
        Path to the merged PDF file
    """
    if len(pdf_files) < 2:
        raise ValueError("At least 2 PDF files are required for merging")
    
    # Create a temporary file for the merged PDF
    temp_output = NamedTemporaryFile(delete=False, suffix=".pdf")
    temp_output.close()
    
    try:
        logger.info(f"Starting to merge {len(pdf_files)} PDF files")
        # Create a new PDF document
        merged_doc = fitz.open()
        
        # Process each PDF file
        for i, pdf_file in enumerate(pdf_files):
            try:
                # Open the PDF
                pdf_content = pdf_file.read()
                # Skip empty files
                if not pdf_content:
                    logger.warning(f"Skipping empty PDF file at index {i}")
                    continue
                
                doc = fitz.open(stream=pdf_content, filetype="pdf")
                
                # Copy pages to the merged document
                merged_doc.insert_pdf(doc)
                
                # Close the source document
                doc.close()
                logger.info(f"Added PDF {i+1}/{len(pdf_files)} to merged document")
            except Exception as e:
                logger.error(f"Error processing PDF file at index {i}: {str(e)}")
                # Continue with other files even if one fails
        
        if merged_doc.page_count == 0:
            raise ValueError("No valid PDF pages found in the input files")
        
        # Save the merged document
        merged_doc.save(temp_output.name)
        logger.info(f"Successfully merged {merged_doc.page_count} pages to {temp_output.name}")
        merged_doc.close()
        
        return temp_output.name
    except Exception as e:
        # If there's an error, clean up the temporary file and re-raise
        logger.error(f"Error merging PDFs: {str(e)}")
        if os.path.exists(temp_output.name):
            os.unlink(temp_output.name)
        raise e


def cleanup_temp_file(file_path: str) -> None:
    """Delete a temporary file if it exists"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            logger.info(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        logger.error(f"Error cleaning up temporary file {file_path}: {str(e)}") 