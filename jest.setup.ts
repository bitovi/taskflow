// Jest setup: configure testing-library or global mocks here
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder as any;
(global as any).TextDecoder = TextDecoder;

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Poppins: () => ({ className: 'mocked-poppins' }),
}));

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
