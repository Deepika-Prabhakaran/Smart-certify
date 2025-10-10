import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Download, CheckCircle, Clock, XCircle, LogOut, Home, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const StudentStatusTracker = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if student is logged in
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

    fetchStudentRequests();
  }, [navigate]);

  const fetchStudentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleSignOut();
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching student requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDownload = (request) => {
    if (request.downloadUrl) {
      toast({
        title: "Downloading Certificate",
        description: `Downloading your ${request.certificateType} certificate...`,
      });
      window.open(`http://localhost:5000${request.downloadUrl}`, '_blank');
    } else {
      toast({
        title: "Download not available",
        description: "Certificate is not yet approved or PDF not generated",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your certificate requests...</p>
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
              <GraduationCap className="h-8 w-8 text-institutional" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Certify</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {studentData?.firstName} {studentData?.lastName}
                </p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/home">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/request-certificate">
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Certificate
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(!showProfile)}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <span className="text-sm font-medium text-foreground">Track Status</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              My Certificate Requests
            </h2>
            <p className="text-muted-foreground">
              Track the status of your certificate applications
            </p>
          </div>

          {/* Student Info Card */}
          {studentData && (
            <Card className="mb-8 shadow-form">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Student ID:</span>
                    <p className="font-semibold">{studentData.studentId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Name:</span>
                    <p className="font-semibold">{studentData.firstName} {studentData.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">College:</span>
                    <p className="font-semibold">{studentData.college}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Department:</span>
                    <p className="font-semibold">{studentData.department || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requests Table */}
          <Card className="shadow-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Certificate Requests ({requests.length})
              </CardTitle>
              <CardDescription>
                View the status of all your certificate applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Certificate Type</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">#{request.id}</TableCell>
                        <TableCell className="font-medium">{request.certificateType}</TableCell>
                        <TableCell>{request.college}</TableCell>
                        <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(request.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                          {request.status.toLowerCase() === 'approved' && request.approvedDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Approved: {new Date(request.approvedDate).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.status.toLowerCase() === 'approved' && request.downloadUrl ? (
                            <div className="space-y-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(request)}
                                className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                              >
                                <Download className="h-3 w-3" />
                                Download PDF
                              </Button>
                              <div className="text-xs text-green-600 font-medium">
                                ✓ Ready for Download
                              </div>
                            </div>
                          ) : request.status.toLowerCase() === 'pending' ? (
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Under Review</span>
                              <div className="text-xs text-yellow-600">
                                Admin approval pending
                              </div>
                            </div>
                          ) : request.status.toLowerCase() === 'rejected' ? (
                            <div className="space-y-1">
                              <span className="text-sm text-red-600">Request Rejected</span>
                              <div className="text-xs text-muted-foreground">
                                Contact admin for details
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No action available</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Certificate Requests Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't submitted any certificate requests. Start by requesting your first certificate.
                  </p>
                  <Link to="/request-certificate">
                    <Button className="bg-institutional hover:bg-institutional/90">
                      <FileText className="h-4 w-4 mr-2" />
                      Request New Certificate
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Dialog */}
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
                    <p className="font-semibold">{studentData?.studentId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-semibold">{studentData?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                    <p className="font-semibold">{studentData?.firstName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                    <p className="font-semibold">{studentData?.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">College</Label>
                    <p className="font-semibold">{studentData?.college}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="font-semibold">{studentData?.department || 'Not specified'}</p>
                  </div>
                </div>
                {studentData?.yearOfStudy && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Year of Study</Label>
                    <p className="font-semibold">{studentData.yearOfStudy}st Year</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  );
};

export default StudentStatusTracker;
