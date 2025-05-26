import { Cabin } from '../types';

export const cabins: Cabin[] = [
  {
    id: '1',
    name: 'Pine Haven',
    description: 'A cozy cabin nestled among tall pine trees, perfect for couples seeking a romantic getaway in nature.',
    price: 120,
    capacity: 2,
    amenities: ['Queen bed', 'Fireplace', 'Kitchenette', 'Private bathroom', 'Porch with forest view'],
    images: [
      'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/11701126/pexels-photo-11701126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'standard'
  },
  {
    id: '2',
    name: 'Lakeview Lodge',
    description: 'Spacious family cabin with panoramic views of the lake. Wake up to the sounds of nature and enjoy direct access to the water.',
    price: 220,
    capacity: 6,
    amenities: ['2 Bedrooms', 'Full kitchen', 'Dining area', 'Living room with sofa bed', 'Lake-facing deck', 'BBQ grill', 'Fishing dock access'],
    images: [
      'https://images.pexels.com/photos/129494/pexels-photo-129494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5227440/pexels-photo-5227440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'family'
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    description: 'Luxury cabin with modern amenities and stunning mountain views. Perfect for those who want to experience nature without sacrificing comfort.',
    price: 350,
    capacity: 4,
    amenities: ['2 Bedrooms with en-suite bathrooms', 'Gourmet kitchen', 'Hot tub', 'Home theater', 'Floor-to-ceiling windows', 'Wraparound deck', 'Private hiking trail'],
    images: [
      'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3513239/pexels-photo-3513239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'luxury'
  },
  {
    id: '4',
    name: 'Forest Bunkhouse',
    description: 'Rustic group accommodation perfect for friends, family reunions, or corporate retreats. Located in a secluded forest clearing.',
    price: 400,
    capacity: 12,
    amenities: ['6 Bunk beds', 'Large common area', 'Industrial kitchen', 'Multiple bathrooms', 'Outdoor fire pit', 'Games room', 'Conference facilities'],
    images: [
      'https://images.pexels.com/photos/675060/pexels-photo-675060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3849167/pexels-photo-3849167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'group'
  },
  {
    id: '5',
    name: 'Creekside Cottage',
    description: 'Charming cabin situated beside a bubbling creek. Fall asleep to the soothing sounds of flowing water.',
    price: 150,
    capacity: 3,
    amenities: ['Queen bed plus single bed', 'Small kitchen', 'Bathroom with shower', 'Private deck overlooking the creek', 'Hammock'],
    images: [
      'https://images.pexels.com/photos/2792603/pexels-photo-2792603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'standard'
  },
  {
    id: '6',
    name: 'Eagle\'s Nest',
    description: 'Elevated luxury cabin with spectacular views from its perched position. The ultimate glamping experience.',
    price: 380,
    capacity: 2,
    amenities: ['King bed', 'Spa bathroom with jacuzzi', 'Mini bar', 'Private balcony', 'Telescope for stargazing', 'Complimentary wine'],
    images: [
      'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/773344/pexels-photo-773344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'luxury'
  }
];