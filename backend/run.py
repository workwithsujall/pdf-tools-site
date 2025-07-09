#!/usr/bin/env python3
"""
Script to run the PDF Tools API server.
Run this from the parent directory with: python -m backend.run
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True) 