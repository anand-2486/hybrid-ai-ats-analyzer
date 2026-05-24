from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from prompts.prompts_reader import load_ats_prompt

# ── ATS Result Model ─────────────────────────────────────────────────────────

class ATSResponse(BaseModel):
    # 🌟 UPGRADE: Core Enterprise Category Metrics scaled explicitly from 0 to 100
    ats_compatibility: int = Field(
        ..., 
        description="Score from 0 to 100 analyzing parsing layout compliance, section grouping, and structural ATS validation."
    )
    impact_score: int = Field(
        ..., 
        description="Score from 0 to 100 measuring outcome-driven, quantified performance results and statistical metric proofs."
    )
    readability: int = Field(
        ..., 
        description="Score from 0 to 100 evaluating typography hierarchy, whitespace scanning balance, and structural cleanly presentation."
    )
    technical_depth: int = Field(
        ..., 
        description="Score from 0 to 100 evaluating specialized technical framework density, core tool taxonomies, and domain expertise execution."
    )
    recruiter_appeal: int = Field(
        ..., 
        description="Score from 0 to 100 measuring trajectory progression, strong narrative verbs, and strategic presentation appeal."
    )
    project_quality: int = Field(
        ..., 
        description="Score from 0 to 100 assessing context-action-result project framing, engineering scale, and problem-solution depth."
    )
    
    # Text-based feedback loops
    strengths: list[str] = Field(
        default_factory=list, 
        description="Specific strengths identified in the resume formatting, architecture, or skills alignment."
    )
    weaknesses: list[str] = Field(
        default_factory=list, 
        description="Specific structural gaps or target content weaknesses identified in the candidate profile."
    )
    missing_keywords: list[str] = Field(
        default_factory=list, 
        description="Crucial software tools, tech stacks, or domain phrases missing relative to the target job requirements."
    )
    improvements: list[str] = Field(
        default_factory=list, 
        description="Concrete, highly actionable suggestions to elevate the overall profile quality."
    )
    summary: str = Field(
        ..., 
        description="A concise narrative overview performance summary of the candidate profile tailored for talent acquisition recruiters."
    )


# ── Chain Builder ────────────────────────────────────────────────────────────

def analyze_resume_chain(cleaned_text: str, job_description: str, llm) -> "ATSResponse":
    """
    Assembles the structured extraction chain, reads the local markdown prompt,
    and invokes Gemini to return a validated Pydantic model contract.
    """
    # 1. Load the markdown content dynamically from your local prompts folder
    system_prompt_template = load_ats_prompt()
    
    # 2. Build the structural chat message wrapper template
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt_template),
        ("human", "Please parse this profile context now.\n\nJob Specs:\n{job_description}\n\nCandidate Resume:\n{resume_text}")
    ])
    
    # 3. Force Gemini to conform its output matrix directly to your response class structure
    chain = prompt | llm.with_structured_output(ATSResponse)
    
    # 4. Invoke the network stream with extraction parameters
    return chain.invoke({
        "resume_text": cleaned_text, 
        "job_description": job_description
    })