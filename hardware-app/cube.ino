
// Screen settings
#define SCREEN_WIDTH      128
#define SCREEN_HEIGHT     128
#define SCREEN_IS_ACTIVE  false

// Sceen pins definitions
#define SCLK_PIN          13
#define MOSI_PIN          11
#define DC_PIN            8
#define CS_PIN            10
#define RST_PIN           7

// Color definitions
#define BLACK             0x0000
#define BLUE              0x001F
#define RED               0xF800
#define GREEN             0x07E0
#define CYAN              0x07FF
#define MAGENTA           0xF81F
#define YELLOW            0xFFE0
#define WHITE             0xFFFF

// BLE definitions
#define BLE_DEVICE_NAME                           "DeskCube"

#define BLE_UUID_AHRS_SERVICE                     "1101"
#define BLE_UUID_AHRS_ROLL                        "2101"
#define BLE_UUID_AHRS_PITCH                       "2102"
#define BLE_UUID_AHRS_YAW                         "2103"
#define BLE_UUID_AHRS_HEADING                     "2104"
#define BLE_UUID_AHRS_FREQUENCY                   "2105"

#define BLE_UUID_ACCELEROMETER_SERVICE            "181A"
#define BLE_UUID_ACCELEROMETER_X                  "3101"
#define BLE_UUID_ACCELEROMETER_Y                  "3102"
#define BLE_UUID_ACCELEROMETER_Z                  "3103"
#define BLE_UUID_DIRECTIONAL                      "3104"

#include <ReefwingAHRS.h>
#include <Arduino_LSM9DS1.h>
#include <ArduinoBLE.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1351.h>
#include <SPI.h>
#include "Cube_Screen.h"
#include "Cube_Images.h"

// LSM9DS1 IMU
LSM9DS1 imu;
EulerAngles angles;

// Initail values
int loopFrequency = 0;
const long displayPeriod = 300;
unsigned long previousMillis = 0;
int degreesX = 0;
int degreesY = 0;

// Cube Screen - Software SPI
Cube_Screen cubeScreen = Cube_Screen(SCREEN_WIDTH, SCREEN_HEIGHT, CS_PIN, DC_PIN, MOSI_PIN, SCLK_PIN, RST_PIN);

// Cube Screen - Hardware SPI
// Cube_Screen cubeScreen = Cube_Screen(SCREEN_WIDTH, SCREEN_HEIGHT, &SPI, CS_PIN, DC_PIN, RST_PIN);

// Cube BLE
// Bluetooth® Low Energy - AHRS Service
BLEService ahrsService(BLE_UUID_ACCELEROMETER_SERVICE);

// Bluetooth® Low Energy - AHRS Service Characteristics
BLEFloatCharacteristic ahrsRollChar(BLE_UUID_AHRS_ROLL, BLERead | BLENotify);
BLEFloatCharacteristic ahrsPitchChar(BLE_UUID_AHRS_PITCH, BLERead | BLENotify);
BLEFloatCharacteristic ahrsYawChar(BLE_UUID_AHRS_YAW, BLERead | BLENotify);
BLEFloatCharacteristic ahrsHeadingChar(BLE_UUID_AHRS_HEADING, BLERead | BLENotify);
BLEIntCharacteristic ahrsFrequencyChar(BLE_UUID_AHRS_FREQUENCY, BLERead | BLENotify);

// Bluetooth® Low Energy - Accelometer Service
BLEService accService("fff1");

// Bluetooth® Low Energy - Accelometer Service Characteristics
BLEIntCharacteristic accXPos(BLE_UUID_ACCELEROMETER_X, BLERead | BLENotify);
BLEIntCharacteristic accYPos(BLE_UUID_ACCELEROMETER_Y, BLERead | BLENotify);
BLECharCharacteristic directional(BLE_UUID_DIRECTIONAL, BLERead | BLENotify);

