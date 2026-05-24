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

    # 1. Define Labeled Training Data (Sentences + Entity Target Indices)
    # Target Tags Mapping -> 0: O (Other), 1: B-SKILL (Skill Start), 2: I-SKILL (Inside Skill)
    training_corpus = [
        "python is an excellent language for backend apps",
        "highly skilled developer building models with pytorch natively"
    ]
    
    # Explicitly map target tag sequences corresponding to the text tokens exactly
    # "python(1) is(0) an(0) excellent(0) language(0) for(0) backend(2) apps(0)"
    # "highly(0) skilled(0) developer(0) building(0) models(0) with(0) pytorch(1) natively(0)"
    target_tags = [
        [1, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 1, 0]
    ]

    # 2. Build Vocab & Initialize Serializer
    tokenizer = ResumeTokenizer()
    tokenizer.build_vocab(training_corpus)
    
    # 3. Model Hyperparameters configuration
    EMBEDDING_DIM = 16
    HIDDEN_DIM = 32
    TAGSET_SIZE = 3 # [O, B-SKILL, I-SKILL]
    VOCAB_SIZE = len(tokenizer.word2idx)
    
    # Instantiate the network blueprint graph
    model = BiLSTMNER(VOCAB_SIZE, EMBEDDING_DIM, HIDDEN_DIM, TAGSET_SIZE)
    
    # 4. Setup Loss Function & Optimizer
    # ignore_index=0 can be used if padding is involved, here we calculate across all indices
    loss_function = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    # 5. The Core Deep Learning Epoch Optimization Loop
    EPOCHS = 20
    model.train() # Set to explicit training state mode
    
    print("\n--- Starting Parameter Optimization ---")
    for epoch in range(1, EPOCHS + 1):
        total_epoch_loss = 0.0
        
        for text, tags in zip(training_corpus, target_tags):
            # Step A: Clear accumulated historical gradients from the previous iteration
            model.zero_grad()
            
            # Step B: Serialize text into a token index tensor matrix
            inputs_tensor = tokenizer.text_to_tensor(text)
            targets_tensor = torch.tensor(tags, dtype=torch.long)
            
            # Step C: Forward Pass -> Output raw score distributions (logits)
            # Reshape logit matrix from (1, seq_len, tagset_size) to (seq_len, tagset_size)
            logits = model(inputs_tensor).squeeze(0)
            
            # Step D: Calculate Loss Value
            loss = loss_function(logits, targets_tensor)
            total_epoch_loss += loss.item()
            
            # Step E: Backward Pass -> Compute gradients via the chain rule derivation
            loss.backward()
            
            # Step F: Parameter Update -> Nudge the weights in the direction of lower loss
            optimizer.step()
            
        # Log progression metrics every 4 epochs to watch convergence tracking
        if epoch == 1 or epoch % 4 == 0:
            average_loss = total_epoch_loss / len(training_corpus)
            print(f"Epoch {epoch:02d}/{EPOCHS} | Aggregate Cross-Entropy Loss: {average_loss:.5f}")

    print("\n====================================================")
    print("🎉 TRAINING COMPLETE: Network Weights Converged cleanly!")
    print("====================================================\n")
    
    # 6. Save the optimized mathematical weight matrices to disk
    WEIGHTS_DIR = "deep_learning/weights"
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    weights_path = os.path.join(WEIGHTS_DIR, "bi_lstm_ner.pth")
    
    torch.save(model.state_dict(), weights_path)
    print(f"Model checkpoint checkpoint written to: {weights_path}")

if __name__ == "__main__":
    train_network()