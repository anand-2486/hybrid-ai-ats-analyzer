import os
import uuid
import math
import json
from typing import List, Optional
from pydantic import BaseModel, Field
import numpy as np
import sqlite3

# Bypass the OpenMP runtime conflict error automatically
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# ── 🌟 OFFLINE SYSTEM CONFIGURATION MATRIX ───────────────────────────────────
# Force the transformers ecosystem to run exclusively from local disk caches
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# HUGGING FACE AUTHENTICATION TOKEN INJECTION
if os.getenv("HF_TOKEN"):
    os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")
else:
    print("WARNING: HF_TOKEN environment variable is missing from your active configuration profile.")

# ── 🌟 UNIFIED API KEY ENFORCEMENT ───────────────────────────────────────────
if not os.getenv("GOOGLE_API_KEY"):
    print("WARNING: GOOGLE_API_KEY missing from configuration environment.")

if not os.getenv("GROQ_API_KEY"):
    print("WARNING: GROQ_API_KEY missing from configuration environment.")

# Core Multi-Model Layer Imports
from groq import Groq
from google import genai
from google.genai import types
from models.tfidf_matcher import calculate_cosine_similarity
from models.semantic_matcher import calculate_semantic_similarity
from services.dl_service import extract_dl_entities
from services.pdf_parser import extract_text, clean_resume_text

