Installation Steps (Windows Local Machine):
STEP 1: create folder & put these files inside\nmkdir agri-translate-backend\n# (paste app.py, requirements.txt, install_models.py, README.txt)
STEP 2: create & activate virtual environment\npython -m venv .venv\n.venv\Scripts\activate
STEP 3: install libraries\npip install -r requirements.txt
STEP 4: download language models (run once!)\npython install_models.py
STEP 5: run the translation API\nuvicorn app:app --host 0.0.0.0 --port 8000\n\n🚀 Example API Call\nPOST http://localhost:8000/api/v1/translate\nContent-Type: application/json\n\n{\n  \"text\": \"Welcome to our agriculture advisory app\",\n  \"to_lang\": \"ta\"\n}\n\nResponse ⬇️:\n{\n  \"translated_text\": \"எங்கள் விவசாய ஆலோசனை செயலியில் வரவேற்கிறோம்\"\n}\n