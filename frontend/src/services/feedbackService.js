import api from './api';

/**
 * Feedback service for CRUD operations
 */
class FeedbackService {
  /**
   * Get all feedback with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - API response
   */
  async getFeedback(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/feedback?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Create new feedback
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise} - API response
   */
  async createFeedback(feedbackData) {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Delete feedback
   * @param {string} id - Feedback ID
   * @returns {Promise} - API response
   */
  async deleteFeedback(id) {
    try {
      const response = await api.delete(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

// Create and export an instance
const feedbackService = new FeedbackService();
export default feedbackService;