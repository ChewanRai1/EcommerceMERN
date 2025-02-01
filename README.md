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
2. Install Dependencies
Backend
sh
Copy
Edit
cd server-app
npm install
Frontend
sh
Copy
Edit
cd frontend
npm install
3. Set Up Environment Variables
Create a .env file in the server-app directory and add the following:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=your_frontend_url
4. Run the Application
Start Backend
sh
Copy
Edit
cd server-app
npm start
Start Frontend
sh
Copy
Edit
cd frontend
npm start
📂 Project Structure
lua
Copy
Edit
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
🛡 Security Features
JWT Authentication for secure user sessions
XSRF Protection to prevent cross-site request forgery
Input Sanitization to prevent injection attacks
Password Hashing using bcrypt
📌 Future Enhancements
Implementing WebSockets for real-time interactions
Adding AI-powered recommendations for tech courses
Enhancing the UI with animations and micro-interactions
Integrating payment gateways for seamless booking
🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue for discussion.

📜 License
This project is licensed under the MIT License.

📞 Contact
For any queries, feel free to reach out at:

Email: kojuparibesh1234@gmail.com
GitHub: ChewanRai1
LinkedIn: Paribesh Koju
