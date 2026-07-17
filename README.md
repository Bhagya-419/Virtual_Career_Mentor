# 🎓 Virtual Career Mentor

An AI-powered web application that helps students and job seekers make informed career decisions through resume analysis, skill assessment, career prediction, and personalized guidance.

---

## 📌 Features

- 🔐 User Authentication (JWT)
- 👤 User Profile Management
- 📄 Rule Based Resume Analysis
- 🤖 AI Career Chatbot (OpenRouter API)
- 📝 Skill Assessment Quiz
- 🧠 Machine Learning Career Prediction (Random Forest)
- 💼 Job Recommendations
- 📊 Quiz History & Chat History
- 💾 MongoDB Data Storage
- 🌐 Responsive Web Interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Machine Learning
- Python
- Scikit-learn
- Random Forest

### AI Integration
- OpenRouter API

### Development Tools
- VS Code
- Git
- GitHub

---

## 📂 Project Structure

```
virtual-career-mentor/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── ml/
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/Bhagya-419/Virtual_Career_Mentor.git
```

## 🚀 Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install the required dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file inside the **backend** folder and add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Start the backend server

```bash
node server.js
```
### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📖 Workflow

1. User Registration/Login
2. Upload Resume
3. Resume Analysis
4. Take Skill Assessment Quiz
5. Predict Career using ML Model
6. AI Career Guidance
7. View Quiz & Chat History
8. Receive Career Recommendations

---

## 🎯 Future Enhancements

- Industry-standard ATS Resume Parser API
- Live Job Portal Integration
- Interview Preparation Module
- Resume Builder
- Email Notifications
- Personalized Learning Roadmaps

---

## 👩‍💻 Developed By

- Bhagya
- Pavani
- Pranathi
- Pravalika
- Rajasri

---

## 📄 License

This project is developed for educational and academic purposes.
