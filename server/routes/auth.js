import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from '../db.js';
import rateLimit from 'express-rate-limit';

// Rate limiter for auth endpoints (e.g., /verify): limit to 10 requests/min per IP
const verifyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random-123456789';
const SALT_ROUNDS = 10;

// Student Sign Up
router.post('/student/signup', async (req, res) => {
  try {
    console.log('Student signup attempt:', req.body);
    
    const { 
      studentId, 
      firstName, 
      lastName, 
      email, 
      password, 
      college, 
      department, 
      yearOfStudy, 
      phoneNumber 
    } = req.body;

    if (!studentId || !firstName || !lastName || !email || !password || !college) {
      return res.status(400).json({ 
        error: 'Required fields: studentId, firstName, lastName, email, password, college' 
      });
    }

    const pool = getPool();
    
    // Check if student already exists
    const existingStudent = await pool.request()
      .input('studentId', studentId)
      .input('email', email)
      .query(`
        SELECT id FROM MasterStudent 
        WHERE studentId = @studentId OR email = @email
      `);

    if (existingStudent.recordset.length > 0) {
      return res.status(409).json({ error: 'Student ID or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new student
    const result = await pool.request()
      .input('studentId', studentId)
      .input('firstName', firstName)
      .input('lastName', lastName)
      .input('email', email)
      .input('password', hashedPassword)
      .input('college', college)
      .input('department', department || null)
      .input('yearOfStudy', yearOfStudy || null)
      .input('phoneNumber', phoneNumber || null)
      .query(`
        INSERT INTO MasterStudent 
        (studentId, firstName, lastName, email, password, college, department, yearOfStudy, phoneNumber)
        OUTPUT INSERTED.id
        VALUES (@studentId, @firstName, @lastName, @email, @password, @college, @department, @yearOfStudy, @phoneNumber)
      `);

    const newStudentId = result.recordset[0].id;

    // Generate JWT token
    const token = jwt.sign(
      { id: newStudentId, studentId, email, firstName, lastName, type: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Student registered successfully:', newStudentId);

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        id: newStudentId,
        studentId,
        firstName,
        lastName,
        email,
        college,
        department,
        yearOfStudy
      }
    });
  } catch (error) {
    console.error('Error in student signup:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Student Sign In
router.post('/student/signin', async (req, res) => {
  try {
    console.log('Student signin attempt:', { studentId: req.body.studentId });
    
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ error: 'Student ID and password are required' });
    }

    const pool = getPool();
    
    // Find student by studentId or email
    const result = await pool.request()
      .input('identifier', studentId)
      .query(`
        SELECT id, studentId, firstName, lastName, email, password, college, department, yearOfStudy, isActive
        FROM MasterStudent 
        WHERE (studentId = @identifier OR email = @identifier)
      `);

    console.log('Database query result:', result.recordset.length, 'students found');

    if (result.recordset.length === 0) {
      console.log('No student found with identifier:', studentId);
      return res.status(401).json({ error: 'Invalid credentials - student not found. Please sign up first.' });
    }

    const student = result.recordset[0];
    
    if (!student.isActive) {
      console.log('Student account is not active:', studentId);
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for student:', studentId);
      return res.status(401).json({ error: 'Invalid credentials - wrong password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: student.id, 
        studentId: student.studentId, 
        email: student.email, 
        firstName: student.firstName,
        lastName: student.lastName,
        type: 'student' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Student signed in successfully:', student.studentId);

    res.json({
      message: 'Sign in successful',
      token,
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        college: student.college,
        department: student.department,
        yearOfStudy: student.yearOfStudy
      }
    });
  } catch (error) {
    console.error('Error in student signin:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Admin Sign Up
router.post('/admin/signup', async (req, res) => {
  try {
    const { 
      adminId, 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      department, 
      permissions 
    } = req.body;

    if (!adminId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: 'Required fields: adminId, firstName, lastName, email, password' 
      });
    }

    const pool = getPool();
    
    // Check if admin already exists
    const existingAdmin = await pool.request()
      .input('adminId', adminId)
      .input('email', email)
      .query(`
        SELECT id FROM MasterAdmin 
        WHERE adminId = @adminId OR email = @email
      `);

    if (existingAdmin.recordset.length > 0) {
      return res.status(409).json({ error: 'Admin ID or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new admin
    const result = await pool.request()
      .input('adminId', adminId)
      .input('firstName', firstName)
      .input('lastName', lastName)
      .input('email', email)
      .input('password', hashedPassword)
      .input('role', role || 'Admin')
      .input('department', department || null)
      .input('permissions', JSON.stringify(permissions) || null)
      .query(`
        INSERT INTO MasterAdmin 
        (adminId, firstName, lastName, email, password, role, department, permissions)
        OUTPUT INSERTED.id
        VALUES (@adminId, @firstName, @lastName, @email, @password, @role, @department, @permissions)
      `);

    const newAdminId = result.recordset[0].id;

    // Generate JWT token
    const token = jwt.sign(
      { id: newAdminId, adminId, email, firstName, lastName, type: 'admin', role: role || 'Admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: newAdminId,
        adminId,
        firstName,
        lastName,
        email,
        role: role || 'Admin',
        department
      }
    });
  } catch (error) {
    console.error('Error in admin signup:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Admin Sign In
router.post('/admin/signin', async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ error: 'Admin ID and password are required' });
    }

    const pool = getPool();
    
    // Find admin by adminId or email
    const result = await pool.request()
      .input('identifier', adminId)
      .query(`
        SELECT id, adminId, firstName, lastName, email, password, role, department, permissions, isActive
        FROM MasterAdmin 
        WHERE (adminId = @identifier OR email = @identifier)
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.recordset[0];
    
    if (!admin.isActive) {
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, adminId: admin.adminId, email: admin.email, firstName: admin.firstName, lastName: admin.lastName, type: 'admin', role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Sign in successful',
      token,
      admin: {
        id: admin.id,
        adminId: admin.adminId,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        permissions: admin.permissions ? JSON.parse(admin.permissions) : null
      }
    });
  } catch (error) {
    console.error('Error in admin signin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify JWT Token
router.get('/verify', verifyRateLimiter, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
