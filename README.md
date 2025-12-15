# RealTime Chat App

A full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB.  
The application enables instant message delivery between multiple users with a clean client–server architecture.

🔗 **Live Application:**  
https://real-time-chat-app-teal-nine.vercel.app/

---

## Features

- Real-time bi-directional messaging using Socket.IO  
- Multiple concurrent users  
- Persistent message storage with MongoDB  
- Modular client–server architecture  
- Responsive React frontend  
- Deployed on Vercel  

---

## Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- Socket.IO Client
- CSS

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- MongoDB

### Deployment
- Vercel (Frontend)


## Project Structure
```text
RealTimeChatApp/
│
├── client/                         # React frontend
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/                 # Static assets (icons, images)
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── UserList.jsx
│   │   │
│   │   ├── context/                # Global state & auth context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/                  # Application pages
│   │   │   ├── Login.jsx
│   │   │   └── Chat.jsx
│   │   │
│   │   ├── utils/                  # Helper functions
│   │   │   └── formatTime.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/                         # Node.js backend
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   └── messageController.js
│   │
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js
│   │   └── Message.js
│   │
│   ├── routes/                     # REST API routes
│   │   ├── authRoutes.js
│   │   └── messageRoutes.js
│   │
│   ├── socket/                     # Socket.IO handlers
│   │   └── socket.js
│   │
│   ├── middleware/                 # Custom middleware
│   │   └── authMiddleware.js
│   │
│   ├── config/                     # Configuration files
│   │   └── db.js
│   │
│   ├── index.js                    # Server entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── vercel.json                     # Vercel configuration (if used)
```

---

## Local Development Setup

### Prerequisites
- Node.js (v16 or later recommended)
- MongoDB (local or MongoDB Atlas)

---

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Bineet08/RealTimeChatApp.git
cd RealTimeChatApp
```
2. **Install backend dependencies**
```bash
cd server
npm install
```
3. **Install frontend dependencies**
```bash
cd ../client
npm install
```


### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI=your_mongodb_connection_string`

`PORT=5000`



### Run the application

1. **Start the backend**
```bash
cd server
npm start
```
2. **Start the FrontEnd**
```bash
cd ../client
npm start
```
- The application will be available on 
```text
http://localhost:3000
```
## License

Open-source project for educational and personal use.
