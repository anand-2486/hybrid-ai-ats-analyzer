from typing import Optional
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from prompts.prompts_reader import load_skills_prompt


class JDFocusArea(BaseModel):
    priority_level: str = Field(
        ..., 
        description="Priority level of this gap relative to the target JD: 'HIGH', 'MEDIUM', or 'LOW'."
    )
    skill_or_concept: str = Field(
        ..., 
        description="The exact tool, technical framework, or core design concept requested by the JD."
    )
    current_status: str = Field(
        ..., 
        description="Brief assessment of where the candidate's resume currently stands (e.g., 'Missing from text', 'Needs deeper project details', 'Strong baseline but lacks framework usage')."
    )
    actionable_preparation_step: str = Field(
        ..., 
        description="Explicit, concrete engineering instruction on exactly what the candidate should add, adjust, or learn to excel in this specific job description criteria."
    )


class BaseSkill(BaseModel):
    name: str = Field(
        ...,
        description="Name of the skill, tool, or technology"
    )
    confidence: str = Field(
        ...,
        description="Confidence level: HIGH, MEDIUM, LOW"
    )
    proficiency_signal: str = Field(
        ...,
        description="Skill usage level: PRIMARY, SECONDARY, MENTIONED"
    )
    evidence: str = Field(
        ...,
        description="Resume evidence supporting this extraction"
    )


class ProgrammingLanguage(BaseSkill):
    pass


class FrameworkOrLibrary(BaseSkill):
    pass


class Database(BaseSkill):
    type: str = Field(
        ...,
        description="Database type such as relational, NoSQL, vector, graph"
    )


class CloudAndDevOps(BaseSkill):
    category: str = Field(
        ...,
        description="Cloud or DevOps category"
    )


class ToolOrPlatform(BaseSkill):
    pass


class AIAndML(BaseSkill):
    category: str = Field(
        ...,
        description="AI/ML category"
    )


class DomainOrConcept(BaseSkill):
    pass


class APIOrProtocol(BaseSkill):
    pass



class Skills(BaseModel):
    programming_languages: list[ProgrammingLanguage] = Field(default_factory=list)
    frameworks_and_libraries: list[FrameworkOrLibrary] = Field(default_factory=list)
    databases: list[Database] = Field(default_factory=list)
    cloud_and_devops: list[CloudAndDevOps] = Field(default_factory=list)
    tools_and_platforms: list[ToolOrPlatform] = Field(default_factory=list)
    ai_and_ml: list[AIAndML] = Field(default_factory=list)
    domains_and_concepts: list[DomainOrConcept] = Field(default_factory=list)
    apis_and_protocols: list[APIOrProtocol] = Field(default_factory=list)


class SkillsResponse(BaseModel):
    candidate_name: Optional[str] = Field(
        None,
        description="Candidate name"
    )
    target_role: Optional[str] = Field(
        None,
        description="Target role inferred from resume"
    )
    extraction_summary: str = Field(
        ...,
        description="Overall technical profile summary"
    )
    skills: Skills = Field(
        ...,
        description="Grouped extracted skills"
    )
    jd_targeted_focus_plan: list[JDFocusArea] = Field(
        default_factory=list,
        description="A tailored plan outlining critical gaps, priority requirements, and actionable alignment steps based strictly on the target Job Description."
    )
    skills_flat_list: list[str] = Field(
        default_factory=list
    )


def extract_skills_from_resume_chain(cleaned_text: str, job_description: str, llm) -> "SkillsResponse":
    """
    Assembles the multi-tier technical skill taxonomy extraction chain, reads the local
    markdown prompt, and requests structured evaluation from Gemini.
    """
    system_prompt_template = load_skills_prompt()

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt_template),
        ("human", "Analyze this profile text and map it against the taxonomy metrics.\n\nJob Specs:\n{job_description}\n\nCandidate Resume:\n{resume_text}")
    ])
    
    chain = prompt | llm.with_structured_output(SkillsResponse)
    
    return chain.invoke({
        "resume_text": cleaned_text, 
        "job_description": job_description
    })