import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { jobListings } from './JobsPage';

const ApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Find the job listing
  const job = jobListings.find(job => job.id === id);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: null as File | null,
    linkedin: '',
    experience: '',
    startDate: '',
    referral: '',
    additionalInfo: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'coverLetter') => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and Word documents are allowed');
        return;
      }
      
      setFormData(prev => ({ ...prev, [type]: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.resume) {
        throw new Error('Please upload your resume');
      }

      // Here you would typically:
      // 1. Upload files to storage
      // 2. Send application data to your backend
      // 3. Send confirmation email
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message and redirect
      alert('Application submitted successfully! We will contact you soon.');
      navigate('/jobs');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
        <p className="mt-2 text-gray-600">The position you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={`Apply for ${job.title}`}
        subtitle="Submit your application and join our team"
        backgroundImage="https://images.pexels.com/photos/7005019/pexels-photo-7005019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Job Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{job.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Department:</span> {job.department}
              </div>
              <div>
                <span className="font-medium">Location:</span> {job.location}
              </div>
              <div>
                <span className="font-medium">Type:</span> {job.type}
              </div>
              <div>
                <span className="font-medium">Experience:</span> {job.experience}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Resume
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="resume"
                              className="relative cursor-pointer rounded-md font-medium text-green-700 hover:text-green-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="resume"
                                name="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, 'resume')}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF or Word up to 5MB
                          </p>
                          {formData.resume && (
                            <p className="text-sm text-green-600">
                              Selected: {formData.resume.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cover Letter (Optional)
                    </label>
                    <div className="mt-1">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="coverLetter"
                              className="relative cursor-pointer rounded-md font-medium text-green-700 hover:text-green-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="coverLetter"
                                name="coverLetter"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, 'coverLetter')}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF or Word up to 5MB
                          </p>
                          {formData.coverLetter && (
                            <p className="text-sm text-green-600">
                              Selected: {formData.coverLetter.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn Profile (Optional)
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Relevant Experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={4}
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Briefly describe your relevant experience..."
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Earliest Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="referral" className="block text-sm font-medium text-gray-700">
                      How did you hear about us? (Optional)
                    </label>
                    <input
                      type="text"
                      id="referral"
                      name="referral"
                      value={formData.referral}
                      onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows={4}
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Any additional information you'd like to share..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;