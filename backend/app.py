from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = "wishlist.db"

USERS = {
    "lohan": "1234",
    "leticia": "1234"
}

# ---------- DATABASE ----------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item TEXT NOT NULL,
            owner TEXT NOT NULL,
            category TEXT NOT NULL,
            link TEXT,
            note TEXT,
            created_by TEXT NOT NULL,
            created_at TEXT NOT NULL,
            bought_by TEXT,
            bought_at TEXT,
            delivered INTEGER NOT NULL DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------- AUTH ----------

def get_user_from_token():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth.replace("Bearer ", "")
    return None

@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username", "").strip().lower()
    password = data.get("password", "").strip()

    if USERS.get(username) == password:
        return jsonify({"token": username})

    return jsonify({"error": "invalid credentials"}), 401

# ---------- ITEMS ----------

@app.route("/items", methods=["GET"])
def get_items():
    viewer = get_user_from_token()
    if not viewer:
        return jsonify([]), 401

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM items")
    rows = cur.fetchall()
    conn.close()

    items = [dict(r) for r in rows]

    pending = [
        i for i in items
        if i["owner"] == viewer and i["bought_by"] and not i["delivered"]
    ]

    hide_before = None
    if pending:
        hide_before = max(datetime.fromisoformat(i["bought_at"]) for i in pending)

    visible = []

    for item in items:
        if item["owner"] in ["casa", "nina"]:
            visible.append(item)
            continue

        if item["owner"] != viewer:
            visible.append(item)
            continue

        if hide_before:
            created = datetime.fromisoformat(item["created_at"])
            if created > hide_before:
                visible.append(item)
        else:
            visible.append(item)

    return jsonify(visible)

@app.route("/items", methods=["POST"])
def add_item():
    viewer = get_user_from_token()
    if not viewer:
        return jsonify({"error": "unauthorized"}), 401

    data = request.json or {}
    owner = data.get("owner")

    if owner in ["lohan", "leticia"] and owner != viewer:
        return jsonify({"error": "cannot add item for another user"}), 403

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO items (
            item, owner, category, link, note,
            created_by, created_at, delivered
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    """, (
        data.get("item"),
        owner,
        owner,
        data.get("link"),
        data.get("note"),
        viewer,
        datetime.utcnow().isoformat()
    ))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/items/<int:item_id>/buy", methods=["POST"])
def buy_item(item_id):
    viewer = get_user_from_token()

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE items
        SET bought_by = ?, bought_at = ?
        WHERE id = ?
    """, (viewer, datetime.utcnow().isoformat(), item_id))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/items/<int:item_id>/deliver", methods=["POST"])
def deliver_item(item_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE items SET delivered = 1 WHERE id = ?
    """, (item_id,))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    viewer = get_user_from_token()
    data = request.json or {}

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT created_by FROM items WHERE id = ?", (item_id,))
    row = cur.fetchone()

    if not row or row["created_by"] != viewer:
        return jsonify({"error": "forbidden"}), 403

    cur.execute("""
        UPDATE items
        SET item = ?, link = ?, note = ?
        WHERE id = ?
    """, (
        data.get("item"),
        data.get("link"),
        data.get("note"),
        item_id
    ))

    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    viewer = get_user_from_token()

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT created_by FROM items WHERE id = ?", (item_id,))
    row = cur.fetchone()

    if not row or row["created_by"] != viewer:
        return jsonify({"error": "forbidden"}), 403

    cur.execute("DELETE FROM items WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

# ---------- START ----------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
