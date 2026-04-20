# 🏫 Class-Room-Automation — MERN Stack

A **Smart Classroom Automation System** built with the MERN stack (MongoDB, Express, React, Node.js).

## 📁 Project Structure

```
Class-Room-Automation-/
├── backend/          ← Node.js + Express + MongoDB API
├── frontend/         ← React (Vite) frontend
├── API_Documentation.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup
```bash
cd backend
# Edit .env with your MongoDB URI
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## 🔑 First-Time Setup
1. Start both servers
2. Go to `http://localhost:5173/register`
3. Create an admin account (e.g., `admin` / `1234`)
4. Login and control your classroom devices!

## ✨ Features
- JWT-based authentication (register/login)
- Live dashboard with 6 classroom devices (4 Lights + 2 Fans)
- Toggle devices ON/OFF — state persists in MongoDB
- Real-time power consumption gauge (auto-refreshes every 3s)
- Responsive dark-mode UI with premium design
- Protected routes (unauthorized users redirected to login)

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite + React Router |
| UI Components | Chart.js, React-Chartjs-2 |
| Styling | Vanilla CSS (dark mode, glassmorphism) |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |

## 📡 API Endpoints
See [API_Documentation.md](./API_Documentation.md) for full details.
