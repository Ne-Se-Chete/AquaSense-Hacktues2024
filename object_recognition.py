import cv2
import os

# Threshold to detect objects
thres = 0.45

# Load class names
classNames = []
classFile = os.path.join(os.path.dirname(__file__), 'config_files', 'coco.names')

with open(classFile, 'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')

# Paths to config and weights files
configPath = os.path.join(os.path.dirname(__file__), 'config_files', 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt')
weightsPath = os.path.join(os.path.dirname(__file__), 'config_files', 'frozen_inference_graph.pb')

# Load pre-trained model
net = cv2.dnn_DetectionModel(weightsPath, configPath)

# Set model input parameters
net.setInputSize(320, 320)
net.setInputScale(1.0 / 127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)

# Path to the image folder
image_folder = "images"
output_folder = "recognized"

# Create the output directory if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Read current image ID
current_image_file = "current_image.txt"
current_image_id = 0

if os.path.exists(current_image_file):
    with open(current_image_file, 'r') as f:
        current_image_id = int(f.read())

# Load the image corresponding to current image ID
image_path = os.path.join(image_folder, f"image_{current_image_id}.jpg")

if os.path.exists(image_path):
    image = cv2.imread(image_path)

    # Detect objects in the image
    classIds, confs, bbox = net.detect(image, confThreshold=thres)

    # Check if any objects are detected
    if len(classIds) > 0:
        for classId, confidence, box in zip(classIds.flatten(), confs.flatten(), bbox):
            # Draw bounding box and label
            cv2.rectangle(image, box, color=(0, 255, 0), thickness=2)
            cv2.putText(image, classNames[classId - 1], (box[0] + 10, box[1] + 30),
                        cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)

        # Save the detected image
        output_path = os.path.join(output_folder, f"recognized_image_{current_image_id}.jpg")
        cv2.imwrite(output_path, image)

        # Update current image ID
        current_image_id += 1
        with open(current_image_file, 'w') as f:
            f.write(str(current_image_id))

        print(f"Object detection completed for image_{current_image_id - 1}. Detected image saved as {output_path}.")
    else:
        print("No objects detected in the image.")
else:
    print(f"Image image_{current_image_id}.jpg does not exist.")

