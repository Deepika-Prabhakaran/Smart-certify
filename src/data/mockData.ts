export interface CertificateRequest {
  id: string;
  studentName: string;
  college: string;
  certificateType: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  generatedLetter?: string;
  approvedBy?: string;
  approvedDate?: string;
}

// Mock data for certificate requests
export const mockCertificateRequests: CertificateRequest[] = [
  {
    id: '1',
    studentName: 'John Doe',
    college: 'Engineering College',
    certificateType: 'Bonafide Certificate',
    requestDate: '2024-01-15',
    status: 'pending',
    generatedLetter: 'This is to certify that John Doe is a bonafide student of Engineering College...'
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    college: 'Arts & Science College',
    certificateType: 'Study Certificate',
    requestDate: '2024-01-14',
    status: 'approved',
    generatedLetter: 'This is to certify that Jane Smith has successfully completed her studies at Arts & Science College...',
    approvedBy: 'Admin',
    approvedDate: '2024-01-15'
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    college: 'Business School',
    certificateType: 'Character Certificate',
    requestDate: '2024-01-13',
    status: 'approved',
    generatedLetter: 'This is to certify that Mike Johnson is of good character and conduct during his time at Business School...',
    approvedBy: 'Admin',
    approvedDate: '2024-01-14'
  },
  {
    id: '4',
    studentName: 'Sarah Wilson',
    college: 'Medical College',
    certificateType: 'Bonafide Certificate',
    requestDate: '2024-01-12',
    status: 'pending',
    generatedLetter: 'This is to certify that Sarah Wilson is a bonafide student of Medical College...'
  }
];

// Function to get requests by student (mock filtering)
export const getRequestsByStudent = (studentName: string): CertificateRequest[] => {
  return mockCertificateRequests.filter(req => req.studentName === studentName);
};

// Function to get all requests (for admin)
export const getAllRequests = (): CertificateRequest[] => {
  return mockCertificateRequests;
};