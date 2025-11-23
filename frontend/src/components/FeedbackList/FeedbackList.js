import React from 'react';
import FeedbackItem from '../FeedbackItem/FeedbackItem';
import './FeedbackList.css';

/**
 * Feedback List Component to display multiple feedback items
 * @param {Array} props.feedback - Array of feedback objects
 * @param {Function} props.onDelete - Delete callback
 * @param {boolean} props.isLoading - Loading state
 */
const FeedbackList = ({ feedback, onDelete, isLoading = false }) => {
  /**
   * Render loading state
   * @returns {JSX.Element} - Loading indicator
   */
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading feedback...</p>
    </div>
  );

  /**
   * Render empty state
   * @returns {JSX.Element} - Empty state message
   */
  const renderEmpty = () => (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <h3>No Feedback Yet</h3>
      <p>Be the first to share your thoughts and feedback!</p>
    </div>
  );

  if (isLoading) {
    return renderLoading();
  }

  if (!feedback || feedback.length === 0) {
    return renderEmpty();
  }

  return (
    <div className="feedback-list">
      <div className="feedback-stats">
        <span className="stat-count">
          {feedback.length} {feedback.length === 1 ? 'feedback' : 'feedbacks'}
        </span>
      </div>

      <div className="feedback-items">
        {feedback.map((item) => (
          <FeedbackItem
            key={item._id}
            feedback={item}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;