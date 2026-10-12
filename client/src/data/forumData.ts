export interface ForumTopic {
  id: string;
  board: string;
  title: string;
  author: string;
  authorAvatar?: string;
  city: string;
  repliesCount: number;
  viewsCount: number;
  createdAt: string;
  isPinned?: boolean;
  content: string;
  tags: string[];
}

export const INITIAL_TOPICS: ForumTopic[] = [
  {
    id: 'topic-1',
    board: 'Housing & Flatmates',
    title: 'Relocating to Bengaluru: Indiranagar vs Koramangala for walkable tech commute?',
    author: 'Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    city: 'Bengaluru, Karnataka',
    repliesCount: 18,
    viewsCount: 342,
    createdAt: '2 hours ago',
    isPinned: true,
    content:
      'Moving to Bengaluru next month for a senior engineering role on Outer Ring Road. Looking for honest feedback regarding traffic, water reliability, broadband speeds, and walking access to gyms/cafes in Indiranagar compared to Koramangala.',
    tags: ['Housing', 'Rentals', 'Bengaluru'],
  },
  {
    id: 'topic-2',
    board: 'Tech, Jobs & Careers',
    title: 'What are current compensation bands for 5-8 YOE Full-Stack Engineers in Mumbai / Pune?',
    author: 'Vikram Joshi',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    city: 'Mumbai, Maharashtra',
    repliesCount: 29,
    viewsCount: 810,
    createdAt: '5 hours ago',
    isPinned: true,
    content:
      'Negotiating offers across fintech startups and enterprise firms in BKC / Powai. Sharing data points on base + stock for React/Node/Go roles. Would love input from other tech leads.',
    tags: ['Jobs', 'Tech', 'Salaries'],
  },
  {
    id: 'topic-3',
    board: 'Buy, Sell & Barter Advice',
    title: 'Tips for safely inspecting used cars & two-wheelers in Delhi NCR before transfer?',
    author: 'Amit Sharma',
    city: 'Delhi NCR, Delhi',
    repliesCount: 12,
    viewsCount: 195,
    createdAt: '1 day ago',
    content:
      'Planning to purchase a second-hand hatchback from a direct owner on Listly. Any recommended mobile mechanics or RTO NOC verification checklists for Delhi/Gurgaon transfers?',
    tags: ['For Sale', 'Vehicles', 'Safety'],
  },
  {
    id: 'topic-4',
    board: 'City Hangouts & Local Meetups',
    title: 'Weekend Board Game & Tech Meetup in Indiranagar (Sunday 4 PM)',
    author: 'Priya Sundaram',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    city: 'Bengaluru, Karnataka',
    repliesCount: 8,
    viewsCount: 140,
    createdAt: '1 day ago',
    content:
      'Hosting our monthly community meetup for casual board games, chess, and startup brainstorms. All newcomers welcome! RSVP below to join the group.',
    tags: ['Community', 'Meetup', 'BoardGames'],
  },
  {
    id: 'topic-5',
    board: 'General Discussion',
    title: 'Best broadband ISPs for low-latency remote work in Hyderabad (Hitec City area)?',
    author: 'Karthik Reddy',
    city: 'Hyderabad, Telangana',
    repliesCount: 15,
    viewsCount: 220,
    createdAt: '2 days ago',
    content:
      'Act Fibernet vs JioFiber vs Airtel Xstream in Kondapur/Madhapur? Looking for 300+ Mbps symmetrical and 99.9% uptime during power cuts.',
    tags: ['General', 'Internet', 'RemoteWork'],
  },
  {
    id: 'topic-6',
    board: 'Housing & Flatmates',
    title: 'Looking for a flatmate in 3BHK high-rise in Baner / Balewadi, Pune',
    author: 'Rohan Mehta',
    city: 'Pune, Maharashtra',
    repliesCount: 6,
    viewsCount: 110,
    createdAt: '3 days ago',
    content:
      'Master bedroom with attached balcony and covered parking available in a gated society with pool, gym, and clubhouse. Rent 14k/month.',
    tags: ['Housing', 'Flatmates', 'Pune'],
  },
];

export const FORUM_BOARDS = [
  'All Boards',
  'Housing & Flatmates',
  'Tech, Jobs & Careers',
  'Buy, Sell & Barter Advice',
  'City Hangouts & Local Meetups',
  'General Discussion',
];
