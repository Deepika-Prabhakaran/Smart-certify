# Genesis Certify - Certificate Automation System

A modern web application for automating academic certificate generation and management with digital signatures and official seals.

## 🚀 Features

- **Automated Certificate Generation**: AI-powered letter generation using Google's Gemini API
- **Digital Signatures & Seals**: Professional PDF certificates with official seals
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
- **Google Gemini AI** for letter generation
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- SQL Server
- Google Gemini API key

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/genesis-certify.git
cd genesis-certify
```

### 2. Install dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
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
```

### 4. Database Setup

Run the SQL script to create the database and table:
```sql
CREATE DATABASE CertificateDB;
USE CertificateDB;

CREATE TABLE Requests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    studentName NVARCHAR(255) NOT NULL,
    college NVARCHAR(255) NOT NULL,
    certificateType NVARCHAR(255) NOT NULL,
    generatedLetter NTEXT NOT NULL,
    requestDate DATETIME DEFAULT GETDATE(),
    status NVARCHAR(50) DEFAULT 'Pending',
    approvedBy NVARCHAR(255),
    approvedDate DATETIME,
    pdfPath NVARCHAR(500)
);
```

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
The application will run on `http://localhost:5173`

### 3. Access the Application
- **Student Portal**: Request certificates and track status
- **Admin Dashboard**: Review and approve certificate requests at `/admin-dashboard`

## 📁 Project Structure

```
genesis-certify/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and configurations
│   └── hooks/             # Custom React hooks
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── utils/             # Utilities (PDF generation, etc.)
│   └── db.js              # Database connection
├── public/                # Static assets
├── certificates/          # Generated PDF certificates (auto-created)
└── README.md
```

## 🔧 API Endpoints

### Public Routes
- `POST /api/submit-request` - Submit certificate request
- `GET /api/status/:id` - Check request status
- `POST /api/generate-letter` - Generate certificate letter

### Admin Routes
- `GET /api/admin/requests` - Get all requests
- `POST /api/admin/approve/:id` - Approve request and generate PDF
- `POST /api/admin/reject/:id` - Reject request

### Static Files
- `GET /certificates/:filename` - Download generated PDFs

## 🎨 Certificate Features

- **Professional Layout**: Clean, institutional design
- **Digital Signatures**: Authorized signature with admin details
- **Official Seal**: Text-based seal with verification details
  ```
  ═══════════════════════════════
  ✔ CERTIFIED & APPROVED ✔
  ─────────────────────────────
  Digitally Signed by Admin
  Seal ID: CERT-2024-XXX
  ═══════════════════════════════
  ```
- **Unique Naming**: Files saved as `studentname-certificatetype.pdf`
- **Verification Info**: Certificate ID, timestamps, and official markings

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Secure file handling
- Request ID-based tracking

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
- [ ] Advanced PDF templates
- [ ] User authentication system
- [ ] Certificate verification portal
- [ ] REST API documentation with Swagger

---

**Genesis Certify** - Streamlining academic certificate generation with modern technology.