import React, { useState, useEffect } from 'react';
import { sites as initialSites, reviewQueue as initialReviewQueue } from '../../data/frontend.js';
// Assuming you have API functions for sites (e.g., publish, markSold, togglePopular, deleteSite, addSite)
import * as api from '../../api/sites.js';
import { Home, MapPin, CheckCircle, XCircle, Star, Edit, Trash2, Globe, PlusCircle, UserPlus, User, MessageSquare, Calendar, Phone } from 'lucide-react'; // Lucide icons, added Phone
import AddPropertyModal from '../../components/AddPropertyModal.jsx'; // Import the new modal component

export default function SiteManagement() {
  // Initialize state with data from frontend.js
  const [sites, setSites] = useState(initialSites || []);
  const [reviewQueue, setReviewQueue] = useState(initialReviewQueue || []);
  const [enquiries, setEnquiries] = useState([]); // New state for enquiries in SiteManagement
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false); // State for Add Property modal visibility

  // Effect to ensure data is loaded/initialized (useful if using async API calls later)
  useEffect(() => {
    // In a real application, you'd fetch this from your backend:
    // api.getAllSites().then(data => setSites(data));
    // api.getReviewQueue().then(data => setReviewQueue(data));
    // api.getAllEnquiries().then(data => setEnquiries(data)); // Hypothetical API call for all enquiries

    // Mock data for enquiries (moved from BrokerDashboard)
    const mockEnquiries = [
      { _id: 'e1', userId: { name: 'Client A', phone: '9876543210' }, propertyId: { title: 'Luxury Apartment, Sector 18' }, message: 'Interested in a site visit next week.', createdAt: new Date('2024-07-20').toISOString() },
      { _id: 'e2', userId: { name: 'Client B', phone: '9988776655' }, propertyId: { title: 'Spacious Villa, Greater Noida' }, message: 'Can I get more photos?', createdAt: new Date('2024-07-21').toISOString() },
      { _id: 'e3', userId: { name: 'Client C', phone: '9000011111' }, propertyId: { title: 'Commercial Plot, Yamuna Exp.' }, message: 'What are the payment terms?', createdAt: new Date('2024-07-22').toISOString() },
    ];
    setEnquiries(mockEnquiries);

    console.log('Initial Sites:', sites);
    console.log('Initial Review Queue:', reviewQueue);
    console.log('Initial Enquiries:', enquiries); // Log enquiries as well
  }, []); // Empty dependency array means this runs once on mount

  // Helper to sort sites: popular first, then by name
  const sortSites = (siteList) => {
    return [...siteList].sort((a, b) => {
      // Popular sites come first
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      // Then sort by name
      return a.title.localeCompare(b.title);
    });
  };

  const handlePublish = (id) => {
    // Simulate API call to publish site
    console.log(`Publishing site ${id}`);
    const siteToPublish = reviewQueue.find((s) => String(s.id) === String(id)); // Ensure ID comparison is robust
    if (siteToPublish) {
      // api.publishSite(id); // Hypothetical API call
      setReviewQueue((q) => q.filter((s) => String(s.id) !== String(id)));
      setSites((s) => sortSites([...s, { ...siteToPublish, published: true, active: true, popular: false }])); // Mark as published, active, not popular by default
    }
  };

  const handleMarkSold = (id) => {
    // Simulate API call to mark site as sold
    console.log(`Marking site ${id} as sold`);
    if (window.confirm('Are you sure you want to mark this site as sold?')) {
      try {
        // api.markSold(id); // Hypothetical API call
        setSites((s) =>
          s.map((site) => (String(site.id) === String(id) ? { ...site, active: false } : site))
        );
      } catch (err) {
        console.error('Failed to mark site sold:', err);
      }
    }
  };

  const handleTogglePopular = (id, currentPopularStatus) => {
    // Simulate API call to toggle popular status
    console.log(`Toggling popular status for site ${id} to ${!currentPopularStatus}`);
    try {
      // api.togglePopular(id, !currentPopularStatus); // Hypothetical API call
      setSites((prevSites) =>
        sortSites(prevSites.map((s) =>
          String(s.id) === String(id) ? { ...s, popular: !currentPopularStatus } : s
        ))
      );
    } catch (err) {
      console.error('Failed to toggle popular status:', err);
    }
  };

  const handleDeleteSite = (id) => {
    // Simulate API call to delete site
    console.log(`Deleting site ${id}`);
    if (window.confirm('Are you sure you want to delete this site permanently? This action cannot be undone.')) {
      try {
        // api.deleteSite(id); // Hypothetical API call
        setSites((prevSites) => prevSites.filter((s) => String(s.id) !== String(id)));
        setReviewQueue((prevQueue) => prevQueue.filter((s) => String(s.id) !== String(id))); // Also remove from queue if present
      } catch (err) {
        console.error('Failed to delete site:', err);
      }
    }
  };

  const handleAddProperty = (newProperty) => {
    // This function will be called by the modal when a new property is added
    console.log('New property received in SiteManagement:', newProperty);
    // In a real app, you'd add this to your backend and then refetch/update state
    setSites((prevSites) => sortSites([...prevSites, newProperty]));
    // Optionally, if new properties go into a review queue first:
    // setReviewQueue((prevQueue) => [...prevQueue, { ...newProperty, published: false }]);
  };


  return (
    <div className="space-y-10 p-6 bg-white rounded-xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-4 inline-block">Site Management</h1>

      {/* Add Property Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddPropertyModal(true)}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <PlusCircle size={20} className="mr-2" /> Add New Property
        </button>
      </div>

      {/* ─────────────────── All Sites ─────────────────── */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">All Sites</h2>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-blue-50 text-blue-800 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Site Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Submitted By</th> {/* Added Submitted By column */}
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Popular</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.length > 0 ? (
                sortSites(sites).map((s) => (
                  <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <Home size={18} className="text-gray-500" /> {s.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" /> {s.locality}, {s.city}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <User size={16} className="text-gray-400" /> {s.submittedBy || 'N/A'} {/* Display submittedBy */}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          s.published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {s.published ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        {s.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePopular(s.id, s.popular)}
                        className={`p-2 rounded-full ${
                          s.popular ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'
                        } transition-colors`}
                        title={s.popular ? "Mark as Not Popular" : "Mark as Popular"}
                      >
                        <Star size={20} fill={s.popular ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          s.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {s.active ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => console.log('Edit site:', s.id)} // Placeholder for edit action
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit Site"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleMarkSold(s.id)}
                          className="p-2 rounded-full text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Mark Sold"
                        >
                          <Globe size={18} /> {/* Using globe for 'sold' or 'inactive' */}
                        </button>
                        <button
                          onClick={() => handleDeleteSite(s.id)}
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Site"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 text-lg">
                    No sites to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──────────────── Pending Review ──────────────── */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Sites Pending Review</h2>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-amber-50 text-amber-800 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Site Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Submitted By</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewQueue.length > 0 ? (
                reviewQueue.map((s) => (
                  <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-lg text-gray-900">{s.title}</td> {/* Use s.title for consistency */}
                    <td className="px-4 py-3 text-gray-700">{s.locality}, {s.city}</td> {/* Use locality and city */}
                    <td className="px-4 py-3 text-gray-700">{s.submittedBy || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handlePublish(s.id)}
                        className="rounded-full bg-sky-600 hover:bg-sky-700 px-4 py-2 text-sm text-white transition shadow-md hover:shadow-lg"
                      >
                        Publish
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 text-lg">
                    No sites pending review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──────────────── Enquiries Table ──────────────── */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-4 border-blue-500 pb-4 inline-block">Recent Enquiries</h2>
        {enquiries.length > 0 ? (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full text-left">
              <thead className="bg-blue-50 text-blue-800 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">From</th>
                  <th className="px-4 py-3">Contact No.</th> {/* New column for Contact No. */}
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3 rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-gray-900 font-semibold flex items-center gap-2">
                      <User size={18} className="text-gray-500" /> {e.userId?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" /> {e.userId?.phone || 'N/A'} {/* Display contact number */}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <Home size={16} className="text-gray-400" /> {e.propertyId?.title || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <MessageSquare size={16} className="text-gray-400" /> {e.message}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" /> {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500 text-lg">No recent enquiries.</p>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && <AddPropertyModal onClose={() => setShowAddPropertyModal(false)} onAddProperty={handleAddProperty} />}
    </div>
  );
}
