import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async (letterText, requestId, studentName, certificateType) => {
  try {
    // Ensure certificates directory exists
    const certificatesDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Create proper filename format: studentname-certificatetype (lowercase, no spaces)
    const sanitizedStudentName = studentName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const sanitizedCertType = certificateType.toLowerCase()
      .replace(/certificate/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${sanitizedStudentName}-${sanitizedCertType}.pdf`;
    const filePath = path.join(certificatesDir, fileName);

    // Clean up letterText: remove asterisks, double dashes, and specific note
    const cleanedLetterText = letterText
      .replace(/\*/g, '')
      .replace(/--/g, '')
      .replace(/-/g, '')
      .replace(/Note: This certificate is valid for official use only and should not be used for any unauthorized purposes\./g, '')
      .trim();

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 80, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // College Header
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .fillColor('#1a365d')
         .text('Rajalakshmi Engineering College', { align: 'center' })
         .moveDown(0.1);

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#333333')
         .text('Thandalam, Chennai - 602105, Tamil Nadu, India', { align: 'center' })
         .text('Phone: +91-44-37181111   Email: info@rajalakshmi.edu.in', { align: 'center' })
         .moveDown(0.3);

      // Decorative line
      doc.strokeColor('#1a365d')
         .lineWidth(1.5)
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke()
         .moveDown(0.8);

      // Certificate Type centered below header
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#0066cc')
         .text(certificateType, { align: 'center' })
         .moveDown(0.8);

      // Letter body - centered and justified with better font
      doc.fontSize(13)
         .font('Times-Roman')
         .fillColor('#333')
         .text(cleanedLetterText, {
           align: 'justify',
           width: 445,
           indent: 0,
           lineGap: 4
         })
         .moveDown(3);

      // Calculate positions for bottom elements
      const pageHeight = 842; // A4 height in points
      const bottomMargin = 80;
      const sealBottomY = pageHeight - bottomMargin - 70; // 70px from bottom
      const signatureBottomY = pageHeight - bottomMargin - 70;

      // Left bottom - Official Seal with label
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#1a365d')
         .text('Official College Seal:', 70, sealBottomY - 20);

      addSimpleSeal(doc, 70, sealBottomY, requestId);

      // Right bottom - Principal signature
      addPrincipalSignature(doc, 350, signatureBottomY);

      // Footer at very bottom
      const footerY = pageHeight - 40;
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`Certificate ID: ${requestId} | Student: ${studentName} | Generated: ${new Date().toLocaleDateString()}`, 50, footerY, { 
           align: 'center',
           width: 495
         });

      // Border
      doc.strokeColor('#1a365d')
         .lineWidth(2)
         .rect(45, 45, 505, 752)
         .stroke();

      doc.end();

      stream.on('finish', () => {
        resolve(fileName);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Principal signature function - repositioned for right bottom
function addPrincipalSignature(doc, x, y) {
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('Principal', x, y, { align: 'left' });

  doc.fontSize(14)
     .font('Times-Italic')
     .fillColor('#1a365d')
     .text('S.N Murugesan', x, y + 18);

  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('Principal, REC', x, y + 36);

  doc.fontSize(8)
     .font('Helvetica')
     .fillColor('#666666')
     .text('Digitally Signed by Principal', x, y + 52);

  doc.strokeColor('#000000')
     .lineWidth(1)
     .moveTo(x, y + 68)
     .lineTo(x + 140, y + 68)
     .stroke();
}

// Simple seal - positioned at left bottom with proper margins
function addSimpleSeal(doc, x, y, requestId) {
  const radius = 40;
  const centerX = x + radius + 10; // Add padding from left edge
  const centerY = y + radius;

  // Outer circle
  doc.strokeColor('#1a365d')
     .lineWidth(2)
     .circle(centerX, centerY, radius)
     .stroke();

  // Inner circle
  doc.strokeColor('#1a365d')
     .lineWidth(1)
     .circle(centerX, centerY, radius - 8)
     .stroke();

  // Seal text - compact and well-spaced
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('REC', centerX - 15, centerY - 20, { width: 30, align: 'center' });

  doc.fontSize(7)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('RAJALAKSHMI', centerX - 25, centerY - 8, { width: 50, align: 'center' });

  doc.fontSize(6)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('ENGINEERING COLLEGE', centerX - 25, centerY + 2, { width: 50, align: 'center' });

  doc.fontSize(6)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('Chennai', centerX - 20, centerY + 12, { width: 40, align: 'center' });

  doc.fontSize(6)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('OFFICIAL SEAL', centerX - 20, centerY + 22, { width: 40, align: 'center' });

  // Decorative stars
  doc.fontSize(8)
     .fillColor('#0066cc')
     .text('★', centerX - radius + 5, centerY - 3)
     .text('★', centerX + radius - 12, centerY - 3)
     .text('★', centerX - 3, centerY - radius + 8)
     .text('★', centerX - 3, centerY + radius - 12);

  // Seal ID below with proper spacing
  doc.fontSize(7)
     .font('Helvetica')
     .fillColor('#666666')
     .text(`Seal ID: CERT-${new Date().getFullYear()}-${String(requestId).padStart(3, '0')}`, 
           x, y + (radius * 2) + 15, {
       width: 120,
       align: 'center'
     });
}


