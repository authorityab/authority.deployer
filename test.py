import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

#var joystick_up = new Gpio(6, 'in', 'falling'); //rising
#var joystick_down= new Gpio(5, 'in', 'falling');
#var joystick_left = new Gpio(26, 'in', 'falling'); // only gpio pns 4,5,6 are working
#var joystick_right = new Gpio(4, 'in', 'falling');

GPIO.setup(6, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(5, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(19, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
	input_up = GPIO.input(6)
	input_down = GPIO.input(5)
	input_left = GPIO.input(26)
	input_right = GPIO.input(4)
	
	if input_up == False:
		print('up');
		time.sleep(0.2)
		
	if input_down == False:
		print('down');
		time.sleep(0.2)
	
	if input_left == False:
		print('left');
		time.sleep(0.2)
		
	if input_right == False:
		print('right');
		time.sleep(0.2)