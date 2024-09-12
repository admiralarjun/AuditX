import axios from "axios";

import { apiurl } from "./api";

export const getPlatforms = async () => {
  try {
    const response = await axios.get(`${apiurl()}/platforms/`);
    return response;
  } catch (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }
};

export const createPlatform = async (platformData) => {
  try {
    const formData = new FormData();
    formData.append('name', platformData.name);
    formData.append('release', platformData.release);
    formData.append('target_id', platformData.target_id);

    const response = await axios.post(`${apiurl()}/platforms/`, formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'An error occurred while creating the platform');
    }
    throw error;
  }
};

export const updatePlatform = async (platformId, platformData) => {
  const response = await axios.put(`${apiurl()}/platforms/${platformId}`, platformData);
  return response.data;
};

export const deletePlatform = async (platformId) => {
  const response = await axios.delete(`${apiurl()}/platforms/${platformId}`);
  return response.data;
};