void setup(void) {

  // Init the LSM9DS1 IMU
  imu.begin();

  // Positive magnetic declination - Sydney, AUSTRALIA
  imu.setDeclination(12.717);
  imu.setFusionAlgorithm(SensorFusion::FUSION);
  imu.setFusionPeriod(0.01f);   // Estimated sample period = 0.01 s = 100 Hz
  imu.setFusionGain(7.5);       // Default Fusion Filter Gain - try 7.5 for a much quicker response

  // Init Serial Monitor
  Serial.begin(115200);
  // while (!Serial) delay(10);
  Serial.println("* DESKCUBE [INIT]:\tStarted");

  // Init Cube Screen, and clear the screen
  if(SCREEN_IS_ACTIVE){
    cubeScreen.begin();
  }
  cubeScreen.reset();

  // Init Cube IMU
  Serial.print("* DESKCUBE [IMU]:\t");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  if (imu.connected()) {
    Serial.println("LSM9DS1 IMU Connected.");

    // Callibration data
    imu.loadAccBias(0.001221, 0.001221, -0.011108);
    imu.loadGyroBias(0.328979, -0.291595, 0.022430);
    imu.loadMagBias(0.052246, 0.140259, -0.275513);

    imu.start();
  } else {
    Serial.println("LSM9DS1 IMU Not Detected.");
    while (1);
  }

  // Draw Bluetooth Bitmap on screen
  // cubeScreen.drawBitmap(0, 0, myBitmap, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);

  // Init Cube BLE
  Serial.print("* DESKCUBE [BLE]:\t");
  if (!BLE.begin()) {
    Serial.println("Failed to initialize BLE");
    while (1);
  }

  // BLE.setDeviceName(BLE_DEVICE_NAME);
  BLE.setLocalName("DeskCube");

  // AHRS Service
  BLE.setAdvertisedService(ahrsService);
  
  ahrsService.addCharacteristic(ahrsRollChar);
  ahrsService.addCharacteristic(ahrsPitchChar);
  ahrsService.addCharacteristic(ahrsYawChar);
  ahrsService.addCharacteristic(ahrsHeadingChar);
  ahrsService.addCharacteristic(ahrsFrequencyChar);

  ahrsService.addCharacteristic(accXPos);
  ahrsService.addCharacteristic(accYPos);
  ahrsService.addCharacteristic(directional);

  BLE.addService(ahrsService);

  ahrsRollChar.writeValue(0.0);
  ahrsPitchChar.writeValue(0.0);
  ahrsYawChar.writeValue(0.0);
  ahrsHeadingChar.writeValue(0.0);
  ahrsFrequencyChar.writeValue(0);

  // Accelometer Service
  accXPos.writeValue(0);
  accYPos.writeValue(0);
  directional.writeValue('C');

  // Start advertising
  BLE.advertise();
  Serial.println("Bluetooth® device active, waiting for connections...");

  cubeScreen.setColor(RED);
  cubeScreen.drawTextLine("Bluetooth active,");
  cubeScreen.drawTextLine("waiting for ");
  cubeScreen.drawTextLine("connections...");
}

