"""
Downloads and caches IndicTrans2 English→Indic models locally.
Run this only once.
"""

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# English → Indic model
MODEL_NAME = "ai4bharat/indictrans2-en-indic-1B"

print(f"⬇️ Downloading {MODEL_NAME} ...")
AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, trust_remote_code=True)
print("✅ English→Indic model downloaded and cached!")

# Indic → English model (optional, only if you want reverse translation)
MODEL_NAME = "ai4bharat/indictrans2-indic-en-1B"

print(f"⬇️ Downloading {MODEL_NAME} ...")
AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, trust_remote_code=True)
print("✅ Indic→English model downloaded and cached!")
