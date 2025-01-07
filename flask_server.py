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

@app.route('/sendDRIData', methods=['GET'])
def get_latest_dri_data():
    """Fetches the latest records from MongoDB for today's date sorted by createdAt timestamp."""
    collection = connect_mongodb()
    today_date = datetime.today().strftime("%Y-%m-%d")

    query = {"date": today_date}
    latest_entry = collection.find(query, {"_id": 0}).sort("createdAt", -1)  # Sort by createdAt DESCENDING

    records = list(latest_entry)

    if records:
        return jsonify({"status": "success", "data": records}), 200
    else:
        return jsonify({"status": "error", "message": "No records found for today's date"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
