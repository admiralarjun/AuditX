import axios from "axios";

const API_URL = "http://localhost:8000"; // Adjust as needed

// Utility function to encode data to base64
const encodeBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// API calls for profiles and controls
export const getProfiles = () => axios.get(`${API_URL}/profiles`);

export const createProfile = async (profileData) => {
  const response = await axios.post(`${API_URL}/profiles/`, profileData);
  return response.data;
};
