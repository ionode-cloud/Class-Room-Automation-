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

## 💡 Device Management

### 1. List All Devices
`GET /api/devices`

Retrieve the current state of all devices in the classroom.

**Success Response:**
```json
{
  "devices": [
    {
      "_id": "69d6ad27...",
      "name": "Light 1",
      "type": "light",
      "isOn": false,
      "powerConsumption": 20,
      "lastUpdated": "2026-04-20T18:00:00Z"
    }
  ],
  "timestamp": "2026-04-20T18:05:00Z"
}
```

---

### 2. Add New Device
`POST /api/devices`

Manually register a new device to the dashboard.

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Display name of the device |
| `type` | String | Yes | `light`, `fan`, or `ac` |
| `powerConsumption` | Number | No | Rated wattage |
| `isOn` | Boolean | No | Initial state (default: false) |

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
1. Set the request type (e.g., `POST`).
2. Enter the URL (e.g., `http://localhost:5000/api/devices/bulk-update`).
3. In the **Body** tab, select **raw** and set the format to **JSON**.
4. Paste your JSON payload and hit **Send**.

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

