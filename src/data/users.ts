import { User } from '../types';

// Test users for development
export const users: User[] = [
  {
    id: 'client123',
    email: 'client@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'client',
    language: 'en',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'admin123',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    language: 'en',
    createdAt: '2024-03-01T00:00:00Z'
  }
];

// Test credentials (in a real app, passwords would be hashed)
export const testCredentials = {
  client: {
    email: 'client@example.com',
    password: 'Client123!'
  },
  admin: {
    email: 'admin@example.com',
    password: 'Admin123!'
  }
};