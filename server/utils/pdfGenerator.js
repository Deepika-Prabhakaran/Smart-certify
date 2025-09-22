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

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 60, right: 60 }
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(28)
         .font('Helvetica-Bold')
         .fillColor('#1a365d')
         .text('GENESIS CERTIFICATE', { align: 'center' })
         .moveDown(0.5);

      // Decorative line
      doc.strokeColor('#1a365d')
         .lineWidth(2)
         .moveTo(60, doc.y)
         .lineTo(535, doc.y)
         .stroke()
         .moveDown(1.5);

      // Certificate content
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#000000')
         .text(letterText, { 
           align: 'justify',
           lineGap: 6,
           indent: 20
         })
         .moveDown(4);

      // Ensure we have enough space for signature and seal
      const currentY = doc.y;
      const pageHeight = 841.89; // A4 height in points
      const requiredSpace = 300; // Space needed for signature and seal
      
      if (currentY > pageHeight - requiredSpace - 60) { // 60 for bottom margin
        doc.addPage();
      }

      // Signature section
      const signatureY = doc.y;
      const leftColumnX = 60;
      const rightColumnX = 350;

      // Date on the left
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#000000')
         .text(`Date: ${new Date().toLocaleDateString()}`, leftColumnX, signatureY, { align: 'left' });

      // Professional signature section
      addProfessionalSignature(doc, rightColumnX, signatureY);

      // Official Seal section - positioned below signature
      const sealSectionY = signatureY + 100;
      addOfficialSeal(doc, rightColumnX + 25, sealSectionY, requestId);

      // Footer with certificate details
      const footerY = 720;
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`Certificate ID: ${requestId}`, 60, footerY, { align: 'left' })
         .text(`Student: ${studentName}`, 60, footerY + 12, { align: 'left' })
         .text(`Certificate Type: ${certificateType}`, 60, footerY + 24, { align: 'left' })
         .text(`Generated: ${new Date().toLocaleString()}`, 350, footerY, { align: 'left' })
         .text('DIGITALLY SIGNED & SEALED', 350, footerY + 12, { align: 'left' })
         .text('GENESIS CERTIFY SYSTEM', 350, footerY + 24, { align: 'left' });

      // Add border
      doc.strokeColor('#1a365d')
         .lineWidth(3)
         .rect(50, 50, 495, 742)
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

// Professional signature function
function addProfessionalSignature(doc, x, y) {
  // Authorized Signature label
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('Authorized Signature', x, y, { align: 'left' });

  // Signature style text
  doc.fontSize(14)
     .font('Helvetica-Oblique')
     .fillColor('#1a365d')
     .text('Genesis Admin', x, y + 20);
  
  // Digital signature indicator
  doc.fontSize(9)
     .font('Helvetica')
     .fillColor('#666666')
     .text('Digitally Signed by Admin', x, y + 40);

  // Signature line
  doc.strokeColor('#000000')
     .lineWidth(1)
     .moveTo(x, y + 60)
     .lineTo(x + 150, y + 60)
     .stroke();
}

