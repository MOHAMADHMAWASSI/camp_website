export interface Cabin {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  category: 'standard' | 'family' | 'luxury' | 'group';
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  price: number | null;
  images: string[];
  icon: string;
  season: ('spring' | 'summer' | 'fall' | 'winter')[];
  type: 'Sport' | 'Relaxation' | 'Discovery' | 'Family-Friendly' | 'Night Adventures';
  location: {
    x: number;
    y: number;
    description: string;
  };
  availableSpots?: number;
  availableDates?: string[];
  relatedActivities?: string[];
}

export interface Reservation {
  id: string;
  cabinId: string;
  userId: string;
  startDate: string;
  endDate: string;
  guests: number;
  activities: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  cabinId?: string;
  activityId?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validTo: string;
  appliesTo: 'all' | 'cabins' | 'activities';
  code: string;
  image: string;
}