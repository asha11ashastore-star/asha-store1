#!/bin/bash

echo "🛍️ Starting Perfect Clothing Store Backend..."
echo "============================================"

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r perfect_requirements.txt

# Create uploads directory structure
echo "📁 Creating upload directories..."
mkdir -p uploads/products
mkdir -p uploads/profiles
mkdir -p uploads/reviews
mkdir -p uploads/temp

# Setup environment file
if [ ! -f ".env" ]; then
    echo "⚙️ Setting up environment file..."
    cp .env.perfect .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your:"
    echo "   1. Razorpay API keys (get from https://dashboard.razorpay.com)"
    echo "   2. Database credentials (if using PostgreSQL)"
    echo ""
    echo "Press Enter to continue after updating .env file..."
    read
fi

# Run the application
echo ""
echo "🚀 Starting Perfect Clothing Store API..."
echo "============================================"
echo "📍 API URL: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "📖 ReDoc: http://localhost:8000/redoc"
echo "============================================"
echo ""

python perfect_main.py
