import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, FileText, Download, CheckCircle, Clock, XCircle, LogOut, Home, User, BarChart, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentForm from "@/components/StudentForm";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const RequestCertificate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    college: '',
    certificateType: '',
    generatedLetter: ''
  });
  const [showProfile, setShowProfile] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication and get student data
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const storedStudentData = localStorage.getItem('studentData');

    if (!token || userType !== 'student') {
      navigate('/student-signin');
      return;
    }

    if (storedStudentData) {
      setStudentData(JSON.parse(storedStudentData));
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentData');
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    navigate('/student-signin');
  };

  const handleFormDataChange = (data) => {
    setFormData(data);
  };

  const handleFormSubmit = async () => {
    // Validate form data
    if (!formData.studentName || !formData.college || !formData.certificateType) {
      const errorMessage = 'Please fill in all required fields before submitting.';
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Validate generated letter
    if (!formData.generatedLetter) {
      const errorMessage = 'Please generate a certificate letter before submitting.';
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
      toast({
        title: "Missing Certificate Letter",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://cert-admin-webapp-24-fyekedh8evdyh0aw.centralindia-01.azurewebsites.net/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentName: formData.studentName,
          college: formData.college,
          certificateType: formData.certificateType,
          generatedLetter: formData.generatedLetter
        })
      });
      
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      const successMessage = `Request submitted successfully! Request ID: ${result.requestId}. Your certificate request is now pending approval.`;
      
      setSubmitStatus({
        type: 'success',
        message: successMessage,
        requestId: result.requestId
      });

      // Show big centered success toast with auto-dismiss and green checkmark
      toast({
        title: (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-800 font-semibold">Request Submitted!</span>
          </div>
        ),
        description: (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Request ID: <strong className="text-green-800">{result.requestId}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Status: Pending Admin Approval</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Track progress in 'My Status' section</span>
            </div>
            <div className="text-xs text-green-600 mt-3 p-2 bg-green-50 rounded border border-green-200">
              ✨ Your certificate will be ready for download once approved by admin
            </div>
          </div>
        ),
        duration: 6000, // Auto dismiss after 6 seconds
        style: {
          background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
          border: '2px solid #22c55e',
          boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          minWidth: '400px',
          maxWidth: '500px'
        }
      });
      
      // Reset form after successful submission
      setFormData({
        studentName: '',
        college: '',
        certificateType: '',
        generatedLetter: ''
      });

      // Redirect to status tracker after delay
      setTimeout(() => {
        navigate('/student-status-tracker');
      }, 3000);

    } catch (error) {
      const errorMessage = `Network error: ${error.message}. Please check if the server is running at http://localhost:5000`;
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });

      // Show big centered error toast
      toast({
        title: (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-red-800 font-semibold">Submission Failed</span>
          </div>
        ),
        description: (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Error: {error.message}</span>
            </div>
            <div className="flex items-center gap-2 text-red-700">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Please try again or contact support</span>
            </div>
          </div>
        ),
        variant: "destructive",
        duration: 6000,
        style: {
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '16px',
          minWidth: '400px',
          maxWidth: '500px'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-institutional" />
              <h1 className="text-2xl font-bold text-foreground">Request Certificate</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/home">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/student-status-tracker">
                <Button variant="ghost" size="sm">
                  <BarChart className="h-4 w-4 mr-2" />
                  Track Status
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(!showProfile)}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <span className="text-sm font-medium text-foreground">Request Certificate</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/home">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
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
          <StudentForm 
            onDataChange={handleFormDataChange}
            formData={formData}
          />

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleFormSubmit}
              disabled={isSubmitting || submitStatus?.type === 'success'}
              size="lg"
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Request...
                </>
              ) : submitStatus?.type === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Request Submitted Successfully
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Certificate Request
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Profile Dialog */}
      {studentData && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Profile
              </DialogTitle>
              <DialogDescription>
                Your account information and details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Student ID</Label>
                  <p className="font-semibold">{studentData.studentId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-semibold">{studentData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                  <p className="font-semibold">{studentData.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                  <p className="font-semibold">{studentData.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">College</Label>
                  <p className="font-semibold">{studentData.college}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                  <p className="font-semibold">{studentData.department || 'Not specified'}</p>
                </div>
              </div>
              {studentData.yearOfStudy && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Year of Study</Label>
                  <p className="font-semibold">{studentData.yearOfStudy}st Year</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Smart Certify. Professional academic document generation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RequestCertificate;

