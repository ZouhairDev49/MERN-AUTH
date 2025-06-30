# 🔐 MERN Stack Authentication App

A complete authentication system built with the **MERN stack (MongoDB, Express, React, Node.js)** using **JWT tokens**, **cookie-based auth**, and protected routes.

> Includes user registration, login, logout, profile display, and route protection.

---

## 📸 Screenshots

### 🏠 Home Page
![[home Page]Capture d'écran 2025-06-30 122612](https://github.com/user-attachments/assets/fa8d3aad-f309-4b8f-8372-4dbef1bd2a11)

### 🔐 Login Page
![Login Page][Capture d'écran 2025-06-30 122519](https://github.com/user-attachments/assets/5e3d9f41-1237-4f4f-afa1-b70906213d3b)

### 📝 Register Page
![Register Page][Capture d'écran 2025-06-30 122533](https://github.com/user-attachments/assets/679e29fe-26c8-4638-815e-a03d40d1c585)

### Reset Password with otp code verification 
![REset Password Page][Capture d'écran 2025-06-30 122455](https://github.com/user-attachments/assets/7b3f97ff-3a4f-465d-a4d2-28b671ae6073)
###  Account verification with otp code 
![Account verification Page][Capture d'écran 2025-06-30 122621](https://github.com/user-attachments/assets/c7c38082-2fd6-4a12-836a-a353b6566f9a)

---

## 🚀 Features

- 🔒 JWT-based Authentication
- 🍪 HttpOnly Cookie Token Storage
- 🛡️ Protected Backend + Frontend Routes
- 👤 User Profile Dashboard
- ❌ Logout + Token Expiry Handling
- ✅ Form Validation + Feedback
- ⚙️ Environment Variable Support

---

## 🧰 Tech Stack

### 💻 Frontend
- React
- Axios
- React Router
- TailwindCSS or Bootstrap

### 🖥️ Backend
- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens
- Cookie-parser
- dotenv

### Installation

1. Clone the repository:

```sh
git clone (https://github.com/ZouhairDev49/MERN-AUTH.git)
cd mern-auth
```

2. Install dependencies for the client:

```sh
cd client
npm install
```

3. Install dependencies for the server:

```sh
cd ../server
npm install
```

### Configuration

1. Create a `.env` file in the **server** directory based on the `.env.template` file and fill in the required environment variables.


```
VITE_API_URL=http://localhost:4000/api/auth
```

### Running the Application

- Start the server:

```sh
cd server
npm run dev
```

- Start the client:

```sh
cd ../client
npm run dev
```

- The client application should now be running at http://localhost:5173 and the server at http://localhost:4000.


