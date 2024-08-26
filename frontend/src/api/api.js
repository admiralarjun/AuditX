import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Adjust as needed

// Utility function to encode data to base64
const encodeBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// API calls for profiles and controls
export const getProfiles = () => axios.get(`${API_URL}/get_profiles`);
export const getControls = (profileName) => axios.get(`${API_URL}/get_controls/${profileName}`);

export const executeControls = (profileName, selectedControlsList) => {
  return axios.post(`${API_URL}/execute_controls/${profileName}`, {
    controls: selectedControlsList
  });
};

export const getControlFile = (profile, control) => {
  return axios.get(`${API_URL}/controls/${profile}/files/${control}`);
};

export const updateControlFile = async (profile, control, code) => {
  try {
    const response = await axios.put(`${API_URL}/controls/${profile}/files/${control}`, {
      code: code
    });
    return response.data;
  } catch (error) {
    console.error('Error updating control file:', error.response?.data || error.message);
    throw error; // Re-throw the error for further handling if necessary
  }
};

export const getResult = (folderName, fileName) => axios.get(`${API_URL}/results/${folderName}/${fileName}`);
export const listFiles = (folderName) => axios.get(`${API_URL}/list_files/${folderName}`);

// Updated function to handle different actions
export const getCoPilotResponse = async (action, input) => {
  try {
    // Encode the input to base64
    const encodedInput = encodeBase64(input);
    const response = await axios.post(`${API_URL}/copilot/${action}`, {
      code: encodedInput, // Send the encoded input
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CoPilot response:', error);
    throw error;
  }
};
