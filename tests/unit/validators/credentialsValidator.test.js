import { describe, it, expect } from 'vitest';
import { credentialsSchema } from '../../../validators/credentialsValidator.js';

describe('credentialsValidator', () => {
    describe('email validation', () => {
        it('should accept valid email', async () => {
            const data = { email: 'test@example.com', password: 'password123' };
            const result = await credentialsSchema.validateAsync(data);
            expect(result.email).toBe('test@example.com');
        });

        it('should reject invalid email format', async () => {
            const data = { email: 'invalid-email', password: 'password123' };
            await expect(credentialsSchema.validateAsync(data)).rejects.toThrow();
        });

        it('should reject empty email', async () => {
            const data = { email: '', password: 'password123' };
            await expect(credentialsSchema.validateAsync(data)).rejects.toThrow();
        });

        it('should reject missing email', async () => {
            const data = { password: 'password123' };
            await expect(credentialsSchema.validateAsync(data)).rejects.toThrow();
        });
    });

    describe('password validation', () => {
        it('should accept valid password', async () => {
            const data = { email: 'test@example.com', password: 'password123' };
            const result = await credentialsSchema.validateAsync(data);
            expect(result.password).toBe('password123');
        });

        it('should reject password shorter than 5 characters', async () => {
            const data = { email: 'test@example.com', password: '1234' };
            await expect(credentialsSchema.validateAsync(data)).rejects.toThrow();
        });

        it('should reject password longer than 30 characters', async () => {
            const data = { email: 'test@example.com', password: 'a'.repeat(31) };
            await expect(credentialsSchema.validateAsync(data)).rejects.toThrow();
        });

        it('should reject empty password', async () => {
            const data = { email: 'test@example.com', password: '' };
            await expect(credentialsSchema.validateAsync(data)).rejects.toThrow();
        });
    });

    describe('stripUnknown option', () => {
        it('should strip unknown fields', async () => {
            const data = {
                email: 'test@example.com',
                password: 'password123',
                unknownField: 'should be removed'
            };
            const result = await credentialsSchema.validateAsync(data);
            expect(result.unknownField).toBeUndefined();
        });
    });
});
