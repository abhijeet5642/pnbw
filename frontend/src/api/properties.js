import apiClient from './apiClient.js'; // Import the new central client

// Get all properties
export const getProperties = async () => {
  const { data } = await apiClient.get('/properties');
  return data;
};

// Get a single property by its ID
export const getPropertyById = async (id) => {
  const { data } = await apiClient.get(`/properties/${id}`);
  return data;
};

// Create a new property
export const createProperty = async (formData) => {
  // When you send a FormData object with Axios, it automatically sets
  // the correct 'Content-Type: multipart/form-data' header with the boundary.
  const { data } = await apiClient.post('/properties', formData);
  return data;
};

// Delete a property by its ID
export const deleteProperty = async (id) => {
  const { data } = await apiClient.delete(`/properties/${id}`);
  return data;
};

// (Optional) Update a property
export const updateProperty = async (id, propertyData) => {
  const { data } = await apiClient.put(`/properties/${id}`, propertyData);
  return data;
};

// --- FUNCTIONS FOR REVIEWS (NEWLY ADDED) ---

/**
 * Get all reviews for a specific property.
 * @param {string} propertyId The ID of the property.
 * @returns {Promise<Array>} A promise that resolves to an array of reviews.
 */
export const getReviewsForProperty = async (propertyId) => {
  const { data } = await apiClient.get(`/properties/${propertyId}/reviews`);
  return data;
};

/**
 * Create a new review for a property.
 * @param {string} propertyId The ID of the property to review.
 * @param {object} reviewData The review data (e.g., { rating, comment }).
 * @returns {Promise<object>} A promise that resolves to the server's response.
 */
export const createReview = async (propertyId, reviewData) => {
  const { data } = await apiClient.post(`/properties/${propertyId}/reviews`, reviewData);
  return data;
};