# PDF Tools

A full-stack web application for PDF manipulation including merging, splitting, and compressing PDF files.

## Features

- **Merge PDFs**: Combine multiple PDF files into a single document
- **Split PDFs**: Divide a PDF into individual pages or specific page ranges
- **Compress PDFs**: Reduce PDF file size with different compression levels
- **Convert PDFs to JPG**: (Coming soon)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **PDF Processing**: PyMuPDF (fitz)

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python 3.7+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/pdf-tools.git
cd pdf-tools
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Development

Run both frontend and backend with the provided script:
```bash
./run.sh
```

Or run them separately:

**Frontend:**
```bash
npm run dev
# or
yarn dev
```

**Backend:**
```bash
cd backend
uvicorn main:app --reload
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Deployment

### Frontend (Next.js)

Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

Or build for production:
```bash
npm run build
npm run start
```

### Backend (FastAPI)

#### Option 1: Docker

```bash
cd backend
docker build -t pdf-tools-api .
docker run -p 8000:8000 pdf-tools-api
```

#### Option 2: Traditional Deployment

Install Gunicorn:
```bash
pip install gunicorn
```

Run with Gunicorn:
```bash
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

Set the environment variable for CORS:
```bash
export CORS_ORIGINS=https://your-frontend-domain.com
```

### Environment Variables

**Frontend:**
- `NEXT_PUBLIC_API_URL`: URL of the backend API (default: http://localhost:8000)

**Backend:**
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS

## License

MIT