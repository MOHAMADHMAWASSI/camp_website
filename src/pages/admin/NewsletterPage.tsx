import React, { useState } from 'react';
import { Download, Send, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<{ email: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState({
    subject: '',
    content: ''
  });
  const [sendingCampaign, setSendingCampaign] = useState(false);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSubscribers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  // Export subscribers as CSV
  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Send campaign
  const sendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSendingCampaign(true);
      setError(null);

      // Call your newsletter service endpoint
      const { error: sendError } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: campaign.subject,
          content: campaign.content,
        }
      });

      if (sendError) throw sendError;

      // Reset form
      setCampaign({ subject: '', content: '' });
      alert('Campaign sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send campaign');
    } finally {
      setSendingCampaign(false);
    }
  };

  React.useEffect(() => {
    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Newsletter Management</h2>
        <button
          onClick={exportSubscribers}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Export Subscribers
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscribers List */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Subscribers ({subscribers.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <li key={subscriber.email} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Campaign Form */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Send Campaign
          </h3>
          <form onSubmit={sendCampaign} className="bg-white shadow sm:rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  rows={6}
                  value={campaign.content}
                  onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={sendingCampaign}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {sendingCampaign ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Campaign
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;