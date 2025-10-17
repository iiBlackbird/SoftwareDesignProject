// This assumes your backend is running on http://localhost:3000
// In a real app, this URL should come from an environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const signUp = async (fullName, email, password) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to sign up');
  }

  return res.json();
};

export const signIn = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to sign in');
  }

  return res.json();
};

export const verifyEmail = async (token) => {
  const res = await fetch(`${API_URL}/auth/verify-email?token=${token}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to verify email');
  }

  return data;
};