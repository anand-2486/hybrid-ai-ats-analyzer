import os
import uuid
import math
# Bypass the OpenMP runtime conflict error automatically
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# ── Core Multi-Model Layer Imports ───────────────────────────────────────────
from chains.ats_chain import analyze_resume_chain
from chains.skill_chain import extract_skills_from_resume_chain
from models.tfidf_matcher import calculate_cosine_similarity
from models.semantic_matcher import calculate_semantic_similarity
from services.dl_service import extract_dl_entities
from services.pdf_parser import extract_text, clean_resume_text

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("CRITICAL: GOOGLE_API_KEY is missing from your configuration profiles.")

app = FastAPI(
    title="SaaS Enterprise Recruiter ATS Pipeline Engine",
    description="Batch ingestion engine grading, ranking, and sorting multiple candidate profiles against requirements."
)

# Explicitly whitelist local development origins to clear browser CORS preflight flags
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)

@app.get("/")
def read_root():
    return {"message": "Enterprise Recruiter Batch Pipeline Core is active."}


@app.post("/api/recruiter/rank-candidates")
async def rank_candidates_pipeline(
    job_description: str = Form(...),
    files: list[UploadFile] = File(...)
):
    """
    Ingests a master JD framework alongside a batch array of candidate profiles.
    Parses, evaluates, and scores each file across 6 deep categories and multi-model layers,
    applying an algebraic normalization curve to match market score expectations.
    """
    if not files:
        raise HTTPException(status_code=400, detail="Batch file compilation wrapper array cannot be empty.")

    leaderboard = []

    for file in files:
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            continue # Soft-skip invalid file formats safely within loop context

        try:
            # Layer 1: Read and process individual file strings
            file_bytes = await file.read()
            raw_text = extract_text(file_bytes, file.filename)
            cleaned_text = clean_resume_text(raw_text)
            
            if not cleaned_text.strip():
                continue

            # Layer 2: Compute classic text overlap matrices and semantic vector matching
            keyword_score = calculate_cosine_similarity(cleaned_text, job_description)
            semantic_score = calculate_semantic_similarity(cleaned_text, job_description)
            
            # Layer 3: Deep Learning (PyTorch Entity Token Tracking)
            dl_entities = extract_dl_entities(cleaned_text)
            
            # Layer 4: GenAI Structured Profile Scoring Analysis
            ats_results = analyze_resume_chain(cleaned_text, job_description, llm)
            skills_results = extract_skills_from_resume_chain(cleaned_text, job_description, llm)
            
            ats_payload = ats_results.model_dump()
            skills_payload = skills_results.model_dump()
            
            # EXTRACTION: Pull the 6 Deep Multi-Dimensional AI Categories out of the upgraded chain payload
            ats_comp = ats_payload.get("ats_compatibility", 50)
            impact = ats_payload.get("impact_score", 50)
            readability = ats_payload.get("readability", 50)
            tech_depth = ats_payload.get("technical_depth", 50)
            appeal = ats_payload.get("recruiter_appeal", 50)
            proj_quality = ats_payload.get("project_quality", 50)
            
            # Calculate a robust macro overall structural average from the 6 vectors
            llm_category_average = (ats_comp + impact + readability + tech_depth + appeal + proj_quality) / 6
            
            # Balanced raw index combining algorithm vectors and deep LLM attributes
            # Weights allocation: 50% LLM structural breakdown, 35% Dense Semantic Synonyms, 15% Classic Overlap
            raw_match_index = (
                (llm_category_average * 0.50) + 
                (semantic_score * 0.35) + 
                (keyword_score * 0.15)
            )
            
            # 🌟 INDUSTRY CURVE BOOSTER: Normalizes mathematically strict vector ranges 
            # to line up gracefully with standard market application score expectations.
            boosted_score = round(math.sqrt(max(0, raw_match_index)) * 10)
            overall_match_index = max(1, min(100, boosted_score))
            
            # 📊 STATISTICAL PERCENTILE MODEL COHERENCE LAYER
            # Computes a standard normal distribution z-score assuming a calibrated population mean of 68.0 and std-dev of 10.0
            mean, std_dev = 68.0, 10.0
            z_score = (overall_match_index - mean) / std_dev
            percentile_ahead = round(0.5 * (1.0 + math.erf(z_score / math.sqrt(2.0))) * 100)
            percentile_ahead = max(1, min(99, percentile_ahead)) # Clamp gracefully between 1% and 99%

            leaderboard.append({
                "candidate_id": str(uuid.uuid4())[:8],
                "filename": file.filename,
                "candidate_name": file.filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title(),
                "match_index": overall_match_index,
                "percentile_ahead": percentile_ahead,
                "scoring_categories": {
                    "ats_compatibility": ats_comp,
                    "impact_score": impact,
                    "readability": readability,
                    "technical_depth": tech_depth,
                    "recruiter_appeal": appeal,
                    "project_quality": proj_quality
                },
                "keyword_score": keyword_score,
                "semantic_score": semantic_score,
                "ats_details": ats_payload,
                "skills_details": skills_payload,
                "token_entities": dl_entities
            })

        except Exception as e:
            # Prevent a single corrupt file from crashing the entire multi-file pipeline payload execution
            print(f"Error processing profile {file.filename}: {str(e)}")
            continue

    # CRITICAL RECRUITER ACTION: Sort the entire leaderboard array by the absolute Match Index descending
    sorted_leaderboard = sorted(leaderboard, key=lambda x: x["match_index"], reverse=True)

    return {
        "success": True,
        "total_processed": len(sorted_leaderboard),
        "leaderboard": sorted_leaderboard
    }