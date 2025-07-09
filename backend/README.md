# PDF Tools API

Backend service for PDF Tools, providing APIs for PDF manipulation.

## Features

- Merge multiple PDF files
- Split PDFs into pages or specific ranges
- Compress PDFs with different compression levels
- Convert PDFs to JPG (coming soon)

## Requirements

- Python 3.7+
- FastAPI
- PyMuPDF (for PDF operations)
- uvicorn (for running the server)

## Installation

1. Create a virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Development

Run the server with:
```bash
cd backend
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Endpoints

- **POST /api/merge**: Merge multiple PDF files
- **POST /api/split**: Split a PDF into individual pages or specific ranges
- **POST /compress-pdf**: Compress a PDF with various compression levels

## Deployment

### Docker

The project includes a Dockerfile for easy deployment:

```bash
# Build the image
docker build -t pdf-tools-api .

# Run the container
docker run -p 8000:8000 pdf-tools-api
```

### Production Deployment

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

Set the environment variable `CORS_ORIGINS` to control allowed origins:

```bash
export CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## License

MIT 