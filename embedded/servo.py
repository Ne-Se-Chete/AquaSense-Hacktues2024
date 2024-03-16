from gpiozero import Servo
from time import sleep

def config_servo_camera():
    servo = Servo(17)

    servo.min()
    sleep(0.5)
    servo.mid()
    sleep(0.5)
    servo.max()
    sleep(0.5)
    servo.mid()
    sleep(0.5)
    servo.max()

if "__main__" in __name__:
    config_servo_camera()