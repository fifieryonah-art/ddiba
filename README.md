# Ddiba

**Ddiba. Learn your way.**

Ddiba is an AI learning companion built for inclusivity and accessibility. It takes learning material a student is struggling with and adapts both the content and the way it's presented — helping students learn, read, and practise in ways that work for how they think, with a particular focus on students with dyslexia and other reading or learning differences.

## Features

- **Adapt My Lesson** — transforms study material into a clearer version (simplified language, chunked paragraphs, explained terms) while preserving meaning
- **Learn It My Way** — personalizes explanations to each student's preferred learning style (short explanations, step-by-step, examples, etc.)
- **Listen & Read** — text-to-speech and adjustable reading settings (font size, spacing, background) for accessibility
- **Practice With Me** — generates practice questions directly from the student's own material
- **Feedback That Helps Me Improve** — evaluates free-form answers and explains what to review next
- **My Learning Profile** — stores preferences and progress to personalize future sessions

## Tech Stack

**Frontend**
- JavaScript, React
- Vite (dev server / build tool)
- React Router

**Backend**
- Python, Django REST Framework
- LLM integration via OpenAI
- SQLite

## Project Structure

```
DDIBA/
├── Backend/       # Django REST Framework API
├── Frontend/      # React + Vite app
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v22.22.1 (use `nvm install 22.22.1 && nvm use 22.22.1` if you use nvm)
- Python 3.x
- pip

### Frontend setup
```bash
cd Frontend
npm install
npm run dev
```

### Backend setup
```bash
cd Backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Git Workflow

- `main` — production branch, only merged into when ready to ship/demo
- `dev` — active development branch, all feature work merges here first
- Create a feature branch off `dev` for any new work:
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b feature/your-feature-name
  ```
- Open a pull request into `dev` (not `main`) when your feature is ready, and request review from teammates before merging.

## Team

Built by Brendalynee, Tisha, Phiona, and Shalom for the Girl Code Hackathon, September 5-6, 2026.