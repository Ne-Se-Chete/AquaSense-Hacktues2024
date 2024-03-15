import serial
import time
import requests
from datetime import datetime
from gps import *
from object_recognition import recognize
from camera import *


def get_local_datetime():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def send_request():
    ip = "192.168.80.134"
    port = 8080
    url = f"http://{ip}:{port}/services/ts/server/gen/api/SensorData/SensorDataService.ts"
  
    type_trash = recognize()

    latitude, longitude = start_gps()

    json_data = {
        "Latitude": float(latitude),
        "Longitude": float(longitude),
        "ph": 8.6,  # TODO - from Arduino with Valeri's code to get the value
        "typeTrash": str(type_trash),
        "IsThereOil": True,  # TODO - from Arduino with Valeri's code to get the value
        "DateTime": str(get_local_datetime())
    }

    auth_credentials = ("admin", "admin")

    response = requests.post(url, json=json_data, auth=auth_credentials)

    if response.status_code == 200:
        print("Request successful")
        print(response.text)
        return True
    else:
        print("Request failed with status code:", response.status_code)
        return False


if "__main__" in __name__:
    receive_string = ""

    #TODO serArduino = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    #serArduino.flush()
    while True:
        #receive_string = serArduino.readline().decode('utf-8').rstrip()
        print(receive_string)
        time.sleep(0.5)
        
        if receive_string == "":    # !=
            receive_string = "done"
            try:
                run_camera()
            except Exception as e:
                print("Application error:", e)

            # if send_request() == False:
            #     break
