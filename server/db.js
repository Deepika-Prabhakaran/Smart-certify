import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false
  }
};

let pool;

export const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Connected to Azure SQL Database');
    
    // Create Requests table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Requests' AND xtype='U')
      CREATE TABLE Requests (
        id INT IDENTITY(1,1) PRIMARY KEY,
        studentName NVARCHAR(255) NOT NULL,
        college NVARCHAR(255) NOT NULL,
        certificateType NVARCHAR(255) NOT NULL,
        requestDate DATETIME DEFAULT GETDATE(),
        status NVARCHAR(50) DEFAULT 'Pending',
        generatedLetter NTEXT,
        approvedBy NVARCHAR(255) NULL,
        approvedDate DATETIME NULL,
        pdfPath NVARCHAR(500) NULL
      )
    `);
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return pool;
};
