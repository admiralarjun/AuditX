import axios from "axios";

import { apiurl } from "./api";

export const getPlatforms = () => axios.get(`${apiurl()}/platforms/`);

export const createPlatform = async (platformData) => {
  const response = await axios.post(`${apiurl()}/platforms/`, platformData);
  return response.data;
};

export const updatePlatform = async (platformId, platformData) => {
  const response = await axios.put(`${apiurl()}/platforms/${platformId}`, platformData);
  return response.data;
};

export const deletePlatform = async (platformId) => {
  const response = await axios.delete(`${apiurl()}/platforms/${platformId}`);
  return response.data;
};
