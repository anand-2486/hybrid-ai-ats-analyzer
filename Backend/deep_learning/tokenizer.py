import torch
import re

class ResumeTokenizer:
    def __init__(self, lowercase=True):
        self.lowercase = lowercase

        self.PAD_TOKEN = "<PAD>"

        self.UNK_TOKEN = "<UNK>"
        

        self.word2idx = {}
        self.idx2word = {}
        self._initialized = False

    def build_vocab(self, texts: list[str]):
        """Scans a collection of text documents to map out your unique word index."""
        vocab = set()
        for text in texts:
            tokens = self._tokenize_string(text)
            for token in tokens:
                vocab.add(token)
                

        self.word2idx = {self.PAD_TOKEN: 0, self.UNK_TOKEN: 1}
        

        for idx, word in enumerate(sorted(vocab), start=2):
            self.word2idx[word] = idx
            

        self.idx2word = {idx: word for word, idx in self.word2idx.items()}
        self._initialized = True
        print(f"--- Tokenizer Vocab Built: {len(self.word2idx)} unique tokens registered ---")

    def _tokenize_string(self, text: str) -> list[str]:
        """Standardizes strings and extracts words/alphanumeric sequences."""
        if self.lowercase:
            text = text.lower()

        return re.findall(r'\b\w+\b', text)

    def text_to_tensor(self, text: str) -> torch.Tensor:
        """Converts a raw sentence string directly into a PyTorch LongTensor matrix."""
        if not self._initialized:
            raise ValueError("Tokenizer has not been initialized with build_vocab() yet.")
            
        tokens = self._tokenize_string(text)
        
        indices = [self.word2idx.get(token, self.word2idx[self.UNK_TOKEN]) for token in tokens]
        
        return torch.tensor([indices], dtype=torch.long)

    def tensor_to_text(self, tensor: torch.Tensor) -> list[str]:
        """Translates a model's integer tensor coordinates back into readable human tokens."""
        indices = tensor.squeeze().tolist()
        if not isinstance(indices, list):
            indices = [indices]
        return [self.idx2word.get(idx, self.UNK_TOKEN) for idx in indices]


if __name__ == "__main__":
    print("--- Verifying Text-to-Tensor Serialization ---")
    
    sample_corpus = [
        "Skilled Python Engineer with deep experience building backend apps with FastAPI.",
        "Looking for Machine Learning specialists with custom PyTorch network expertise."
    ]
    
    tokenizer = ResumeTokenizer()
    tokenizer.build_vocab(sample_corpus)
    
    incoming_resume_sentence = "Expert Python developer building models with PyTorch."
    tensor_output = tokenizer.text_to_tensor(incoming_resume_sentence)
    
    print(f"\nSource Sentence: '{incoming_resume_sentence}'")
    print(f"Serialized Tensor Array: {tensor_output}")
    print(f"Tensor Shape Layout: {tensor_output.shape}")

    decoded_words = tokenizer.tensor_to_text(tensor_output)
    print(f"Decoded Inversion Sequence: {decoded_words}")
    print("---------------------------------------------")