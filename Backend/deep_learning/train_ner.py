import os
import torch
import torch.nn as nn
import torch.optim as optim
from bi_lstm_ner import BiLSTMNER
from tokenizer import ResumeTokenizer

def train_network():
    print("====================================================")
    print("🚀 INITIALIZING CUSTOM PYTORCH BI-LSTM TRAINING LOOP")
    print("====================================================\n")

    training_corpus = [
        "python is an excellent language for backend apps",
        "highly skilled developer building models with pytorch natively"
    ]

    target_tags = [
        [1, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 1, 0]
    ]

    tokenizer = ResumeTokenizer()
    tokenizer.build_vocab(training_corpus)
    
    EMBEDDING_DIM = 16
    HIDDEN_DIM = 32
    TAGSET_SIZE = 3 
    VOCAB_SIZE = len(tokenizer.word2idx)
    
    model = BiLSTMNER(VOCAB_SIZE, EMBEDDING_DIM, HIDDEN_DIM, TAGSET_SIZE)
    
    loss_function = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)


    EPOCHS = 20
    model.train()
    
    print("\n--- Starting Parameter Optimization ---")
    for epoch in range(1, EPOCHS + 1):
        total_epoch_loss = 0.0
        
        for text, tags in zip(training_corpus, target_tags):

            model.zero_grad()
            
            inputs_tensor = tokenizer.text_to_tensor(text)
            targets_tensor = torch.tensor(tags, dtype=torch.long)

            logits = model(inputs_tensor).squeeze(0)     

            loss = loss_function(logits, targets_tensor)
            total_epoch_loss += loss.item()

            loss.backward()

            optimizer.step()
            
        if epoch == 1 or epoch % 4 == 0:
            average_loss = total_epoch_loss / len(training_corpus)
            print(f"Epoch {epoch:02d}/{EPOCHS} | Aggregate Cross-Entropy Loss: {average_loss:.5f}")

    print("\n====================================================")
    print("🎉 TRAINING COMPLETE: Network Weights Converged cleanly!")
    print("====================================================\n")

    WEIGHTS_DIR = "deep_learning/weights"
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    weights_path = os.path.join(WEIGHTS_DIR, "bi_lstm_ner.pth")
    
    torch.save(model.state_dict(), weights_path)
    print(f"Model checkpoint checkpoint written to: {weights_path}")

if __name__ == "__main__":
    train_network()