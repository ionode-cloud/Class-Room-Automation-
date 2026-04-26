# 📚 Smart Classroom Automation — API Reference

This documentation provides details for interacting with the Smart Classroom Automation backend. The API is designed for local development and demonstration purposes.

**Base URL:** `http://localhost:5000`

---

## 📋 Table of Contents
- [Authentication](#-authentication)
- [Device Management](#-device-management)
- [Bulk Operations](#-bulk-operations)
- [Power Analytics](#-power-analytics)
- [Environment Analytics](#-environment-analytics)
- [Testing with Postman](#-testing-with-postman)

---

## 🔐 Authentication
> [!NOTE]
> Authentication is currently **OPTIONAL** to facilitate easier local testing and demonstrations. All device routes are publicly accessible.

### 1. Register User
`POST /api/auth/register`

Create a new administrative user.

**Request Body:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `username` | String | Unique username |
| `password` | String | User password |
| `role` | String | User role (e.g., "admin") |

**Example:**
```json
{ "username": "admin", "password": "1234", "role": "admin" }
```

---

### 2. Login User
`POST /api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{ "username": "admin", "password": "1234" }
```

---

## 💡 Device Management & Sync (All-in-One)

### 1. Get All Classroom Data
`GET /api/devices`

Retrieve the current state of all fans, lights, devices, total power consumption, and latest sensor readings in a single unified response.

**Success Response:**
```json
{
  "id": "classroom_1",
  "devices": [
    {
      "_id": "69d6ad27...",
      "name": "Fan 1",
      "type": "fan",
      "isOn": true,
      "powerConsumption": 45
    }
  ],
  "fans": [ ... ],
  "lights": [ ... ],
  "others": [ ... ],
  "totalPowerConsumption": 45,
  "sensorData": {
    "temperature": 24.5,
    "humidity": 55.2
  },
  "timestamp": "2026-04-26T12:00:00Z"
}
```

---

### 2. Create Device OR Sync All Data
`POST /api/devices`

This endpoint serves a dual purpose:
1. **Legacy mode**: Register a single new device by sending `{ "name": "Fan", "type": "fan" }`.
2. **Sync mode**: Update sensors, fans, and lights in a single API call (useful for ESP32/Arduino integration).

**Request Body (Sync Mode - All fields optional):**
```json
{
  "sensorData": {
    "temperature": 26.1,
    "humidity": 50.0
  },
  "fans": [
    { "_id": "YOUR_FAN_ID_HERE", "isOn": true, "powerConsumption": 45 }
  ],
  "lights": [
    { "_id": "YOUR_LIGHT_ID_HERE", "isOn": false }
  ]
}
```

---

### 3. Update Device Status
`POST /api/devices/:id/update`

Change the state (ON/OFF) of a specific device.

**Request Body:**
```json
{ "isOn": true }
```

---

### 4. Update Device Details
`PUT /api/devices/:id`

Full update for a specific device, allowing modification of name, type, power, and state.

**Request Body (All fields optional):**
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Updated name of the device |
| `type` | String | `light`, `fan`, or `ac` |
| `powerConsumption` | Number | Updated wattage |
| `isOn` | Boolean | Update device state |

**Example:**
```json
{
  "name": "Classroom AC 1",
  "powerConsumption": 1500,
  "isOn": true
}
```

> [!TIP]
> **RESTful Update Pattern**: Use the `PUT` method for standard resource updates. This follows best practices for API design, allowing you to update any or all device properties in a single call.

---

## 📦 Bulk Operations

### 1. Global Update
`POST /api/devices/bulk-update`

Apply settings to **all** devices simultaneously. Useful for "Master Off" or resetting the entire classroom.

**Request Body (All fields optional):**
| Field | Type | Description |
| :--- | :--- | :--- |
| `isOn` | Boolean | Turn all devices ON or OFF |
| `powerConsumption` | Number | Set a uniform power value for all devices |

**Example (Master Off):**
```json
{ "isOn": false }
```

---

## ⚡ Power Analytics

### 1. Real-time Total Power
`GET /api/devices/power/total`

Calculates the sum of `powerConsumption` for all devices currently set to `isOn: true`.

---

### 2. Sensor Update (IoT Mock)
`POST /api/devices/power/update`

Model an external sensor updating the power reading of a specific device.

**Request Body:**
```json
{
  "deviceId": "69d6ad27...",
  "powerConsumption": 45
}
```

---

## 🛠️ Testing with Postman

### Basic Steps
1. Open Postman and click **New > HTTP Request**.
2. Enter the URL (e.g., `http://localhost:5000/api/devices`).
3. Follow the specific instructions below based on the method:

### 🟢 GET Requests (Fetching Data)
*Used for reading data from the server. (e.g., `GET /api/devices`)*
- **Setup**: Select **GET** from the HTTP Method dropdown next to the URL.
- **Body**: No body is required for GET requests.
- **Action**: Click the blue **Send** button.
- **Result**: You will see the retrieved JSON data in the lower response pane.

### 🟡 POST Requests (Creating or Syncing Data)
*Used for sending new data to the server. (e.g., `POST /api/devices`)*
- **Setup**: Select **POST** from the dropdown.
- **Body**: Go to the **Body** tab below the URL bar.
- Select the **raw** radio button.
- At the end of that row, change the format dropdown from `Text` to **JSON**.
- Enter your JSON object in the text area. Example:
  ```json
  { "name": "Fan 4", "type": "fan", "isOn": true }
  ```
- **Action**: Click **Send**.

### 🟠 PUT Requests (Updating Existing Data)
*Used for replacing or updating an existing resource. (e.g., `PUT /api/devices/:id`)*
- **Setup**: Select **PUT** from the dropdown. 
- **URL**: Ensure you replace `:id` in the URL with an actual MongoDB `_id` string. Example: `http://localhost:5000/api/devices/64d6ad...`
- **Body**: Go to the **Body** tab -> select **raw** -> format **JSON**.
- Enter your updated fields. Example:
  ```json
  { "isOn": false, "powerConsumption": 0 }
  ```
- **Action**: Click **Send**.

### 🔴 DELETE Requests (Removing Data)
*Used for removing a resource from the database.*
- **Setup**: Select **DELETE** from the dropdown.
- **URL**: Ensure the URL contains the ID of the item you want to remove. Example: `http://localhost:5000/api/devices/64d6ad...`
- **Body**: Usually no body is required.
- **Action**: Click **Send**.

---

## 🌡️ Environment Analytics

### 1. Record Sensor Reading
`POST /api/sensors`

Record a new temperature and humidity data point. This endpoint is designed to receive data from IoT devices like an ESP32 or Arduino.

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `temperature` | Number | Yes | Current temperature in Celsius |
| `humidity` | Number | Yes | Current humidity percentage |

**Example:**
```json
{
  "temperature": 24.5,
  "humidity": 60
}
```

---

### 2. Get Sensor History
`GET /api/sensors/history?limit=N`

Retrieve historical sensor data points for generating charts and analytics. Data is returned in chronological order (oldest first).

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | Number | 48 | Number of past data points to fetch |

**Response Format:**
```json
[
  {
    "_id": "64d6ad28...",
    "temperature": 22.1,
    "humidity": 55,
    "timestamp": "2026-04-20T08:00:00.000Z",
    "__v": 0
  }
]
```

---

### 3. Get Latest Reading
`GET /api/sensors/latest`

Fetch the single most recent environment reading to update live dashboard values.

**Response Format:**
```json
{
  "_id": "64d6ad29...",
  "temperature": 24.5,
  "humidity": 60,
  "timestamp": "2026-04-20T18:30:00.000Z",
  "__v": 0
}
```

