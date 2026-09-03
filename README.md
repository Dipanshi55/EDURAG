# EduRAG 🎓

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![AI Integration](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-orange.svg)]()

EduRAG is a comprehensive educational platform and college portal designed for Tulsiramji Gaikwad Patil College of Engineering and Technology. It leverages modern web technologies and Artificial Intelligence (via Gemini and OpenAI APIs) to empower students with an intelligent, fast, and highly interactive learning and administrative environment.

## ✨ Features

- **Modern UI/UX**: Built with React, TailwindCSS, and Framer Motion for a stunning, responsive, and accessible user interface.
- **Smart Educational Assistant (RAG)**: Integrates Google Gemini and OpenAI to provide intelligent retrieval-augmented generation features for students and staff.
- **Robust Backend API**: Powered by Node.js and Express, securely handling authentication, file uploads (Multer), and AI orchestration.
- **Secure Authentication**: JSON Web Tokens (JWT) and Bcrypt for secure user sessions and password management.
- **Dynamic Content**: Connected to a MongoDB Atlas cluster to efficiently store and retrieve academic data, courses, and placement statistics.

## 🚀 Tech Stack

### **Frontend (`/client`)**
- React 19 & React Router v7
- Vite (Build Tool)
- TailwindCSS v4
- Framer Motion (Animations)
- Redux Toolkit (State Management)
- Axios (HTTP Client)
- Lucide React (Icons)

### **Backend (`/server`)**
- Node.js & Express.js
- MongoDB & Mongoose
- `@google/genai` (Google Gemini AI)
- `openai` (OpenAI API)
- `jsonwebtoken` & `bcryptjs` (Auth)
- `multer` (File Uploads)

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB account (for database)
- Gemini / OpenAI API keys

### **1. Clone the Repository**
```bash
git clone https://github.com/kileshwar23/Edurag.git
cd Edurag
```

### **2. Backend Setup**
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
# Add other necessary keys...
```

Start the backend server (development mode):
```bash
npm run dev
```

### **3. Frontend Setup**
Open a new terminal window and navigate to the client folder:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will usually be accessible at `http://localhost:4000` or `http://localhost:5173`. The backend runs on `http://localhost:5001`.

## 📂 Project Structure

```
EduRAG/
├── client/           # React frontend application
│   ├── src/          # Components, Pages, and Redux slices
│   ├── public/       # Static assets like images and logos
│   └── package.json  
├── server/           # Node.js + Express backend
│   ├── src/          # Routes, Controllers, Models
│   ├── .env          # Environment variables (not tracked by git)
│   └── package.json
└── README.md         # Project documentation
```

## 📜 License

This project is licensed under the ISC License.
