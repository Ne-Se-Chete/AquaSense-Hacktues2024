const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to
// read ph from 7 segment display TO COMIT

void setup() {
  // Set GPIO 0, 3, and 1 as outputs
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  Serial.begin(9600);



  // Set GPIO 0, 3, and 1 to high level
//  digitalWrite(8, HIGH);

}

void loop() {
  digitalWrite(2, LOW);
  digitalWrite(3, HIGH);
  digitalWrite(4, LOW);
  digitalWrite(5, HIGH);
  Serial.println(analogRead(analogInPin));

  Serial.println(ReadPH());
  delay(250);


}

/*

const int digitPins[] = {2, 3, 4, 5};  // Pins for controlling common cathode
const int segmentPins[] = {6, 7, 8, 9, 10, 11, 12, 13}; // Pins for segments a, b, c, d, e, f, g, dp

const byte digitValues[] = {
  B11111100, // 0
  B01100000, // 1
  B11011010, // 2
  B11110010, // 3
  B01100110, // 4
  B10110110, // 5
  B10111110, // 6
  B11100000, // 7
  B11111110, // 8
  B11110110  // 9
};

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(digitPins[i], OUTPUT);
    digitalWrite(digitPins[i], HIGH); // Set all digits off initially
  }
  for (int i = 0; i < 8; i++) {
    pinMode(segmentPins[i], OUTPUT);
    digitalWrite(segmentPins[i], LOW); // Set all segments off initially
  }
}

void loop() {
  for (int num = 0; num < 10; num++) {
    displayNumber(num);
    delay(1000); // Display each number for 1 second
  }
}

void displayNumber(int num) {
  for (int i = 0; i < 4; i++) {
    digitalWrite(digitPins[i], HIGH);
  }

  for (int digit = 0; digit < 4; digit++) {
    digitalWrite(digitPins[digit], LOW);

    for (int segment = 0; segment < 8; segment++) {
      if (bitRead(digitValues[num], segment)) {
        digitalWrite(segmentPins[segment], HIGH); // Turn segment on
      } else {
        digitalWrite(segmentPins[segment], LOW); // Turn segment off
      }
    }

    delay(5);

    for (int segment = 0; segment < 8; segment++) {
      digitalWrite(segmentPins[segment], LOW);
    }

    digitalWrite(digitPins[digit], HIGH);
  }
}
*/