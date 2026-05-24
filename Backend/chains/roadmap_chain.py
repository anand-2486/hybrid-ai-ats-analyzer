from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class LearningResource(BaseModel):
    resource_name: str = Field(..., description="Name of the course, documentation, or book (e.g., 'Official Docker Docs').")
    resource_link: str = Field(..., description="A helpful search string or educational platform recommendation (e.g., 'Coursera / freeCodeCamp').")

class RoadmapStep(BaseModel):
    step_number: int = Field(..., description="Sequential position in the roadmap trajectory (1, 2, 3).")
    technology_or_skill: str = Field(..., description="The exact tool or domain competency to master (e.g., 'Docker').")
    actionable_objective: str = Field(..., description="What specific capstone project or capability the candidate should build to prove mastery.")
    estimated_time: str = Field(..., description="The time budget allocation required for an intermediate engineer (e.g., '2-3 Weeks').")
    recommended_resources: list[LearningResource] = Field(..., description="High-fidelity learning resources and platforms.")

class SmartRoadmapResponse(BaseModel):
    target_career_track: str = Field(..., description="The high-probability career role this roadmap optimizes for (e.g., 'DevOps Engineer').")
    strategic_overview: str = Field(..., description="A punchy, motivating summary explaining how this sequence closes the structural match gap.")
    sequential_steps: list[RoadmapStep] = Field(..., description="The step-by-step learning milestones ordered logically by architectural prerequisites.")

def generate_skill_roadmap_chain(cleaned_text: str, job_description: str, llm) -> "SmartRoadmapResponse":
    """
    Analyzes the structural deficits between the resume text and the job description requirements,
    mapping out a time-bound, sequential learning roadmap complete with vetted learning resources.
    """
    system_prompt = """
    You are an elite Principal Engineering Mentor and Technical Architect. Your job is to compile an engineering-grade learning roadmap to help a developer bridge the gap between their current resume profile and their target application goals.
    
    CRITICAL RULES FOR SEQUENCING:
    1. Organize items by logical architectural prerequisites (e.g., Teach Git and Docker *before* Kubernetes, teach SQL/Python *before* Apache Spark).
    2. Do not just throw a massive flat list of keywords. Group them into exactly 3-4 highly focused sequential steps.
    3. Ensure every step contains explicit capstone objectives and realistic, engineering-focused time estimations.
    """
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Build a strategic training roadmap using these data matrices:\n\nTarget Job Description:\n{job_description}\n\nCandidate Resume:\n{resume_text}")
    ])
    
    chain = prompt | llm.with_structured_output(SmartRoadmapResponse)
    return chain.invoke({"resume_text": cleaned_text, "job_description": job_description})