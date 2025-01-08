from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime
from time import sleep
from pymongo import MongoClient

# MongoDB Connection
MONGO_URI = "mongodb+srv://info:loloklol.12A@jsw.6tat7au.mongodb.net"
DB_NAME = "OutlookData"
COLLECTION_NAME = "DRIData"

def connect_mongodb():
    """Connects to MongoDB and returns the collection object."""
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    return db[COLLECTION_NAME]

def setup_driver():
    """Sets up and launches the Chrome WebDriver."""
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    service = Service("C:/WebDriver/chromedriver.exe")  # Update with your ChromeDriver path
    driver = webdriver.Chrome(service=service, options=options)
    driver.get("https://outlook.office.com/mail/inbox")
    print("Outlook Web launched... Please log in if required.")
    return driver



def get_current_shift():
    """Determines the current shift based on system time."""
    current_hour = datetime.now().hour
    if 6 <= current_hour < 14:
        return "A"
    elif 14 <= current_hour < 22:
        return "B"
    else:
        return "C"  # Night Shift



# Example usage
print(get_current_shift())


def fetch_email_by_subject(driver, subject, today_date, shift):
    """Searches for an email by subject and extracts table data."""
    try:
        print("Searching for emails...")
        emails = WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[@role='option']"))
        )

        print(f"Found {len(emails)} emails in the inbox.")

        for email in emails:
            aria_label = email.get_attribute("aria-label")
            if aria_label and subject in aria_label:
                print(f"Found matching email: {aria_label}")
                email.click()
                print("Opening email...")

                print("Waiting for email content...")
                email_body = WebDriverWait(driver, 30).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@aria-label='Message body']"))
                )

                html_content = email_body.get_attribute("innerHTML")
                print("Extracted email body successfully!")

                # Extracting table data
                soup = BeautifulSoup(html_content, "html.parser")
                table = soup.find("table")

                if table:
                    rows = table.find_all("tr")
                    extracted_data = []

                    for row in rows:
                        cols = row.find_all("td")
                        row_data = [col.text.strip() for col in cols]

                        # Ensure valid data (skip empty rows)
                        if len(row_data) >= 4:
                            record = {
                                "Name": row_data[0],
                                "EmployeeCode": row_data[1],
                                "MobileNo": row_data[2],
                                "Department": row_data[3],
                                "date": today_date,
                                "shift": shift,
                                "createdAt": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")  # UTC Timestamp
                            }
                            extracted_data.append(record)

                    return extracted_data  # Return extracted data

                else:
                    print("No table found in the email.")
                    return None  # Email found but no table

        print("No matching email found.")
        return None  # Email not found

    except Exception as e:
        driver.save_screenshot("error_screenshot.png")  # Save screenshot for debugging
        print(f"Error while fetching email: {e}")
        return None

def insert_to_mongodb(collection, data):
    """Inserts new records into MongoDB, ensuring no duplicates."""
    if data:
        inserted_count = 0
        for entry in data:
            existing_entry = collection.find_one({
                "Name": entry["Name"],
                "EmployeeCode": entry["EmployeeCode"],
                "MobileNo": entry["MobileNo"],
                "Department": entry["Department"],
                "date": entry["date"],
                "shift": entry["shift"]
            })

            if not existing_entry:
                collection.insert_one(entry)
                print(f"Inserted new record: {entry}")
                inserted_count += 1
            else:
                print(f"Duplicate entry found, skipping: {entry}")

        print(f"Inserted {inserted_count} new records into MongoDB collection '{COLLECTION_NAME}'")
    else:
        print("No new data to insert into MongoDB.")

if __name__ == "__main__":
    driver = setup_driver()
    mongo_collection = connect_mongodb()

    try:
        while True:
            today_date = datetime.today().strftime("%Y-%m-%d")
            shift = get_current_shift()

            email_subject = f"DRI Rakshak Hazir {today_date} and Shift is:{shift}"
            email_subject2 = f"DRI Rakshak Hazir {today_date} and Shift is:G"
            print(f"Checking for email: {email_subject}")

            table_data = fetch_email_by_subject(driver, email_subject, today_date, shift)
            table_data2 = fetch_email_by_subject(driver, email_subject2, today_date, "G")

            if table_data:
                print("Email found! Inserting data into MongoDB...")
                insert_to_mongodb(mongo_collection, table_data)
            else:
                print("Email not found. Retrying in 1 minute...")

            if table_data2:
                print("Email found G! Inserting data into MongoDB...")
                insert_to_mongodb(mongo_collection, table_data2)
            else:
                print("Email not found G. Retrying in 1 minute...")

            sleep(60)  # Wait for 1 minute before checking again

    except KeyboardInterrupt:
        print("Script stopped manually.")
        driver.quit()
        
