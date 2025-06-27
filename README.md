# 🏨 Hotel Booking System – stayEazy

## 📌 Overview

**Hotel Booking System** is a fully functional web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). This project allows users to **search, view, and book hotels online**, manage profiles, and view booking history. Manager can manage hotel listings through a dedicated dashboard.

---

## 🚀 Key Features

### 👤 User Features

- ✅ Sign Up / Login (JWT-based authentication)
- 🔐 Forgot Password & Secure Reset via Email
- 👨‍💼 Profile View & Edit
- 🏨 Hotel Search with Filters (by name, price)
- 📅 Book Hotels with:
  - Room selection
  - Customer details
  - GST-inclusive billing
- 💳 Booking History
- 🌟 View Hotel Reviews

### 🛠️ Admin/Manager Features

- 🏢 Admin Panel for Hotel Managers
- ✏️ Edit Hotel Information (name, description, pricing, room count)
- 📊 View bookings & feedback (if extended)

---

## 🧱 Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React.js + Tailwind CSS       |
| Backend   | Node.js + Express.js          |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT, Cookies, Secure Password Hashing |
| Email     | Nodemailer for reset links    |

---

## 🗂️ Backend Structure

- Models:
  - `User`: Stores user info, hashed password, booking history
  - `Hotel`: Stores hotel data, reviews, pricing, room count
  - `Booking`: Stores individual booking records with timestamps

- Controllers:
  - Auth: SignUp, Login, Forgot/Reset Password
  - User: Profile, Bookings
  - Hotel: Search, Sort, Review
  - Booking: Room availability check, Bill calculation

---

## 🖥️ Frontend UI

- **React Components** for each feature (login, search, profile, etc.)
- **Tailwind CSS** for modern, responsive layout
- Clean user experience with form validations and interactive hotel cards

---

## 📚 Learnings

- Real-world **authentication & authorization** using JWT and cookies
- REST API design with **modular, scalable backend architecture**
- Integration of **email-based password reset**
- File organization and real-time updates using **React state**
- Enhanced UI using Tailwind for fast and aesthetic layout

---

## 📌 Future Improvements

- 🧾 PDF invoice download for bookings
- 📆 Real-time calendar-based room availability
- 📲 Mobile PWA support
- 🔄 Integration with payment gateway (Razorpay/Stripe)

- **Website**: [stayeazy.vercel.app](https://stayeazy.vercel.app)
