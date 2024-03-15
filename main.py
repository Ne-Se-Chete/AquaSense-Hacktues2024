import serial
import time
import requests
from datetime import datetime
from gps import *
from object_recognition import recognize
from camera import *
from servo import config_servo_camera
from get_from_db import get_last_latitude_longitude

receive_string = ""


def get_local_datetime():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def decode_message(receive_string):
    UV, PH = receive_string.split(" ")
    UV = UV.split(":")[1]
    PH = PH.split(":")[1]
    return UV, PH


def send_request():
    ip = "##.##.##.##"
    port = ####
    url = f"http://{ip}:{port}/services/ts/server/gen/api/SensorData/SensorDataService.ts"
  
    type_trash = recognize()

    while(1):
        last_save_latitude, last_save_longitude = get_last_latitude_longitude()
        latitude, longitude = start_gps()
        if latitude != -1 and longitude != -1:
            if last_save_latitude == -1 and last_save_longitude == -1:
                last_save_latitude = latitude
                last_save_longitude = longitude
            elif last_save_latitude - latitude < 0.0005 and last_save_longitude - longitude < 0.0005:
                return False
            break

    UV, PH = decode_message(receive_string)

    json_data = {
        "Latitude": float(latitude),
        "Longitude": float(longitude),
        "ph": PH,
        "typeTrash": str(type_trash),
        "IsThereOil": True if int(UV) > 210 and int(UV) < 230 else False,
        "DateTime": 1710521530
    }

    auth_credentials = ("admin", "admin")

    response = requests.post(url, json=json_data, auth=auth_credentials)

    time.sleep(3)
    if response.status_code < 400:
        print("Request successful")
        print(response.text)
        return True
    else:
        print("Request failed with status code:", response.status_code)
        return False


if "__main__" in __name__:
    serArduino = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    serArduino.flush()
    while True:
        receive_string = serArduino.readline().decode('utf-8').rstrip()
        time.sleep(0.5)
        if receive_string != "":
            print(receive_string)
            decode_message(receive_string)
            try:
                config_servo_camera()
                while(True):
                    if run_camera():
                        break
                send_request()
            except Exception as e:
                print("Error:", e)

        time.sleep(6)