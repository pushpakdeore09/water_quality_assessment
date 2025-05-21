#include <WiFi.h>
#include <FirebaseESP32.h>

// WiFi credentials
#define WIFI_SSID "Network"
#define WIFI_PASSWORD "password"

// Firebase credentials
#define FIREBASE_API_KEY "AIzaSyCUg_atHRlvyRFKfPFN5L_h_9xS_17XdOk"
#define FIREBASE_PROJECT_URL "https://water-assessment-293c6-default-rtdb.firebaseio.com/"

#define USER_EMAIL "esp32@example.com"
#define USER_PASSWORD "esp32client"

// Sensor pins
#define TDS_PIN 34
#define TURBIDITY_PIN 35
#define RAINDROP_PIN 32

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// pH calibration variables
#define PH_MIN 6.5
#define PH_MAX 8.5
#define RAINDROP_MIN_VOLTAGE 0.5  // Corresponds to pH 6.5
#define RAINDROP_MAX_VOLTAGE 3.5  // Corresponds to pH 8.5

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  config.api_key = FIREBASE_API_KEY;
  config.database_url = FIREBASE_PROJECT_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  int tdsRaw = analogRead(TDS_PIN);
  int turbidityRaw = analogRead(TURBIDITY_PIN);
  int raindropRaw = analogRead(RAINDROP_PIN);

  float tdsVoltage = tdsRaw * (3.3 / 4095.0);
  float turbidityVoltage = turbidityRaw * (3.3 / 4095.0);
  float raindropVoltage = raindropRaw * (3.3 / 4095.0);

  // TDS calculation
  float tdsValue = (133.42 * tdsVoltage * tdsVoltage * tdsVoltage 
                  - 255.86 * tdsVoltage * tdsVoltage 
                  + 857.39 * tdsVoltage) * 0.5;

  // Turbidity calculation
  float turbidityNTU = -1120.4 * turbidityVoltage * turbidityVoltage + 5742.3 * turbidityVoltage - 4352.9;
  if (turbidityNTU < 0) turbidityNTU = 0;
  turbidityNTU = turbidityNTU / 1000;

  // pH calculation from raindrop sensor
  float pH = ((raindropVoltage - RAINDROP_MIN_VOLTAGE) / (RAINDROP_MAX_VOLTAGE - RAINDROP_MIN_VOLTAGE)) 
            * (PH_MAX - PH_MIN) + PH_MIN;

  // Log values to Serial
  Serial.println("--- Sensor Readings ---");
  Serial.print("TDS (mg/L): ");
  Serial.println(tdsValue, 3);
  Serial.print("Turbidity (NTU): ");
  Serial.println(turbidityNTU, 3);
  Serial.print("pH: ");
  Serial.println(pH, 3);

  // Use FirebaseJson to send only TDS, Turbidity, and pH values
  FirebaseJson json;
  json.set("TDS", tdsValue);
  json.set("Turbidity", turbidityNTU);
  json.set("pH", pH);

  if (Firebase.ready()) {
    if (Firebase.updateNode(fbdo, "/Sensors", json)) {
      Serial.println("All sensor data updated successfully!");
    } else {
      Serial.println("Update failed: " + fbdo.errorReason());
    }
  }

  delay(2000);
}
