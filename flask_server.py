from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

# MongoDB Connection
MONGO_URI = "mongodb+srv://info:loloklol.12A@jsw.6tat7au.mongodb.net"
DB_NAME = "OutlookData"
COLLECTION_NAME = "DRIData"

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

def connect_mongodb():
    """Connects to MongoDB and returns the collection object."""
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    return db[COLLECTION_NAME]

def get_current_shift():
    """Determines the current shift based on system time, considering overlaps."""
    current_hour = datetime.now().hour

    if 10 <= current_hour < 14:  # Overlap between A (6 AM - 2 PM) and G (9 AM - 6 PM)
        return ["A", "G"]
    elif 14 <= current_hour < 18:  # Overlap between B (2 PM - 10 PM) and G (9 AM - 6 PM)
        return ["B", "G"]
    elif 6 <= current_hour < 10:  # A shift alone (6 AM - 10 AM)
        return ["A"]
    elif 18 <= current_hour < 22:  # B shift alone (6 PM - 10 PM)
        return ["B"]
    else:  # C shift (10 PM - 6 AM)
        return ["C"]

@app.route('/sendDRIData', methods=['GET'])
def get_latest_dri_data():
    """Fetches the latest records from MongoDB based on today's date and current shift."""
    collection = connect_mongodb()
    today_date = datetime.today().strftime("%Y-%m-%d")
    current_shifts = get_current_shift()  # Returns a list (e.g., ["A", "G"])

    query = {"date": today_date, "shift": {"$in": current_shifts}}  # Fetch data for all active shifts
    latest_entries = collection.find(query, {"_id": 0}).sort("createdAt", -1)  # Sort by createdAt DESCENDING

    records = list(latest_entries)

    if records:
        return jsonify({"status": "success", "data": records}), 200
    else:
        return jsonify({"status": "error", "message": "No records found for today's date and current shift"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
