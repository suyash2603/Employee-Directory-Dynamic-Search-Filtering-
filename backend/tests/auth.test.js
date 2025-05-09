const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = require('../server'); // Assuming you export the app from server.js
const db = require('../models/db');

// Mock JWT secret
process.env.JWT_SECRET = 'testsecret';

jest.mock('../models/db');

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/required fields/i);
    });

    it('should create a new employee and return 201', async () => {
      db.query
        .mockResolvedValueOnce([[]]) // check employeeId uniqueness
        .mockResolvedValueOnce([{ insertId: 123 }]) // insert into employees
        .mockResolvedValueOnce([[{ id: 2 }]]) // fetch role id
        .mockResolvedValueOnce([{}]); // insert into employee_roles

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'employee',
          department_id: 1,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/signup successful/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 404 for non-existing user', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notfound@example.com', password: '123456' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    it('should return token for valid credentials', async () => {
      const hashedPassword = await require('bcryptjs').hash('password123', 10);

      db.query
        .mockResolvedValueOnce([
          [
            {
              id: 1,
              name: 'John',
              email: 'john@example.com',
              password: hashedPassword,
              department_id: 1,
              profile_pic: null,
              status: 'active',
            },
          ],
        ])
        .mockResolvedValueOnce([[{ role_name: 'employee' }]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
          selectedRole: 'employee',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('john@example.com');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: '' });

      expect(res.statusCode).toBe(400);
    });

    it('should return 404 if user not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'notfound@example.com', newPassword: 'newpass123' });

      expect(res.statusCode).toBe(404);
    });

    it('should update password and return token', async () => {
      const hashedPassword = await require('bcryptjs').hash('oldpassword', 10);

      db.query
        .mockResolvedValueOnce([
          [
            {
              id: 1,
              email: 'john@example.com',
              password: hashedPassword,
              role: 'employee',
            },
          ],
        ])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'john@example.com', newPassword: 'newpass123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

  describe('POST /api/auth/check-credentials', () => {
    it('should return 404 if user not found', async () => {
      db.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/api/auth/check-credentials')
        .send({ email: 'unknown@example.com', password: 'pass' });

      expect(res.statusCode).toBe(404);
    });

    it('should return 200 for valid credentials', async () => {
      const hashedPassword = await require('bcryptjs').hash('pass', 10);

      db.query.mockResolvedValueOnce([
        [{ email: 'user@example.com', password: hashedPassword }],
      ]);

      const res = await request(app)
        .post('/api/auth/check-credentials')
        .send({ email: 'user@example.com', password: 'pass' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/valid/i);
    });
  });
});
