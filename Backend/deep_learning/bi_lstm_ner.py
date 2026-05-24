import torch
import torch.nn as nn

class BiLSTMNER(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, tagset_size):
        """
        Initializes the Deep Learning Sequence Tagger.
        
        Args:
            vocab_size (int): Size of the token vocabulary index map.
            embedding_dim (int): Dimensional depth of the continuous vector spaces.
            hidden_dim (int): Internal tracking cell dimension for each LSTM direction.
            tagset_size (int): Total unique target entity labels (e.g., B-SKILL, I-ORG, O).
        """
        super(BiLSTMNER, self).__init__()
        
        # 1. Continuous Vector Embedding Matrix Layer
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        
        # 2. Core Recurrent Sequence Engine
        # bidirectional=True splits hidden_dim across forward and backward tracks
        self.lstm = nn.LSTM(
            input_size=embedding_dim,
            hidden_size=hidden_dim,
            num_layers=1,
            bidirectional=True,
            batch_first=True
        )
        
        # 3. Dense Classification Projection Layer
        # Concatenates forward and backward channels, multiplying hidden_dim by 2
        self.hidden2tag = nn.Linear(hidden_dim * 2, tagset_size)
        
    def forward(self, sentences):
        """
        Processes a tokenized sequence tensor through the network layers.
        
        Args:
            sentences (Tensor): Integer token matrix of shape (batch_size, sequence_length)
        Returns:
            Tensor: Raw logit scores for every tag per token (batch_size, sequence_length, tagset_size)
        """
        # Map tokens to dense continuous vectors -> Shape: (batch_size, seq_len, embedding_dim)
        embeds = self.embedding(sentences)
        
        # Run sequence through the Recurrent engine -> Shape: (batch_size, seq_len, hidden_dim * 2)
        lstm_out, _ = self.lstm(embeds)
        
        # Project raw vectors down to tag dimensions -> Shape: (batch_size, seq_len, tagset_size)
        logits = self.hidden2tag(lstm_out)
        
        return logits

# 🧪 Functional Architecture Test
if __name__ == "__main__":
    print("--- Verifying PyTorch Architecture Graph ---")
    
    # Mocking basic shape hyper-parameters
    MOCK_VOCAB_SIZE = 1000
    MOCK_EMBEDDING_DIM = 64
    MOCK_HIDDEN_DIM = 128
    MOCK_TAGSET_SIZE = 5 # e.g., [O, B-TECH, I-TECH, B-ORG, I-ORG]
    
    # Instantiate the network blueprint
    model = BiLSTMNER(MOCK_VOCAB_SIZE, MOCK_EMBEDDING_DIM, MOCK_HIDDEN_DIM, MOCK_TAGSET_SIZE)
    print(model)
    
    # Simulating an ingested sentence tensor: 1 batch, 7 tokens long
    mock_input_tokens = torch.tensor([[12, 45, 7, 201, 89, 44, 3]])
    
    with torch.no_grad():
        output_logits = model(mock_input_tokens)
        
    print(f"\nMock Input Tensor Shape: {mock_input_tokens.shape}")
    print(f"Output Logits Tensor Shape: {output_logits.shape}")
    print("------------------------------------------")