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

    // Clean up letterText: remove asterisks, double dashes, specific note, and dynamic signature blocks
    let cleanedLetterText = letterText
      .replace(/\*/g, '')
      .replace(/--/g, '')
      .replace(/-/g, '')
      .replace(/Note: This certificate is valid for official use only and should not be used for any unauthorized purposes\./g, '')
      .trim();

    // Remove dynamic signature blocks using pattern matching
    // Pattern 1: "Yours faithfully," followed by signature elements
    cleanedLetterText = cleanedLetterText.replace(/Yours faithfully,[\s\S]*$/gi, 'Yours faithfully,');
    
    // Pattern 2: "Sincerely," followed by signature elements  
    cleanedLetterText = cleanedLetterText.replace(/Sincerely,[\s\S]*$/gi, 'Sincerely,');
    
    // Pattern 3: "Yours truly," followed by signature elements
    cleanedLetterText = cleanedLetterText.replace(/Yours truly,[\s\S]*$/gi, 'Yours truly,');
    
    // Pattern 4: Remove any standalone signature placeholder patterns
    cleanedLetterText = cleanedLetterText
      .replace(/\[Signature\]/gi, '')
      .replace(/\[Name of[^\]]*\]/gi, '')
      .replace(/\[Designation[^\]]*\]/gi, '')
      .replace(/Authorized Signatory[\s\S]*$/gi, '')
      .replace(/\(Seal\/Stamp[^\)]*\)/gi, '')
      .replace(/\n\s*\n\s*[A-Z\s]{2,}\s*$/g, '') // Remove trailing college names in caps
      .trim();

      return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // College Header
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#1a365d')
         .text('Rajalakshmi Engineering College', { align: 'center' })
         .moveDown(0.05);

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#333333')
         .text('Thandalam, Chennai - 602105, Tamil Nadu, India', { align: 'center' })
         .text('Phone: +91-44-37181111   Email: info@rajalakshmi.edu.in', { align: 'center' })
         .moveDown(0.1);

      // Decorative line
      doc.strokeColor('#1a365d')
         .lineWidth(1.5)
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke()
         .moveDown(0.3);

      // Certificate Type centered below header
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#0066cc')
         .text(certificateType, { align: 'center' })
         .moveDown(0.3);

      // Letter body - centered and justified with minimal spacing
      doc.fontSize(10)
         .font('Times-Roman')
         .fillColor('#333')
         .text(cleanedLetterText, {
           align: 'justify',
           width: 445,
           indent: 0,
           lineGap: 2
         })
         .moveDown(0.5);

      // Calculate current position and ensure everything fits on one page
      const currentY = doc.y;
      const pageHeight = 842; // A4 height in points
      const bottomMargin = 40;
      const requiredSpaceForBottom = 80; // Reduced space needed
      
      // Position elements closer together
      const sealY = currentY + 10;
      const signatureY = currentY + 10;

      // Left bottom - Official Seal with label
      doc.fontSize(8)
         .font('Helvetica-Bold')
         .fillColor('#1a365d')
         .text('Official College Seal:', 70, sealY - 10);

      addSimpleSeal(doc, 70, sealY, requestId);

      // Right bottom - Principal signature
      addPrincipalSignature(doc, 350, signatureY);

      // Footer positioned closer
      const footerY = Math.max(sealY + 75, signatureY + 65);
      doc.fontSize(7)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`Certificate ID: ${requestId} | Student: ${studentName} | Generated: ${new Date().toLocaleDateString()}`, 50, footerY, { 
           align: 'center',
           width: 495
         });

      // Border - ensure it encompasses all content on same page
      const borderHeight = footerY - 35;
      doc.strokeColor('#1a365d')
         .lineWidth(2)
         .rect(45, 35, 505, borderHeight)
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

// Principal signature function - compact and positioned properly
function addPrincipalSignature(doc, x, y) {
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('Principal', x, y, { align: 'left' });

  doc.fontSize(11)
     .font('Times-Italic')
     .fillColor('#1a365d')
     .text('S.N Murugesan', x, y + 12);

  doc.fontSize(8)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('Principal, REC', x, y + 26);

  doc.fontSize(6)
     .font('Helvetica')
     .fillColor('#666666')
     .text('Digitally Signed by Principal', x, y + 38);

  doc.strokeColor('#000000')
     .lineWidth(1)
     .moveTo(x, y + 48)
     .lineTo(x + 110, y + 48)
     .stroke();
}

// Simple seal - compact design without any stray symbols
function addSimpleSeal(doc, x, y, requestId) {
  const radius = 30;
  const centerX = x + radius + 8;
  const centerY = y + radius;

  // Outer circle
  doc.strokeColor('#1a365d')
     .lineWidth(2)
     .circle(centerX, centerY, radius)
     .stroke();

  // Inner circle
  doc.strokeColor('#1a365d')
     .lineWidth(1)
     .circle(centerX, centerY, radius - 5)
     .stroke();

  // Seal text - clean and compact
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('REC', centerX - 10, centerY - 15, { width: 20, align: 'center' });

  doc.fontSize(5)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('RAJALAKSHMI', centerX - 18, centerY - 5, { width: 36, align: 'center' });

  doc.fontSize(4)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('ENGINEERING COLLEGE', centerX - 18, centerY + 2, { width: 36, align: 'center' });

  doc.fontSize(4)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('Chennai', centerX - 15, centerY + 8, { width: 30, align: 'center' });

  doc.fontSize(4)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('OFFICIAL SEAL', centerX - 15, centerY + 14, { width: 30, align: 'center' });

  // Clean decorative elements - only stars, no ampersands
  doc.fontSize(5)
     .fillColor('#0066cc')
     .text('*', centerX - radius + 4, centerY - 2)
     .text('*', centerX + radius - 8, centerY - 2)
     .text('*', centerX - 2, centerY - radius + 5)
     .text('*', centerX - 2, centerY + radius - 8);

  // Seal ID below
  doc.fontSize(5)
     .font('Helvetica')
     .fillColor('#666666')
     .text(`Seal ID: CERT-${new Date().getFullYear()}-${String(requestId).padStart(3, '0')}`, 
           x, y + (radius * 2) + 8, {
       width: 80,
       align: 'center'
     });
}


