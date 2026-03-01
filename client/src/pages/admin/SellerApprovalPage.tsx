import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, User, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { BackButton } from '../../components/common/BackButton';
import { toast } from 'sonner';

interface Seller {
  id: string; // Updated to handle _id from API
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  story?: string;
  image?: string;
  products?: number; // Might need to compute or get from API
  rating?: number;
  approved: boolean;
  createdAt: string;
}

export const SellerApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch sellers from API
  const fetchSellers = async () => {
    try {
      setLoading(true);
      // Get pending sellers
      const pendingData = await adminAPI.getPendingSellers();
      console.log('Pending data:', pendingData); // Log pending data

      // Get all users to filter approved sellers (API optimization needed in real app)
      const allUsersData = await adminAPI.getAllUsers();
      console.log('All Users data:', allUsersData); // Log all users data

      let allSellers: Seller[] = [];

      if (pendingData.success) {
        allSellers = [...allSellers, ...pendingData.sellers.map((s: any) => ({
          id: s._id,
          ...s,
          image: s.image || 'https://placehold.co/100' // Placeholder if no image
        }))];
      }

      if (allUsersData.success) {
        const approved = allUsersData.users
          .filter((u: any) => u.role === 'seller' && u.approved)
          .map((s: any) => ({
            id: s._id,
            ...s,
            image: s.image || 'https://placehold.co/100'
          }));
        allSellers = [...allSellers, ...approved];
      }

      console.log('All sellers after processing:', allSellers);

      // Remove duplicates if any (just in case)
      const uniqueSellers = Array.from(new Map(allSellers.map(item => [item.id, item])).values());
      setSellers(uniqueSellers);

    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const pendingSellers = sellers.filter((s) => !s.approved);
  const approvedSellers = sellers.filter((s) => s.approved);

  const handleApprove = async (sellerId: string) => {
    try {
      const response = await adminAPI.approveSeller(sellerId, true);
      if (response.success) {
        setSellers(sellers.map((s) => (s.id === sellerId ? { ...s, approved: true } : s)));
        toast.success("Seller approved successfully");
      }
    } catch (error) {
      toast.error("Failed to approve seller");
    }
  };

  const handleReject = async (sellerId: string) => {
    // Rejection logic - usually just approve=false or delete.
    // We will keep it as unapproved for now.
    try {
      const response = await adminAPI.approveSeller(sellerId, false);
      if (response.success) {
        setSellers(sellers.map((s) => (s.id === sellerId ? { ...s, approved: false } : s)));
        toast.info("Seller rejected (set to unapproved)");
      }
    } catch (error) {
      toast.error("Failed to reject seller");
    }
  };

  const seller = selectedSeller ? sellers.find((s) => s.id === selectedSeller) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton to="/admin/dashboard" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Approvals</h1>
          <p className="text-gray-600">Review and approve seller applications</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seller List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Pending Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Pending Approvals ({pendingSellers.length})
              </h2>
              {pendingSellers.length > 0 ? (
                <div className="space-y-3">
                  {pendingSellers.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSeller(s.id)}
                      className={`bg-white rounded-lg p-4 cursor-pointer border-2 transition ${selectedSeller === s.id
                        ? 'border-green-500 shadow-md'
                        : 'border-gray-200 hover:border-green-300'
                        }`}
                    >
                      <div className="flex items-center mb-2">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900">{s.name}</h3>
                          <p className="text-sm text-gray-600">{s.location || 'No location'}</p>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 text-center text-gray-600">
                  No pending approvals
                </div>
              )}
            </div>

            {/* Approved Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Approved Sellers ({approvedSellers.length})
              </h2>
              <div className="space-y-3">
                {approvedSellers.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSeller(s.id)}
                    className={`bg-white rounded-lg p-4 cursor-pointer border-2 transition ${selectedSeller === s.id
                      ? 'border-green-500 shadow-md'
                      : 'border-gray-200 hover:border-green-300'
                      }`}
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{s.name}</h3>
                        <p className="text-sm text-gray-600">{s.location || 'No location'}</p>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Details */}
          <div className="lg:col-span-2">
            {seller ? (
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <img
                      src={seller.image}
                      alt={seller.name}
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{seller.name}</h2>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {seller.location || 'Location not provided'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${seller.approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}
                  >
                    {seller.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                {/* Contact Information */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {seller.email}
                    </div>
                    {seller.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {seller.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Seller Story */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Seller Story</h3>
                  <p className="text-gray-700 leading-relaxed">{seller.story || 'No story provided.'}</p>
                </div>

                {/* Statistics */}
                {seller.approved && (
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{seller.products || 0}</p>
                      <p className="text-sm text-gray-600">Products</p>
                    </div>
                    {/* 
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{seller.rating || 0}</p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                     */}
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Joined</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!seller.approved && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve Seller
                    </button>
                    <button
                      onClick={() => handleReject(seller.id)}
                      className="flex-1 flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                  </div>
                )}

                {seller.approved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-semibold">
                      This seller has been approved and is active on the platform
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Seller</h3>
                <p className="text-gray-600">
                  Choose a seller from the list to view details and manage approval
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};