void loop() {

  // wait for a Bluetooth® Low Energy central
  BLEDevice central = BLE.central();

  // if a central is connected to the peripheral:
  if (central) {

    // print the central's BT address:
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    // print the info on the Cube screen
    cubeScreen.reset();
    cubeScreen.setColor(BLUE);
    cubeScreen.drawTextLine("Connected to central: ");
    cubeScreen.drawTextLine(central.address());
    
    // reset the screen after the delay
    delay(500);
    cubeScreen.reset();

    while (central.connected()) {

      //  Check for new IMU data and update angles
      angles = imu.update();

      //  Wait for new sample - 7 ms delay provides a 100Hz sample rate / loop frequency
      delay(7);

      //  Display sensor data every displayPeriod, non-blocking.
      if (millis() - previousMillis >= displayPeriod) {

        Serial.print("Roll: ");
        Serial.print(angles.roll);
        Serial.print("\tPitch: ");
        Serial.print(angles.pitch);
        Serial.print("\tYaw: ");
        Serial.print(angles.yaw);
        Serial.print("\tHeading: ");
        Serial.print(angles.heading);
        Serial.print("\tLoop Frequency: ");
        Serial.print(loopFrequency);
        Serial.println(" Hz");
        
        updateAHRSValues();
        updateTilting();

        loopFrequency = 0;
        previousMillis = millis();
      }

      loopFrequency++;
    }

    loopFrequency = 0;

    Serial.print("Disconnected from central: ");
    Serial.println(central.address());

    cubeScreen.reset();
    cubeScreen.setColor(BLUE);
    cubeScreen.drawTextLine("Disconnected from central: ");
    cubeScreen.drawTextLine(central.address());

    delay(500);
    cubeScreen.reset();

    cubeScreen.setColor(RED);
    cubeScreen.drawTextLine("Bluetooth active,");
    cubeScreen.drawTextLine("waiting for ");
    cubeScreen.drawTextLine("connections...");
    delay(500);

  }
}

void updateAHRSValues() {

  ahrsRollChar.writeValue(angles.roll);
  ahrsPitchChar.writeValue(angles.pitch);
  ahrsYawChar.writeValue(angles.yaw);
  ahrsHeadingChar.writeValue(angles.heading);
  ahrsFrequencyChar.writeValue(loopFrequency);

  // Display value on the Screen
  // cubeScreen.resetCursor();
  // cubeScreen.drawValue("ROLL: ", angles.roll, RED);
  // cubeScreen.drawValue("PITC: ", angles.pitch, GREEN);
  // cubeScreen.drawValue("YAW : ", angles.yaw, BLUE);
  // cubeScreen.drawValue("HEAD: ", angles.heading, YELLOW);
  // cubeScreen.drawValue("FREQ: ", loopFrequency, " Hz", WHITE);
}

void updateTilting() {
  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);
  }

  // cubeScreen.setColor(MAGENTA);

  // Define X position
  if (x > 0.1) {
    x = 100 * x;
    degreesX = map(x, 0, 97, 0, 90);
    directional.writeValue('U');
    accXPos.writeValue(degreesX);
    // cubeScreen.drawValue("Tilting up ", degreesX, " deg", MAGENTA);
    cubeScreen.drawBitmap(0, 0, imageArrowUp, SCREEN_WIDTH, SCREEN_HEIGHT, BLUE);
  
  } else if(x < -0.1) {
    x = 100 * x;
    degreesX = map(x, 0, -100, 0, 90);
    directional.writeValue('D');
    accXPos.writeValue(degreesX);
    // cubeScreen.drawValue("Tilting down ", degreesX, " deg", MAGENTA);
    cubeScreen.drawBitmap(0, 0, imageArrowDown, SCREEN_WIDTH, SCREEN_HEIGHT, YELLOW);
  }

  // Define Y position
  if (y > 0.1) {
    y = 100 * y;
    degreesY = map(y, 0, 97, 0, 90);
    directional.writeValue('L');
    accYPos.writeValue(degreesY);
    // cubeScreen.drawValue("Tilting left ", degreesY, " deg", MAGENTA);
    cubeScreen.drawBitmap(0, 0, imageArrowLeft, SCREEN_WIDTH, SCREEN_HEIGHT, RED);

  } else if (y < -0.1) {
    y = 100 * y;
    degreesY = map(y, 0, -100, 0, -90);
    directional.writeValue('R');
    accYPos.writeValue(degreesY);
    // cubeScreen.drawValue("Tilting right ", degreesY, " deg", MAGENTA);
    cubeScreen.drawBitmap(0, 0, imageArrowRight, SCREEN_WIDTH, SCREEN_HEIGHT, GREEN);

  }
}