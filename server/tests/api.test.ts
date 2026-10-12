import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Craigslist Redesign API Suite', () => {
  let authToken = '';
  let secondUserToken = '';
  let createdListingId = '';
  let conversationId = '';

  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/categories should return top-level categories with subcategories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
    expect(res.body.categories[0]).toHaveProperty('name');
    expect(res.body.categories[0]).toHaveProperty('children');
  });

  it('GET /api/locations/search should find cities', async () => {
    const res = await request(app).get('/api/locations/search?q=San');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.locations)).toBe(true);
    expect(res.body.locations.length).toBeGreaterThan(0);
  });

  describe('Authentication & Authorization', () => {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    it('POST /api/auth/register should create a new user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Test User Alpha',
          email: testEmail,
          password: testPassword,
          phone: '(555) 000-1111',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testEmail);
      authToken = res.body.token;
    });

    it('POST /api/auth/register should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Duplicate User',
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(409);
    });

    it('POST /api/auth/login should authenticate user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testEmail);
    });

    it('POST /api/auth/login should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
    });

    it('GET /api/auth/me should return profile with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testEmail);
    });

    it('GET /api/auth/me should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    // Create a second user for ownership and messaging security tests
    it('Register a second user for permission checks', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Second User Beta',
          email: `beta_${Date.now()}@example.com`,
          password: testPassword,
        });
      expect(res.status).toBe(201);
      secondUserToken = res.body.token;
    });
  });

  describe('Listings, Search & Filtering', () => {
    it('GET /api/listings should return paginated listings', async () => {
      const res = await request(app).get('/api/listings?limit=5');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.limit).toBe(5);
    });

    it('GET /api/listings with keyword search should filter correctly', async () => {
      const res = await request(app).get('/api/listings?q=Toyota');
      expect(res.status).toBe(200);
      expect(res.body.listings.length).toBeGreaterThanOrEqual(1);
      expect(res.body.listings[0].title).toContain('Toyota');
    });

    it('GET /api/listings with price filtering', async () => {
      const res = await request(app).get('/api/listings?minPrice=2000&maxPrice=3000');
      expect(res.status).toBe(200);
      for (const item of res.body.listings) {
        expect(item.price).toBeGreaterThanOrEqual(2000);
        expect(item.price).toBeLessThanOrEqual(3000);
      }
    });

    it('POST /api/listings should create a listing when authorized', async () => {
      // First get a category ID
      const catRes = await request(app).get('/api/categories');
      const categoryId = catRes.body.categories[0].id;

      const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Brand New Mechanical Keyboard with RGB',
          description: 'Custom built 75% hot-swappable mechanical keyboard with lubricated switches.',
          categoryId,
          price: 120,
          locationName: 'San Francisco, CA',
          condition: 'New',
          images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'],
        });

      expect(res.status).toBe(201);
      expect(res.body.listing).toBeDefined();
      expect(res.body.listing.title).toBe('Brand New Mechanical Keyboard with RGB');
      createdListingId = res.body.listing.id;
    });

    it('PATCH /api/listings/:id should reject update from non-owner (Security test)', async () => {
      const res = await request(app)
        .patch(`/api/listings/${createdListingId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ title: 'Hacked Title Attempt' });

      expect(res.status).toBe(403);
    });

    it('PATCH /api/listings/:id should permit update by actual owner', async () => {
      const res = await request(app)
        .patch(`/api/listings/${createdListingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 110, condition: 'Like New' });

      expect(res.status).toBe(200);
      expect(res.body.listing.price).toBe(110);
    });
  });

  describe('Favorites Workflow', () => {
    it('POST /api/favorites/:id should add listing to favorites', async () => {
      const res = await request(app)
        .post(`/api/favorites/${createdListingId}`)
        .set('Authorization', `Bearer ${secondUserToken}`);

      expect(res.status).toBe(201);
    });

    it('GET /api/favorites should retrieve user saved listings', async () => {
      const res = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${secondUserToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.listings.some((l: any) => l.id === createdListingId)).toBe(true);
    });

    it('DELETE /api/favorites/:id should remove listing from favorites', async () => {
      const res = await request(app)
        .delete(`/api/favorites/${createdListingId}`)
        .set('Authorization', `Bearer ${secondUserToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Conversations, Privacy & Messaging', () => {
    it('POST /api/conversations should allow buyer to message seller', async () => {
      // Find seller ID of createdListingId
      const listingRes = await request(app).get(`/api/listings/${createdListingId}`);
      const sellerId = listingRes.body.listing.owner.id;

      const res = await request(app)
        .post('/api/conversations')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({
          listingId: createdListingId,
          recipientId: sellerId,
          initialMessage: 'Hi, is this mechanical keyboard still available?',
        });

      expect(res.status).toBe(201);
      expect(res.body.conversation).toBeDefined();
      conversationId = res.body.conversation.id;
    });

    it('GET /api/conversations/:id/messages should reject non-participant third user (Security)', async () => {
      // Register a third unrelated user
      const thirdRes = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Unrelated Third Party',
          email: `third_${Date.now()}@example.com`,
          password: 'Password123!',
        });
      const thirdToken = thirdRes.body.token;

      const res = await request(app)
        .get(`/api/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${thirdToken}`);

      expect(res.status).toBe(403);
    });

    it('GET /api/conversations/:id/messages should allow participant to view messages', async () => {
      const res = await request(app)
        .get(`/api/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${authToken}`); // Seller

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.messages)).toBe(true);
      expect(res.body.messages.length).toBe(1);
    });

    it('POST /api/conversations/:id/messages should allow sending reply', async () => {
      const res = await request(app)
        .post(`/api/conversations/${conversationId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Yes, it is still available!' });

      expect(res.status).toBe(201);
      expect(res.body.message.content).toBe('Yes, it is still available!');
    });
  });

  describe('Trust & Safety', () => {
    it('POST /api/reports should submit a listing report', async () => {
      const res = await request(app)
        .post('/api/reports')
        .send({
          listingId: createdListingId,
          reason: 'Spam or Duplicate',
          details: 'Listing appears to be repeated multiple times.',
        });

      expect(res.status).toBe(201);
      expect(res.body.reportId).toBeDefined();
    });
  });
});
