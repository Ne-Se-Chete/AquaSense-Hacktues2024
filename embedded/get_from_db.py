import requests

def get_last_latitude_longitude():
    ip = "192.168.80.133"
    port = 8080
    url = f"http://{ip}:{port}/services/ts/server/gen/api/SensorData/SensorDataService.ts"
    username = "admin"
    password = "admin"

    response = requests.get(url, auth=(username, password))

    if response.status_code == 200:
        print("GET request successful.")
        # Parse the JSON response
        data = response.json()

        if not data:  # Check if the list is empty
            print("JSON response is empty.")
            return -1, -1
        
        # Get the last latitude and longitude
        last_entry = data[-1]
        last_latitude = last_entry["Latitude"]
        last_longitude = last_entry["Longitude"]
        
        return last_latitude, last_longitude
    else:
        print(f"Failed to make GET request. Status code: {response.status_code}")
        return -1, -1


if "__main__" in __name__:
    get_last_latitude_longitude()