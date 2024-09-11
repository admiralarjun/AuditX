import axios from "axios";

import { apiurl } from "./api";

export const getPlatforms = () => axios.get(`${apiurl()}/platforms/`);

export const createPlatform = async (platformData) => {
  try {
    const formData = new FormData();
    for (const key in platformData) {
      if (platformData[key] !== null && platformData[key] !== undefined) {
        formData.append(key, platformData[key]);
      }
    }
    const response = await axios.post(`${apiurl()}/platforms/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
