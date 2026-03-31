# 📝 SmartNotes — Full Stack Notes App

A production-grade full stack notes application built with Node.js, Express, MongoDB and JWT authentication. Users can securely create, read, update and delete their personal notes.

🔗 **Live Demo:** https://smart-notes-db8l1vhar-hiten-developers-projects.vercel.app/

---

## ✨ Features

- 🔐 Secure user authentication — Signup & Login
- 🔑 JWT based session management
- 🔒 bcrypt password hashing
- 📝 Full CRUD operations on notes
- 🛡️ Protected routes — users only see their own notes
- 🔍 Live search across all notes
- 📱 Fully responsive — works on all devices
- ☁️ Deployed on cloud — Render + Vercel

---

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

**Deployment:**
- Backend → Render
- Frontend → Vercel
- Database → MongoDB Atlas

---

## 📁 Folder Structure

```
notes-app/
│
├── client/                  → Frontend
│   ├── index.html           → Signup page
│   ├── login.html           → Login page
│   ├── dashboard.html       → Notes dashboard
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       └── notes.js
│
├── server/                  → Backend
│   ├── config/
│   │   └── db.js            → MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   ├── app.js
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user, returns JWT | No |

### Notes Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notes` | Get all notes of logged in user | Yes |
| POST | `/api/notes` | Create a new note | Yes |
| PUT | `/api/notes/:id` | Update a note | Yes |
| DELETE | `/api/notes/:id` | Delete a note | Yes |

---

## 🚀 Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/hiten-developer/smart-notes-app.git
cd smart-notes-app
```

**2. Setup Backend**
```bash
cd server
npm install
```

**3. Create `.env` file inside `server/` folder**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**4. Start the backend server**
```bash
npm run dev
```

**5. Open Frontend**

Open `client/index.html` in your browser directly — or use Live Server extension in VS Code.

---

## 📸 Screenshots

### Signup Page
![Signup](https://via.placeholder.com/800x450/0d1117/3b82f6?text=Signup+Page)
<img width="850" height="798" alt="Screenshot 2026-03-24 185135" src="https://github.com/user-attachments/assets/cc5f5d65-e804-452c-834e-fd38e23abf16" />

### Login Page
![Login](https://via.placeholder.com/800x450/0d1117/8b5cf6?text=Login+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/0d1117/3b82f6?text=Notes+Dashboard)

---

## 🔐 Security Features

- Passwords are hashed using **bcrypt** before storing in database
- Authentication uses **JWT tokens** with 7 day expiry
- Every note operation verifies **ownership** — users cannot access other users' notes
- Sensitive config stored in **environment variables** — never in code

---

## 👨‍💻 Author

**Hiten Prajapati**
- GitHub: https://github.com/hiten-developer
- LinkedIn: https://www.linkedin.com/in/hitenprajapati-dev/

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
