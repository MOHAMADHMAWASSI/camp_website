import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { reviews } from '../../data/reviews';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Slice to show only 5 testimonials
  const testimonials = reviews.slice(0, 5);
  
  // Auto scroll testimonials
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);
  
  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };
  
  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };
  
  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  return (
    <section className="py-16 bg-green-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Our Guests Say</h2>
          <p className="mt-4 text-lg text-green-100 max-w-3xl mx-auto">
            Hear from those who have experienced the magic of WildScape Camping firsthand.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto" 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-lg">
                    <div className="flex justify-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <blockquote className="text-lg italic text-center mb-6">
                      "{testimonial.comment}"
                    </blockquote>
                    <div className="text-center">
                      <p className="font-semibold">{testimonial.userName}</p>
                      <p className="text-sm text-green-200">
                        {testimonial.cabinId 
                          ? 'Stayed in a cabin' 
                          : 'Participated in an activity'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;