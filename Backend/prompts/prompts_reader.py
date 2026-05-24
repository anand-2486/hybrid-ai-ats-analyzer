import os

PROMPT_DIR = os.path.dirname(os.path.abspath(__file__))

def load_ats_prompt():
    with open(os.path.join(PROMPT_DIR, 'ats_prompt.md'), 'r', encoding='utf-8') as file:
        return file.read()
    
def load_skills_prompt():
    with open(os.path.join(PROMPT_DIR, 'skills_prompt.md'), 'r', encoding='utf-8') as file:
        return file.read()
    
