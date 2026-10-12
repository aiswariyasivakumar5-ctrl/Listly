import { User, Category, LocationItem, Listing, Conversation, Message, Pagination } from '../types';

const API_ROOT = import.meta.env.VITE_API_URL || '';
const BASE_URL = `${API_ROOT}/api`;

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected error occurred. Please try again.');
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: { email: string; password: string; displayName: string; phone?: string }) =>
    request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  logout: () => {
    setAuthToken(null);
    return request<{ message: string }>('/auth/logout', { method: 'POST' });
  },

  forgotPassword: (email: string) =>
    request<{ message: string; resetToken?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: { token: string; newPassword: string }) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateProfile: (body: { displayName?: string; phone?: string; bio?: string; avatarUrl?: string }) =>
    request<{ user: User }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // Categories
  getCategories: () => request<{ categories: Category[] }>('/categories'),
  getCategoryBySlug: (slug: string) => request<{ category: Category }>(`/categories/${slug}`),

  // Locations
  searchLocations: (q = '') => request<{ locations: LocationItem[] }>(`/locations/search?q=${encodeURIComponent(q)}`),
  getPopularLocations: () => request<{ locations: LocationItem[] }>('/locations/popular'),
  getNearbyLocations: (lat: number, lng: number) =>
    request<{ locations: (LocationItem & { distanceMiles: number })[] }>(`/locations/nearby?lat=${lat}&lng=${lng}`),

  // Listings
  getListings: (params: {
    q?: string;
    category?: string;
    location?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    condition?: string;
    isFree?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return request<{ listings: Listing[]; pagination: Pagination }>(`/listings?${query.toString()}`);
  },

  getListing: (id: string) => request<{ listing: Listing }>(`/listings/${id}`),

  createListing: (data: any) =>
    request<{ listing: Listing }>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateListing: (id: string, data: any) =>
    request<{ listing: Listing }>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteListing: (id: string) =>
    request<{ message: string }>(`/listings/${id}`, {
      method: 'DELETE',
    }),

  getMyListings: () => request<{ listings: Listing[] }>('/listings/user/me'),

  // Favorites
  getFavorites: () => request<{ listings: Listing[] }>('/favorites'),
  addFavorite: (listingId: string) => request<{ message: string }>(`/favorites/${listingId}`, { method: 'POST' }),
  removeFavorite: (listingId: string) => request<{ message: string }>(`/favorites/${listingId}`, { method: 'DELETE' }),

  // Messaging & Conversations
  getConversations: () => request<{ conversations: Conversation[] }>('/conversations'),
  startConversation: (body: { listingId?: string; recipientId: string; initialMessage?: string }) =>
    request<{ conversation: Conversation }>('/conversations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getMessages: (conversationId: string) =>
    request<{ conversation: Conversation; otherUser: any; messages: Message[] }>(
      `/conversations/${conversationId}/messages`
    ),
  sendMessage: (conversationId: string, content: string) =>
    request<{ message: Message }>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Upload image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ url: string; filename: string }>('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Report
  submitReport: (body: { listingId: string; reason: string; details?: string }) =>
    request<{ message: string; reportId: string }>('/reports', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
