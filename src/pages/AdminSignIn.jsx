import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    adminId: '',
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
      const response = await fetch('http://localhost:5000/api/auth/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and admin data
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('adminData', JSON.stringify(result.admin));

        toast({
          title: "Welcome back!",
          description: `Signed in as ${result.admin.firstName} ${result.admin.lastName}`,
        });

        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Sign In Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your connection.",
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
            <Shield className="h-8 w-8 text-red-600 mr-2" />
            <h2 className="text-2xl font-bold">Admin Portal</h2>
          </div>
          <CardTitle className="text-2xl text-center">Admin Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminId">Admin ID or Email</Label>
              <Input
                id="adminId"
                name="adminId"
                type="text"
                placeholder="Enter your admin ID or email"
                value={formData.adminId}
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
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
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
            Need admin access?{" "}
            <Link to="/admin-signup" className="text-red-600 hover:underline font-medium">
              Register here
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link to="/student-signin" className="text-muted-foreground hover:text-foreground">
              Student? Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignIn;
