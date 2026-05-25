import numpy as np
from sentence_transformers import SentenceTransformer

try:
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception:
    embedding_model = None

def calculate_semantic_similarity(resume_text: str, job_description: str) -> float:
    """
    Computes semantic text alignment using dense sentence embeddings.
    Catches contextual concepts and synonyms that pure TF-IDF misses.
    """
    if embedding_model is None:
        return 0.0

    embeddings = embedding_model.encode([resume_text, job_description])
    
    vec_a = embeddings[0]
    vec_b = embeddings[1]

    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
        
    similarity = float(dot_product / (norm_a * norm_b))

    return round(max(0.0, min(1.0, similarity)) * 100)