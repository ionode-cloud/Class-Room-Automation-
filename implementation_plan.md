# Class-Room-Automation → MERN Application

## Overview

Converting the existing static HTML/JS Class-Room-Automation project into a full-stack **MERN** (MongoDB, Express.js, React, Node.js) application with a proper frontend and backend separation.

### Current State
- `index.html` — Static login page (hardcoded `admin/1234`)
- `dashboard.html` — Static smart classroom dashboard with device toggles (Lights, Fans) and power consumption doughnut gauge

---

## Architecture

```
Class-Room-Automation-/
├── backend/                   ← Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js            ← Auth model
│   │   └── Device.js          ← Device state + power log model
│   ├── routes/
│   │   ├── authRoutes.js      ← POST /api/auth/login, /register
│   │   └── deviceRoutes.js    ← CRUD for device states & power logs
│   ├── middleware/
│   │   └── authMiddleware.js  ← JWT protect middleware
│   ├── .env                   ← MONGODB_URI, JWT_SECRET, PORT
│   ├── server.js
│   └── package.json
│
└── frontend/                  ← React (Vite)
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   └── Dashboard.jsx
    │   ├── components/
    │   │   ├── DeviceCard.jsx  ← Individual device toggle + power
    │   │   └── PowerGauge.jsx  ← Doughnut chart gauge (Chart.js)
    │   ├── context/
    │   │   └── AuthContext.jsx ← JWT token management
    │   ├── api/
    │   │   └── axios.js        ← Axios instance with base URL + interceptor
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env                    ← VITE_API_URL=http://localhost:5000
    └── package.json
```

---

## Backend Features

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register admin user |
| `/api/auth/login` | POST | Login → returns JWT |
| `/api/devices` | GET | Get all devices + states |
| `/api/devices/:id/toggle` | PATCH | Toggle a device ON/OFF |
| `/api/devices/power` | GET | Get total/per-device power logs |
| `/api/devices/power/update` | POST | IoT sensor posts power readings |

### MongoDB Models
- **User**: `{ username, password (bcrypt hashed), role }`
- **Device**: `{ name, type, isOn, powerConsumption, lastUpdated }`

---

## Frontend Features

- **Login page**: Calls `POST /api/auth/login`, stores JWT in `localStorage`, redirects to Dashboard
- **Dashboard**: 
  - Fetches all devices from API on load
  - Toggle switches call PATCH API endpoint
  - Live power consumption gauge (Chart.js doughnut)  
  - Auto-refresh every 2 seconds via polling
  - Logout button clears token
- **Protected routes**: Redirect to `/login` if no valid JWT

---

## Proposed Changes

### Backend

#### [NEW] `backend/package.json`
#### [NEW] `backend/server.js`
#### [NEW] `backend/.env`
#### [NEW] `backend/models/User.js`
#### [NEW] `backend/models/Device.js`
#### [NEW] `backend/routes/authRoutes.js`
#### [NEW] `backend/routes/deviceRoutes.js`
#### [NEW] `backend/middleware/authMiddleware.js`
#### [NEW] `backend/.gitignore`

---

### Frontend (React + Vite)

#### [NEW] `frontend/` — Vite React app
#### [NEW] `frontend/src/context/AuthContext.jsx`
#### [NEW] `frontend/src/api/axios.js`
#### [NEW] `frontend/src/pages/Login.jsx`
#### [NEW] `frontend/src/pages/Dashboard.jsx`
#### [NEW] `frontend/src/components/DeviceCard.jsx`
#### [NEW] `frontend/src/components/PowerGauge.jsx`
#### [NEW] `frontend/src/App.jsx`
#### [NEW] `frontend/src/index.css`
#### [NEW] `frontend/.env`

---

## Verification Plan

### Automated
- Start backend: `npm run dev` in `/backend`
- Start frontend: `npm run dev` in `/frontend`
- Test API via browser: login, toggle devices, observe gauge update

### Manual Verification
- Login with registered credentials → must redirect to Dashboard
- Toggle device → state persists in MongoDB
- Power gauge updates every 2 seconds via live polling
- Invalid login → error message shown
