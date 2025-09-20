import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Check, X, FileText, Users, Clock, CheckCircle } from "lucide-react";
import { getAllRequests } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data
    setRequests(getAllRequests());
  }, []);

  const handleApprove = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved',
            approvedBy: 'Admin',
            approvedDate: new Date().toISOString().split('T')[0],
            generatedLetter: `${req.generatedLetter}\n\n[E-SIGNATURE: Digital Seal Applied]\n[APPROVED BY: Admin]\n[DATE: ${new Date().toLocaleDateString()}]`
          }
        : req
    ));
    
    toast({
      title: "Certificate Approved",
      description: "Certificate has been approved and e-signature applied",
    });
  };

  const handleReject = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' }
        : req
    ));
    
    toast({
      title: "Certificate Rejected",
      description: "Certificate request has been rejected",
      variant: "destructive"
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
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
    switch (status) {
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

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

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
                  <RequestsTable requests={requests} onApprove={handleApprove} onReject={handleReject} />
                </TabsContent>
                
                <TabsContent value="pending">
                  <RequestsTable requests={pendingRequests} onApprove={handleApprove} onReject={handleReject} />
                </TabsContent>
                
                <TabsContent value="approved">
                  <RequestsTable requests={approvedRequests} onApprove={handleApprove} onReject={handleReject} />
                </TabsContent>
                
                <TabsContent value="rejected">
                  <RequestsTable requests={rejectedRequests} onApprove={handleApprove} onReject={handleReject} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Separate component for the requests table
const RequestsTable = ({ 
  requests, 
  onApprove, 
  onReject 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
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
    switch (status) {
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
            <TableCell>{request.requestDate}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(request.status)} className="flex items-center gap-1 w-fit">
                {getStatusIcon(request.status)}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(request.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              {request.status === 'approved' && (
                <span className="text-sm text-green-600 font-medium">✓ E-Signature Applied</span>
              )}
              {request.status === 'rejected' && (
                <span className="text-sm text-red-600 font-medium">✗ Rejected</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;
