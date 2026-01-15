# Tour Booking System

A comprehensive tour booking and management system featuring a backend API built with Node.js/Express and a frontend interface for users and administrators.

## 🚀 Overview

This project provides a robust platform for booking tours, managing destinations, and interacting with a Gemini-powered chatbot for tour information. It includes features for user authentication, booking management, and a dedicated admin dashboard.

## 🔑 Admin Credentials

To access the administrative dashboard and management features:

- **Email:** `kimtruongthinh.nguyen@gmail.com`
- **Password:** `Thinh2004!`

## 🛠️ Tech Stack

### Backend
- **Framework:** Node.js, Express.js
- **Database:** Google Firestore
- **Search Engine:** Elasticsearch
- **Authentication:** Firebase Admin SDK & Google JWT
- **Storage:** Cloudinary (for images)
- **AI Integration:** Google Gemini API
- **Notifications:** Nodemailer (via Gmail)
- **Other libraries:** `slugify`, `multer`, `helmet`, `morgan`, `cors`

### Frontend
- **Languages:** HTML5, CSS3, JavaScript (Vanilla)
- **Frameworks/Libraries:** Bootstrap 5
- **Design:** Modern CSS with custom components, glassmorphism, and responsive layouts.
- **AI Chatbot:** Integrated frontend for Gemini chatbot interactions.

## 📂 Project Structure

```text
.
├── backend/                # Server-side application
│   ├── src/                # Source code
│   │   ├── app.js          # App entry point
│   │   ├── config/         # Configuration (Firebase, Elasticsearch, Cloudinary, Multer)
│   │   ├── controllers/    # Request handlers for all modules
│   │   ├── middlewares/    # Custom middlewares (Auth, Error, Validation, etc.)
│   │   ├── models/         # Firestore data models/schemas
│   │   ├── routes/         # API endpoint definitions and routing
│   │   ├── services/       # Business logic (Gemini, Booking, Email, etc.)
│   │   ├── templates/      # Email and notification templates
│   │   ├── utils/          # Helper functions and utilities
│   │   └── seeds/          # Data seeder scripts (Tours, Users, Permissions, etc.)
│   ├── server.js           # Server application runner
│   └── .env                # Environment variables configuration
└── frontend/               # Client-side application
    ├── admin/              # Admin dashboard pages
    │   ├── bookings/       # Booking management
    │   ├── destinations/   # Destination management
    │   ├── permissions/    # Permission management
    │   ├── roles/          # Role management
    │   ├── tours/          # Tour management
    │   └── users/          # User management
    ├── assets/             # Shared resources
    │   ├── css/            # Page-specific and global stylesheets
    │   └── js/             # Business logic, API services, and middleware
    ├── booking/            # Booking flow and confirmation
    ├── login/              # User authentication (Login)
    ├── register/           # User registration
    ├── profile/            # User profile management
    ├── my-bookings/        # Personal booking history
    ├── tour/               # Tour details and listings
    └── index.html          # Main landing page
```

## ⚙️ Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create and configure your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. The frontend consists of static files.
2. Serve the `frontend` directory using a local web server (e.g., Live Server in VS Code).
3. Ensure the backend is running at `http://localhost:5000` (or as configured in `.env`).

## ✨ Key Features

- **Dynamic Tour Listings:** Browse tours with detailed information and images.
- **Smart Search:** Powered by Elasticsearch for fast and relevant results.
- **Gemini Chatbot:** Get instant help and tour recommendations.
- **Admin Dashboard:** Manage destinations, tours, bookings, and permissions.
- **Secure Authentication:** User and admin login via Firebase.
- **Photo Management:** Seamless image uploads and hosting via Cloudinary.
