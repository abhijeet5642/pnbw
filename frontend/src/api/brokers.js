// frontend/src/api/brokers.js
import apiClient from './apiClient.js';

export const getBrokerDashboardData = async (brokerId) => {
  const { data } = await apiClient.get(`/brokers/${brokerId}/dashboard`);
  return data;
};