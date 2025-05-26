import { SpecialOffer } from '../types';

export const specialOffers: SpecialOffer[] = [
  {
    id: '1',
    title: 'Midweek Escape',
    description: 'Enjoy 20% off all cabin bookings from Monday to Thursday. Perfect for a peaceful getaway without the weekend crowds.',
    discount: 20,
    validFrom: '2024-06-01',
    validTo: '2024-09-30',
    appliesTo: 'cabins',
    code: 'MIDWEEK20',
    image: 'https://images.pexels.com/photos/5087188/pexels-photo-5087188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    title: 'Family Adventure Package',
    description: 'Book a family cabin and get complimentary access to 3 activities of your choice. Create memories that will last a lifetime!',
    discount: 0, // Special package, not a direct discount
    validFrom: '2024-07-01',
    validTo: '2024-08-31',
    appliesTo: 'activities',
    code: 'FAMILYFUN',
    image: 'https://images.pexels.com/photos/8112172/pexels-photo-8112172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    title: 'Extended Stay Discount',
    description: 'Stay 7 nights or more and receive 15% off your entire booking. More time to relax and explore!',
    discount: 15,
    validFrom: '2024-06-01',
    validTo: '2024-10-31',
    appliesTo: 'all',
    code: 'STAYLONGER',
    image: 'https://images.pexels.com/photos/9482110/pexels-photo-9482110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    title: 'Fall Colors Special',
    description: 'Experience the magical autumn foliage with our special fall package: 10% off cabins plus a complimentary guided hiking tour.',
    discount: 10,
    validFrom: '2024-09-15',
    validTo: '2024-11-15',
    appliesTo: 'cabins',
    code: 'FALLMAGIC',
    image: 'https://images.pexels.com/photos/1808329/pexels-photo-1808329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];