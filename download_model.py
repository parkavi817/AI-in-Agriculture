from huggingface_hub import hf_hub_download
import os

# Create the target directory if it doesn't exist
target_dir = "IndicTrans2/models/en-indic-base"
os.makedirs(target_dir, exist_ok=True)

# Download the model file
print("Downloading IndicTrans2 model...")
model_path = hf_hub_download(
    repo_id="ai4bharat/indictrans2-en-indic-translation",
    filename="en-indic-preprint.tar.gz",
    local_dir=target_dir,
    local_dir_use_symlinks=False
)

print(f"Model downloaded successfully to: {model_path}")
print("You can now extract the tar.gz file to use the model.")
