import { describe, it, expect } from 'vitest';
import { newUserSchema } from '../../../validators/userValidator.js';
import { validUser } from '../../fixtures/testData.js';

describe('userValidator', () => {
    describe('newUserSchema', () => {
        it('should accept valid user data', async () => {
            const result = await newUserSchema.validateAsync(validUser);
            expect(result.email).toBe(validUser.email);
            expect(result.fullName).toBe(validUser.fullName);
        });

        describe('fullName validation', () => {
            it('should reject fullName shorter than 3 characters', async () => {
                const data = { ...validUser, fullName: 'Jo' };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });

            it('should reject fullName longer than 30 characters', async () => {
                const data = { ...validUser, fullName: 'a'.repeat(31) };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });

            it('should reject missing fullName', async () => {
                const { fullName, ...data } = validUser;
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });
        });

        describe('city validation', () => {
            it('should reject city shorter than 2 characters', async () => {
                const data = { ...validUser, city: 'A' };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });

            it('should reject city longer than 50 characters', async () => {
                const data = { ...validUser, city: 'a'.repeat(51) };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });
        });

        describe('phoneNumber validation', () => {
            it('should accept valid phone number formats', async () => {
                const validPhones = ['+381601234567', '060-123-456', '(060) 123 456'];
                for (const phone of validPhones) {
                    const data = { ...validUser, phoneNumber: phone };
                    const result = await newUserSchema.validateAsync(data);
                    expect(result.phoneNumber).toBe(phone);
                }
            });

            it('should reject invalid phone number format', async () => {
                const data = { ...validUser, phoneNumber: 'abc' };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });
        });

        describe('email validation', () => {
            it('should reject invalid email', async () => {
                const data = { ...validUser, email: 'not-an-email' };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });
        });

        describe('password validation', () => {
            it('should reject password shorter than 5 characters', async () => {
                const data = { ...validUser, password: '1234' };
                await expect(newUserSchema.validateAsync(data)).rejects.toThrow();
            });
        });

        describe('multiple validation errors', () => {
            it('should collect all validation errors with abortEarly: false', async () => {
                const data = {
                    fullName: 'Jo',
                    city: 'A',
                    phoneNumber: 'abc',
                    email: 'invalid',
                    password: '123'
                };
                try {
                    await newUserSchema.validateAsync(data);
                } catch (err) {
                    expect(err.details.length).toBeGreaterThan(1);
                }
            });
        });
    });
});
