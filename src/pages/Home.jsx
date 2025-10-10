import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, FileText, BarChart, Users, LogOut, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Home = () => {
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (!token || !storedUserType) {
      navigate('/student-signin');
      return;
    }

    setUserType(storedUserType);
    
    if (storedUserType === 'student') {
      const studentData = localStorage.getItem('studentData');
      if (studentData) {
        setUserData(JSON.parse(studentData));
      }
    } else if (storedUserType === 'admin') {
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        setUserData(JSON.parse(adminData));
      }
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentData');
    localStorage.removeItem('adminData');
    
    toast({
      title: (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
            <LogOut className="w-4 h-4 text-white" />
          </div>
          <span className="text-blue-800 font-semibold">Signed Out Successfully</span>
        </div>
      ),
      description: (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Session ended securely</span>
          </div>
        </div>
      ),
      duration: 2000, // Auto dismiss after 2 seconds
      className: "bg-white border-2 border-blue-400 shadow-lg rounded-lg animate-in slide-in-from-top-2",
      style: {
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '2px solid #3b82f6'
      }
    });
    
    navigate('/student-signin');
  };

  if (!userType || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {userType === 'admin' ? (
                <Shield className="h-8 w-8 text-red-600" />
              ) : (
                <GraduationCap className="h-8 w-8 text-institutional" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Certify</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {userData.firstName} {userData.lastName}
                  {userType === 'admin' && ` (${userData.role || 'Admin'})`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Student Navigation */}
              {userType === 'student' && (
                <>
                  <Link to="/request-certificate">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Request Certificate
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
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
              
              {/* Admin Navigation */}
              {userType === 'admin' && (
                <>
                  <Link to="/admin-dashboard">
                    <Button variant="ghost" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/status-tracker">
                    <Button variant="ghost" size="sm">
                      <BarChart className="h-4 w-4 mr-2" />
                      Track Status
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {userType === 'student' ? 'Student Dashboard' : 'Admin Dashboard'}
            </h2>
            <p className="text-muted-foreground">
              {userType === 'student' 
                ? 'Manage your certificate requests and track their status'
                : 'Manage certificate requests and oversee the approval process'
              }
            </p>
          </div>

          {/* Student Dashboard */}
          {userType === 'student' && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-form hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-institutional" />
                    Request New Certificate
                  </CardTitle>
                  <CardDescription>
                    Submit a new certificate request with AI-powered letter generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      • AI-generated professional letters
                      • Multiple certificate types available
                      • Real-time status tracking
                    </div>
                    <Link to="/request-certificate">
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Request Certificate
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-form hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-6 w-6 text-green-600" />
                    Track Application Status
                  </CardTitle>
                  <CardDescription>
                    View the status of your certificate requests and download approved certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      • View all your requests
                      • Download approved certificates
                      • Track approval progress
                    </div>
                    <Link to="/student-status-tracker">
                      <Button variant="outline" className="w-full">
                        <BarChart className="h-4 w-4 mr-2" />
                        Track My Requests
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Dashboard */}
          {userType === 'admin' && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-form hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-red-600" />
                    Admin Dashboard
                  </CardTitle>
                  <CardDescription>
                    Review, approve, and manage all certificate requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      • Review pending requests
                      • Approve/reject certificates
                      • Generate official PDFs with seals
                    </div>
                    <Link to="/admin-dashboard">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Requests
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-form hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-6 w-6 text-blue-600" />
                    Status Tracker
                  </CardTitle>
                  <CardDescription>
                    View all certificate requests across the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      • View all student requests
                      • Search by student name
                      • Monitor system activity
                    </div>
                    <Link to="/status-tracker">
                      <Button variant="outline" className="w-full">
                        <BarChart className="h-4 w-4 mr-2" />
                        View All Requests
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Information Card */}
          <Card className="mt-8 shadow-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Your Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    {userType === 'student' ? 'Student ID:' : 'Admin ID:'}
                  </span>
                  <p className="font-semibold">
                    {userType === 'student' ? userData.studentId : userData.adminId}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Name:</span>
                  <p className="font-semibold">{userData.firstName} {userData.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <p className="font-semibold">{userData.email}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    {userType === 'student' ? 'College:' : 'Role:'}
                  </span>
                  <p className="font-semibold">
                    {userType === 'student' ? userData.college : userData.role || 'Admin'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Dialog for Students */}
          {userType === 'student' && (
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
                      <p className="font-semibold">{userData.studentId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="font-semibold">{userData.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                      <p className="font-semibold">{userData.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                      <p className="font-semibold">{userData.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">College</Label>
                      <p className="font-semibold">{userData.college}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                      <p className="font-semibold">{userData.department || 'Not specified'}</p>
                    </div>
                  </div>
                  {userData.yearOfStudy && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Year of Study</Label>
                      <p className="font-semibold">{userData.yearOfStudy} Year</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
