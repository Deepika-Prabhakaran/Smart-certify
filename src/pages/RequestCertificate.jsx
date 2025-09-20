import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentForm from "@/components/StudentForm";

const RequestCertificate = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-institutional" />
              <h1 className="text-2xl font-bold text-foreground">Certificate Automation System</h1>
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground font-medium">
                Home
              </Link>
              <Link to="/request-certificate" className="text-foreground font-medium">
                Request Certificate
              </Link>
              <span className="text-muted-foreground font-medium cursor-not-allowed opacity-50">
                Admin Dashboard
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Request Certificate
              </h2>
              <p className="text-muted-foreground">
                Generate your academic certificate letter in minutes
              </p>
            </div>
          </div>

          {/* Form Component */}
          <StudentForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Certificate Automation System. Professional academic document generation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RequestCertificate;
