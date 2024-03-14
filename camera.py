from picamera2 import Picamera2
from libcamera import controls
import os

# Define the directory to save images
image_directory = "./images"

# Check if the directory exists, and if not, create it
if not os.path.exists(image_directory):
    os.makedirs(image_directory)

picam2 = Picamera2()
# Prepare the camera configuration
config = picam2.create_still_configuration()
picam2.configure(config)
picam2.start(show_preview=True)
picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})

# Function to get current image ID
def get_current_image_id():
    # Open the file "current_image.txt" to read the current image ID
    with open("current_image.txt", "r") as file:
        current_image_id = file.read().strip()
    return current_image_id


# Function to capture and save image
def capture_and_save_image(image_filename):
    # The path where the image will be saved
    image_path = os.path.join(image_directory, image_filename)
    # Capture the image to the specified file
    picam2.capture_file(image_path)

# Example: Capturing and saving an image
current_image_id = get_current_image_id()
image_filename = f"image_{current_image_id}.jpg"
capture_and_save_image(image_filename)

# Don't forget to stop the preview when done
picam2.stop()
