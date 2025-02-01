# TechShala

TechShala is a full-stack web application built using the **MERN (MongoDB, Express.js, React, Node.js)** stack. It is designed to provide a platform for users to explore and book tech-related courses efficiently.

## 🚀 Features
- User authentication (JWT-based login/signup)
- Role-based access control (Admin/User)
- Course management with CRUD operations
- Secure API with data validation and XSRF protection
- Interactive and responsive UI with React
- State management using Context API / Redux
- Backend API with Express.js and MongoDB

## 🛠 Tech Stack
### **Frontend**
- React.js
- React Router DOM
- Redux / Context API
- Bootstrap / Tailwind CSS
- Axios

### **Backend**
- Node.js
- Express.js
- MongoDB with Mongoose ORM
- JSON Web Token (JWT) authentication
- Dotenv for environment variables

### **Other Dependencies**
- bcrypt for password hashing
- Cors for cross-origin requests
- Multer for file uploads

## 📦 Installation

### **1. Clone the Repository**
```sh
git clone https://github.com/ChewanRai1/TechShala_ST6005CEM_Security.git
cd TechShala_ST6005CEM_Security
```

### **2. Install Dependencies**
#### **Backend**
```sh
cd server-app
npm install
```

#### **Frontend**
```sh
cd frontend
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the **server-app** directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=your_frontend_url
EMAIL_USER=
EMAIL_PASS=
```

### **4. Run the Application**
#### **Start Backend**
```sh
cd server-app
npm start
```

#### **Start Frontend**
```sh
cd frontend
npm start
```

## 📂 Project Structure
```
TechShala_ST6005CEM_Security/
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│   └── .env
│
│── server-app/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── Credentials.txt
│
│── README.md
│── package.json
│── .gitignore
```

## 🛡 Security Features
- **HTTPS Enforcement** for encrypted communication
- **JWT Authentication** for secure user sessions
- **CSRF Protection** to prevent cross-site request forgery
- **RBAC (Role-Based Access Control)** to restrict unauthorized actions
- **Input Sanitization** to prevent injection attacks
- **Password Security Measures**:
  - Enforced password length and complexity
  - Password expiration and reuse prevention
  - Real-time strength assessment during registration
- **Brute Force Protection** to mitigate unauthorized access attempts
- **Session Management** for user activity tracking
- **Encryption** for sensitive data storage
- **Audit Trail** to log and monitor system activities


## 📞 Contact
For any queries, feel free to reach out at:
- **Email:** rai.chewan123@gmail.com
- **GitHub:** [ChewanRai1](https://github.com/ChewanRai1)
- **LinkedIn:** [Chewan Rai]((https://www.linkedin.com/in/chewan-rai140/))
