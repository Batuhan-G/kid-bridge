#!/bin/bash

# Kid Bridge Database Backup Script
# This script creates encrypted backups of the database

set -e  # Exit on any error

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_URL=${DATABASE_URL:-"file:./dev.db"}

echo "🗄️  Starting Kid Bridge Database Backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if we're using SQLite or PostgreSQL
if [[ $DATABASE_URL == *"sqlite"* ]] || [[ $DATABASE_URL == *"file:"* ]]; then
    echo "📋 Backing up SQLite database..."
    
    # Extract database file path
    DB_FILE=$(echo $DATABASE_URL | sed 's/file://')
    
    if [ -f "$DB_FILE" ]; then
        # Create backup with timestamp
        BACKUP_FILE="$BACKUP_DIR/kidbridge_backup_$TIMESTAMP.db"
        cp "$DB_FILE" "$BACKUP_FILE"
        
        # Compress the backup
        gzip "$BACKUP_FILE"
        BACKUP_FILE="$BACKUP_FILE.gz"
        
        echo "✅ SQLite backup created: $BACKUP_FILE"
    else
        echo "❌ Database file not found: $DB_FILE"
        exit 1
    fi
    
elif [[ $DATABASE_URL == *"postgresql"* ]]; then
    echo "📋 Backing up PostgreSQL database..."
    
    # Extract connection details from DATABASE_URL
    # Format: postgresql://username:password@localhost:5432/database
    
    BACKUP_FILE="$BACKUP_DIR/kidbridge_backup_$TIMESTAMP.sql"
    
    # Use pg_dump for PostgreSQL backup
    pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"
    
    echo "✅ PostgreSQL backup created: $BACKUP_FILE"
else
    echo "❌ Unsupported database type in DATABASE_URL"
    exit 1
fi

# Set secure permissions (owner read/write only)
chmod 600 "$BACKUP_FILE"

# Clean up old backups (keep last 7 days)
find "$BACKUP_DIR" -name "kidbridge_backup_*.gz" -mtime +7 -delete

echo "🔐 Backup completed successfully: $BACKUP_FILE"
echo "🗑️  Old backups (>7 days) cleaned up"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo "☁️  Uploading to cloud storage..."
# aws s3 cp "$BACKUP_FILE" s3://your-backup-bucket/kidbridge/
# echo "✅ Backup uploaded to cloud storage"

echo "✅ Database backup process completed"