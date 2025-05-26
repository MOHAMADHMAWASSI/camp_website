import { Activity } from '../types';

export const activities: Activity[] = [
  {
    id: '1',
    name: 'Kayak Adventure',
    description: 'Explore our beautiful lake with a kayaking adventure. Perfect for beginners and experienced paddlers alike. All safety equipment provided.',
    duration: '2-4 hours',
    difficulty: 'moderate',
    price: 25,
    images: [
      'https://images.pexels.com/photos/1497582/pexels-photo-1497582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    icon: 'sailboat',
    season: ['spring', 'summer', 'fall']
  },
  {
    id: '2',
    name: 'Pedal Boat on the Lake',
    description: 'Enjoy a leisurely ride on our pedal boats. Perfect for families and couples wanting to explore the lake at their own pace.',
    duration: '1-2 hours',
    difficulty: 'easy',
    price: 20,
    images: [
      'https://images.pexels.com/photos/1497582/pexels-photo-1497582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    icon: 'sailboat',
    season: ['spring', 'summer', 'fall']
  },
  {
    id: '3',
    name: 'Archery',
    description: 'Learn the ancient art of archery with our experienced instructors. All equipment provided and suitable for beginners.',
    duration: '1.5 hours',
    difficulty: 'easy',
    price: 30,
    images: [
      'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3589341/pexels-photo-3589341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    icon: 'target',
    season: ['spring', 'summer', 'fall', 'winter']
  },
  {
    id: '4',
    name: 'Rock Climbing',
    description: 'Challenge yourself on our natural rock climbing walls. Equipment and instruction provided for all skill levels.',
    duration: '3 hours',
    difficulty: 'challenging',
    price: 45,
    images: [
      'https://images.pexels.com/photos/8134103/pexels-photo-8134103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/625428/pexels-photo-625428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    icon: 'mountain',
    season: ['spring', 'summer', 'fall']
  },
  {
    id: '5',
    name: 'Lake Swimming',
    description: 'Cool off in our pristine lake. Designated swimming areas with lifeguards on duty during peak hours.',
    duration: 'Flexible',
    difficulty: 'easy',
    price: null,
    images: [
      'https://images.pexels.com/photos/1165313/pexels-photo-1165313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    icon: 'swim',
    season: ['summer']
  },
  {
    id: '6',
    name: 'Pool Swimming',
    description: 'Enjoy our heated pool with dedicated lanes for lap swimming and a separate area for recreational swimming.',
    duration: 'Flexible',
    difficulty: 'easy',
    price: 10,
    images: [
      'https://images.pexels.com/photos/71104/utah-mountain-biking-bike-biking-71104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/805303/pexels-photo-805303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    icon: 'swim',
    season: ['spring', 'summer', 'fall', 'winter']
  }
];