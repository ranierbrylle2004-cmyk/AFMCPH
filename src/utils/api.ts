// Use local development server or production Cloudflare Workers URL
const API_BASE = 'http://localhost:8787/api';  // Local Wrangler dev server

export const api = {
  // User operations
  register: async (userData: any) => {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE}/users/${id}`);
    return response.json();
  },

  // Booking operations
  getBookings: async () => {
    const response = await fetch(`${API_BASE}/bookings`);
    return response.json();
  },

  getUserBookings: async (userId: string) => {
    const response = await fetch(`${API_BASE}/bookings/user/${userId}`);
    return response.json();
  },

  createBooking: async (bookingData: any) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  updateBooking: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  deleteBooking: async (id: string) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Post operations
  getPosts: async () => {
    const response = await fetch(`${API_BASE}/posts`);
    return response.json();
  },

  createPost: async (postData: any) => {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  updatePost: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};