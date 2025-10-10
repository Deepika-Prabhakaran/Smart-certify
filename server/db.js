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

// Add table creation functions
export const initializeTables = async () => {
  try {
    console.log('Initializing database tables...');
    const pool = getPool();
    
    // Create MasterStudent table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MasterStudent' AND xtype='U')
      CREATE TABLE MasterStudent (
        id INT IDENTITY(1,1) PRIMARY KEY,
        studentId NVARCHAR(20) UNIQUE NOT NULL,
        firstName NVARCHAR(50) NOT NULL,
        lastName NVARCHAR(50) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        college NVARCHAR(100) NOT NULL,
        department NVARCHAR(100),
        yearOfStudy INT,
        phoneNumber NVARCHAR(15),
        createdDate DATETIME DEFAULT GETDATE(),
        isActive BIT DEFAULT 1
      )
    `);

    // Create MasterAdmin table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MasterAdmin' AND xtype='U')
      CREATE TABLE MasterAdmin (
        id INT IDENTITY(1,1) PRIMARY KEY,
        adminId NVARCHAR(20) UNIQUE NOT NULL,
        firstName NVARCHAR(50) NOT NULL,
        lastName NVARCHAR(50) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) DEFAULT 'Admin',
        department NVARCHAR(100),
        permissions NVARCHAR(MAX),
        createdDate DATETIME DEFAULT GETDATE(),
        isActive BIT DEFAULT 1
      )
    `);

    // Add submittedBy column to Requests table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Requests' AND COLUMN_NAME = 'submittedBy')
      ALTER TABLE Requests ADD submittedBy INT NULL
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
};
