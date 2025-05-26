import { Reservation } from '../types';

// This is mock data for demonstration purposes
export const reservations: Reservation[] = [
  {
    id: '1',
    cabinId: '1',
    userId: 'user1',
    startDate: '2024-07-15',
    endDate: '2024-07-18',
    guests: 2,
    activities: ['1', '3'],
    totalPrice: 435,
    status: 'confirmed'
  },
  {
    id: '2',
    cabinId: '2',
    userId: 'user2',
    startDate: '2024-07-20',
    endDate: '2024-07-27',
    guests: 5,
    activities: ['2', '4', '3'],
    totalPrice: 1655,
    status: 'confirmed'
  },
  {
    id: '3',
    cabinId: '3',
    userId: 'user3',
    startDate: '2024-08-01',
    endDate: '2024-08-05',
    guests: 4,
    activities: ['1', '5', '7'],
    totalPrice: 1490,
    status: 'pending'
  },
  {
    id: '4',
    cabinId: '4',
    userId: 'user4',
    startDate: '2024-08-10',
    endDate: '2024-08-13',
    guests: 10,
    activities: ['1', '2', '3', '6'],
    totalPrice: 1345,
    status: 'confirmed'
  },
  {
    id: '5',
    cabinId: '5',
    userId: 'user5',
    startDate: '2024-07-25',
    endDate: '2024-07-28',
    guests: 3,
    activities: ['2', '7'],
    totalPrice: 510,
    status: 'cancelled'
  }
];