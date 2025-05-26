# WildScape Camping Website

A modern, bilingual (English/French) camping website built with React, TypeScript, and Supabase, featuring cabin rentals, outdoor activities, and an interactive campground map.

## Features

### Core Features
- 🌐 Bilingual support (English/French)
- 🏠 Cabin booking system with detailed views
- 🏃‍♂️ Activity management and reservations
- 🗺️ Interactive campground map
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔐 Admin dashboard for site management

### Admin Dashboard
- 📊 Overview with key metrics and recent activity
- 🏡 Cabin management with amenities and policies
- 🎯 Activity scheduling and management
- 📅 Maintenance and blocked dates calendar
- 📧 Newsletter subscriber management
- 👥 User/staff management with role-based access
- 💰 Dynamic pricing rules
- 📊 Booking management and analytics

## Tech Stack

- **Frontend Framework:** React 18
- **Type Safety:** TypeScript
- **Routing:** React Router v6
- **State Management:** React Context + Hooks
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Internationalization:** i18next

## Project Structure

```
src/
├── components/         # Reusable React components
│   ├── admin/         # Admin dashboard components
│   ├── cards/         # Card components for cabins, activities, etc.
│   ├── features/      # Complex feature components
│   ├── home/          # Homepage-specific components
│   └── layout/        # Layout components (Navbar, Footer)
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── i18n/              # Internationalization
│   └── locales/       # Language files (en.json, fr.json)
├── lib/               # Utility libraries and configurations
├── pages/             # Page components
│   ├── admin/         # Admin dashboard pages
│   ├── client/        # Client dashboard pages
│   └── policies/      # Policy and information pages
├── types/             # TypeScript type definitions
└── data/             # Mock data for development
```

## Database Schema

### Core Tables
- `cabins`: Cabin information and details
- `cabin_amenities`: Cabin amenities and features
- `cabin_images`: Cabin photo gallery
- `cabin_availability`: Cabin availability calendar
- `activities`: Activity information and scheduling
- `profiles`: User profiles and roles

### Admin Features
- `newsletter_subscribers`: Newsletter subscription management
- `cabin_blocked_dates`: Maintenance and blocked dates
- `pricing_rules`: Dynamic pricing configuration
- `cabin_policies`: Cabin-specific policies

## Key Features

### Bilingual Support
- Complete translation coverage for all UI elements
- Language preference persistence
- Automatic language detection

### Cabin Management
- Detailed cabin listings with photos and amenities
- Advanced filtering options
- Real-time availability checking
- Secure booking system
- Dynamic pricing rules

### Activities
- Comprehensive activity catalog
- Difficulty levels and duration information
- Seasonal availability
- Online booking system
- Activity categories and filtering

### Interactive Map
- Visual representation of the campground
- Cabin and activity locations
- Points of interest
- Interactive elements for better user experience

### Admin Dashboard
- Comprehensive management interface
- Role-based access control
- Real-time analytics
- Newsletter management
- Maintenance scheduling

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images provided by Pexels
- Icons by Lucide React
- UI components styled with Tailwind CSS

## Feature Access Matrix

| Feature                | Regular User | Admin        |
|-----------------------|--------------|--------------|
| View Cabins           | ✅           | ✅           |
| Book Cabins           | ✅           | ✅           |
| View Activities       | ✅           | ✅           |
| Book Activities       | ✅           | ✅           |
| View Map             | ✅           | ✅           |
| Manage Cabins        | ❌           | ✅           |
| Manage Activities    | ❌           | ✅           |
| Manage Users         | ❌           | ✅           |
| View Analytics       | ❌           | ✅           |
| Newsletter Management| ❌           | ✅           |
| Pricing Rules        | ❌           | ✅           |
| Maintenance Calendar | ❌           | ✅           |