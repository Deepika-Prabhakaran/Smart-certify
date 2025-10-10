import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Search, FileText, Download, CheckCircle, Clock, XCircle, RefreshCw, LogOut, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StatusTracker = () => {
  const [studentName, setStudentName] = useState("");
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load all requests on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token) {
      navigate('/student-signin');
      return;
    }

    fetchAllRequests();
  }, [navigate]);

  // Filter requests when search term changes
  useEffect(() => {
    if (!studentName.trim()) {
      setFilteredRequests(allRequests);
    } else {
      const filtered = allRequests.filter(request => 
        request.studentName.toLowerCase().includes(studentName.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [studentName, allRequests]);

  const fetchAllRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/requests');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setAllRequests(data.requests || []);
      setFilteredRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching all requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please check if the server is running.",
        variant: "destructive"
      });
      setAllRequests([]);
      setFilteredRequests([]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!studentName.trim()) {
      setFilteredRequests(allRequests);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/status?name=${encodeURIComponent(studentName.trim())}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setFilteredRequests(data.requests || []);
      
      if (data.requests.length === 0) {
        toast({
          title: "No requests found",
          description: "No certificate requests found for this name",
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please check if the server is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setStudentName("");
    fetchAllRequests();
  };

  const handleDownload = (request) => {
    if (request.downloadUrl) {
      // Show toast message about the download
      toast({
        title: "Downloading Official Certificate",
        description: `Downloading ${request.certificateType} for ${request.studentName} with official seal. File: ${request.studentName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}-${request.certificateType.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`,
      });
      
      // Open the PDF in a new tab
      window.open(`http://localhost:5000${request.downloadUrl}`, '_blank');
    } else {
      toast({
        title: "Download not available",
        description: "Certificate is not yet approved or PDF not generated",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentData');
    localStorage.removeItem('adminData');
    toast({
      title: "Signed Out", 
      description: "You have been signed out successfully.",
    });
    navigate('/student-signin');
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

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading certificate requests...</p>
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
              <h1 className="text-2xl font-bold text-foreground">Certificate Status Tracker</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/home">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
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
              Track Certificate Requests
            </h2>
            <p className="text-muted-foreground">
              View all certificate requests or search by student name
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8 shadow-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Certificate Requests
              </CardTitle>
              <CardDescription>
                Enter student name to filter requests, or leave blank to see all requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="studentName">Student Name (Optional)</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student name to filter..."
                    className="mt-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="bg-institutional hover:bg-institutional/90"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleRefresh}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Show All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Certificate Requests ({filteredRequests.length})
                {studentName && (
                  <span className="text-sm font-normal text-muted-foreground">
                    - Filtered by: "{studentName}"
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Certificate Type</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">#{request.id}</TableCell>
                        <TableCell className="font-medium">{request.studentName}</TableCell>
                        <TableCell>{request.certificateType}</TableCell>
                        <TableCell>{request.college}</TableCell>
                        <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(request.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
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
                                Download Official PDF
                              </Button>
                              <div className="text-xs text-green-600 font-medium">
                                ✓ Officially Sealed & Signed
                              </div>
                              <div className="text-[10px] text-gray-500">
                                File: {request.studentName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}-{request.certificateType.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf
                              </div>
                            </div>
                          ) : request.status.toLowerCase() === 'pending' ? (
                            <span className="text-sm text-muted-foreground">Awaiting approval</span>
                          ) : request.status.toLowerCase() === 'rejected' ? (
                            <span className="text-sm text-red-600">Request rejected</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">No action available</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {studentName ? "No Matching Requests Found" : "No Certificate Requests"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {studentName 
                      ? `No certificate requests found matching "${studentName}"`
                      : "No certificate requests have been submitted yet"
                    }
                  </p>
                  <Link to="/request-certificate">
                    <Button variant="institutional">
                      Submit New Request
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StatusTracker;
