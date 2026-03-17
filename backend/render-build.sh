#!/bin/bash
set -e

echo "Building React frontend..."
cd ../frontend
npm install
npm run build

echo "Setting up Django backend..."
cd ../backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

echo "Build complete!"
