import sqlite3

DB_FILE = "database.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner TEXT,
            category TEXT,
            item TEXT,
            link TEXT,
            bought_by TEXT,
            delivered INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()
