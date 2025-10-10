import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, LogIn, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentSignIn = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/student/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('studentData', JSON.stringify(result.student));

        toast({
          title: (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-800 font-semibold">Welcome Back!</span>
            </div>
          ),
          description: (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Signed in as {result.student.firstName} {result.student.lastName}</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Access granted to Smart Certify portal</span>
              </div>
            </div>
          ),
          duration: 3000, // Auto dismiss after 3 seconds
          style: {
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
            border: '2px solid #22c55e',
            borderRadius: '8px'
          }
        });

        navigate('/home');
      } else {
        toast({
          title: "Sign In Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to server. Please ensure the server is running on port 5000.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-institutional mr-2" />
            <h2 className="text-2xl font-bold">Smart Certify</h2>
          </div>
          <CardTitle className="text-2xl text-center">Student Sign In</CardTitle>
          <CardDescription className="text-center">
            Access your Smart Certify student portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID or Email</Label>
              <Input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="Enter your student ID or email"
                value={formData.studentId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/student-signup" className="text-blue-600 hover:underline font-medium">
              Sign up here
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link to="/admin-signin" className="text-muted-foreground hover:text-foreground">
              Admin? Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSignIn;
