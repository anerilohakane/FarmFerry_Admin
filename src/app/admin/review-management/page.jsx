"use client";
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Eye, 
  Check, 
  X, 
  Trash2, 
  Filter, 
  Search, 
  Calendar,
  User,
  Package,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { 
  getAllReviews, 
  getReviewStats, 
  updateReviewStatus, 
  toggleReviewVisibility, 
  deleteReview, 
  replyToReview 
} from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const ReviewManagementDashboard = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    avgRating: 0
  });
  const [replyContent, setReplyContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch reviews and stats on component mount
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
        sort: 'createdAt',
        order: 'desc'
      };
      
      if (statusFilter !== 'all') params.status = statusFilter;
      if (ratingFilter !== 'all') params.rating = ratingFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await getAllReviews(params, token);
      setReviews(response.reviews || []);
      setFilteredReviews(response.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  // Fetch review statistics
  const fetchStats = async () => {
    try {
      const response = await getReviewStats(token);
      setStats({
        total: response.totalReviews || 0,
        pending: response.pendingReviews || 0,
        approved: response.approvedReviews || 0,
        rejected: response.rejectedReviews || 0,
        avgRating: response.avgRating || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        (review.customer?.firstName + ' ' + review.customer?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
      
      return matchesSearch && matchesStatus && matchesRating;
    });
    setFilteredReviews(filtered);
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  // Handle review actions
  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  const handleApprovalAction = (review, action) => {
    setSelectedReview(review);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const handleDeleteAction = (review) => {
    setSelectedReview(review);
    setShowDeleteDialog(true);
  };

  const handleReplyAction = (review) => {
    setSelectedReview(review);
    setReplyContent('');
    setShowReplyModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedReview) return;
    
    try {
      setActionLoading(true);
      const status = approvalAction === 'approve' ? 'approved' : 'rejected';
      await updateReviewStatus(selectedReview._id, status, token);
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review._id === selectedReview._id 
          ? { ...review, status }
          : review
      ));
      
      // Refresh stats
      await fetchStats();
      
      setShowApprovalDialog(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error updating review status:', error);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;
    
    try {
      setActionLoading(true);
      await deleteReview(selectedReview._id, token);
      
      // Update local state
      setReviews(prev => prev.filter(review => review._id !== selectedReview._id));
      
      // Refresh stats
      await fetchStats();
      
      setShowDeleteDialog(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReply = async () => {
    if (!selectedReview || !replyContent.trim()) return;
    
    try {
      setActionLoading(true);
      await replyToReview(selectedReview._id, replyContent, token);
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review._id === selectedReview._id 
          ? { 
              ...review, 
              reply: {
                content: replyContent,
                createdAt: new Date(),
                createdBy: { firstName: 'Admin', lastName: '' },
                createdByModel: 'Admin'
              }
            }
          : review
      ));
      
      setShowReplyModal(false);
      setSelectedReview(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error adding reply:', error);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
              <p className="text-gray-600">Manage customer reviews and ratings for your farm products</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{stats.avgRating}</div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <ThumbsDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <span className="text-sm text-gray-600">{filteredReviews.length} results</span>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {review.customer?.firstName} {review.customer?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{review.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{review.product?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600 ml-2">{review.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{review.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{review.comment}</div>
                      <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                        <span>{review.helpfulCount || 0} helpful</span>
                        {review.reportCount > 0 && <span className="text-red-500">{review.reportCount} reported</span>}
                        {review.isVerified && <span className="text-green-600">✓ Verified</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(review)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovalAction(review, 'approve')}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleApprovalAction(review, 'reject')}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleReplyAction(review)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                          title="Reply"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAction(review)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Details Modal */}
        {showDetailsModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">
                          {selectedReview.customer?.firstName} {selectedReview.customer?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedReview.customer?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                    <p className="font-medium">{selectedReview.product?.name}</p>
                  </div>

                  {/* Review Details */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {renderStars(selectedReview.rating)}
                        <span className="font-semibold">{selectedReview.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(selectedReview.createdAt)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedReview.status)}`}>
                          {selectedReview.status}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-2">{selectedReview.title}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedReview.comment}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>{selectedReview.helpfulCount || 0} people found this helpful</span>
                      {selectedReview.reportCount > 0 && (
                        <span className="text-red-500">{selectedReview.reportCount} reports</span>
                      )}
                      {selectedReview.isVerified && (
                        <span className="text-green-600 flex items-center">
                          <Check size={14} className="mr-1" />
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    {/* Reply Section */}
                    {selectedReview.reply && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Admin Reply</h5>
                        <p className="text-blue-800">{selectedReview.reply.content}</p>
                        <p className="text-xs text-blue-600 mt-2">
                          {formatDate(selectedReview.reply.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                    {selectedReview.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            handleApprovalAction(selectedReview, 'approve');
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            handleApprovalAction(selectedReview, 'reject');
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleReplyAction(selectedReview);
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    >
                      <MessageSquare size={16} />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleDeleteAction(selectedReview);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Dialog */}
        {showApprovalDialog && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {approvalAction === 'approve' ? (
                    <Check className="h-8 w-8 text-green-600 mr-3" />
                  ) : (
                    <X className="h-8 w-8 text-red-600 mr-3" />
                  )}
                  <h3 className="text-lg font-semibold">
                    {approvalAction === 'approve' ? 'Approve Review' : 'Reject Review'}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to {approvalAction} the review from {selectedReview.customer?.firstName} {selectedReview.customer?.lastName} for "{selectedReview.product?.name}"?
                </p>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowApprovalDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApproval}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 ${
                      approvalAction === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{approvalAction === 'approve' ? 'Approve' : 'Reject'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        {showDeleteDialog && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Trash2 className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold">Delete Review</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to permanently delete the review from {selectedReview.customer?.firstName} {selectedReview.customer?.lastName}? This action cannot be undone.
                </p>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={actionLoading}
                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold">Reply to Review</h3>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reply Content
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter your reply..."
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReply}
                    disabled={actionLoading || !replyContent.trim()}
                    className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 ${
                      actionLoading || !replyContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagementDashboard;