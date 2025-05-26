import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'bookings', name: 'Bookings & Reservations' },
    { id: 'amenities', name: 'Amenities & Services' },
    { id: 'activities', name: 'Activities & Recreation' },
    { id: 'policies', name: 'Policies & Rules' }
  ];

  const faqs = {
    general: [
      {
        id: 'g1',
        question: 'What are your check-in and check-out times?',
        answer: 'Check-in time is from 3:00 PM to 8:00 PM, and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request for an additional fee, subject to availability.'
      },
      {
        id: 'g2',
        question: 'Is there cell phone service at the campground?',
        answer: 'Cell phone coverage varies by carrier. We have good coverage for most major carriers in the main areas, but signal might be limited in some remote spots. Wi-Fi is available in all cabins and common areas.'
      },
      {
        id: 'g3',
        question: 'Are pets allowed?',
        answer: 'Yes, pets are allowed in designated pet-friendly cabins for an additional fee. Please inform us at the time of booking if you plan to bring a pet. All pets must be leashed in common areas.'
      }
    ],
    bookings: [
      {
        id: 'b1',
        question: 'How far in advance should I make a reservation?',
        answer: 'We recommend booking at least 2-3 months in advance for peak season (June-August) and holidays. For off-peak times, 2-4 weeks advance booking is usually sufficient.'
      },
      {
        id: 'b2',
        question: 'What is your cancellation policy?',
        answer: 'Our cancellation policy varies depending on how far in advance you cancel. Full refunds are available for cancellations made 30+ days before check-in. Please see our cancellation policy page for complete details.'
      },
      {
        id: 'b3',
        question: 'Do you require a deposit?',
        answer: 'Yes, we require a 50% deposit at the time of booking, with the remaining balance due 14 days before check-in. A refundable security deposit of $200 is also required.'
      }
    ],
    amenities: [
      {
        id: 'a1',
        question: 'Do the cabins have kitchens?',
        answer: 'Yes, all cabins come with fully equipped kitchens including a refrigerator, stove, microwave, coffee maker, and basic cooking utensils. Luxury cabins also include a dishwasher.'
      },
      {
        id: 'a2',
        question: 'Is bedding provided?',
        answer: 'Yes, all beds come with fresh linens, pillows, and blankets. We also provide towels for both bathroom and pool use.'
      },
      {
        id: 'a3',
        question: 'Do you have laundry facilities?',
        answer: 'Yes, we have a central laundry facility with coin-operated washers and dryers. Luxury cabins have their own washer and dryer.'
      }
    ],
    activities: [
      {
        id: 'ac1',
        question: 'What activities are available on-site?',
        answer: 'We offer hiking, kayaking, fishing, swimming, archery, and guided nature walks. In the evening, we host campfire gatherings with s\'mores. Check our activities page for a complete list and scheduling information.'
      },
      {
        id: 'ac2',
        question: 'Do I need to book activities in advance?',
        answer: 'Yes, we recommend booking activities at least 24 hours in advance, especially during peak season. Some activities like guided tours and kayaking have limited spots available.'
      },
      {
        id: 'ac3',
        question: 'Are activities included in the cabin rate?',
        answer: 'Basic activities like hiking trails and swimming are included. Specialized activities like guided tours, equipment rentals, and instruction classes have additional fees.'
      }
    ],
    policies: [
      {
        id: 'p1',
        question: 'What are your quiet hours?',
        answer: 'Quiet hours are from 10:00 PM to 7:00 AM. During these hours, please keep noise levels to a minimum to respect other guests.'
      },
      {
        id: 'p2',
        question: 'Is smoking allowed?',
        answer: 'Smoking is strictly prohibited inside all cabins and indoor facilities. Designated smoking areas are provided in specific outdoor locations away from buildings.'
      },
      {
        id: 'p3',
        question: 'What is your group booking policy?',
        answer: 'Groups booking 3 or more cabins must contact us directly for special rates and policies. We can accommodate corporate retreats, family reunions, and other group events.'
      }
    ]
  };

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(q => q !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = Object.entries(faqs).reduce((acc, [category, questions]) => {
    if (category === activeCategory || activeCategory === 'all') {
      const filtered = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    }
    return acc;
  }, {} as typeof faqs);

  return (
    <div>
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our campground"
        backgroundImage="https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {Object.entries(filteredFaqs).map(([category, questions]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {categories.find(c => c.id === category)?.name}
              </h2>
              <div className="space-y-4">
                {questions.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openQuestions.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {openQuestions.includes(faq.id) && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(filteredFaqs).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No FAQs found matching your search criteria.</p>
            </div>
          )}
        </div>
        
        {/* Contact Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer you were looking for, our team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
            >
              Contact our support team
              <ChevronDown className="ml-1 h-5 w-5 transform rotate-270" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;