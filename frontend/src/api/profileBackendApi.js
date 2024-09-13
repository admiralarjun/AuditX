import axios from "axios";

const API_URL = "http://localhost:8000"; // Adjust as needed

// Utility function to encode data to base64
const encodeBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// API calls for profiles and controls
export const getProfiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/profiles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};

export const createProfile = async (profileData) => {
  const formData = new FormData();
  formData.append('platform_id', profileData.platform_id);
  formData.append('name', profileData.name);
  formData.append('creds_type', profileData.creds_type);
  if(profileData.creds_id) formData.append('creds_id', profileData.creds_id);

  try {
    console.log("Creating profile:", profileData);
    const response = await axios.post(`${API_URL}/profiles/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};
