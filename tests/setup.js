import dotenv from 'dotenv';
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

dotenv.config({ path: '.env.test' });

if (!process.env.JWT_SECRET)
    process.env.JWT_SECRET = 'test-q-key-for-testing';

beforeAll(async () => {
    
});

afterAll(async () => {
    
});

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    
});
