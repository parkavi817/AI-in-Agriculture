# Argos Translate — Fullstack Example

## Overview
- **Backend**: FastAPI (Python) running Argos Translate models locally. Exposes a batch `/translate` endpoint and supports multiple targets, caching, and a rate‑limited worker pool.
- **Frontend**: React app (single‑file example) that calls the backend, shows progress, and lets you download translated JSONs per language.

## Requirements
- Python 3.10+ (for backend)
- Node 16+ (for frontend dev)

## Setup

### Backend
```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Install Argos models (see notes below)
python install_models.py
# Run the API
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

The React dev server proxies API calls to `http://localhost:8000` (see `package.json` proxy setting).

## Notes
- This implementation runs locally, so there are no external API quotas.
- For production, run the backend behind a process manager (systemd, gunicorn/uvicorn) and consider Docker.
- Increase `ThreadPoolExecutor` workers based on CPU cores if needed.
- Cache can be persisted to Redis for multi‑instance setups.

## Installing Argos Models
You can install models via the CLI:

```bash
pip install argostranslate
argospm install translate-en_hi
argospm install translate-en_ta
# ...add other language pairs as required
```

Or place downloaded `.argosmodel` files into `backend/packages/` and run:

```bash
python install_models.py
```

## Quick Test
After starting both backend and frontend, open the React app in your browser, load an English `complete.json`, select target languages, and click **Run Translate**. Translated JSON files can be downloaded per language.

--- 

*This README reflects the plan you provided and sets up the Argos Translate full‑stack example.*