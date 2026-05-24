from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class CareerPrediction(BaseModel):
    title: str = Field(..., description="The standard industry job title (e.g., 'Backend Engineer').")
    match_reason: str = Field(..., description="1-2 concise sentences explaining why their current tech stack fits this role.")
    critical_missing_skill: str = Field(..., description="The #1 high-leverage tool or framework they should learn next to dominate this role.")

class RolePredictorResponse(BaseModel):
    suited_roles: list[CareerPrediction] = Field(
        ..., 
        description="Top 3 technical engineering or analyst roles the candidate is most qualified for based on text evidence."
    )

def predict_career_roles_chain(cleaned_text: str, llm) -> "RolePredictorResponse":
    """
    Analyzes the structural resume text to extract the candidate's core alignment
    and map them to the top 3 most compatible software engineering or data industry roles.
    """
    system_prompt = """
    You are an advanced internal corporate recruiting AI. Analyze the candidate's resume text and determine the top 3 professional technical roles they are most qualified for right now.
    
    Choose from standard market tracks like: Frontend Engineer, Backend Engineer, Fullstack Engineer, DevOps Engineer, Data Analyst, Data Engineer, Machine Learning Engineer, Mobile Developer, QA Automation Engineer, Embedded Systems Engineer, or Product Manager.
    
    Be objective, accurate, and base your alignment strictly on the depth of tools and core concepts found in their experience text.
    """
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Evaluate this candidate profile context for role alignment:\n\nResume Text:\n{resume_text}")
    ])
    
    chain = prompt | llm.with_structured_output(RolePredictorResponse)
    return chain.invoke({"resume_text": cleaned_text})