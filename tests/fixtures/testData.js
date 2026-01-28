export const validUser = {
    fullName: 'John Doe',
    city: 'Belgrade',
    phoneNumber: '+381601234567',
    email: 'john.doe@example.com',
    password: 'password123'
};

export const validCredentials = {
    email: 'john.doe@example.com',
    password: 'password123'
};

export const invalidCredentials = {
    email: 'invalid-email',
    password: '123'
};

export const createTestUser = (overrides = {}) => ({
    ...validUser,
    email: `test-${Date.now()}@example.com`,
    ...overrides
});
