import os
# Bypass the OpenMP runtime conflict error automatically
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# 🌟 Core multi-model layer imports resting in the same folder level
from chains.ats_chain import analyze_resume_chain
from chains.skill_chain import extract_skills_from_resume_chain
from models.tfidf_matcher import calculate_cosine_similarity
from services.dl_service import extract_dl_entities
from services.pdf_parser import extract_text, clean_resume_text

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("CRITICAL: GOOGLE_API_KEY is missing from your configuration profiles.")

app = FastAPI(
    title="AI-ATS Intelligence Platform Engine",
    description="Orchestration gateway handling classic ML feature matrices, DL NER models, and GenAI schemas."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize stable LLM configuration
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.0,
    extra_body={"generationConfig": {"seed": 42}}
)

@app.get("/")
def read_root():
    return {"message": "AI-ATS Intelligence Engine is running smoothly."}

@app.post("/api/analyze")
async def analyze_profile(
    job_description: str = Form(...),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Invalid format. Supply a valid .pdf or .docx document.")

    try:
        # Layer 1: Data Ingestion & Extraction (In-Memory byte streaming)
        file_bytes = await file.read()
        raw_text = extract_text(file_bytes, file.filename)
        cleaned_text = clean_resume_text(raw_text)
        
        if not cleaned_text.strip():
            raise HTTPException(status_code=400, detail="Unable to extract clean text blocks from the file.")
            
        # Layer 2: Classic Machine Learning (Manual TF-IDF Cosine Matcher)
        semantic_score = calculate_cosine_similarity(cleaned_text, job_description)
        
        # Layer 3: Deep Learning (PyTorch Bi-LSTM Named Entity Recognition)
        dl_entities = extract_dl_entities(cleaned_text)
        
        # Layer 4: Generative AI Orchestration (LangChain Structured Output Extraction Chains)
        ats_results = analyze_resume_chain(cleaned_text, job_description, llm)
        skills_results = extract_skills_from_resume_chain(cleaned_text, job_description, llm)
        
        # Convert Pydantic schemas to native mutable dictionaries
        ats_payload = ats_results.model_dump()
        skills_payload = skills_results.model_dump()
        
        # Append the PyTorch neural network tags cleanly into the ATS dashboard feedback loop
        ats_payload["deep_learning_entities"] = dl_entities
        
        # Compile everything into a unified data contract response
        return {
            "success": True,
            "semantic_score": semantic_score,
            "ats": ats_payload,
            "skills": skills_payload
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Orchestration Engine Fault: {str(e)}")