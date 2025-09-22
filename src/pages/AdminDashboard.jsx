import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Check, X, FileText, Users, Clock, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/requests');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please check if the server is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const request = requests.find(req => req.id === requestId);
      
      // Show detailed loading toast
      toast({
        title: "🔒 Applying Official Seal",
        description: `Generating sealed PDF for ${request?.studentName || 'student'} with official signature and institutional seal...`,
      });

      const response = await fetch(`http://localhost:5000/api/admin/approve/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedBy: 'Admin'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Refresh the requests list
      await fetchRequests();
      
      // Show success with details about the generated file
      toast({
        title: "✅ Certificate Officially Sealed!",
        description: `PDF generated as "${result.pdfFileName}" with digital signature and official institutional seal. Ready for download.`,
      });
    } catch (error) {
      toast({
        title: "❌ Seal Application Failed",
        description: `Failed to apply official seal: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reject/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedBy: 'Admin'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Refresh the requests list
      await fetchRequests();
      
      toast({
        title: "Certificate Rejected",
        description: "Certificate request has been rejected",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to reject certificate: ${error.message}`,
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
        return <X className="h-4 w-4 text-red-600" />;
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

  const pendingRequests = requests.filter(req => req.status.toLowerCase() === 'pending');
  const approvedRequests = requests.filter(req => req.status.toLowerCase() === 'approved');
  const rejectedRequests = requests.filter(req => req.status.toLowerCase() === 'rejected');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
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
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
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
              <Link to="/admin-dashboard" className="text-foreground font-medium">
                Admin Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Certificate Management Dashboard
            </h2>
            <p className="text-muted-foreground">
              Review and approve certificate requests with digital signatures
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-form">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length}</div>
              </CardContent>
            </Card>
            <Card className="shadow-form">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
              </CardContent>
            </Card>
            <Card className="shadow-form">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
              </CardContent>
            </Card>
            <Card className="shadow-form">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <X className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{rejectedRequests.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Table */}
          <Card className="shadow-form">
            <CardHeader>
              <CardTitle>Certificate Requests</CardTitle>
              <CardDescription>
                Review and manage all certificate requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <RequestsTable 
                    requests={requests} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                    onViewLetter={setSelectedLetter}
                  />
                </TabsContent>
                
                <TabsContent value="pending">
                  <RequestsTable 
                    requests={pendingRequests} 
                    onApprove={handleApprove} 
                    onReject={handleReject}
                    onViewLetter={setSelectedLetter}
                  />
                </TabsContent>
                
                <TabsContent value="approved">
                  <RequestsTable 
                    requests={approvedRequests} 
                    onApprove={handleApprove} 
                    onReject={handleReject}
                    onViewLetter={setSelectedLetter}
                  />
                </TabsContent>
                
                <TabsContent value="rejected">
                  <RequestsTable 
                    requests={rejectedRequests} 
                    onApprove={handleApprove} 
                    onReject={handleReject}
                    onViewLetter={setSelectedLetter}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Letter Preview Dialog */}
      <Dialog open={!!selectedLetter} onOpenChange={() => setSelectedLetter('')}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Letter Preview</DialogTitle>
            <DialogDescription>
              Review the generated certificate letter
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={selectedLetter}
              readOnly
              className="min-h-[400px] font-mono text-sm"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Separate component for the requests table
const RequestsTable = ({ 
  requests, 
  onApprove, 
  onReject,
  onViewLetter
}) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Requests</h3>
        <p className="text-muted-foreground">No certificate requests in this category</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>College</TableHead>
          <TableHead>Certificate Type</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">#{request.id}</TableCell>
            <TableCell>{request.studentName}</TableCell>
            <TableCell>{request.college}</TableCell>
            <TableCell>{request.certificateType}</TableCell>
            <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(request.status)} className="flex items-center gap-1 w-fit">
                {getStatusIcon(request.status)}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2 flex-wrap">
                {request.generatedLetter && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewLetter(request.generatedLetter)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Letter
                  </Button>
                )}
                {request.status.toLowerCase() === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onApprove(request.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Apply Official Seal
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(request.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {request.status.toLowerCase() === 'approved' && request.downloadUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`http://localhost:5000${request.downloadUrl}`, '_blank')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Download Sealed PDF
                  </Button>
                )}
                {request.status.toLowerCase() === 'approved' && (
                  <div className="text-xs text-green-600 font-medium flex items-center">
                    ✓ Officially Sealed
                    <br />
                    <span className="text-[10px] opacity-75">
                      {request.downloadUrl && request.downloadUrl.includes('-') 
                        ? request.downloadUrl.split('/').pop().replace('.pdf', '') 
                        : 'PDF Generated'
                      }
                    </span>
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;

