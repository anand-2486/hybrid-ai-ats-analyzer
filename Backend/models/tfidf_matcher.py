import math
import re

def tokenize(text: str) -> list[str]:
    """Converts text to lowercase and splits it into alphanumeric tokens."""
    text = text.lower()
    # Using regex to grab words/numbers, stripping punctuation
    tokens = re.findall(r'\b\w+\b', text)
    return tokens

def calculate_tf(tokens: list[str]) -> dict[str, float]:
    """Calculates Term Frequency (TF) for a single document."""
    tf_dict = {}
    total_tokens = len(tokens)
    
    if total_tokens == 0:
        return tf_dict
        
    # Count occurrences
    for token in tokens:
        tf_dict[token] = tf_dict.get(token, 0) + 1
        
    # Standardize by total token count
    for token in tf_dict:
        tf_dict[token] = tf_dict[token] / total_tokens
        
    return tf_dict

def calculate_tfidf_vectors(resume_text: str, jd_text: str) -> tuple[dict[str, float], dict[str, float]]:
    """Generates manual TF-IDF vectors for both the resume and the job description."""
    resume_tokens = tokenize(resume_text)
    jd_tokens = tokenize(jd_text)
    
    # 1. Calculate individual Term Frequencies
    resume_tf = calculate_tf(resume_tokens)
    jd_tf = calculate_tf(jd_tokens)
    
    # 2. Build the unique global vocabulary across both documents
    vocabulary = set(resume_tf.keys()).union(set(jd_tf.keys()))
    
    # 3. Calculate Inverse Document Frequency (IDF) manually
    # Total documents (N) = 2
    idf_dict = {}
    for word in vocabulary:
        # Count how many documents contain the word
        docs_with_word = 0
        if word in resume_tf: docs_with_word += 1
        if word in jd_tf: docs_with_word += 1
        
        # Applying standard smooth IDF formula: log(N / docs_with_word) + 1
        idf_dict[word] = math.log(2 / docs_with_word) + 1.0

    # 4. Compute final TF-IDF vector weights
    resume_tfidf = {}
    jd_tfidf = {}
    
    for word in vocabulary:
        resume_tfidf[word] = resume_tf.get(word, 0.0) * idf_dict[word]
        jd_tfidf[word] = jd_tf.get(word, 0.0) * idf_dict[word]
        
    return resume_tfidf, jd_tfidf

def calculate_cosine_similarity(resume_text: str, jd_text: str) -> int:
    """Computes the cosine similarity score from scratch and scales it out of 100."""
    # Get the raw numeric weight distributions
    vec_a, vec_b = calculate_tfidf_vectors(resume_text, jd_text)
    
    dot_product = 0.0
    magnitude_a = 0.0
    magnitude_b = 0.0
    
    # Compute dot product and magnitude vector lengths manually
    for word in vec_a:
        val_a = vec_a[word]
        val_b = vec_b.get(word, 0.0)
        
        dot_product += val_a * val_b
        magnitude_a += val_a ** 2
        magnitude_b += val_b ** 2
        
    magnitude_a = math.sqrt(magnitude_a)
    magnitude_b = math.sqrt(magnitude_b)
    
    if magnitude_a == 0 or magnitude_b == 0:
        return 0
        
    similarity = dot_product / (magnitude_a * magnitude_b)
    
    # Convert decimal (0.0 - 1.0) to an integer percentage out of 100
    return int(round(similarity * 100))

if __name__ == "__main__":
    test_resume = "Skilled Python Software Engineer with experience in FastAPI and custom Machine Learning algorithms."
    test_jd = "Looking for a Software Engineer expert in Python, backend web development with FastAPI, and data models."
    
    score = calculate_cosine_similarity(test_resume, test_jd)
    print(f"Test Mathematical Match Score: {score} / 100")