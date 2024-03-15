void setup(){

  Serial.begin(9600);
  pinMode(7, OUTPUT);
}

void loop(){

  if(Serial.available() > 0) {
      String data = Serial.readStringUntil('\n');
      Serial.print("Im arduino");
      if (data == "HIGH")
      {
        digitalWrite(7, HIGH);
      }else if (data == "LOW")
      {
        digitalWrite(7, LOW);
      }else{
        Serial.println("Invalid Input");
      }
  }
}