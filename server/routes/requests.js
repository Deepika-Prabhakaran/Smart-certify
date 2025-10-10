import express from 'express';
import { getPool } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/submit-request - Submit a new certificate request (with auth)
router.post('/submit-request', verifyToken, async (req, res) => {
  try {
    console.log('Received submit request:', req.body);
    console.log('User from token:', req.user);
    
    const { studentName, college, certificateType, generatedLetter } = req.body;

    if (!studentName || !college || !certificateType || !generatedLetter) {
      console.log('Missing fields validation failed');
      return res.status(400).json({ 
        error: 'Missing required fields: studentName, college, certificateType, generatedLetter' 
      });
    }

    // Verify that the authenticated student matches the request
    if (req.user.type !== 'student') {
      return res.status(403).json({ error: 'Only students can submit certificate requests' });
    }

    console.log('Attempting to connect to database...');
    const pool = getPool();
    
    console.log('Executing database query...');
    const result = await pool.request()
      .input('studentName', studentName)
      .input('college', college)
      .input('certificateType', certificateType)
      .input('generatedLetter', generatedLetter)
      .input('submittedBy', req.user.id) // Add student ID from token
      .query(`
        INSERT INTO Requests (studentName, college, certificateType, generatedLetter, status, submittedBy)
        OUTPUT INSERTED.id
        VALUES (@studentName, @college, @certificateType, @generatedLetter, 'Pending', @submittedBy)
      `);

    const requestId = result.recordset[0].id;
    console.log('Request inserted successfully with ID:', requestId);

    res.status(201).json({
      message: 'Request submitted successfully',
      requestId,
      status: 'Pending'
    });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/status?name=<studentName> - Get requests for authenticated student
router.get('/status', verifyToken, async (req, res) => {
  try {
    if (req.user.type !== 'student') {
      return res.status(403).json({ error: 'Only students can view their request status' });
    }

    const pool = getPool();
    const result = await pool.request()
      .input('submittedBy', req.user.id)
      .query(`
        SELECT id, studentName, college, certificateType, requestDate, status, pdfPath, approvedDate
        FROM Requests
        WHERE submittedBy = @submittedBy
        ORDER BY requestDate DESC
      `);

    res.json({
      studentName: req.user.firstName || 'Student',
      requests: result.recordset.map(request => ({
        id: request.id,
        college: request.college,
        certificateType: request.certificateType,
        requestDate: request.requestDate,
        status: request.status,
        approvedDate: request.approvedDate,
        downloadUrl: request.pdfPath ? `/certificates/${request.pdfPath}` : null
      }))
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
