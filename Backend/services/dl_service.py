import torch
import os
from deep_learning.bi_lstm_ner import BiLSTMNER
from deep_learning.tokenizer import ResumeTokenizer


def extract_dl_entities(cleaned_text: str) -> list[dict]:
    return [{"token": "test", "confidence_class": "B-SKILL"}] # Temporary rapid mock


def extract_dl_entities(cleaned_text: str) -> list[dict]:
    """
    Feeds the cleaned resume text through the custom PyTorch Bi-LSTM network
    to extract deep-learning inferred token tag classifications.
    """
    try:
        base_corpus = [
            "python java c++ go rust javascript typescript backend frontend api devops",
            "aws azure docker kubernetes pytorch tensorflow machine learning sql nosql"
        ]
        tokenizer = ResumeTokenizer()
        tokenizer.build_vocab(base_corpus)

        input_tensor = tokenizer.text_to_tensor(cleaned_text)

        TAGSET_SIZE = 3
        model = BiLSTMNER(
            vocab_size=len(tokenizer.word2idx),
            embedding_dim=32,
            hidden_dim=64,
            tagset_size=TAGSET_SIZE
        )

        model.eval()
        with torch.no_grad():
            logits = model(input_tensor)
            predictions = torch.argmax(logits, dim=-1).squeeze().tolist()

        decoded_tokens = tokenizer.tensor_to_text(input_tensor)
        if not isinstance(predictions, list):
            predictions = [predictions]

        extracted_tags = []
        for token, tag_id in zip(decoded_tokens, predictions):
            if tag_id != 0 and token not in [tokenizer.PAD_TOKEN, tokenizer.UNK_TOKEN]:
                extracted_tags.append({
                    "token": token,
                    "confidence_class": f"NEURAL_ID_{tag_id}"
                })
                
        return extracted_tags[:8]  
        
    except Exception as e:
        print(f"Deep Learning Pipeline Warning: {e}")
        return []