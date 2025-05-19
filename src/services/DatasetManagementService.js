import axios from 'axios';

// API base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Dataset Management Service
 * Handles all dataset-related API calls and operations
 */
class DatasetManagementService {
  /**
   * Get all datasets with optional filters
   * @param {Object} filters - Filter criteria
   * @param {string} filters.status - Filter by status (public/private)
   * @param {string} filters.category - Filter by category
   * @param {string} filters.search - Search term
   * @param {Object} pagination - Pagination options
   * @param {number} pagination.page - Current page
   * @param {number} pagination.pageSize - Items per page
   * @param {Object} sorting - Sorting options
   * @param {string} sorting.field - Field to sort by
   * @param {string} sorting.order - Sort order (asc/desc)
   * @returns {Promise<Object>} Paginated list of datasets
   */
  async getDatasets(filters = {}, pagination = {}, sorting = {}) {
    try {
      const { page = 1, pageSize = 10 } = pagination;
      const { field = 'updatedAt', order = 'desc' } = sorting;
      
      const params = {
        page,
        pageSize,
        sortBy: field,
        sortOrder: order,
        ...filters
      };
      
      const response = await axios.get(`${API_BASE_URL}/datasets`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching datasets:', error);
      throw error;
    }
  }

  /**
   * Get dataset categories
   * @returns {Promise<Array>} List of dataset categories
   */
  async getDatasetCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dataset categories:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific dataset
   * @param {string} datasetId - Dataset ID
   * @returns {Promise<Object>} Dataset details
   */
  async getDatasetById(datasetId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${datasetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Upload a new dataset
   * @param {FormData} formData - Dataset form data (includes file(s) and metadata)
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} Created dataset
   */
  async uploadDataset(formData, onProgress) {
    try {
      const response = await axios.post(`${API_BASE_URL}/datasets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress && typeof onProgress === 'function') {
            onProgress(percentCompleted);
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading dataset:', error);
      throw error;
    }
  }

  /**
   * Update an existing dataset
   * @param {string} datasetId - Dataset ID
   * @param {Object} datasetData - Updated dataset data
   * @returns {Promise<Object>} Updated dataset
   */
  async updateDataset(datasetId, datasetData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/datasets/${datasetId}`, datasetData);
      return response.data;
    } catch (error) {
      console.error(`Error updating dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a dataset
   * @param {string} datasetId - Dataset ID
   * @returns {Promise<Object>} Result
   */
  async deleteDataset(datasetId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/datasets/${datasetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Download a dataset
   * @param {string} datasetId - Dataset ID
   * @returns {Promise<Blob>} Dataset file blob
   */
  async downloadDataset(datasetId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${datasetId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Share a dataset with other users
   * @param {string} datasetId - Dataset ID
   * @param {Array<string>} userIds - List of user IDs to share with
   * @param {string} permissionLevel - Permission level (read, edit, etc.)
   * @returns {Promise<Object>} Result
   */
  async shareDataset(datasetId, userIds, permissionLevel = 'read') {
    try {
      const response = await axios.post(`${API_BASE_URL}/datasets/${datasetId}/share`, {
        userIds,
        permissionLevel
      });
      return response.data;
    } catch (error) {
      console.error(`Error sharing dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Toggle bookmark status for a dataset
   * @param {string} datasetId - Dataset ID
   * @param {boolean} isBookmarked - Whether to bookmark or unbookmark
   * @returns {Promise<Object>} Updated bookmark status
   */
  async toggleBookmark(datasetId, isBookmarked) {
    try {
      const method = isBookmarked ? 'post' : 'delete';
      const response = await axios[method](`${API_BASE_URL}/datasets/${datasetId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling bookmark for dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get dataset usage analytics
   * @param {string} datasetId - Dataset ID
   * @param {Object} timeRange - Time range for analytics
   * @returns {Promise<Object>} Usage statistics
   */
  async getDatasetAnalytics(datasetId, timeRange = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${datasetId}/analytics`, {
        params: timeRange
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Visualize dataset data
   * @param {string} datasetId - Dataset ID
   * @param {Object} visualizationOptions - Options for visualization
   * @returns {Promise<Object>} Visualization data
   */
  async visualizeDataset(datasetId, visualizationOptions = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/datasets/${datasetId}/visualize`, visualizationOptions);
      return response.data;
    } catch (error) {
      console.error(`Error visualizing dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new dataset version
   * @param {string} datasetId - Dataset ID
   * @param {FormData} formData - New version data
   * @returns {Promise<Object>} Created version
   */
  async createDatasetVersion(datasetId, formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/datasets/${datasetId}/versions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating new version for dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get all versions of a dataset
   * @param {string} datasetId - Dataset ID
   * @returns {Promise<Array>} List of dataset versions
   */
  async getDatasetVersions(datasetId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/datasets/${datasetId}/versions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching versions for dataset ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Transform dataset data
   * @param {string} datasetId - Dataset ID
   * @param {Object} transformationOptions - Data transformation options
   * @returns {Promise<Object>} Transformed data preview
   */
  async transformDataset(datasetId, transformationOptions) {
    try {
      const response = await axios.post(`${API_BASE_URL}/datasets/${datasetId}/transform`, transformationOptions);
      return response.data;
    } catch (error) {
      console.error(`Error transforming dataset ${datasetId}:`, error);
      throw error;
    }
  }
}

export default new DatasetManagementService(); 