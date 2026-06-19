🚀 MERN Full-Stack Platform
MongoDB Express.js React Node.js TailwindCSS

A full-stack web platform built with the MERN stack, featuring a modern React frontend, RESTful Node/Express API, MongoDB database, dynamic form handling, email notifications, and mobile-responsive UI.

✨ Features
📋 Course Registration System — Users can browse and register for courses with form validation
💼 Internship Application Portal — Dynamic internship listings with full application flow
📬 Contact Messaging System — Contact form with email notification via Nodemailer
🔒 Rate Limiting & Security — Helmet, CORS, and express-rate-limit for API protection
📱 Fully Responsive UI — Built with React + Tailwind CSS, works on all devices
⚡ Animated Interactions — Framer Motion animations for smooth user experience
✅ Server-side Validation — Joi schema validation on all form submissions
🛠️ Tech Stack
Frontend
Technology	Purpose
React 19	UI Framework
React Router v7	Client-side routing
Tailwind CSS	Styling
Framer Motion	Animations
Axios	HTTP requests
Lucide React	Icons
Backend
Technology	Purpose
Node.js	Runtime
Express.js	Web framework
MongoDB + Mongoose	Database & ODM
Nodemailer	Email notifications
Joi	Input validation
Helmet + CORS	Security
Morgan	HTTP logging
📁 Project Structure
mern-fullstack-platform/
├── client/                    # React frontend
│   ├── public/                # Static assets
│   ├── src/                   # React source code
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   └── App.js             # Root component
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json
│
├── server/                    # Node/Express backend
│   ├── src/
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── ContactMessage.model.js
│   │   │   ├── CourseRegistration.model.js
│   │   │   └── InternshipApplication.model.js
│   │   ├── routes/            # API routes
│   │   │   ├── contact.routes.js
│   │   │   ├── courses.routes.js
│   │   │   └── internships.routes.js
│   │   ├── services/
│   │   │   └── mailer.js      # Email service
│   │   ├── validation/
│   │   │   └── schemas.js     # Joi validation schemas
│   │   ├── setup/
│   │   │   └── db.js          # MongoDB connection
│   │   └── server.js          # Express app entry point
│   └── package.json
│
└── README.md
🚀 Getting Started
Prerequisites
Node.js v18+
MongoDB (local or Atlas)
npm or yarn
1. Clone the repository
git clone https://github.com/muhammad-umair-naseer/mern-fullstack-platform.git
cd mern-fullstack-platform
2. Setup Backend
cd server
npm install
cp .env.example .env    # Fill in your values
npm run dev
3. Setup Frontend
cd client
npm install
npm start
4. Environment Variables
Create a .env file in the server/ directory:

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/demo-platform
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
CONTACT_TO=contact@example.com
🔌 API Endpoints
Courses
Method	Endpoint	Description
GET	/api/courses	Get all courses
POST	/api/courses/register	Register for a course
Internships
Method	Endpoint	Description
GET	/api/internships	Get all internships
POST	/api/internships/apply	Submit internship application
Contact
Method	Endpoint	Description
POST	/api/contact	Submit contact message
Health Check
Method	Endpoint	Description
GET	/health	Server health status
🔒 Security Features
Helmet — Sets secure HTTP headers
CORS — Configured cross-origin resource sharing
Rate Limiting — 20 requests/minute per IP on form endpoints
Joi Validation — Server-side input validation on all submissions
Environment Variables — All secrets stored in .env (never committed)
👨‍💻 Author
Muhammad Umair Naseer

Portfolio: muhammad-umair-naseer.netlify.app
LinkedIn: linkedin.com/in/muhammad-umair-naseer
GitHub: github.com/muhammad-umair-naseer
📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

⭐ If you found this project useful, please consider giving it a star!
