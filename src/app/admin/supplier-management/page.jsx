"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search, Check, X, Building2, Mail, Phone, MapPin, User, DollarSign, Star, AlertCircle, Eye, Edit
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const SupplierManagementDashboard = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Add edit modal and logic
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [previewedDocument, setPreviewedDocument] = useState(null);

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", 1);
      params.append("limit", 50);
      const res = await fetch(`${API_URL}/api/v1/admin/suppliers?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSuppliers(data.data?.suppliers || []);
      console.log('Fetched suppliers:', data.data?.suppliers || []);
    } catch (err) {
      setError("Failed to fetch suppliers");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchSuppliers();
    // eslint-disable-next-line
  }, [searchTerm, statusFilter, token]);

  useEffect(() => {
    console.log('Suppliers state updated:', suppliers);
  }, [suppliers]);

  // Filter suppliers based on approval status (client-side)
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesApproval =
        approvalFilter === "all" || supplier.status === approvalFilter;
      return matchesApproval;
    });
  }, [suppliers, approvalFilter]);

  // View supplier details
  const handleViewDetails = async (supplier) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/suppliers/${supplier._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('Supplier details API response:', data);
      setSelectedSupplier(data.data?.supplier); // FIXED: use data.data.supplier
      setShowDetailsModal(true);
    } catch {
      setError("Failed to fetch supplier details");
    }
    setLoading(false);
  };

  // Approve/Reject supplier
  const handleApprovalAction = (supplier, action) => {
    setSelectedSupplier(supplier);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const confirmApproval = async () => {
    if (selectedSupplier && approvalAction) {
      setLoading(true);
      try {
        await fetch(`${API_URL}/api/v1/admin/suppliers/${selectedSupplier._id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: approvalAction }),
        });
        setShowApprovalDialog(false);
        setSelectedSupplier(null);
        setApprovalAction("");
        fetchSuppliers();
      } catch {
        setError("Failed to update supplier status");
      }
      setLoading(false);
    }
  };

  // Add edit modal and logic
  const handleEditSupplier = (supplier) => {
    setEditingSupplier({ ...supplier });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditingSupplier((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingSupplier) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/v1/admin/suppliers/${editingSupplier._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingSupplier),
      });
      setShowEditModal(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch {
      setError("Failed to update supplier");
    }
    setLoading(false);
  };

  // UI helpers
  const getStatusBadge = (status) => {
    const classes = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      active: "bg-blue-100 text-blue-800 border-blue-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      blocked: "bg-black text-white border-gray-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${classes[status] || ""}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Management</h1>
          <p className="text-gray-600">Manage and monitor your supplier relationships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{suppliers.filter(s => (s.status || '').toLowerCase().trim() === "approved").length}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{suppliers.filter(s => (s.status || '').toLowerCase().trim() === "pending").length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{suppliers.filter(s => (s.status || '').toLowerCase().trim() === "rejected").length}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Supplier List Table */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{supplier.businessName || supplier.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supplier.ownerName || supplier.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supplier.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supplier.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(supplier.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(supplier)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditSupplier(supplier)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {supplier.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprovalAction(supplier, "approved")}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleApprovalAction(supplier, "rejected")}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Supplier Details</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-medium">Business Name:</span> {selectedSupplier.businessName}</div>
                    <div><span className="font-medium">Owner Name:</span> {selectedSupplier.ownerName}</div>
                    <div><span className="font-medium">Email:</span> {selectedSupplier.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedSupplier.phone}</div>
                    <div><span className="font-medium">Business Type:</span> {selectedSupplier.businessType}</div>
                    <div><span className="font-medium">GST Number:</span> {selectedSupplier.gstNumber}</div>
                    <div><span className="font-medium">PAN Number:</span> {selectedSupplier.panNumber}</div>
                    <div><span className="font-medium">Status:</span> {getStatusBadge(selectedSupplier.status)}</div>
                    <div><span className="font-medium">Verification Notes:</span> {selectedSupplier.verificationNotes}</div>
                    <div><span className="font-medium">Verified At:</span> {selectedSupplier.verifiedAt ? new Date(selectedSupplier.verifiedAt).toLocaleString() : '-'}</div>
                    <div><span className="font-medium">Created At:</span> {selectedSupplier.createdAt ? new Date(selectedSupplier.createdAt).toLocaleString() : '-'}</div>
                    <div><span className="font-medium">Last Login:</span> {selectedSupplier.lastLogin ? new Date(selectedSupplier.lastLogin).toLocaleString() : '-'}</div>
                  </div>
                </div>
                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-medium">Street:</span> {selectedSupplier.address?.street}</div>
                    <div><span className="font-medium">City:</span> {selectedSupplier.address?.city}</div>
                    <div><span className="font-medium">State:</span> {selectedSupplier.address?.state}</div>
                    <div><span className="font-medium">Country:</span> {selectedSupplier.address?.country}</div>
                    <div><span className="font-medium">Postal Code:</span> {selectedSupplier.address?.postalCode}</div>
                  </div>
                </div>
                {/* Bank Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-medium">Account Holder Name:</span> {selectedSupplier.bankDetails?.accountHolderName}</div>
                    <div><span className="font-medium">Bank Name:</span> {selectedSupplier.bankDetails?.bankName}</div>
                    <div><span className="font-medium">Account Number:</span> {selectedSupplier.bankDetails?.accountNumber}</div>
                    <div><span className="font-medium">IFSC Code:</span> {selectedSupplier.bankDetails?.ifscCode}</div>
                  </div>
                </div>
                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents</h3>
                  {selectedSupplier.documents && selectedSupplier.documents.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {selectedSupplier.documents.map((doc, idx) => {
                        const isImage = doc.url && /\.(jpg|jpeg|png|gif)$/i.test(doc.url);
                        const isPDF = doc.url && /\.pdf$/i.test(doc.url);
                        return (
                          <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setPreviewedDocument(doc)}>
                            {isImage ? (
                              <img src={doc.url} alt={doc.type} className="h-20 w-20 object-cover rounded border" />
                            ) : isPDF ? (
                              <div className="h-20 w-20 flex items-center justify-center bg-gray-100 border rounded">
                                <span role="img" aria-label="PDF" className="text-4xl">📄</span>
                              </div>
                            ) : (
                              <div className="h-20 w-20 flex items-center justify-center bg-gray-100 border rounded">
                                <span className="text-xs">DOC</span>
                              </div>
                            )}
                            <div className="mt-1 text-xs text-gray-700 truncate w-20 text-center">{doc.type}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-500">No documents uploaded.</div>
                  )}
                </div>
                {/* Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-medium">Total Orders:</span> {selectedSupplier.totalOrders}</div>
                    <div><span className="font-medium">Total Revenue:</span> {selectedSupplier.totalRevenue}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Dialog */}
        {showApprovalDialog && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {approvalAction === "approved" ? "Approve Supplier" : "Reject Supplier"}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to {approvalAction === "approved" ? "approve" : "reject"} {" "}
                  <strong>{selectedSupplier.businessName || selectedSupplier.name}</strong>?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowApprovalDialog(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApproval}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      approvalAction === "approved"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {approvalAction === "approved" ? "Approve" : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Supplier</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={editingSupplier.businessName || ""}
                      onChange={(e) => handleEditChange("businessName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                    <input
                      type="text"
                      value={editingSupplier.ownerName || ""}
                      onChange={(e) => handleEditChange("ownerName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingSupplier.email || ""}
                      onChange={(e) => handleEditChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingSupplier.phone || ""}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingSupplier.status || "pending"}
                      onChange={(e) => handleEditChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editingSupplier.address?.street || ""}
                    onChange={(e) => handleEditChange("address", { ...editingSupplier.address, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-6 flex flex-col items-center">
              <button
                onClick={() => setPreviewedDocument(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close preview"
              >
                &times;
              </button>
              <div className="mb-4 w-full flex flex-col items-center">
                <div className="mb-2 text-lg font-semibold">{previewedDocument.type}</div>
                {previewedDocument.url && /\.(jpg|jpeg|png|gif)$/i.test(previewedDocument.url) ? (
                  <img src={previewedDocument.url} alt={previewedDocument.type} className="max-h-[70vh] rounded border" />
                ) : previewedDocument.url && /\.pdf$/i.test(previewedDocument.url) ? (
                  <iframe
                    src={previewedDocument.url}
                    title={`PDF-${previewedDocument.type}`}
                    className="w-full"
                    style={{ minHeight: "500px", maxHeight: "80vh" }}
                  />
                ) : previewedDocument.url ? (
                  <a href={previewedDocument.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open Document</a>
                ) : (
                  <div className="text-gray-500">No preview available.</div>
                )}
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Type:</span> {previewedDocument.type}</div>
                <div><span className="font-medium">Verified:</span> {previewedDocument.isVerified ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Uploaded At:</span> {previewedDocument.uploadedAt ? new Date(previewedDocument.uploadedAt).toLocaleString() : '-'}</div>
                <div><span className="font-medium">publicId:</span> {previewedDocument.publicId}</div>
                {previewedDocument.rejectionReason && <div className="col-span-2"><span className="font-medium text-red-600">Rejection Reason:</span> {previewedDocument.rejectionReason}</div>}
                {previewedDocument.url && <div className="col-span-2"><a href={previewedDocument.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download/View Original</a></div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierManagementDashboard;