import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div>
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with our team for any questions or inquiries"
        backgroundImage="https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our cabins, activities, or just want to say hello? 
              We'd love to hear from you. Our friendly team is here to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Location</h3>
                  <p className="mt-1 text-gray-600">
                    123 Forest Road<br />
                    Mountain Valley, CA 91234
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                  <p className="mt-1 text-gray-600">
                    <a href="tel:+15551234567" className="hover:text-green-700">
                      (555) 123-4567
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Email</h3>
                  <p className="mt-1 text-gray-600">
                    <a href="mailto:info@wildscapecamping.com" className="hover:text-green-700">
                      info@wildscapecamping.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;