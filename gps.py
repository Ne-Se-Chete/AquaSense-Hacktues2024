import serial
from datetime import datetime

SERIAL_PORT = "/dev/serial0"
latitude = -1
longitude = -1

def decimal_degrees(coord):
    degrees = int(coord[:2])
    minutes = float(coord[2:])
    return degrees + (minutes / 60)

def get_position_data(gps):
    global latitude, longitude  # Use global keyword to modify global variables
    data = gps.readline().decode("utf-8")
    message = data.split(",")[0]

    if message == "$GNRMC":
        fields = data.split(',')
        latitude = fields[3]
        longitude = fields[5]
        longitude = longitude[1:]
        formatted_latitude = decimal_degrees(latitude)
        formatted_longitude = decimal_degrees(longitude)
        print("Latitude:", formatted_latitude)
        print("Longitude:", formatted_longitude)
        return formatted_latitude, formatted_longitude  # Return values instead of list
    return None

def start_gps():
    print("Application started!")
    latitude_final = -1
    longitude_final = -1
    with serial.Serial(SERIAL_PORT, baudrate=9600, timeout=0.5) as gps:
        try:
            while True:
                position_data = get_position_data(gps)
                if position_data:
                    latitude_final, longitude_final = position_data
                    break
        except KeyboardInterrupt:
            print("Application closed!")
        except Exception as e:
            print("Application error:", e)
            
    return latitude_final, longitude_final

# Call the start_gps function
if __name__ == "__main__":
    start_gps()
