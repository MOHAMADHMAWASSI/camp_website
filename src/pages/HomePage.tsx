import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCabins from '../components/home/FeaturedCabins';
import PopularActivities from '../components/home/PopularActivities';
import Testimonials from '../components/home/Testimonials';
import SpecialOffers from '../components/home/SpecialOffers';
import Newsletter from '../components/home/Newsletter';
import MapPreview from '../components/home/MapPreview';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedCabins />
      <PopularActivities />
      <MapPreview />
      <Testimonials />
      <SpecialOffers />
      <Newsletter />
    </div>
  );
};

export default HomePage;