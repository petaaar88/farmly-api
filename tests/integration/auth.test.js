import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';

vi.mock('../../repositories/userRepository.js', () => ({
    default: {
        findUserByEmail: vi.fn(),
        createUser: vi.fn()
    }
}));

vi.mock('../../utils/hashingUtils.js', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        validatePassword: vi.fn()
    };
});

import UserRepository from '../../repositories/userRepository.js';
import { validatePassword } from '../../utils/hashingUtils.js';

describe('Auth Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 and token for valid credentials', async () => {
            const mockUser = {
                dataValues: { id: 1 },
                password: 'hashedpassword'
            };

            UserRepository.findUserByEmail.mockResolvedValue(mockUser);
            validatePassword.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(typeof response.body.accessToken).toBe('string');
        });

        it('should return 401 for non-existent user', async () => {
            UserRepository.findUserByEmail.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
        });

        it('should return 401 for wrong password', async () => {
            const mockUser = {
                dataValues: { id: 1 },
                password: 'hashedpassword'
            };

            UserRepository.findUserByEmail.mockResolvedValue(mockUser);
            validatePassword.mockResolvedValue(false);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for password too short', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: '1234'
                });

            expect(response.status).toBe(400);
        });
    });
});
