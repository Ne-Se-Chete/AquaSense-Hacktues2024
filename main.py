import serial
import time

from gps import get_position_data
# use with with serial.Serial(SERIAL_PORT, baudrate=9600, timeout=0.5) as gps:

from camera import capture_and_save_image

serArduino = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
 
# Get rid of garbage/incomplete data
serArduino.flush()
 
# Infinite loop
while (1):
 
  send_string = input()
   
  serArduino.write(send_string.encode('utf-8'))
   
  time.sleep(0.5)
 
  receive_string = serArduino.readline().decode('utf-8').rstrip()
 
  print(receive_string)