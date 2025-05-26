import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Privacy Policy" 
        subtitle="How we protect and handle your personal information"
        backgroundImage="https://images.pexels.com/photos/3601453/pexels-photo-3601453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-green max-w-none mb-12">
            <p className="text-lg text-gray-600">
              At WildScape Camping, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our services. By using our website or services, you agree to the terms of this privacy policy.
            </p>
          </div>
          
          {/* Information Collection */}
          <div className="space-y-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-green-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Information We Collect</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>We collect the following types of information:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Name and contact information</li>
                  <li>Payment information</li>
                  <li>Booking history and preferences</li>
                  <li>Device and browser information</li>
                  <li>Location data (with your consent)</li>
                  <li>Communications with our team</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">How We Use Your Information</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>We use your information to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Process your reservations and payments</li>
                  <li>Communicate about your bookings</li>
                  <li>Improve our services</li>
                  <li>Send relevant marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-green-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Data Security</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>We protect your data through:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Encryption of sensitive information</li>
                  <li>Regular security assessments</li>
                  <li>Restricted access to personal data</li>
                  <li>Secure data storage systems</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Your Rights */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rights</h3>
            <div className="space-y-4 text-gray-600">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for marketing</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-700 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Us About Privacy</h3>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                If you have questions about our privacy policy or want to exercise your rights, contact our Data Protection Officer:
              </p>
              <ul className="space-y-2">
                <li>Email: privacy@wildscapecamping.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Forest Road, Mountain Valley, CA 91234</li>
              </ul>
              <p className="text-sm">
                Last updated: March 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;