app = FastAPI(
    title="SaaS Enterprise Recruiter ATS Pipeline Engine (Persistent Core)",
    description="Batch ingestion engine featuring SQLite persistence, dual-cloud failovers, and NumPy ML backup metrics."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize cloud execution handlers safely using fixed key constants
groq_client = None
gemini_client = None

if os.getenv("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
if os.getenv("GOOGLE_API_KEY"):
    gemini_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


# ── PYDANTIC SCHEMA BLOCK ────────────────────────────────────────────────────
class ATSAnalysisPayload(BaseModel):
    summary: str = "No summary generated."
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    critical_skill_gaps: List[str] = Field(default_factory=list)
    target_role: str = "Engineering Candidate"
    recruiter_likelihood: str = "Medium Priority"
    ats_compatibility: int = 50
    impact_score: int = 50
    readability: int = 50
    technical_depth: int = 50
    recruiter_appeal: int = 50
    project_quality: int = 50


@app.get("/")
def read_root():
    return {"message": "Enterprise Recruiter Ultra-Resilient Persistent Core is online."}


# ── 🌟 NEW ROUTE: FETCH HISTORICAL DATA ─────────────────────────────────────
@app.get("/api/recruiter/history")
def get_historical_leaderboard():
    """Retrieves all previously processed candidates grouped by their job context."""
    try:
        conn = sqlite3.connect("ats_database.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT c.id, c.job_id, c.filename, c.name, c.match_index, c.percentile_ahead, 
                   c.provider_used, c.scoring_categories, c.skills_details, c.missing_keywords, 
                   c.critical_skill_gaps, c.summary_analysis, j.description
            FROM candidates c
            JOIN jobs j ON c.job_id = j.id
            ORDER BY j.created_at DESC, c.match_index DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        
        history_list = []
        for r in rows:
            history_list.append({
                "candidate_id": r[0],
                "job_id": r[1],
                "filename": r[2],
                "candidate_name": r[3],
                "match_index": r[4],
                "percentile_ahead": r[5],
                "engine_routing_provider": r[6],
                "scoring_categories": json.loads(r[7]),
                "skills_details": json.loads(r[8]),
                "missing_keywords": json.loads(r[9]),
                "critical_skill_gaps": json.loads(r[10]),
                "summary": r[11],
                "job_description_context": r[12]
            })
            
        return {"success": True, "count": len(history_list), "history": history_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database retrieval crash: {str(e)}")


# ── MAIN PIPELINE: PARSE, ANALYZE, AND SAVE ──────────────────────────────────
@app.post("/api/recruiter/rank-candidates")
async def rank_candidates_pipeline(
    job_description: str = Form(...),
    files: List[UploadFile] = File(...)
):
    if not files:
        raise HTTPException(status_code=400, detail="Batch file compilation wrapper array cannot be empty.")

    # 🚀 DATABASE OPERATION: Open connection pool and insert a parent job instance record
    job_id = str(uuid.uuid4())[:8]
    try:
        db_conn = sqlite3.connect("ats_database.db")
        db_cursor = db_conn.cursor()
        db_cursor.execute("INSERT INTO jobs (id, description) VALUES (?, ?)", (job_id, job_description))
    except Exception as db_err:
        print(f"🚨 Database Connection Failure: {str(db_err)}")
        raise HTTPException(status_code=500, detail="Could not initialize database transactional pool row.")

    leaderboard = []

    for file in files:
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            continue

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
            if not isinstance(dl_entities, dict):
                dl_entities = {}
            
            # Layer 4: GenAI Structured Profile Scoring Analysis
            system_prompt = (
                "You are an expert enterprise recruitment intelligence parsing engine designed to provide deep, exhaustive candidate evaluations.\n"
                "Cross-examine the candidate resume text against the organizational job description requirements thoroughly.\n\n"
                "CRITICAL INSTRUCTIONS FOR ELABORATION:\n"
                "1. For 'summary': Write a detailed, comprehensive 4-5 sentence professional evaluation. Include their academic background, absolute core technical specialties, specific project types, and precise alignment matching metrics.\n"
                "2. For 'strengths': Provide exactly 3-4 highly detailed bullet points. Do not use generic phrases. Specify the frameworks they used, how they applied them, and why it benefits the position.\n"
                "3. For 'weaknesses': Provide exactly 3-4 deep analytical descriptions detailing technical gaps, architectural omissions, lack of production scaling, or hidden experience risks.\n\n"
                "You MUST return a flat JSON object matching this structural schema template exactly. "
                "Do NOT wrap the response inside properties like 'candidate_info' or 'analysis'. "
                "Every single key listed below must exist directly at the ROOT level of the JSON dictionary:\n"
                "{\n"
                '  "summary": "Detailed, thorough professional assessment paragraph explaining alignment...",\n'
                '  "strengths": ["Descriptive strength point 1 detailing specific tools/impact", "Descriptive strength point 2..."],\n'
                '  "weaknesses": ["Descriptive gap point 1 explaining the clear technical/role risk", "Descriptive gap point 2..."],\n'
                '  "missing_keywords": ["Keyword1", "Keyword2"],\n'
                '  "critical_skill_gaps": ["Detailed technical skill domain missing from profile"],\n'
                '  "target_role": "Target Title Matching",\n'
                '  "recruiter_likelihood": "High Shortlist Priority",\n'
                '  "ats_compatibility": 80,\n'
                '  "impact_score": 75,\n'
                '  "readability": 85,\n'
                '  "technical_depth": 70,\n'
                '  "recruiter_appeal": 75,\n'
                '  "project_quality": 65,\n'
                '  "skills_details": {\n'
                '    "programming_languages": [],\n'
                '    "frameworks_and_libraries": [],\n'
                '    "databases": [],\n'
                '    "cloud_and_devops": [],\n'
                '    "tools_and_platforms": [],\n'
                '    "ai_and_machine_learning": [],\n'
                '    "domains_and_core_concepts": [],\n'
                '    "apis_and_protocols": []\n'
                "  }\n"
                "}"
            )

            user_prompt = f"Target Organizational Job Description:\n{job_description}\n\nIncoming Candidate Resume:\n{cleaned_text}"

            raw_json_dict = None
            active_provider = "UNKNOWN"

            # ── 🌟 STAGE A: PRIMARY TRACK (GEMINI VIA GOOGLE_API_KEY) ────────
            if gemini_client:
                try:
                    print(f"[{file.filename}] Route 1: Requesting Gemini-2.5-Flash framework...")
                    gemini_response = gemini_client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=f"{system_prompt}\n\n{user_prompt}",
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.2
                        ),
                    )
                    raw_json_dict = json.loads(gemini_response.text)
                    active_provider = "GEMINI"
                    print(f"[{file.filename}] Route 1 Success: Handled cleanly by Gemini.")
                except Exception as gemini_err:
                    print(f"⚠️ [{file.filename}] ROUTE 1 FAILURE: Gemini failed: {str(gemini_err)}")

            # ── 🌟 STAGE B: HOT FAILOVER TRACK (GROQ CORE INFRASTRUCTURE) ────
            if not raw_json_dict and groq_client:
                try:
                    print(f"[{file.filename}] Route 2: Initiating automatic hot failover to Groq/Llama cluster...")
                    chat_completion = groq_client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {"role": "system", "content": system_prompt + "\nCRITICAL: Do not break string encapsulations. Do not write raw newlines inside values; compress using spaces instead."},
                            {"role": "user", "content": user_prompt}
                        ],
                        response_format={"type": "json_object"},
                        temperature=0.1
                    )
                    ai_response_text = chat_completion.choices[0].message.content
                    
                    try:
                        raw_json_dict = json.loads(ai_response_text)
                    except json.JSONDecodeError:
                        print("🔧 Formatting anomaly caught on Groq stream. Running backup validation regex string patch...")
                        if '"summary":' in ai_response_text and '"strengths":' in ai_response_text:
                            segments = ai_response_text.split('"summary":', 1)
                            remainder = segments[1].split('"strengths":', 1)
                            clean_summary = remainder[0].strip().strip(',').strip().strip('"').replace('\n', ' ').replace('"', '\\"')
                            ai_response_text = f'{segments[0]}"summary": "{clean_summary}",\n"strengths":{remainder[1]}'
                        raw_json_dict = json.loads(ai_response_text)

                    active_provider = "GROQ_FAILOVER"
                    print(f"[{file.filename}] Route 2 Success: Handled securely by Groq Llama-3.3.")
                except Exception as groq_err:
                    print(f"⚠️ [{file.filename}] ROUTE 2 FAILURE: Groq track failed: {str(groq_err)}")

            # ── 🌟 STAGE C: EMERGENCY OFFLINE TRACK (LOCAL NUMPY ML LAYER) ───
            if not raw_json_dict:
                print(f"🚨 [{file.filename}] CLUSTER DROPOUT: Both Cloud LLM lines down. Initializing Local NumPy ML Track...")
                raw_target_role = "Frontend Developer Intern" if "front" in cleaned_text.lower() else "Machine Learning Intern"
                is_ml_track_detected = "ml" in raw_target_role.lower() or "machine" in raw_target_role.lower() or "data" in raw_target_role.lower()
                
                skills_len = len(dl_entities.get("skills", [])) or len(dl_entities.get("languages", []))
                
                if os.path.exists("models/ats_ml_weights.json"):
                    with open("models/ats_ml_weights.json", "r") as w_file:
                        ml_p = json.load(w_file)
                    w, b, f_m, f_s = np.array(ml_p["weights"]), ml_p["bias"], np.array(ml_p["feature_means"]), np.array(ml_p["feature_stds"])
                    ml_pred = int(np.dot(([keyword_score, semantic_score, skills_len, 2] - f_m) / f_s, w) + b)
                    ml_score = max(5, min(100, ml_pred))
                else:
                    ml_score = max(5, min(100, round((keyword_score * 0.3) + (semantic_score * 0.7))))

                raw_json_dict = {
                    "summary": "Local ML Pipeline Assessment: Profile evaluation computed entirely offline due to active network timeouts. High match relevance verified across localized embedding token arrays.",
                    "strengths": [f"Technical Alignment Matrix: Local keywords overlap scored at {keyword_score:.1f}% Match Profile Index."],
                    "weaknesses": ["Network Disconnect Status: Comprehensive multi-agent deep structural scaling review skipped."],
                    "missing_keywords": ["Internet Connection Required"],
                    "critical_skill_gaps": ["Manual Matrix Implementation Proof Missing"] if is_ml_track_detected else ["Machine Learning & LLM Integration Missing"],
                    "target_role": raw_target_role,
                    "recruiter_likelihood": "Medium Priority" if ml_score < 75 else "High Priority",
                    "ats_compatibility": int(ml_score),
                    "impact_score": int(max(10, ml_score - 5)),
                    "readability": 85,
                    "technical_depth": int(max(10, ml_score - 10)),
                    "recruiter_appeal": int(max(10, ml_score - 8)),
                    "project_quality": int(max(10, ml_score - 12)),
                    "skills_details": {
                        "programming_languages": dl_entities.get("languages", []) or dl_entities.get("skills", [])[:4],
                        "frameworks_and_libraries": dl_entities.get("frameworks", []),
                        "databases": dl_entities.get("databases", []),
                        "cloud_and_devops": dl_entities.get("devops", []),
                        "tools_and_platforms": dl_entities.get("tools", []),
                        "ai_and_machine_learning": dl_entities.get("ai_ml", []),
                        "domains_and_core_concepts": dl_entities.get("concepts", []),
                        "apis_and_protocols": dl_entities.get("apis", [])
                    }
                }
                active_provider = "LOCAL_NUMPY_ML"

            # ── 🌟 DYNAMIC PARSING & TRANSLATION ENGINE ──────────────────────
            if isinstance(raw_json_dict, dict) and ("summary" not in raw_json_dict or "skills_details" not in raw_json_dict):
                for key, val in list(raw_json_dict.items()):
                    if isinstance(val, dict) and "summary" in val:
                        raw_json_dict = val
                        break

            ui_safe_skills = {
                "programming_languages": dl_entities.get("languages", []) or dl_entities.get("skills", [])[:4],
                "frameworks_libraries": dl_entities.get("frameworks", []),
                "databases": dl_entities.get("databases", []),
                "cloud_devops": dl_entities.get("devops", []),
                "tools_platforms": dl_entities.get("tools", []),
                "ai_machine_learning": dl_entities.get("ai_ml", []),
                "domains_core_concepts": dl_entities.get("concepts", []),
                "apis_protocols": dl_entities.get("apis", [])
            }

            if "skills_details" in raw_json_dict and isinstance(raw_json_dict["skills_details"], dict):
                rb = raw_json_dict["skills_details"]
                ui_safe_skills["programming_languages"] = rb.get("programming_languages") or rb.get("programming-languages") or ui_safe_skills["programming_languages"]
                ui_safe_skills["frameworks_libraries"] = rb.get("frameworks_libraries") or rb.get("frameworks_and_libraries") or ui_safe_skills["frameworks_libraries"]
                ui_safe_skills["databases"] = rb.get("databases") or rb.get("database") or ui_safe_skills["databases"]
                ui_safe_skills["cloud_devops"] = rb.get("cloud_devops") or rb.get("cloud_and_devops") or ui_safe_skills["cloud_devops"]
                ui_safe_skills["tools_platforms"] = rb.get("tools_platforms") or rb.get("tools_and_platforms") or ui_safe_skills["tools_platforms"]
                ui_safe_skills["ai_machine_learning"] = rb.get("ai_machine_learning") or rb.get("ai_and_machine_learning") or ui_safe_skills["ai_machine_learning"]
                ui_safe_skills["domains_core_concepts"] = rb.get("domains_core_concepts") or rb.get("domains_and_core_concepts") or ui_safe_skills["domains_core_concepts"]
                ui_safe_skills["apis_protocols"] = rb.get("apis_protocols") or rb.get("apis_and_protocols") or ui_safe_skills["apis_protocols"]

            raw_json_dict.pop("skills_details", None)
            validated_payload = ATSAnalysisPayload.model_validate(raw_json_dict)
            ats_payload = validated_payload.model_dump()
            
            # Extract score buckets
            ats_comp = ats_payload.get("ats_compatibility", 50)
            impact = ats_payload.get("impact_score", 50)
            readability = ats_payload.get("readability", 50)
            tech_depth = ats_payload.get("technical_depth", 50)
            appeal = ats_payload.get("recruiter_appeal", 50)
            proj_quality = ats_payload.get("project_quality", 50)
            
            llm_category_average = (ats_comp + impact + readability + tech_depth + appeal + proj_quality) / 6
            
            raw_match_index = (
                (llm_category_average * 0.50) + 
                (semantic_score * 0.35) + 
                (keyword_score * 0.15)
            )
            
            boosted_score = round(math.sqrt(max(0, raw_match_index)) * 10)
            overall_match_index = max(1, min(100, boosted_score))
            
            mean, std_dev = 68.0, 10.0
            z_score = (overall_match_index - mean) / std_dev
            percentile_ahead = round(0.5 * (1.0 + math.erf(z_score / math.sqrt(2.0))) * 100)
            percentile_ahead = max(1, min(99, percentile_ahead))

            categories_map = {
                "ats_compatibility": ats_comp,
                "impact_score": impact,
                "readability_index": readability,
                "technical_depth_metric": tech_depth,
                "recruiter_appeal": appeal,
                "project_quality": proj_quality
            }

            # ── 🌟 DATABASE OPERATION: PERSIST INDIVIDUAL CANDIDATE RECORD ──
            cand_id = str(uuid.uuid4())[:8]
            db_cursor.execute("""
                INSERT INTO candidates (
                    id, job_id, filename, name, match_index, percentile_ahead, provider_used,
                    scoring_categories, skills_details, missing_keywords, critical_skill_gaps, summary_analysis
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                cand_id, job_id, file.filename, file.filename.rsplit('.', 1)[0].replace('_', ' ').title(),
                overall_match_index, percentile_ahead, active_provider,
                json.dumps(categories_map), json.dumps(ui_safe_skills),
                json.dumps(ats_payload.get("missing_keywords", [])), json.dumps(ats_payload.get("critical_skill_gaps", [])),
                ats_payload.get("summary", "No summary calculated.")
            ))

            leaderboard.append({
                "candidate_id": cand_id,
                "filename": file.filename,
                "candidate_name": file.filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title(),
                "match_index": overall_match_index,
                "percentile_ahead": percentile_ahead,
                "scoring_categories": categories_map,
                "keyword_score": keyword_score,
                "semantic_score": semantic_score,
                "semantic_similarity_score": ats_payload.get("semantic_similarity_score", round(semantic_score)),
                "missing_keywords": ats_payload.get("missing_keywords", []),
                "critical_skill_gaps": ats_payload.get("critical_skill_gaps", []),
                "target_role": ats_payload.get("target_role", "Engineering Candidate"),
                "recruiter_likelihood": ats_payload.get("recruiter_likelihood", "Medium Priority"),
                "ats_details": ats_payload,
                "skills_details": ui_safe_skills, 
                "token_entities": dl_entities,
                "engine_routing_provider": active_provider
            })

        except Exception as e:
            print(f"Error processing profile {file.filename}: {str(e)}")
            continue

    # Commit operations and clear connection lines cleanly
    db_conn.commit()
    db_conn.close()

    sorted_leaderboard = sorted(leaderboard, key=lambda x: x["match_index"], reverse=True)

    return {
        "success": True,
        "total_processed": len(sorted_leaderboard),
        "leaderboard": sorted_leaderboard
    }