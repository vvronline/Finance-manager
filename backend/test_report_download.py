import urllib.request
import urllib.parse
import json
import datetime
import os

API_URL = "http://localhost:8000"

def test_download_report():
    # 1. Create a dummy transaction
    today = datetime.date.today()
    transaction_data = {
        "amount": 100.0,
        "category": "Test",
        "description": "Test Transaction",
        "type": "expense",
        "date": today.isoformat()
    }
    
    print("Creating transaction...")
    try:
        req = urllib.request.Request(
            f"{API_URL}/transactions/",
            data=json.dumps(transaction_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                print(f"Failed to create transaction: {response.read().decode()}")
                return
    except Exception as e:
        print(f"Error creating transaction: {e}")
        return

    # 2. Download report
    year = today.year
    month = today.month
    print(f"Downloading report for {year}-{month}...")
    try:
        with urllib.request.urlopen(f"{API_URL}/reports/download/{year}/{month}") as response:
            if response.status != 200:
                print(f"Failed to download report: {response.read().decode()}")
                return
            content = response.read()
    except Exception as e:
        print(f"Error downloading report: {e}")
        return

    # 3. Verify Excel format
    if content.startswith(b'PK'):
        print("SUCCESS: Response has valid Excel signature (PK header)")
    else:
        print("FAILURE: Response does not look like an Excel file")
        return

    filename = f"report_{year}_{month}.xlsx"
    with open(filename, "wb") as f:
        f.write(content)
    print(f"Saved report to {filename}")
    print(f"Please open {os.path.abspath(filename)} to verify column widths.")

if __name__ == "__main__":
    test_download_report()
