const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to


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

  delay(250);


}