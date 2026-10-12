import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Craigslist Modern - End-to-End Workflows Validation', () => {
  let buyerToken = '';
  let buyerUser: any;
  let sellerToken = '';
  let sellerUser: any;
  let intruderToken = '';

  let newListingId = '';
  let sharedConvoId = '';

  // Setup test users
  it('Setup: Register Buyer, Seller, and Intruder', async () => {
    const timestamp = Date.now();

    const buyerRes = await request(app).post('/api/auth/register').send({
      displayName: 'Alice Buyer',
      email: `alice_${timestamp}@test.com`,
      password: 'Password123!',
      phone: '(415) 111-2222',
    });
    expect(buyerRes.status).toBe(201);
    buyerToken = buyerRes.body.token;
    buyerUser = buyerRes.body.user;

    const sellerRes = await request(app).post('/api/auth/register').send({
      displayName: 'Bob Seller',
      email: `bob_${timestamp}@test.com`,
      password: 'Password123!',
      phone: '(415) 333-4444',
    });
    expect(sellerRes.status).toBe(201);
    sellerToken = sellerRes.body.token;
    sellerUser = sellerRes.body.user;

    const intruderRes = await request(app).post('/api/auth/register').send({
      displayName: 'Mallory Intruder',
      email: `mallory_${timestamp}@test.com`,
      password: 'Password123!',
    });
    expect(intruderRes.status).toBe(201);
    intruderToken = intruderRes.body.token;
  });

  // Workflow A: Find a listing
  describe('Workflow A: Find a listing', () => {
    it('1. Open homepage data: categories and recent listings', async () => {
      const catRes = await request(app).get('/api/categories');
      expect(catRes.status).toBe(200);
      expect(catRes.body.categories.length).toBeGreaterThan(0);

      const recentRes = await request(app).get('/api/listings?limit=8&sort=newest');
      expect(recentRes.status).toBe(200);
      expect(recentRes.body.listings.length).toBeGreaterThan(0);
    });

    it('2. Search locations and pick location', async () => {
      const locRes = await request(app).get('/api/locations/search?q=San Francisco');
      expect(locRes.status).toBe(200);
      expect(locRes.body.locations.length).toBeGreaterThan(0);
      expect(locRes.body.locations[0].city).toBe('San Francisco');
    });

    it('3. Search with keywords and filters', async () => {
      const searchRes = await request(app).get('/api/listings?q=Toyota&location=Mumbai');
      expect(searchRes.status).toBe(200);
      expect(searchRes.body.listings.length).toBeGreaterThanOrEqual(1);
    });

    it('4. Open result and view details', async () => {
      const searchRes = await request(app).get('/api/listings?limit=1');
      const firstId = searchRes.body.listings[0].id;

      const detailRes = await request(app).get(`/api/listings/${firstId}`);
      expect(detailRes.status).toBe(200);
      expect(detailRes.body.listing).toBeDefined();
      expect(detailRes.body.listing.id).toBe(firstId);
      expect(detailRes.body.listing.owner).toBeDefined();
    });
  });

  // Workflow B: Publish a listing
  describe('Workflow B: Publish a listing', () => {
    it('Seller creates a listing', async () => {
      const catRes = await request(app).get('/api/categories');
      const categoryId = catRes.body.categories[0].id;

      const createRes = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Vintage Record Player with Bluetooth',
          description: 'Refurbished 3-speed turntable in solid walnut cabinet. Pristine audio quality.',
          categoryId,
          price: 180,
          isNegotiable: true,
          locationName: 'San Francisco, CA',
          condition: 'Excellent',
          attributes: { brand: 'Audio-Technica', speeds: '33/45/78', woodFinish: 'Walnut' },
          images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'],
        });

      expect(createRes.status).toBe(201);
      newListingId = createRes.body.listing.id;
      expect(createRes.body.listing.title).toBe('Vintage Record Player with Bluetooth');
    });

    it('Confirm newly created listing appears in search', async () => {
      const searchRes = await request(app).get('/api/listings?q=Turntable');
      expect(searchRes.status).toBe(200);
      const found = searchRes.body.listings.some((l: any) => l.id === newListingId);
      expect(found).toBe(true);
    });

    it('Edit the listing from dashboard', async () => {
      const editRes = await request(app)
        .patch(`/api/listings/${newListingId}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          price: 165,
          condition: 'Like New',
        });

      expect(editRes.status).toBe(200);
      expect(editRes.body.listing.price).toBe(165);
      expect(editRes.body.listing.condition).toBe('Like New');
    });
  });

  // Workflow C: Save a listing
  describe('Workflow C: Save a listing', () => {
    it('Buyer favorites the listing', async () => {
      const favRes = await request(app)
        .post(`/api/favorites/${newListingId}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(favRes.status).toBe(201);
    });

    it('Listing appears in saved listings page', async () => {
      const myFavsRes = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(myFavsRes.status).toBe(200);
      const exists = myFavsRes.body.listings.some((l: any) => l.id === newListingId);
      expect(exists).toBe(true);
    });

    it('Buyer removes listing from favorites', async () => {
      const removeRes = await request(app)
        .delete(`/api/favorites/${newListingId}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(removeRes.status).toBe(200);

      const checkRes = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${buyerToken}`);

      const stillExists = checkRes.body.listings.some((l: any) => l.id === newListingId);
      expect(stillExists).toBe(false);
    });
  });

  // Workflow D: Contact a seller
  describe('Workflow D: Contact a seller', () => {
    it('Buyer starts conversation with seller', async () => {
      const convoRes = await request(app)
        .post('/api/conversations')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          listingId: newListingId,
          recipientId: sellerUser.id,
          initialMessage: 'Hi Bob, can I pick up the turntable this evening?',
        });

      expect(convoRes.status).toBe(201);
      sharedConvoId = convoRes.body.conversation.id;
    });

    it('Seller views the conversation and messages', async () => {
      const sellerViewRes = await request(app)
        .get(`/api/conversations/${sharedConvoId}/messages`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(sellerViewRes.status).toBe(200);
      expect(sellerViewRes.body.messages.length).toBe(1);
      expect(sellerViewRes.body.messages[0].content).toContain('turntable');
    });

    it('Seller replies to buyer', async () => {
      const replyRes = await request(app)
        .post(`/api/conversations/${sharedConvoId}/messages`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ content: 'Yes, 6 PM near Mission & 24th works for me!' });

      expect(replyRes.status).toBe(201);
      expect(replyRes.body.message.content).toContain('6 PM');
    });
  });

  // Workflow E: Security & Access Control
  describe('Workflow E: Security & Access Control', () => {
    it('Intruder cannot modify seller listing (403 Forbidden)', async () => {
      const unauthorizedEdit = await request(app)
        .patch(`/api/listings/${newListingId}`)
        .set('Authorization', `Bearer ${intruderToken}`)
        .send({ title: 'Unauthorized Modification' });

      expect(unauthorizedEdit.status).toBe(403);
    });

    it('Intruder cannot access buyer-seller conversation (403 Forbidden)', async () => {
      const snoopingRes = await request(app)
        .get(`/api/conversations/${sharedConvoId}/messages`)
        .set('Authorization', `Bearer ${intruderToken}`);

      expect(snoopingRes.status).toBe(403);
    });

    it('Unauthenticated request to protected route is rejected (401 Unauthorized)', async () => {
      const unauthedRes = await request(app).get('/api/users/me');
      expect(unauthedRes.status).toBe(401);
    });

    it('Server rejects invalid listing submission (400 Bad Request)', async () => {
      const invalidRes = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ title: 'ab' }); // Too short, missing category, etc.

      expect(invalidRes.status).toBe(400);
    });
  });
});
