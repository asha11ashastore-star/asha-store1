#!/bin/bash

echo "🔧 Setting up Clothing Store Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r clothing_requirements.txt

# Set up environment file
if [ ! -f ".env" ]; then
    echo "Setting up environment file..."
    cp .env.clothing .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Start the server
echo "🚀 Starting Clothing Store API..."
echo "API Documentation will be available at: http://localhost:8000/docs"
python clothing_main.py
