import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_NAME = "advanced_student_management"

# 1. Check if Render's DATABASE_URL is available; otherwise, fall back to localhost
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # If on Render, connect using the URL string directly
    # (psycopg2 handles the connection string natively)
    conn = psycopg2.connect(DATABASE_URL)
else:
    # If running locally on your machine, use your local credentials
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="ranju123",
        dbname="postgres"
    )

conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

# 2. Only attempt to create a database if you're working locally.
# On Render, the database is already provisioned and named for you.
if not DATABASE_URL:
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
    exists = cur.fetchone()

    if not exists:
        cur.execute('CREATE DATABASE ' + DB_NAME)
        print("[OK] Database '" + DB_NAME + "' created successfully.")
    else:
        print("[OK] Database '" + DB_NAME + "' already exists.")
else:
    print("[OK] Connected to Render PostgreSQL successfully.")

cur.close()
conn.close()
