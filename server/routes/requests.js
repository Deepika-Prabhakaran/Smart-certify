import express from 'express';
import { getPool } from '../db.js';

const router = express.Router();

// POST /api/submit-request - Submit a new certificate request
router.post('/submit-request', async (req, res) => {
  try {
    console.log('Received submit request:', req.body);
    
    const { studentName, college, certificateType, generatedLetter } = req.body;

    if (!studentName || !college || !certificateType || !generatedLetter) {
      console.log('Missing fields validation failed');
      return res.status(400).json({ 
        error: 'Missing required fields: studentName, college, certificateType, generatedLetter' 
      });
    }

    console.log('Attempting to connect to database...');
    const pool = getPool();
    
    console.log('Executing database query...');
    const result = await pool.request()
      .input('studentName', studentName)
      .input('college', college)
      .input('certificateType', certificateType)
      .input('generatedLetter', generatedLetter)
      .query(`
        INSERT INTO Requests (studentName, college, certificateType, generatedLetter, status)
        OUTPUT INSERTED.id
        VALUES (@studentName, @college, @certificateType, @generatedLetter, 'Pending')
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

// GET /api/status?name=<studentName> - Get all requests for a student
router.get('/status', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Student name is required' });
    }

    const pool = getPool();
    const result = await pool.request()
      .input('studentName', name)
      .query(`
        SELECT id, studentName, college, certificateType, requestDate, status, pdfPath, approvedDate
        FROM Requests
        WHERE studentName = @studentName
        ORDER BY requestDate DESC
      `);

    res.json({
      studentName: name,
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
