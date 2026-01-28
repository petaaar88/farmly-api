import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { BaseError } from 'sequelize';

vi.mock('../../repositories/userRepository.js', () => ({
    default: {
        findUserByEmail: vi.fn(),
        createUser: vi.fn()
    }
}));

import UserRepository from '../../repositories/userRepository.js';

describe('Users Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/users/register', () => {
        const validUserData = {
            fullName: 'John Doe',
            city: 'Belgrade',
            phoneNumber: '+381601234567',
            email: 'newuser@example.com',
            password: 'password123'
        };

        it('should return 201 and token for valid registration', async () => {
            const mockCreatedUser = {
                dataValues: { id: 1, ...validUserData }
            };

            UserRepository.createUser.mockResolvedValue(mockCreatedUser);

            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('accessToken');
        });

        it('should return 400 for missing fullName', async () => {
            const { fullName, ...data } = validUserData;

            const response = await request(app)
                .post('/api/users/register')
                .send(data);

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing email', async () => {
            const { email, ...data } = validUserData;

            const response = await request(app)
                .post('/api/users/register')
                .send(data);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({ ...validUserData, email: 'invalid-email' });

            expect(response.status).toBe(400);
        });

        it('should return 400 for password too short', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({ ...validUserData, password: '1234' });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing city', async () => {
            const { city, ...data } = validUserData;

            const response = await request(app)
                .post('/api/users/register')
                .send(data);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid phone number', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({ ...validUserData, phoneNumber: 'abc' });

            expect(response.status).toBe(400);
        });

        it('should return 400 for fullName too short', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({ ...validUserData, fullName: 'Jo' });

            expect(response.status).toBe(400);
        });

        it('should return 400 for duplicate email', async () => {
            class UniqueConstraintError extends BaseError {
                constructor() {
                    super('Duplicate key');
                    this.parent = { code: '23505', detail: 'Key (email) already exists' };
                }
            }
            UserRepository.createUser.mockRejectedValue(new UniqueConstraintError());

            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData);

            expect(response.status).toBe(400);
        });
    });
});
