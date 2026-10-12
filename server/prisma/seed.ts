import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.report.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.listingImage.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.passwordReset.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding locations...');
  const locations = [
    { city: 'Bengaluru', state: 'Karnataka', metro: 'Bengaluru Urban', zipCode: '560001', lat: 12.9716, lng: 77.5946, isPopular: true },
    { city: 'Mumbai', state: 'Maharashtra', metro: 'MMR', zipCode: '400001', lat: 19.0760, lng: 72.8777, isPopular: true },
    { city: 'Delhi NCR', state: 'Delhi', metro: 'National Capital Region', zipCode: '110001', lat: 28.6139, lng: 77.2090, isPopular: true },
    { city: 'Hyderabad', state: 'Telangana', metro: 'Greater Hyderabad', zipCode: '500001', lat: 17.3850, lng: 78.4867, isPopular: true },
    { city: 'Chennai', state: 'Tamil Nadu', metro: 'Chennai Metropolitan', zipCode: '600001', lat: 13.0827, lng: 80.2707, isPopular: true },
    { city: 'Pune', state: 'Maharashtra', metro: 'Pune Metro', zipCode: '411001', lat: 18.5204, lng: 73.8567, isPopular: true },
    { city: 'Kolkata', state: 'West Bengal', metro: 'Kolkata Metro', zipCode: '700001', lat: 22.5726, lng: 88.3639, isPopular: true },
    { city: 'Ahmedabad', state: 'Gujarat', metro: 'Ahmedabad Urban', zipCode: '380001', lat: 23.0225, lng: 72.5714, isPopular: true },
    { city: 'Jaipur', state: 'Rajasthan', metro: 'Jaipur District', zipCode: '302001', lat: 26.9124, lng: 75.7873, isPopular: true },
    { city: 'Kochi', state: 'Kerala', metro: 'Ernakulam', zipCode: '682001', lat: 9.9312, lng: 76.2673, isPopular: true },
    { city: 'Chandigarh', state: 'Punjab', metro: 'Tricity', zipCode: '160017', lat: 30.7333, lng: 76.7794, isPopular: true },
    { city: 'Lucknow', state: 'Uttar Pradesh', metro: 'Lucknow Metro', zipCode: '226001', lat: 26.8467, lng: 80.9462, isPopular: true },
    { city: 'Indore', state: 'Madhya Pradesh', metro: 'Indore Metro', zipCode: '452001', lat: 22.7196, lng: 75.8577, isPopular: true },
    { city: 'Coimbatore', state: 'Tamil Nadu', metro: 'Coimbatore Urban', zipCode: '641001', lat: 11.0168, lng: 76.9558, isPopular: true },
    { city: 'Goa', state: 'Goa', metro: 'North Goa', zipCode: '403001', lat: 15.4909, lng: 73.8278, isPopular: true },
    { city: 'San Francisco', state: 'CA', metro: 'Bay Area', zipCode: '94102', lat: 37.7749, lng: -122.4194, isPopular: false },
  ];

  for (const loc of locations) {
    await prisma.location.create({ data: loc });
  }

  console.log('Seeding categories...');
  const categoryDefs = [
    {
      name: 'Housing',
      slug: 'housing',
      icon: 'Home',
      description: 'Apartments for rent, rooms, sublets, vacation rentals, and real estate for sale.',
      displayOrder: 1,
      subs: [
        { name: 'Apartments for Rent', slug: 'housing-apartments' },
        { name: 'Rooms & Shared Housing', slug: 'housing-rooms' },
        { name: 'Sublets & Temporary', slug: 'housing-sublets' },
        { name: 'Vacation Rentals', slug: 'housing-vacation' },
        { name: 'Real Estate for Sale', slug: 'housing-real-estate' },
        { name: 'Commercial & Office Space', slug: 'housing-commercial' },
      ],
    },
    {
      name: 'Jobs',
      slug: 'jobs',
      icon: 'Briefcase',
      description: 'Full-time, part-time and contract roles across many industries.',
      displayOrder: 2,
      subs: [
        { name: 'Full-Time Roles', slug: 'jobs-full-time' },
        { name: 'Part-Time & Flex Roles', slug: 'jobs-part-time' },
        { name: 'Contract & Freelance', slug: 'jobs-contract' },
        { name: 'Software & Technology', slug: 'jobs-software' },
        { name: 'Healthcare & Nursing', slug: 'jobs-healthcare' },
        { name: 'Marketing, PR & Design', slug: 'jobs-marketing' },
        { name: 'Customer Service & Support', slug: 'jobs-customer-service' },
        { name: 'General Labor & Skilled Trades', slug: 'jobs-labor' },
      ],
    },
    {
      name: 'For Sale',
      slug: 'for-sale',
      icon: 'ShoppingBag',
      description: 'Used goods like furniture, electronics, vehicles, appliances and collectibles.',
      displayOrder: 3,
      subs: [
        { name: 'Furniture & Home Decor', slug: 'for-sale-furniture' },
        { name: 'Electronics & Computers', slug: 'for-sale-electronics' },
        { name: 'Vehicles, Cars & Bikes', slug: 'for-sale-vehicles' },
        { name: 'Cars & Trucks - By Owner', slug: 'vehicles-cars-owner' },
        { name: 'Motorcycles & Scooters', slug: 'vehicles-motorcycles' },
        { name: 'Appliances', slug: 'for-sale-appliances' },
        { name: 'Antiques & Collectibles', slug: 'for-sale-antiques' },
        { name: 'Sporting Goods & Bicycles', slug: 'for-sale-sports' },
      ],
    },
    {
      name: 'Services',
      slug: 'services',
      icon: 'Wrench',
      description: 'Things like movers, tutors, repair, beauty and computer help.',
      displayOrder: 4,
      subs: [
        { name: 'Movers & Packers', slug: 'services-movers' },
        { name: 'Tutors & Lessons', slug: 'services-tutors' },
        { name: 'Repair & Handyman', slug: 'services-repair' },
        { name: 'Beauty & Wellness', slug: 'services-beauty' },
        { name: 'Computer & Tech Help', slug: 'services-tech' },
        { name: 'Automotive Services', slug: 'services-auto' },
        { name: 'Home Improvement', slug: 'services-home' },
      ],
    },
    {
      name: 'Gigs',
      slug: 'gigs',
      icon: 'Zap',
      description: 'Short-term or one-off paid tasks and quick assignments.',
      displayOrder: 5,
      subs: [
        { name: 'One-Off Paid Tasks', slug: 'gigs-tasks' },
        { name: 'Computer & Creative Gigs', slug: 'gigs-computer' },
        { name: 'Event & Hospitality Gigs', slug: 'gigs-event' },
        { name: 'Labor & Moving Gigs', slug: 'gigs-labor' },
      ],
    },
    {
      name: 'Community',
      slug: 'community',
      icon: 'Users',
      description: 'Events, activities, lost and found, groups, and local news.',
      displayOrder: 6,
      subs: [
        { name: 'Events & Activities', slug: 'community-events' },
        { name: 'Activities & Meetups', slug: 'community-activities' },
        { name: 'Lost and Found', slug: 'community-lost-found' },
        { name: 'Community Groups', slug: 'community-groups' },
        { name: 'Local News & Announcements', slug: 'community-news' },
        { name: 'Volunteers & Nonprofits', slug: 'community-volunteers' },
      ],
    },
    {
      name: 'Resumes',
      slug: 'resumes',
      icon: 'FileText',
      description: 'Job seekers posting their profiles for employers to find.',
      displayOrder: 7,
      subs: [
        { name: 'Tech, IT & Engineering', slug: 'resumes-tech' },
        { name: 'Marketing & Sales Profiles', slug: 'resumes-marketing' },
        { name: 'Administration & Office', slug: 'resumes-admin' },
        { name: 'Creative & Design Portfolios', slug: 'resumes-creative' },
        { name: 'Skilled Trades & Operations', slug: 'resumes-trades' },
      ],
    },
    {
      name: 'Discussion Forums',
      slug: 'forums',
      icon: 'MessageSquare',
      description: 'Topic-based message boards for community chat, advice, and recommendations.',
      displayOrder: 8,
      subs: [
        { name: 'Housing & Flatmates Board', slug: 'forums-housing' },
        { name: 'Tech, Jobs & Careers Board', slug: 'forums-careers' },
        { name: 'Buy, Sell & Barter Advice', slug: 'forums-buy-sell' },
        { name: 'City Hangouts & Local Meetups', slug: 'forums-city-chat' },
        { name: 'General Discussion & Community', slug: 'forums-general' },
      ],
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoryDefs) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
    });
    categoryMap.set(cat.slug, parent.id);

    for (let i = 0; i < cat.subs.length; i++) {
      const sub = cat.subs[i];
      const child = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          parentId: parent.id,
          displayOrder: i + 1,
        },
      });
      categoryMap.set(sub.slug, child.id);
    }
  }
  categoryMap.set('vehicles', categoryMap.get('for-sale')!);

  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.create({
    data: {
      displayName: 'Alex Mercer',
      email: 'demo@example.com',
      passwordHash,
      phone: '+91 98450 12345',
      bio: 'Tech lead & avid cyclist in Bengaluru.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  });

  const sarahUser = await prisma.user.create({
    data: {
      displayName: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      passwordHash,
      phone: '+91 98200 54321',
      bio: 'Property manager and interior decorator in Indiranagar, Bengaluru.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    },
  });

  const marcusUser = await prisma.user.create({
    data: {
      displayName: 'Marcus Johnson',
      email: 'marcus.johnson@example.com',
      passwordHash,
      phone: '+91 98110 98765',
      bio: 'Vintage car restorer and audio hobbyist in Mumbai.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  });

  const elenaUser = await prisma.user.create({
    data: {
      displayName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      passwordHash,
      phone: '+91 97170 33445',
      bio: 'Engineering hiring lead in Delhi NCR.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
  });

  const davidUser = await prisma.user.create({
    data: {
      displayName: 'David Kim',
      email: 'buyer@example.com',
      passwordHash,
      phone: '+91 99800 66778',
      bio: 'Software engineer relocating between Hyderabad and Bengaluru.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
  });

  console.log('Seeding listings...');
  const listingsData = [
    {
      ownerId: sarahUser.id,
      categoryId: categoryMap.get('housing-apartments') || categoryMap.get('housing')!,
      title: 'Modern 1BR / 1BA Flat with Private Balcony in Indiranagar',
      description: 'Sunny top-floor apartment in prime Indiranagar neighborhood. Features hardwood floors throughout, modern modular kitchen with piped gas, dishwasher, quartz countertops, in-unit washer/dryer, and a private 80 sq ft balcony overlooking garden courtyard.\n\nWater and maintenance included. Cats welcome with deposit. Easy walk to 100 Feet Road, metro station, cafes, and vibrant restaurants. Available for 11-month lease.',
      price: 32000,
      isNegotiable: false,
      isFree: false,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      status: 'ACTIVE',
      condition: 'Excellent',
      attributes: JSON.stringify({ bedrooms: 1, bathrooms: 1, sqft: 720, propertyType: 'Apartment', parking: 'Dedicated', pets: 'Cats OK' }),
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: marcusUser.id,
      categoryId: categoryMap.get('vehicles-cars-owner') || categoryMap.get('vehicles')!,
      title: '2021 Toyota RAV4 Hybrid XLE - Low Miles, Clean Title, One Owner',
      description: 'Selling my meticulously maintained 2021 Toyota RAV4 Hybrid AWD. 34,200 km. Silver Sky Metallic with black interior. Complete service record available at authorized dealership in Bandra West.\n\nEquipped with Convenience Package (smart key, power liftgate, moonroof), blind-spot monitor, Apple CarPlay / Android Auto, and all-weather floor liners. Asking ₹24,50,000 OBO.',
      price: 2450000,
      isNegotiable: true,
      isFree: false,
      locationName: 'Mumbai, Maharashtra',
      zipCode: '400050',
      lat: 19.0596,
      lng: 72.8295,
      status: 'ACTIVE',
      condition: 'Excellent',
      attributes: JSON.stringify({ make: 'Toyota', model: 'RAV4 Hybrid', year: 2021, mileage: 34200, transmission: 'Automatic', fuel: 'Hybrid', titleStatus: 'Clean' }),
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: elenaUser.id,
      categoryId: categoryMap.get('jobs-software') || categoryMap.get('jobs')!,
      title: 'Senior Full Stack Engineer (React / TypeScript / Node.js)',
      description: 'Fast-growing climate tech venture based in Koramangala is seeking a Senior Full Stack Software Engineer. We build intuitive consumer & enterprise platforms helping businesses measure and eliminate carbon footprints.\n\nRole & Responsibilities:\n- Architect modular frontend interfaces using React, Vite, and Tailwind\n- Build high-throughput REST APIs with Node.js and PostgreSQL\n- Collaborate with product designers and domain scientists\n\nCompensation & Benefits:\n- Competitive salary package + equity\n- Comprehensive health insurance\n- Flexible hybrid schedule (Koramangala office / remote)\n- Annual learning stipend',
      price: 3200000,
      isNegotiable: false,
      isFree: false,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560034',
      lat: 12.9352,
      lng: 77.6245,
      status: 'ACTIVE',
      condition: 'New',
      attributes: JSON.stringify({ jobType: 'Full-time', workplace: 'Hybrid', compensation: '₹28L - ₹38L CTC', experienceLevel: 'Senior', industry: 'Climate Tech / SaaS' }),
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: demoUser.id,
      categoryId: categoryMap.get('for-sale-electronics') || categoryMap.get('for-sale')!,
      title: 'Apple MacBook Pro 16" M2 Pro (32GB RAM / 1TB SSD) - Space Gray',
      description: 'Like-new MacBook Pro 16-inch with Apple M2 Pro chip (12-core CPU, 19-core GPU). Upgraded to 32GB unified memory and 1TB ultra-fast NVMe storage. Pristine cosmetic condition with zero scratches or dents.\n\nBattery health is at 96% with only 48 cycles. Includes original 140W USB-C power adapter, MagSafe 3 braided cable, and original retail box. Reset to factory settings with clean macOS installed. Local pickup in HSR Layout.',
      price: 165000,
      isNegotiable: true,
      isFree: false,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560102',
      lat: 12.9121,
      lng: 77.6446,
      status: 'ACTIVE',
      condition: 'Like New',
      attributes: JSON.stringify({ brand: 'Apple', model: 'MacBook Pro 16 M2 Pro', memory: '32GB', storage: '1TB SSD', warranty: 'AppleCare+ eligible' }),
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: sarahUser.id,
      categoryId: categoryMap.get('for-sale-furniture') || categoryMap.get('for-sale')!,
      title: 'Herman Miller Aeron Chair (Size B, Fully Loaded with PostureFit SL)',
      description: 'Authentic Herman Miller Aeron ergonomic desk chair in Graphite finish. Size B (Medium). Fully loaded with PostureFit SL lumbar support, height and depth-adjustable leather arms, tilt limiter, and forward angle tilt control.\n\nBought 18 months ago for home office. Mesh is tight and immaculate, hydraulics smooth as new. Retails over ₹1,30,000 new. Asking ₹55,000. Pickup near Whitefield.',
      price: 55000,
      isNegotiable: false,
      isFree: false,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560066',
      lat: 12.9698,
      lng: 77.7500,
      status: 'ACTIVE',
      condition: 'Like New',
      attributes: JSON.stringify({ brand: 'Herman Miller', model: 'Aeron Size B', color: 'Graphite', ergonomic: 'Yes' }),
      images: [
        'https://images.unsplash.com/photo-1580481077195-c26c04f4ec13?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: marcusUser.id,
      categoryId: categoryMap.get('for-sale-instruments') || categoryMap.get('for-sale')!,
      title: 'Fender American Professional II Stratocaster - Olympic White / Rosewood',
      description: '2022 Fender American Pro II Stratocaster in timeless Olympic White with mint pickguard and rosewood fretboard. Deep "C" neck shape with rolled fingerboard edges, V-Mod II single-coil pickups, and push-push switch to add neck pickup to positions 1 and 2.\n\nSetup with fresh strings. Flawless tone and action. Comes with Fender Deluxe molded hardshell flight case and certificate of authenticity.',
      price: 98000,
      isNegotiable: true,
      isFree: false,
      locationName: 'Pune, Maharashtra',
      zipCode: '411001',
      lat: 18.5362,
      lng: 73.8940,
      status: 'ACTIVE',
      condition: 'Excellent',
      attributes: JSON.stringify({ brand: 'Fender', model: 'American Pro II Stratocaster', year: 2022, countryOfOrigin: 'USA', color: 'Olympic White' }),
      images: [
        'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: davidUser.id,
      categoryId: categoryMap.get('for-sale-sports') || categoryMap.get('for-sale')!,
      title: 'Specialized Diverge Comp Carbon Gravel Bike (54cm)',
      description: 'Specialized Diverge Comp gravel road bike. Size 54cm. Features Future Shock 2.0 front suspension cartridge to soak up bumps on rough trails, Shimano GRX 810 1x11 drivetrain, and hydraulic disc brakes.\n\nTubeless Pathfinder Pro 38mm tires. Well cared for and cleaned after every ride. Pickup in Delhi near Connaught Place.',
      price: 145000,
      isNegotiable: true,
      isFree: false,
      locationName: 'Delhi NCR, Delhi',
      zipCode: '110001',
      lat: 28.6304,
      lng: 77.2177,
      status: 'ACTIVE',
      condition: 'Good',
      attributes: JSON.stringify({ brand: 'Specialized', model: 'Diverge Comp', frameSize: '54cm', frameMaterial: 'Carbon', wheelSize: '700c' }),
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: marcusUser.id,
      categoryId: categoryMap.get('services-home') || categoryMap.get('services')!,
      title: 'Master Craftsman Handyman & Custom Carpentry Services',
      description: 'Licensed & insured local craftsman with over 15 years experience in fine home remodeling and repair.\n\nServices offered:\n- Custom shelving, finish trim & cabinetry\n- Drywall repair and interior painting\n- Door and window replacement & weatherstripping\n- Light fixture, ceiling fan, and dimmer switch installation\n\nServing Jubilee Hills, Banjara Hills, and Gachibowli. Free estimates within 24 hours.',
      price: null,
      isNegotiable: true,
      isFree: false,
      locationName: 'Hyderabad, Telangana',
      zipCode: '500033',
      lat: 17.4326,
      lng: 78.4071,
      status: 'ACTIVE',
      condition: 'New',
      attributes: JSON.stringify({ serviceType: 'Carpentry & Handyman', licensed: 'Yes', insured: 'Yes', hourlyRate: '₹600/hr' }),
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: elenaUser.id,
      categoryId: categoryMap.get('housing-rooms') || categoryMap.get('housing')!,
      title: 'Spacious Furnished Bedroom in High-Rise (Powai, Lake View)',
      description: 'Subletting a sun-drenched private room in our 3-bedroom, 2-bathroom apartment in prime Powai near Hiranandani gardens. High floor with scenic lake view, gym, and swimming pool access.\n\nRoom comes furnished with queen platform bed, wardrobe, and study desk. Sharing space with friendly IT professionals.',
      price: 26000,
      isNegotiable: false,
      isFree: false,
      locationName: 'Mumbai, Maharashtra',
      zipCode: '400076',
      lat: 19.1176,
      lng: 72.9060,
      status: 'ACTIVE',
      condition: 'Excellent',
      attributes: JSON.stringify({ roomType: 'Private Room', bathrooms: 2, roommates: 2, furnished: 'Yes', laundry: 'In-Building' }),
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: sarahUser.id,
      categoryId: categoryMap.get('community-lost-found') || categoryMap.get('community')!,
      title: 'FOUND: Golden Retriever Mix near Cubbon Park (Blue Collar)',
      description: 'Found this friendly, well-behaved golden retriever mix today around 4:30 PM near the south trail of Cubbon Park. Wearing a blue nylon collar without tags. Very gentle, knows "sit" and "paw".\n\nCurrently safe at home with water and food. Please reach out with proof of ownership or photo!',
      price: 0,
      isNegotiable: false,
      isFree: true,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560001',
      lat: 12.9763,
      lng: 77.5929,
      status: 'ACTIVE',
      condition: 'Good',
      attributes: JSON.stringify({ petType: 'Dog', breed: 'Golden Retriever Mix', color: 'Golden / Tan', collar: 'Blue nylon' }),
      images: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: demoUser.id,
      categoryId: categoryMap.get('gigs-computer') || categoryMap.get('gigs')!,
      title: 'Need React & Tailwind Help: Responsive Dashboard Debugging',
      description: 'Seeking an experienced React developer for a 4-hour evening pairing gig. We have a dashboard layout that needs mobile drawer navigation fixes and Tailwind CSS breakpoint refinements.\n\nMust know React 18, Vite, and modern CSS. Rate is ₹1,500/hr. Remote over Google Meet.',
      price: 6000,
      isNegotiable: false,
      isFree: false,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560100',
      lat: 12.9279,
      lng: 77.6271,
      status: 'ACTIVE',
      condition: 'New',
      attributes: JSON.stringify({ gigType: 'Coding / Tech', duration: '4 Hours', compensation: '₹1,500/hr transfer', remote: 'Yes' }),
      images: [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: marcusUser.id,
      categoryId: categoryMap.get('vehicles-motorcycles') || categoryMap.get('vehicles')!,
      title: '2022 Royal Enfield Interceptor 650 (Baker Express) - Mint Condition, 6,200 km',
      description: 'Up for sale is my 2022 Royal Enfield Interceptor 650 in Baker Express dual-tone scheme. Super nimble, 648cc parallel-twin engine with smooth power delivery and signature exhaust note.\n\nAlways garaged and serviced strictly at authorized service center in Anna Nagar. Upgraded touring seat, engine guard, and sump guard. Clean Tamil Nadu registration (TN-02). Inspection welcome.',
      price: 265000,
      isNegotiable: true,
      isFree: false,
      locationName: 'Chennai, Tamil Nadu',
      zipCode: '600040',
      lat: 13.0850,
      lng: 80.2100,
      status: 'ACTIVE',
      condition: 'Excellent',
      attributes: JSON.stringify({ make: 'Royal Enfield', model: 'Interceptor 650', year: 2022, mileage: 6200, engineSize: '648cc', titleStatus: 'Clean' }),
      images: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: demoUser.id,
      categoryId: categoryMap.get('resumes-tech') || categoryMap.get('resumes')!,
      title: 'Senior Full-Stack Engineer (React, TypeScript, Node.js) - 7 Yrs Exp',
      description: 'Senior Software Engineer with 7 years of hands-on experience building resilient microservices, modern single-page web apps, and distributed data pipelines.\n\nKey skills: TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS. Seeking high-impact contract or full-time remote roles based out of Bengaluru.',
      price: null,
      isNegotiable: false,
      isFree: true,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      status: 'ACTIVE',
      condition: 'New',
      attributes: JSON.stringify({ experience: '7 Years', roleType: 'Full-Time / Contract', availability: 'Immediate' }),
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&auto=format&fit=crop&q=80'
      ],
    },
    {
      ownerId: sarahUser.id,
      categoryId: categoryMap.get('forums-housing') || categoryMap.get('forums')!,
      title: '[Discussion] Relocating to Bengaluru: Indiranagar vs Koramangala for walkable commute?',
      description: 'Hey community! Relocating from Pune next month for an engineering role on Outer Ring Road. Wondering how Indiranagar compares to Koramangala in terms of traffic, walkable cafes, reliable water supply, and fiber broadband? Would love any recommendations or broker-free flat leads!',
      price: null,
      isNegotiable: false,
      isFree: true,
      locationName: 'Bengaluru, Karnataka',
      zipCode: '560034',
      lat: 12.9352,
      lng: 77.6245,
      status: 'ACTIVE',
      condition: 'New',
      attributes: JSON.stringify({ board: 'Housing & Flatmates', repliesCount: 14, pinned: true }),
      images: [
        'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop&q=80'
      ],
    }
  ];

  const createdListings = [];
  for (const item of listingsData) {
    const { images, ...listingFields } = item;
    const listing = await prisma.listing.create({
      data: {
        ...listingFields,
        views: Math.floor(Math.random() * 85) + 12,
      },
    });
    createdListings.push(listing);

    for (let idx = 0; idx < images.length; idx++) {
      await prisma.listingImage.create({
        data: {
          listingId: listing.id,
          url: images[idx],
          displayOrder: idx,
        },
      });
    }
  }

  console.log('Seeding favorites...');
  // Alex Mercer saved the Mission Flat and the Toyota RAV4
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      listingId: createdListings[0].id,
    },
  });
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      listingId: createdListings[1].id,
    },
  });
  // David Kim saved MacBook Pro
  await prisma.favorite.create({
    data: {
      userId: davidUser.id,
      listingId: createdListings[3].id,
    },
  });

  console.log('Seeding conversations & messages...');
  // David Kim contacts Sarah Chen about the Mission flat
  const convo1 = await prisma.conversation.create({
    data: {
      listingId: createdListings[0].id,
      starterId: davidUser.id,
      recipientId: sarahUser.id,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo1.id,
      senderId: davidUser.id,
      content: 'Hi Sarah! I saw your Mission 1BR listing. Is it still available for a move-in around the 1st of next month?',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo1.id,
      senderId: sarahUser.id,
      content: 'Hello David! Yes, it is available. We are hosting an open walkthrough this Saturday between 11 AM and 1 PM. Would that time work for you?',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo1.id,
      senderId: davidUser.id,
      content: 'That works great! I have my rental application and credit report ready. See you Saturday at 11.',
      isRead: false,
      createdAt: new Date(Date.now() - 1800000),
    },
  });

  // Alex Mercer contacts Marcus Johnson about the Herman Miller Aeron / Fender guitar
  const convo2 = await prisma.conversation.create({
    data: {
      listingId: createdListings[5].id, // Fender guitar
      starterId: demoUser.id,
      recipientId: marcusUser.id,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo2.id,
      senderId: demoUser.id,
      content: 'Hey Marcus, love the Olympic White Strat! Would you be willing to do ₹90,000 if I can pick it up tomorrow in Pune?',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 6),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo2.id,
      senderId: marcusUser.id,
      content: 'Hey Alex! If you can pick up tomorrow afternoon before 4 PM, I can do ₹92,000 even with the hard case included.',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 1),
    },
  });

  console.log('Seeding completed successfully!');
  console.log(`Demo login: demo@example.com / Password123!`);
  console.log(`Sarah login: sarah.chen@example.com / Password123!`);
  console.log(`David login: buyer@example.com / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
