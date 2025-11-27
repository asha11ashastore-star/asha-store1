#!/bin/bash
# Run database migration to make last_name nullable

echo "🔧 Running database migration..."
echo "================================"

# Check if alembic is installed
if ! command -v alembic &> /dev/null; then
    echo "❌ Alembic not found! Installing..."
    pip install alembic
fi

# Run the migration
echo ""
echo "Running: alembic upgrade head"
echo ""

cd /Users/divyanshurathore/shopall/backend

alembic upgrade head

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ Migration completed successfully!"
    echo "================================"
    echo ""
    echo "✅ last_name column is now nullable"
    echo "✅ Users can signup with single names (e.g., 'prankur')"
    echo "✅ Users can signup with full names (e.g., 'John Doe')"
    echo ""
    echo "🚀 You can now test signup!"
else
    echo ""
    echo "================================"
    echo "❌ Migration failed!"
    echo "================================"
    echo ""
    echo "Manual fix:"
    echo "Run this SQL on your database:"
    echo "ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;"
fi
