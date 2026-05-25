import sqlite3
import os

def initialize_database():
    db_path = "ats_database.db"

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print(f"Initializing relational database storage at: {os.path.abspath(db_path)}")
    
    # 1. Create the JOBS table (Parent Table)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT DEFAULT 'Engineering Role',
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. Create the CANDIDATES table (Child Table)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        name TEXT NOT NULL,
        match_index INTEGER NOT NULL,
        percentile_ahead INTEGER NOT NULL,
        provider_used TEXT NOT NULL,
        scoring_categories TEXT NOT NULL,  -- Complex data stored as a JSON string
        skills_details TEXT NOT NULL,      -- Complex data stored as a JSON string
        missing_keywords TEXT NOT NULL,    -- Complex data stored as a JSON string
        critical_skill_gaps TEXT NOT NULL, -- Complex data stored as a JSON string
        summary_analysis TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
    )
    """)
    
    conn.commit()
    conn.close()
    print("🎉 Relational database schema successfully created!")

if __name__ == "__main__":
    initialize_database()