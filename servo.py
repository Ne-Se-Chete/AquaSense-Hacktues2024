import RPi.GPIO as GPIO
from time import sleep   
GPIO.setmode(GPIO.BCM) 

def moveServo(howmuch):
    GPIO.setup(17,GPIO.OUT)  
    p = GPIO.PWM(17, 50)    
    p.start(0)           

    p.ChangeDutyCycle(int(howmuch))    
p.stop()          
GPIO.cleanup()          