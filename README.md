# Genesis Certify

A modern certificate management system built with React and Vite. This application allows students to request certificates and administrators to manage certificate requests efficiently.

## Features

- **Student Portal**: Request certificates with a user-friendly form
- **Status Tracking**: Real-time tracking of certificate request status
- **Admin Dashboard**: Comprehensive management interface for administrators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Technologies Used

- **Frontend**: React 18 with JSX
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd genesis-certify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── StudentForm.jsx # Certificate request form
├── pages/              # Application pages
│   ├── Home.jsx
│   ├── RequestCertificate.jsx
│   ├── StatusTracker.jsx
│   ├── AdminDashboard.jsx
│   └── NotFound.jsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── data/               # Mock data and constants
└── main.jsx           # Application entry point
```

## Features Overview

### Student Features
- Request certificates through an intuitive form
- Track request status in real-time
- View request history

### Admin Features
- Comprehensive dashboard with request overview
- Approve/reject certificate requests
- Filter and search functionality
- Export capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.