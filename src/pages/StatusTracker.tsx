import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Search, FileText, Copy, CheckCircle, Clock, XCircle } from "lucide-react";
import { getRequestsByStudent } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const StatusTracker = () => {
  const [studentName, setStudentName] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!studentName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name to search for requests",
        variant: "destructive"
      });
      return;
    }
    
    const studentRequests = getRequestsByStudent(studentName);
    setRequests(studentRequests);
    setHasSearched(true);
    
    if (studentRequests.length === 0) {
      toast({
        title: "No requests found",
        description: "No certificate requests found for this name",
      });
    }
  };

  const copyLetter = (letter: string) => {
    navigator.clipboard.writeText(letter);
    toast({
      title: "Copied!",
      description: "Letter copied to clipboard",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusVariant = (status: string) => {
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
            <nav className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground font-medium">
                Home
              </Link>
              <Link to="/request-certificate" className="text-muted-foreground hover:text-foreground font-medium">
                Request Certificate
              </Link>
              <Link to="/status-tracker" className="text-foreground font-medium">
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Track Your Certificate Requests
            </h2>
            <p className="text-muted-foreground">
              Enter your name to view the status of your certificate requests
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8 shadow-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Your Requests
              </CardTitle>
              <CardDescription>
                Enter your full name as submitted in the certificate request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="bg-institutional hover:bg-institutional/90">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {hasSearched && (
            <Card className="shadow-form">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Certificate Requests ({requests.length})
                </CardTitle>
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
                          <TableCell>{request.certificateType}</TableCell>
                          <TableCell>{request.college}</TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(request.status)} className="flex items-center gap-1 w-fit">
                              {getStatusIcon(request.status)}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'approved' && request.generatedLetter && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyLetter(request.generatedLetter)}
                                className="flex items-center gap-1"
                              >
                                <Copy className="h-3 w-3" />
                                Copy Letter
                              </Button>
                            )}
                            {request.status === 'pending' && (
                              <span className="text-sm text-muted-foreground">Awaiting approval</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Requests Found</h3>
                    <p className="text-muted-foreground mb-4">
                      No certificate requests found for "{studentName}"
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
          )}
        </div>
      </main>
    </div>
  );
};

export default StatusTracker;