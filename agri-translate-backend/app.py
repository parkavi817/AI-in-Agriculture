from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from indictrans2 import IndicProcessor

app = FastAPI(title="IndicTrans2 Translator API")

# Load EN→Indic model once
MODEL_NAME = "ai4bharat/indictrans2-en-indic-1B"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, trust_remote_code=True)
ip = IndicProcessor(inference=True)

# Supported Indic languages
LANG_CODES = [
    "hi", "bn", "gu", "mr", "pa", "or", "ta", "te", "kn", "ml",
    "as", "ur", "kok", "sat", "mai", "ne", "sd", "ks", "brx", "mni"
]

class TranslationRequest(BaseModel):
    text: str
    to_lang: str  # e.g., "ta"

class TranslationResponse(BaseModel):
    translated_text: str

@app.post("/api/v1/translate", response_model=TranslationResponse)
def translate_text(req: TranslationRequest):
    if req.to_lang not in LANG_CODES:
        raise HTTPException(status_code=400, detail="Language not supported.")

    # Preprocess input
    inputs = ip.preprocess_batch([req.text], src_lang="en", tgt_lang=req.to_lang)

    # Run through model
    with torch.no_grad():
        output = model.generate(**inputs)

    # Decode + postprocess
    translated = tokenizer.batch_decode(output, skip_special_tokens=True)[0]
    translated = ip.postprocess_batch([translated], lang=req.to_lang)[0]

    return {"translated_text": translated}
