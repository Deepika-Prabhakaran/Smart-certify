import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentForm from "@/components/StudentForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RequestCertificate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    college: '',
    certificateType: '',
    generatedLetter: ''
  });
  const { toast } = useToast();

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
      const response = await fetch('http://localhost:5000/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      // Show success toast
      toast({
        title: "Request Submitted Successfully!",
        description: `Your certificate request has been submitted with ID: ${result.requestId}`,
        variant: "default",
      });
      
      // Reset form after successful submission
      setFormData({
        studentName: '',
        college: '',
        certificateType: '',
        generatedLetter: ''
      });

      // Redirect to home page after shorter delay (2 seconds)
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      const errorMessage = `Network error: ${error.message}. Please check if the server is running at http://localhost:5000`;
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });

      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
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

          {/* Status Messages */}
          {submitStatus && (
            <div className={`mb-6 p-4 rounded-lg border ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{submitStatus.message}</p>
              {submitStatus.requestId && (
                <div className="mt-2 text-sm">
                  <p>Please save your Request ID: <strong>{submitStatus.requestId}</strong></p>
                  <p>You can use this ID to track your certificate status.</p>
                  <p className="mt-2">You will be redirected to the home page in 2 seconds...</p>
                </div>
              )}
            </div>
          )}

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

