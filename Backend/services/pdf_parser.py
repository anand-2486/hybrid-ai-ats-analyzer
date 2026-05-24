import io
import fitz  # PyMuPDF
from docx import Document
import re

def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text blocks from PDF or DOCX bytes natively using fitz and python-docx."""
    text = ""
    filename_lower = filename.lower()
    
    try:
        # 1. For extracting text from PDF using PyMuPDF (fitz)
        if filename_lower.endswith('.pdf'):
            # Open the virtual stream directly from memory
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            doc.close()
            return text

        # 2. For extracting text from DOCX using python-docx
        elif filename_lower.endswith('.docx'):
            # Wrap bytes into an in-memory binary stream container
            file_stream = io.BytesIO(file_bytes)
            doc = Document(file_stream)
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text

        else:
            return ""
            
    except Exception as e:
        print(f"Extraction Pipeline Error: {e}")
        return ""

def clean_resume_text(text: str) -> str:
    """Sanitizes extracted text by removing messy layout/whitespace clutter."""
    # Compress multiple whitespaces, tabs, or newlines into a single clean space
    text = re.sub(r'\s+', ' ', text)
    return text.strip()