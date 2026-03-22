# SnapText AI

Full-stack OCR + AI text processing app.

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your OPENROUTER_API_KEY and JWT_SECRET
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)
- OpenRouter API key from https://openrouter.ai

## Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_MODEL` | Model to use (default: openai/gpt-3.5-turbo) |

## Features

- Multi-language OCR (English, Urdu, Hindi, Arabic, Chinese, Japanese, Spanish)
- Image preprocessing with Sharp for better accuracy
- AI text cleaning, notes generation, summarization, translation
- PDF, TXT, DOCX export
- User auth with scan history
- Drag & drop multi-image upload
