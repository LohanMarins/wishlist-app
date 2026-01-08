from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json, os

app = Flask(__name__)
CORS(app)

DATA_FILE = "data.json"

USERS = {
    "lohan": "1234",
    "leticia": "1234"
}

# ---------- helpers ----------
def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_user_from_token():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth.replace("Bearer ", "")
    return None

# ---------- login ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username", "").lower()
    password = data.get("password", "")

    if USERS.get(username) == password:
        return jsonify({"token": username})

    return jsonify({"error": "Invalid credentials"}), 401

# ---------- items ----------
@app.route("/items", methods=["GET"])
def get_items():
    viewer = get_user_from_token()
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
    viewer = get_user_from_token()
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
    viewer = get_user_from_token()
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
