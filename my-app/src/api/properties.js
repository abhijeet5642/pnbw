import api from './axiosConfig';

/**
 * Fetches a list of all properties.
 * @returns {Promise<Array>} A promise that resolves to an array of property objects.
 */
export  async function getProperties() {
  try {
    const { data } = await api.get('/properties');
    return data;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error;
  }
}

/**
 * Fetches a single property by its ID.
 * @param {string} propertyId The ID of the property to fetch.
 * @returns {Promise<Object>} A promise that resolves to the property object.
 */
export async function getPropertyById(propertyId) {
  try {
    const { data } = await api.get(`/properties/${propertyId}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch property ${propertyId}:`, error);
    throw error;
  }
}

/**
 * Creates a new property. (Admin only)
 * @param {Object} propertyData The data for the new property.
 * @returns {Promise<Object>} The newly created property object.
 */
export async function createProperty(propertyData) {
  try {
    const { data } = await api.post('/properties', propertyData);
    return data;
  } catch (error) {
    console.error('Failed to create property:', error);
    throw error;
  }
}

/**
 * Updates an existing property. (Admin only)
 * @param {string} propertyId The ID of the property to update.
 * @param {Object} propertyData The new data for the property.
 * @returns {Promise<Object>} The updated property object.
 */
export async function updateProperty(propertyId, propertyData) {
  try {
    const { data } = await api.put(`/properties/${propertyId}`, propertyData);
    return data;
  } catch (error) {
    console.error(`Failed to update property ${propertyId}:`, error);
    throw error;
  }
}

/**
 * Deletes a property. (Admin only)
 * @param {string} propertyId The ID of the property to delete.
 * @returns {Promise<Object>} Success message.
 */
export async function deleteProperty(propertyId) {
  try {
    const { data } = await api.delete(`/properties/${propertyId}`);
    return data;
  } catch (error) {
    console.error(`Failed to delete property ${propertyId}:`, error);
    throw error;
  }
}
