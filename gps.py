import serial
from datetime import datetime

SERIAL_PORT = "/dev/ttyAMA0"
running = True
latitude = -1
longitude = -1

def decimal_degrees(coord):
    degrees = int(coord[:2])
    minutes = float(coord[2:])
    return degrees + (minutes / 60)

def get_position_data(gps):
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
        return [formatted_latitude, formatted_longitude]
    return None

# print("Application started!")
# with serial.Serial(SERIAL_PORT, baudrate=9600, timeout=0.5) as gps:
#     while running:
#         try:
#             if get_position_data(gps):
#                 current_datetime = datetime.now()
#                 # Format the datetime as YY-MM-DD hh-mm
#                 formatted_datetime = current_datetime.strftime("%y-%m-%d %H-%M")

#                 print("Formatted datetime:", formatted_datetime)
#                 break  # Break out of the loop after printing coordinates  
#                 #delete if u want to continue
#         except KeyboardInterrupt:
#             running = False
#             print("Application closed!")
#         except Exception as e:
#             print("Application error:", e)


#TODO - make a connection with the trash recognition and if possible - send a just brief msg