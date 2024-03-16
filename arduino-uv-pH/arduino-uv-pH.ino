#define PH_NORM_MIN 215
#define PH_NORM_MAX 270
#define UV_NORM_MIN 200
#define UV_NORM_MAX 220

const int analogInPinUv = A0;
const int analogInPinPh = A1;


void setup() {
  Serial.begin(9600);
}


void loop() {
  int waterCounter = 0;
  int petrolCounter = 0;
  int normalCounter = 0;
  int pollutedCounter = 0;
  int outsideCounter = 0;

  for (int i=0; i<100; i++)
  {  
    int readingUv = analogRead(analogInPinUv);
    int readingPh = analogRead(analogInPinPh);

    // Serial.println(readingUv);
    // Serial.println(readingPh);
    if(readingPh > PH_NORM_MIN && readingPh < PH_NORM_MAX)
    {
      normalCounter++;
    }else if(readingPh < PH_NORM_MIN)
    {
      pollutedCounter++;

    }else if(readingPh > PH_NORM_MAX) {
      outsideCounter++;
    }

    if(readingUv > UV_NORM_MIN && readingUv < UV_NORM_MAX) {
      waterCounter++;
    }else if(readingUv > UV_NORM_MAX) {
      petrolCounter++;
    }
    delay(70);
  }

  if(outsideCounter > normalCounter && outsideCounter > pollutedCounter) {
    Serial.print("Outside");
  }else if(normalCounter > pollutedCounter) {
    Serial.println("Normal");
    }else{
      Serial.println("Polluted");
    }

  if(waterCounter > petrolCounter*3) {
    Serial.println("\nWATER");
  }else{
    Serial.println("\nPETROL");
  }
  
  delay(2000);
}