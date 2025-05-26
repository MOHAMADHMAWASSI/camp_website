export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin';
  language: 'en' | 'fr';
  createdAt: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  language: 'en' | 'fr';
}