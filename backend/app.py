from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
import json, os

app = Flask(__name__)
app.secret_key = "super-secret-key"
CORS(app, supports_credentials=True)

DATA_FILE = "data.json"

USERS = {
    "lohan": "1234",
    "leticia": "1234"
}

def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"].lower()
    password = data["password"]

    if USERS.get(username) == password:
        session["user"] = username
        return jsonify({"user": username})

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/me")
def me():
    return jsonify({"user": session.get("user")})

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})

# ---------- ITEMS ----------
@app.route("/items", methods=["GET"])
def get_items():
    viewer = session.get("user")
    if not viewer:
        return jsonify([]), 401

    items = read_data()

    pending = [
        i for i in items
        if i["owner"] == viewer and i["bought_by"] and not i["delivered"]
    ]

    hide_before = None
    if pending:
        hide_before = max(
            datetime.fromisoformat(i["bought_at"]) for i in pending
        )

    visible = []

    for item in items:
        if item["category"] in ["Casa", "Nina"]:
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
    viewer = session.get("user")
    if not viewer:
        return jsonify({"error": "unauthorized"}), 401

    items = read_data()
    item = request.json

    item["id"] = len(items) + 1
    item["owner"] = item["owner"].lower()
    item["created_at"] = datetime.utcnow().isoformat()
    item["bought_by"] = None
    item["bought_at"] = None
    item["delivered"] = False

    items.append(item)
    write_data(items)
    return jsonify(item)

@app.route("/items/<int:item_id>/buy", methods=["POST"])
def buy_item(item_id):
    viewer = session.get("user")
    items = read_data()

    for item in items:
        if item["id"] == item_id:
            item["bought_by"] = viewer
            item["bought_at"] = datetime.utcnow().isoformat()

    write_data(items)
    return jsonify({"ok": True})

@app.route("/items/<int:item_id>/deliver", methods=["POST"])
def deliver_item(item_id):
    items = read_data()

    for item in items:
        if item["id"] == item_id:
            item["delivered"] = True

    write_data(items)
    return jsonify({"ok": True})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
