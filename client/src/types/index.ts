export interface User {
  id: string;
  email: string;
  displayName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  status: string;
  createdAt: string;
  _count?: {
    listings?: number;
    favorites?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  parentId?: string | null;
  displayOrder: number;
  parent?: Category | null;
  children?: Category[];
  _count?: {
    listings?: number;
  };
}

export interface LocationItem {
  id: string;
  city: string;
  state: string;
  metro: string;
  zipCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  isPopular: boolean;
  distanceMiles?: number;
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  displayOrder: number;
}

export interface Listing {
  id: string;
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  price?: number | null;
  isNegotiable: boolean;
  isFree: boolean;
  currency: string;
  locationName: string;
  zipCode?: string | null;
  status: 'ACTIVE' | 'SOLD' | 'INACTIVE';
  condition?: string | null;
  attributes?: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  owner: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    email?: string;
    bio?: string | null;
    createdAt?: string;
    _count?: {
      listings?: number;
    };
  };
  images: ListingImage[];
  isFavorited?: boolean;
  favoriteCount?: number;
  _count?: {
    favorites?: number;
    reports?: number;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

export interface Conversation {
  id: string;
  listingId?: string | null;
  starterId?: string;
  recipientId?: string;
  starter?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  recipient?: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  listing?: {
    id: string;
    title: string;
    price?: number | null;
    status: string;
    images?: ListingImage[];
  } | null;
  otherUser: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  lastMessage?: Message | null;
  unreadCount?: number;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
