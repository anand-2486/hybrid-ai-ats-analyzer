from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from prompts.prompts_reader import load_ats_prompt

# ── ATS Result Model ─────────────────────────────────────────────────────────

class ATSResponse(BaseModel):
    # The 6 exact scoring fields your UI function uses (scaled 0 to 5)
    keyword_relevance_score: int = Field(
        ..., 
        description="Score from 0 to 5 based on keyword alignment with the target job description."
    )
    formatting_score: int = Field(
        ..., 
        description="Score from 0 to 5 for general layout parseability and structural clarity."
    )
    experience_quality_score: int = Field(
        ..., 
        description="Score from 0 to 5 for progressive work history and clear descriptions."
    )
    skills_section_score: int = Field(
        ..., 
        description="Score from 0 to 5 for presence and depth of professional technical skill stacks."
    )
    education_score: int = Field(
        ..., 
        description="Score from 0 to 5 for clear academic background, degrees, and relevant certifications."
    )
    achievements_score: int = Field(
        ..., 
        description="Score from 0 to 5 for quantified achievements, metrics, and business impact keys."
    )
    
    # Text-based feedback loops
    strengths: list[str] = Field(
        default_factory=list, 
        description="Specific strengths identified in the resume formatting or alignment."
    )
    weaknesses: list[str] = Field(
        default_factory=list, 
        description="Specific structural or content weaknesses identified in the resume."
    )
    missing_keywords: list[str] = Field(
        default_factory=list, 
        description="Crucial technology stacks or domain phrases missing relative to the target job description."
    )
    improvements: list[str] = Field(
        default_factory=list, 
        description="Concrete, actionable suggestion bullets to optimize the overall resume impact."
    )
    summary: str = Field(
        ..., 
        description="A concise narrative overview performance summary of the candidate profile."
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
    
    # 4. Invoke the network stream with execution parentheses ()
    return chain.invoke({
        "resume_text": cleaned_text, 
        "job_description": job_description
    })