import axios from "axios";

const API_URL = "http://localhost:8000"; // Adjust as needed

// Utility function to encode data to base64
const encodeBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// API calls for profiles and controls
export const getProfiles = () => axios.get(`${API_URL}/profiles`);
