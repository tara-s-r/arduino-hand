#include <Servo.h>
#include<SoftwareSerial.h>

Servo largeServo;

void setup () {
  //Servo setup
  largeServo.attach(9);
  
  // LED data
  pinMode(LED_BUILTIN, OUTPUT);
  
  //Serial setup
  Serial.begin(9600);
  Serial.println("connected!");
 }

void loop () {
  if (Serial.available() > 0) {
    char ch = (char)Serial.read();
    
    if (ch == 'h') {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("LED on");
    } 
    else if (ch == 'l') {
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("LED off");
    }
    else if (ch == 'a') {
      Serial.println("left");
      for (int largeAngle = largeServo.read();largeAngle <= 180; largeAngle += 1) { //should I delete the "largeAngle <= 180" part?
        largeServo.write(largeAngle);
        delay(10);
      }
    }
    else if (ch == 'd') {
      Serial.println("right");
      for (int largeAngle = largeServo.read(); largeAngle >= 0 && (char)Serial.read() != 'n'; largeAngle -= 1) {
        largeServo.write(largeAngle);
        delay(10);
      }
    }
    //neutral position
    else if (ch == 'n') {
      Serial.println("neutral");
      int largeAngle = largeServo.read();
      largeServo.write(largeAngle);
      
    }
  }
}

//  final touches
//Servo medServo;
//medServo.attach(10);
//Servo smallServo;
//smallServo.attach(11);
//else if (ch == 'f') {
//  Serial.write("front");
//  int medAngle = medServo.read();
//  for (medAngle <= 180; medAngle -= 1;) {
//  medServo.write(medAngle);}}
//else if (ch == 'v') {
//  Serial.write("back");
//  int medAngle = medServo.read();
//  for (medAngle <= 180; medAngle += 1;) {
//  medServo.write(medAngle);}}
//else if (ch == 'w') {
//  Serial.write("open");
//  int smallAngle = smallServo.read();
//  for (smallAngle <= 180; smallAngle += 1;) {
//  smallServo.write(smallAngle);}}
//else if (ch == 's') {
//  Serial.write("close");
//  int smallAngle = smallServo.read();
//  for (smallAngle <= 180; smallAngle -= 1;) {
//  smallServo.write(smallAngle);}}
//and add neutral position code