// Official seal function with your requested format
function addOfficialSeal(doc, x, y, requestId) {
  const sealWidth = 180;
  const sealHeight = 120;
  
  // Main seal box with double border
  doc.strokeColor('#1a365d')
     .lineWidth(3)
     .rect(x - 10, y, sealWidth, sealHeight)
     .stroke();
     
  doc.strokeColor('#1a365d')
     .lineWidth(1)
     .rect(x - 5, y + 5, sealWidth - 10, sealHeight - 10)
     .stroke();

  // Top border with check marks
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('═══════════════════════════════', x, y + 10, { width: sealWidth - 20, align: 'center' });

  doc.fontSize(14)
     .font('Helvetica-Bold')
     .fillColor('#0066cc')
     .text('✔ CERTIFIED & APPROVED ✔', x, y + 25, { width: sealWidth - 20, align: 'center' });

  // Separator line
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#1a365d')
     .text('─────────────────────────────────', x, y + 45, { width: sealWidth - 20, align: 'center' });

  // Digital signature text
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .fillColor('#000000')
     .text('Digitally Signed by Admin', x, y + 60, { width: sealWidth - 20, align: 'center' });

  // Seal ID
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#666666')
     .text(`Seal ID: CERT-${new Date().getFullYear()}-${String(requestId).padStart(3, '0')}`, x, y + 80, { width: sealWidth - 20, align: 'center' });

  // Bottom border
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('═══════════════════════════════', x, y + 100, { width: sealWidth - 20, align: 'center' });

  // Add some decorative elements
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#0066cc')
     .text('★', x - 5, y + 35)
     .text('★', x + sealWidth - 15, y + 35)
     .text('★', x - 5, y + 85)
     .text('★', x + sealWidth - 15, y + 85);

  // "OFFICIAL SEAL" text below
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('OFFICIAL GENESIS INSTITUTE SEAL', x, y + sealHeight + 10, { 
       width: sealWidth - 20, 
       align: 'center' 
     });
}
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#0066cc')
     .text('★', x - 5, y + 35)
     .text('★', x + sealWidth - 15, y + 35)
     .text('★', x - 5, y + 85)
     .text('★', x + sealWidth - 15, y + 85);

  // "OFFICIAL SEAL" text below
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('OFFICIAL GENESIS INSTITUTE SEAL', x, y + sealHeight + 10, { 
       width: sealWidth - 20, 
       align: 'center' 
     });

// Utility function to find first existing path
function findFirstExistingPath(paths) {
  for (const p of paths) {
    console.log('🔍 Checking path:', p);
    if (fs.existsSync(p)) {
      console.log('✅ Found file at:', p);
      // Also check if file is readable and not empty
      try {
        const stats = fs.statSync(p);
        if (stats.size > 0) {
          console.log('✅ File is valid, size:', stats.size);
          return p;
        } else {
          console.log('⚠️ File exists but is empty:', p);
        }
      } catch (err) {
        console.log('⚠️ Error reading file stats:', err.message);
      }
    } else {
      console.log('❌ File not found at:', p);
    }
  }
  return null;
}

// Text-based seal fallback function
function addTextSeal(doc, sealX, sealY) {
  console.log('📝 Adding text-based seal');
  
  const centerX = sealX + 50;
  const centerY = sealY + 50;
  const radius = 45;

  // Outer circle
  doc.strokeColor('#1a365d')
     .lineWidth(3)
     .circle(centerX, centerY, radius)
     .stroke();

  // Inner circle
  doc.strokeColor('#1a365d')
     .lineWidth(2)
     .circle(centerX, centerY, radius - 10)
     .stroke();

  // Center text
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('GENESIS', centerX - 25, centerY - 20, { 
       width: 50, 
       align: 'center' 
     });

  doc.fontSize(10)
     .text('INSTITUTE', centerX - 25, centerY - 5, { 
       width: 50, 
       align: 'center' 
     });

  doc.fontSize(8)
     .text('OFFICIAL SEAL', centerX - 25, centerY + 10, { 
       width: 50, 
       align: 'center' 
     });

  // Decorative stars at cardinal points
  const starPositions = [
    { x: centerX, y: centerY - radius + 5 },      // Top
    { x: centerX + radius - 5, y: centerY },      // Right
    { x: centerX, y: centerY + radius - 5 },      // Bottom
    { x: centerX - radius + 5, y: centerY }       // Left
  ];

  starPositions.forEach(pos => {
    doc.fontSize(6)
       .fillColor('#1a365d')
       .text('★', pos.x - 3, pos.y - 3);
  });

  // Add "OFFICIAL SEAL" text below the circle
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor('#1a365d')
     .text('OFFICIAL SEAL', sealX + 10, sealY + 110, { 
       width: 100, 
       align: 'center' 
     });
}
