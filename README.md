# 💰 Smart Expense Tracker & AI Financial Advisor

A modern, full-stack Expense Tracking web application built to help you manage your finances smarter. Moving beyond simple logging, this application features a proactive budget alert system and integrates the power of **Google's Gemini AI** as a personal financial advising assistant.

## ✨ Key Features

- **Real-Time Expense Tracking**: Easily log your daily expenses and income.
- **Smart Budget Alerts**: Keep your spending in check. The system actively monitors your transactions and will warn (and optionally block) you when you're about to exceed your defined budget limits.
- **AI Financial Assistant**: A built-in intelligent chat widget powered by the **Gemini API**. It reads your spending patterns and provides highly personalized financial insights, savings tips, and feedback on your habits.
- **Full-Stack Application**: Robust user management and database storage to keep your financial data persistent. 

## 🛠️ Technology Stack
- **Frontend**: React (Client)
- **Backend**: Node.js & Express (Server)
- **Database**: MongoDB (Mongoose Models)
- **AI Integration**: Google Gemini API

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB connection string
- Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SyedRafey03/ExpenseTracker.git
   cd ExpenseTracker
   ```

2. **Install Server Dependencies & Configure:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server` directory and add your credentials:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the Application:**
   Open two terminal tabs.
   - Run the Backend (from `/server`): `npm start` (or `node server.js`)
   - Run the Frontend (from `/client`): `npm start`

The React app will be running on `http://localhost:3000` and the backend will be available on `http://localhost:5000`.
