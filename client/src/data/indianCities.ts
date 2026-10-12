export interface IndianCity {
  city: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central';
  pinCode?: string;
  isPopular?: boolean;
}

export const INDIAN_CITIES: IndianCity[] = [
  // Major Metros / Popular
  { city: 'Bengaluru', state: 'Karnataka', region: 'South', pinCode: '560001', isPopular: true },
  { city: 'Mumbai', state: 'Maharashtra', region: 'West', pinCode: '400001', isPopular: true },
  { city: 'Delhi NCR', state: 'Delhi', region: 'North', pinCode: '110001', isPopular: true },
  { city: 'Hyderabad', state: 'Telangana', region: 'South', pinCode: '500001', isPopular: true },
  { city: 'Chennai', state: 'Tamil Nadu', region: 'South', pinCode: '600001', isPopular: true },
  { city: 'Pune', state: 'Maharashtra', region: 'West', pinCode: '411001', isPopular: true },
  { city: 'Kolkata', state: 'West Bengal', region: 'East', pinCode: '700001', isPopular: true },
  { city: 'Ahmedabad', state: 'Gujarat', region: 'West', pinCode: '380001', isPopular: true },
  { city: 'Jaipur', state: 'Rajasthan', region: 'North', pinCode: '302001', isPopular: true },
  { city: 'Kochi', state: 'Kerala', region: 'South', pinCode: '682001', isPopular: true },
  { city: 'Chandigarh', state: 'Punjab', region: 'North', pinCode: '160017', isPopular: true },
  { city: 'Lucknow', state: 'Uttar Pradesh', region: 'North', pinCode: '226001', isPopular: true },
  { city: 'Indore', state: 'Madhya Pradesh', region: 'Central', pinCode: '452001', isPopular: true },
  { city: 'Coimbatore', state: 'Tamil Nadu', region: 'South', pinCode: '641001', isPopular: true },
  { city: 'Goa', state: 'Goa', region: 'West', pinCode: '403001', isPopular: true },

  // Tier 2 & Key Cities
  { city: 'Surat', state: 'Gujarat', region: 'West', pinCode: '395001' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'South', pinCode: '530001' },
  { city: 'Bhubaneswar', state: 'Odisha', region: 'East', pinCode: '751001' },
  { city: 'Noida', state: 'Uttar Pradesh', region: 'North', pinCode: '201301' },
  { city: 'Gurugram', state: 'Haryana', region: 'North', pinCode: '122001' },
  { city: 'Nagpur', state: 'Maharashtra', region: 'West', pinCode: '440001' },
  { city: 'Patna', state: 'Bihar', region: 'East', pinCode: '800001' },
  { city: 'Vadodara', state: 'Gujarat', region: 'West', pinCode: '390001' },
  { city: 'Thiruvananthapuram', state: 'Kerala', region: 'South', pinCode: '695001' },
  { city: 'Mysuru', state: 'Karnataka', region: 'South', pinCode: '570001' },
  { city: 'Bhopal', state: 'Madhya Pradesh', region: 'Central', pinCode: '462001' },
  { city: 'Guwahati', state: 'Assam', region: 'East', pinCode: '781001' },
  { city: 'Dehradun', state: 'Uttarakhand', region: 'North', pinCode: '248001' },
  { city: 'Ranchi', state: 'Jharkhand', region: 'East', pinCode: '834001' },
  { city: 'Mangaluru', state: 'Karnataka', region: 'South', pinCode: '575001' },
  { city: 'Madurai', state: 'Tamil Nadu', region: 'South', pinCode: '625001' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', region: 'South', pinCode: '520001' },
  { city: 'Varanasi', state: 'Uttar Pradesh', region: 'North', pinCode: '221001' },
  { city: 'Amritsar', state: 'Punjab', region: 'North', pinCode: '143001' },
  { city: 'Agra', state: 'Uttar Pradesh', region: 'North', pinCode: '282001' },
  { city: 'Nashik', state: 'Maharashtra', region: 'West', pinCode: '422001' },
];
