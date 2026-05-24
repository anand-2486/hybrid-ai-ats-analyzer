from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class EnhancerResponse(BaseModel):
    enhanced_bullet: str = Field(
        ..., 
        description="The completely rewritten, metric-driven, high-impact resume bullet point."
    )
    explanation: str = Field(
        ..., 
        description="Brief explanation of what action keywords and metric vectors were injected."
    )

def enhance_bullet_chain(weak_bullet: str, target_focus: str, llm) -> "EnhancerResponse":
    """
    Orchestrates Gemini to refactor weak performance descriptions into 
    quantified, ATS-optimized accomplishment statements.
    """
    system_prompt = """
    You are an elite technical career coach and executive recruiter. Your task is to transform weak, passive resume bullet points into high-impact, metrics-driven accomplishment vectors optimized for ATS scanners.
    
    CRITICAL RULES:
    1. Use the XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].
    2. Start with a strong, definitive active action verb.
    3. If exact metrics aren't provided, logically invent realistic, professional engineering metrics (e.g., 'reduced latency by 30%', 'boosted test coverage to 85%') that match the domain context.
    4. Keep the output highly concise, punchy, and structurally elegant.
    """
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Refactor this entry:\nWeak Bullet: {weak_bullet}\nTarget Domain Tech/Context: {target_focus}")
    ])
    
    chain = prompt | llm.with_structured_output(EnhancerResponse)
    return chain.invoke({"weak_bullet": weak_bullet, "target_focus": target_focus})