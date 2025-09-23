import express from 'express';
import { getPool } from '../db.js';
import { generateCertificatePDF } from '../utils/pdfGenerator.js';

const router = express.Router();

// GET /api/admin/requests - Get all requests with letters for admin
router.get('/requests', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT id, studentName, college, certificateType, requestDate, status, 
               generatedLetter, approvedBy, approvedDate, pdfPath
        FROM Requests
        ORDER BY requestDate DESC
      `);

    res.json({
      requests: result.recordset.map(request => ({
        id: request.id,
        studentName: request.studentName,
        college: request.college,
        certificateType: request.certificateType,
        requestDate: request.requestDate,
        status: request.status,
        generatedLetter: request.generatedLetter,
        approvedBy: request.approvedBy,
        approvedDate: request.approvedDate,
        downloadUrl: request.pdfPath ? `/certificates/${request.pdfPath}` : null
      }))
    });
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/approve/:id - Approve a request and generate PDF
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({ error: 'approvedBy field is required' });
    }

    const pool = getPool();
    
    // Get the request details
    const requestResult = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Requests WHERE id = @id AND status = \'Pending\'');

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    const request = requestResult.recordset[0];

    // Clean up letterText before PDF generation - remove asterisks, dashes, and specific note
    const cleanedLetterText = request.generatedLetter
      .replace(/\*/g, '')
      .replace(/--/g, '')
      .replace(/Note: This certificate is valid for official use only and should not be used for any unauthorized purposes\./g, '')
      .trim();

    console.log('🎯 Approving request and generating PDF with official seal:', {
      id: request.id,
      studentName: request.studentName,
      certificateType: request.certificateType,
      expectedFileName: `${request.studentName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}-${request.certificateType.toLowerCase().replace(/certificate/g, '').replace(/[^a-zA-Z0-9]/g, '')}.pdf`,
      sealStatus: 'APPLYING_OFFICIAL_SEAL'
    });

    // Generate PDF with principal signature and official seal
    const pdfFileName = await generateCertificatePDF(
      cleanedLetterText,
      request.id,
      request.studentName,
      request.certificateType
    );

    console.log('✅ PDF generated successfully with official seal and signature:', pdfFileName, '| SEAL APPLIED: YES');

    // Update database with the generated PDF filename
    await pool.request()
      .input('id', id)
      .input('approvedBy', approvedBy)
      .input('pdfPath', pdfFileName)
      .query(`
        UPDATE Requests 
        SET status = 'Approved', 
            approvedBy = @approvedBy, 
            approvedDate = GETDATE(),
            pdfPath = @pdfPath
        WHERE id = @id
      `);

    res.json({
      message: 'Certificate approved and digitally signed PDF generated with official seal',
      requestId: id,
      status: 'Approved',
      downloadUrl: `/certificates/${pdfFileName}`,
      pdfFileName: pdfFileName,
      sealApplied: true,
      sealStatus: 'OFFICIAL_SEAL_APPLIED'
    });
  } catch (error) {
    console.error('❌ Error approving request and generating sealed PDF:', error);
    res.status(500).json({ 
      error: 'Failed to approve certificate and generate PDF',
      details: error.message 
    });
  }
});

// POST /api/admin/reject/:id - Reject a request
router.post('/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({ error: 'approvedBy field is required' });
    }

    const pool = getPool();
    
    const result = await pool.request()
      .input('id', id)
      .input('approvedBy', approvedBy)
      .query(`
        UPDATE Requests 
        SET status = 'Rejected', 
            approvedBy = @approvedBy, 
            approvedDate = GETDATE()
        WHERE id = @id AND status = 'Pending'
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    res.json({
      message: 'Request rejected successfully',
      requestId: id,
      status: 'Rejected'
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
