import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, FileText, Users } from "lucide-react";

const Home = () => {
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
              <Link to="/request-certificate" className="text-muted-foreground hover:text-foreground font-medium">
                Request Certificate
              </Link>
              <Link to="/status-tracker" className="text-muted-foreground hover:text-foreground font-medium">
                Track Status
              </Link>
              <Link to="/admin-dashboard" className="text-muted-foreground hover:text-foreground font-medium">
                Admin Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Streamlined Certificate Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional academic certificates quickly and efficiently with our automated system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-form">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-institutional mx-auto mb-4" />
              <CardTitle>Quick Generation</CardTitle>
              <CardDescription>
                Generate certificates instantly with AI-powered letter creation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/request-certificate">
                <Button variant="institutional" size="lg" className="w-full">
                  Request Certificate
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-form">
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Multiple Types</CardTitle>
              <CardDescription>
                Support for bonafide, study certificates, and more academic documents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" size="lg" className="w-full" disabled>
                View Types
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-form">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-accent mx-auto mb-4" />
              <CardTitle>Admin Control</CardTitle>
              <CardDescription>
                Comprehensive dashboard for managing and tracking all certificates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/admin-dashboard">
                <Button variant="outline" size="lg" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-primary rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Fill out a simple form and receive your professional certificate letter instantly.
          </p>
          <Link to="/request-certificate">
            <Button 
              size="lg" 
              className="bg-white text-institutional hover:bg-white/90 shadow-document"
            >
              Start Certificate Request
            </Button>
          </Link>
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

export default Home;
