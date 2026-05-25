import torch
import os
from deep_learning.bi_lstm_ner import BiLSTMNER
from deep_learning.tokenizer import ResumeTokenizer

def extract_dl_entities(cleaned_text: str) -> list[dict]:
    try:
        base_corpus = [
            "python is an excellent language for backend apps",
            "highly skilled developer building models with pytorch natively"
        ]
        tokenizer = ResumeTokenizer()
        tokenizer.build_vocab(base_corpus)
        
        TAGSET_SIZE = 3
        model = BiLSTMNER(
            vocab_size=len(tokenizer.word2idx),
            embedding_dim=16, 
            hidden_dim=32,  
            tagset_size=TAGSET_SIZE
        )

        weights_path = "deep_learning/weights/bi_lstm_ner.pth"
        if os.path.exists(weights_path):
            # Map state dict tensors straight into the architecture graph
            model.load_state_dict(torch.load(weights_path, weights_only=True))
            print("--- PyTorch Model: Trained .pth weights loaded successfully ---")
        else:
            print("--- PyTorch Model: No checkpoint found, using default initialization ---")

        model.eval()
        with torch.no_grad():
            input_tensor = tokenizer.text_to_tensor(cleaned_text)
            logits = model(input_tensor)
            predictions = torch.argmax(logits, dim=-1).squeeze().tolist()
            
        decoded_tokens = tokenizer.tensor_to_text(input_tensor)
        if not isinstance(predictions, list):
            predictions = [predictions]
            
        extracted_tags = []
        for token, tag_id in zip(decoded_tokens, predictions):
            if tag_id == 1:
                extracted_tags.append({"token": token, "confidence_class": "B-SKILL"})
            elif tag_id == 2:
                extracted_tags.append({"token": token, "confidence_class": "I-SKILL"})
                
        return extracted_tags[:8]
        
    except Exception as e:
        print(f"Deep Learning Pipeline Warning: {e}")
        return []