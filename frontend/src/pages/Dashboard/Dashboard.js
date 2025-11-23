import React, { useState, useEffect, useCallback } from 'react';
import FeedbackForm from '../../components/FeedbackForm/FeedbackForm';
import FeedbackList from '../../components/FeedbackList/FeedbackList';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import feedbackService from '../../services/feedbackService';
import { debounce } from '../../utils/helpers';
import './Dashboard.css';

/**
 * Dashboard Page Component - Main application interface
 */
const Dashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  /**
   * Load feedback data with current filters
   */
  const loadFeedback = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await feedbackService.getFeedback({
        ...filters,
        page,
        limit: 10
      });
      
      setFeedback(response.feedback);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Debounced search to avoid too many API calls
  const debouncedLoadFeedback = useCallback(
    debounce((page = 1) => {
      loadFeedback(page);
    }, 500),
    [loadFeedback]
  );

  /**
   * Handle filter changes
   * @param {Event} e - Change event
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle search filter with debouncing
   */
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  /**
   * Handle feedback deletion
   * @param {string} id - Feedback ID to delete
   */
  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.deleteFeedback(id);
      loadFeedback(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  /**
   * Handle successful feedback submission
   */
  const handleFeedbackSubmit = () => {
    setShowFeedbackForm(false);
    loadFeedback(1);
  };

  /**
   * Handle page change
   * @param {number} page - Page number to navigate to
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadFeedback(page);
    }
  };

  // Load feedback on component mount and filter changes
  useEffect(() => {
    // Use debounced load for search, regular load for other filters
    if (filters.search) {
      debouncedLoadFeedback(1);
    } else {
      loadFeedback(1);
    }
  }, [
    filters.search,
    filters.category,
    filters.startDate,
    filters.endDate,
    loadFeedback,
    debouncedLoadFeedback
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [filters.search, filters.category, filters.startDate, filters.endDate]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Feedback Collector</h1>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowFeedbackForm(true)}
            >
              + Add Feedback
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Feedback</h3>
            <p className="stat-number">{pagination.total}</p>
            <p className="stat-label">All Submissions</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="search" className="filter-label">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              className="filter-input"
              placeholder="Search by name, email, or message..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category" className="filter-label">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="complaint">Complaint</option>
              <option value="compliment">Compliment</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="startDate" className="filter-label">From Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate" className="filter-label">To Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <button
            onClick={() => setFilters({
              search: '',
              category: 'all',
              startDate: '',
              endDate: ''
            })}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>

        {/* Feedback List */}
        <div className="content-section">
          <FeedbackList
            feedback={feedback}
            onDelete={handleDeleteFeedback}
            isLoading={isLoading}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Feedback Form Modal */}
      <ModalComponent
        isOpen={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
        title="Submit Feedback"
        size="md"
      >
        <FeedbackForm
          onSubmit={handleFeedbackSubmit}
          onCancel={() => setShowFeedbackForm(false)}
        />
      </ModalComponent>
    </div>
  );
};

export default Dashboard;