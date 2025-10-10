# Smart Certify - Certificate Automation System

A modern web application for automating academic certificate generation and management with digital signatures and official seals.

## 🚀 Features

- **Automated Certificate Generation**: AI-powered letter generation using Google's Gemini API
- **Digital Signatures & Seals**: Professional PDF certificates with official seals
- **Student Authentication**: Secure sign-up and sign-in system for students and administrators
- **Admin Dashboard**: Complete certificate request management system
- **Status Tracking**: Real-time request status updates
- **Secure PDF Generation**: Certificates with unique IDs and verification
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **SQL Server** database
- **PDFKit** for PDF generation
- **JWT Authentication** with bcrypt
- **Google Gemini AI** for letter generation
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- SQL Server
- Google Gemini API key

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/smart-certify.git
cd smart-certify
```

### 2. Install dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install bcrypt jsonwebtoken
npm install
```

### 3. Environment Setup

Create a `.env` file in the server directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DB_SERVER=your_sql_server_host
DB_DATABASE=CertificateDB
DB_USER=your_db_username
DB_PASSWORD=your_db_password
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-123456789
```

### 4. Database Setup

The application will automatically create the required tables:
- `MasterStudent` - Student authentication data
- `MasterAdmin` - Admin authentication data  
- `Requests` - Certificate requests with PDF tracking

## 🎯 Usage

### 1. Start the Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
npm run dev
```
The application will run on `http://localhost:8080`

### 3. Access the Application
- **Student Sign Up**: Create account at `/student-signup`
- **Student Sign In**: Access portal at `/student-signin`
- **Admin Portal**: Sign in at `/admin-signin`
- **Certificate Requests**: Students can request certificates after signing in
- **Admin Dashboard**: Review and approve requests at `/admin-dashboard`

## 📁 Project Structure

```
smart-certify/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components (SignIn, SignUp, Dashboard)
│   ├── lib/               # Utilities and configurations
│   └── hooks/             # Custom React hooks
├── server/                # Backend source code
│   ├── routes/            # API routes (auth, requests, admin)
│   ├── utils/             # Utilities (PDF generation, etc.)
│   └── db.js              # Database connection
├── public/                # Static assets (favicon, etc.)
├── certificates/          # Generated PDF certificates (auto-created)
└── README.md
```

## 🔧 API Endpoints

### Authentication Routes
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/student/signin` - Student login
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/admin/signin` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Student Routes (Protected)
- `POST /api/submit-request` - Submit certificate request
- `GET /api/status` - Get student's request status

### Admin Routes (Protected)
- `GET /api/admin/requests` - Get all requests
- `POST /api/admin/approve/:id` - Approve request and generate PDF
- `POST /api/admin/reject/:id` - Reject request

### Static Files
- `GET /certificates/:filename` - Download generated PDFs

## 🎨 Certificate Features

- **Professional Layout**: Clean, institutional design
- **Digital Signatures**: Authorized signature with admin details
- **Official Seal**: Circular seal with verification details
- **Unique Naming**: Files saved as `studentname-certificatetype.pdf`
- **Verification Info**: Certificate ID, timestamps, and official markings
- **Single Page Layout**: All content fits perfectly on one A4 page

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for passwords
- **Input Validation**: SQL injection prevention
- **CORS Configuration**: Secure cross-origin requests
- **Route Protection**: Authentication required for sensitive operations
- **User Type Verification**: Students and admins have separate access levels

## 📱 User Experience

### Student Portal
1. **Registration**: Students create accounts with student ID and personal details
2. **Certificate Request**: AI-generated letters using Gemini API
3. **Status Tracking**: Real-time updates on request approval
4. **PDF Download**: Direct download of approved certificates

### Admin Portal  
1. **Dashboard Overview**: Statistics and request management
2. **Request Review**: View generated letters before approval
3. **PDF Generation**: One-click PDF creation with official seals
4. **Bulk Management**: Filter and process multiple requests

## 📝 Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation above
- Ensure all prerequisites are installed correctly

## 🔮 Future Enhancements

- [ ] Email notifications for status updates
- [ ] Bulk certificate processing
- [ ] Advanced PDF templates with custom branding
- [ ] Multi-language support
- [ ] Certificate verification portal with QR codes
- [ ] REST API documentation with Swagger
- [ ] Mobile app for certificate requests
- [ ] Integration with student information systems

---

**Smart Certify** - Revolutionizing academic certificate generation with AI-powered automation and smart digital workflows.
