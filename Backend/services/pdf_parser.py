import io
import fitz 
from docx import Document
import re

def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text blocks from PDF or DOCX bytes natively using fitz and python-docx."""
    text = ""
    filename_lower = filename.lower()
    
    try:
        if filename_lower.endswith('.pdf'):
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            doc.close()
            return text

        elif filename_lower.endswith('.docx'):
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
    text = re.sub(r'\s+', ' ', text)
    return text.strip()