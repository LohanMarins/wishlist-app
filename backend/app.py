from flask import Flask, request, jsonify
from flask_cors import CORS
from models import init_db
import sqlite3

app = Flask(__name__)
CORS(app)
init_db()

DB_FILE = 'database.db'

# --- Helpers ---
def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute(query, args)
    rv = c.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# --- Rotas ---

@app.route('/items', methods=['GET'])
def get_items():
    owner = request.args.get('owner')
    rows = query_db('''
        SELECT * FROM items WHERE
        category IN ('Casa','Nina')
        OR owner=?
        OR (bought_by IS NOT NULL AND owner != ?)
    ''', (owner, owner))
    items = [dict(id=r[0], owner=r[1], category=r[2], item=r[3], link=r[4],
                  bought_by=r[5], delivered=r[6]) for r in rows]
    return jsonify(items)

@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    query_db('''
        INSERT INTO items (owner, category, item, link) VALUES (?, ?, ?, ?)
    ''', (data['owner'], data['category'], data['item'], data.get('link','')))
    return jsonify({'status': 'ok'})

@app.route('/items/<int:item_id>/buy', methods=['POST'])
def buy_item(item_id):
    data = request.json
    query_db('UPDATE items SET bought_by=? WHERE id=?', (data['bought_by'], item_id))
    owner = query_db('SELECT owner FROM items WHERE id=?', (item_id,), one=True)[0]
    if owner == data['bought_by']:
        query_db('UPDATE items SET delivered=1 WHERE id=?', (item_id,))
    return jsonify({'status': 'ok'})

@app.route('/items/<int:item_id>/deliver', methods=['POST'])
def deliver_item(item_id):
    query_db('UPDATE items SET delivered=1 WHERE id=?', (item_id,))
    return jsonify({'status': 'ok'})

import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render provides this env var
    app.run(host="0.0.0.0", port=port, debug=False)

