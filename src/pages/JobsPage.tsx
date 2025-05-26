import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter } from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'seasonal';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  posted: string;
}

export const jobListings: JobListing[] = [
  {
    id: '1',
    title: 'Outdoor Activities Guide',
    department: 'Activities',
    location: 'On-site',
    type: 'full-time',
    experience: '2+ years',
    salary: '$45,000 - $55,000',
    description: 'Join our team as an Outdoor Activities Guide and help create unforgettable experiences for our guests through various outdoor activities and adventures.',
    requirements: [
      'Minimum 2 years experience in outdoor recreation or similar field',
      'First Aid and CPR certification',
      'Excellent communication and interpersonal skills',
      'Physical ability to lead outdoor activities',
      'Flexible schedule including weekends and holidays'
    ],
    responsibilities: [
      'Lead and coordinate outdoor activities including hiking, kayaking, and archery',
      'Ensure safety protocols are followed during all activities',
      'Maintain equipment and conduct regular safety checks',
      'Provide excellent customer service and create engaging experiences',
      'Assist in developing new activity programs'
    ],
    benefits: [
      'Competitive salary',
      'Health and dental insurance',
      'Paid time off',
      'Employee accommodation discount',
      'Professional development opportunities'
    ],
    posted: '2024-03-15'
  },
  {
    id: '2',
    title: 'Cabin Maintenance Technician',
    department: 'Maintenance',
    location: 'On-site',
    type: 'full-time',
    experience: '3+ years',
    salary: '$40,000 - $50,000',
    description: 'We are seeking a skilled Maintenance Technician to ensure our cabins and facilities are well-maintained and provide a comfortable experience for our guests.',
    requirements: [
      'Experience in building maintenance and repairs',
      'Knowledge of plumbing, electrical, and HVAC systems',
      'Valid driver\'s license',
      'Ability to work independently',
      'Available for on-call rotations'
    ],
    responsibilities: [
      'Perform regular maintenance checks on cabins and facilities',
      'Handle repair requests and preventive maintenance',
      'Maintain inventory of supplies and equipment',
      'Coordinate with contractors when needed',
      'Document maintenance activities and repairs'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Retirement plan',
      'Paid holidays',
      'On-site housing available'
    ],
    posted: '2024-03-10'
  },
  {
    id: '3',
    title: 'Guest Services Representative',
    department: 'Front Desk',
    location: 'On-site',
    type: 'seasonal',
    experience: '1+ year',
    salary: '$35,000 - $42,000',
    description: 'Looking for friendly and energetic Guest Services Representatives to join our front desk team for the upcoming season.',
    requirements: [
      'Previous customer service experience',
      'Excellent communication skills',
      'Computer proficiency',
      'Ability to multitask',
      'Flexible schedule'
    ],
    responsibilities: [
      'Check guests in and out',
      'Handle reservations and inquiries',
      'Provide information about activities and amenities',
      'Process payments',
      'Resolve guest concerns'
    ],
    benefits: [
      'Competitive seasonal pay',
      'Employee discounts',
      'Flexible scheduling',
      'Training provided',
      'Potential for permanent position'
    ],
    posted: '2024-03-20'
  }
];

const JobsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  // Filter jobs based on search and filters
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    return matchesSearch && matchesType && matchesDepartment;
  });

  // Get unique departments
  const departments = Array.from(new Set(jobListings.map(job => job.department)));

  return (
    <div>
      <PageHeader 
        title="Careers at WildScape" 
        subtitle="Join our team and help create unforgettable outdoor experiences"
        backgroundImage="https://images.pexels.com/photos/7005019/pexels-photo-7005019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Job Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
                <div className="space-y-2">
                  {['all', 'full-time', 'part-time', 'seasonal'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {type === 'all' ? 'All Types' : type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Department Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Department</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="department"
                      value="all"
                      checked={selectedDepartment === 'all'}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Departments</span>
                  </label>
                  {departments.map((department) => (
                    <label key={department} className="flex items-center">
                      <input
                        type="radio"
                        name="department"
                        value={department}
                        checked={selectedDepartment === department}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{department}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedDepartment('all');
                }}
                className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Position' : 'Positions'} Available
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-1" />
                Sorted by most recent
              </div>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <div className="mt-2 space-x-4">
                            <span className="inline-flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.type}
                            </span>
                            <span className="inline-flex items-center text-sm text-gray-500">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                      
                      {selectedJob?.id === job.id && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 mb-6">{job.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                                <ul className="list-disc pl-4 space-y-2 text-gray-600">
                                  {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h4>
                                <ul className="list-disc pl-4 space-y-2 text-gray-600">
                                  {job.responsibilities.map((resp, index) => (
                                    <li key={index}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h4>
                              <ul className="list-disc pl-4 space-y-2 text-gray-600">
                                {job.benefits.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="mt-6 flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                Posted on {new Date(job.posted).toLocaleDateString()}
                              </span>
                              <a
                                href={`/apply/${job.id}`}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors"
                              >
                                Apply Now
                                <Briefcase className="ml-2 h-5 w-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No positions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setSelectedDepartment('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;