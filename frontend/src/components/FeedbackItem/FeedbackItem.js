import React, { useState } from 'react';
import { formatDate, getCategoryColor } from '../../utils/helpers';
import './FeedbackItem.css';

/**
 * Individual Feedback Item Component
 * @param {Object} props - Component props
 * @param {Object} props.feedback - Feedback data
 * @param {Function} props.onDelete - Delete callback
 */
const FeedbackItem = ({ feedback, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Handle delete confirmation
   */
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm delete action
   */
  const confirmDelete = async () => {
    try {
      await onDelete(feedback._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  /**
   * Cancel delete action
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  /**
   * Render rating stars
   * @returns {JSX.Element} - Star rating display
   */
  const renderRating = () => {
    // Ensure rating is a number
    const rating = Number(feedback.rating) || 5;
    
    return (
      <div className="rating-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`rating-star ${star <= rating ? 'active' : ''}`}
          >
            ⭐
          </span>
        ))}
        <span className="rating-text">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="feedback-item">
      <div className="feedback-header">
        <div className="feedback-meta">
          <h3 className="feedback-name">{feedback.name}</h3>
          <span className="feedback-email">{feedback.email}</span>
          <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
        </div>
        
        <div className="feedback-tags">
          <span className={`tag category-tag ${getCategoryColor(feedback.category)}`}>
            {feedback.category}
          </span>
        </div>
      </div>

      {renderRating()}

      <div className="feedback-message">
        <p>{feedback.message}</p>
      </div>

      <div className="feedback-actions">
        <button
          onClick={handleDelete}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this feedback? This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button
                onClick={cancelDelete}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;