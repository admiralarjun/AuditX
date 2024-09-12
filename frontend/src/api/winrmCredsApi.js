import axios from "axios";
import { apiurl } from "./api";

export const getWinRMCreds = async () => {
  try {
    const response = await axios.get(`${apiurl()}/winrm_creds/`);
    return response;
  } catch (error) {
    console.error('Error fetching WinRM credentials:', error);
    throw error;
  }
};

export const createWinRMCreds = async (winrmData) => {
  try {
    const response = await axios.post(`${apiurl()}/winrm_creds/`, winrmData);
    return response.data;
  } catch (error) {
    console.error('Error creating WinRM credentials:', error);
    throw error;
  }
};

export const updateWinRMCreds = async (winrmCredsId, winrmData) => {
  try {
    const response = await axios.put(`${apiurl()}/winrm_creds/${winrmCredsId}`, winrmData);
    return response.data;
  } catch (error) {
    console.error('Error updating WinRM credentials:', error);
    throw error;
  }
};

export const deleteWinRMCreds = async (winrmCredsId) => {
  try {
    const response = await axios.delete(`${apiurl()}/winrm_creds/${winrmCredsId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting WinRM credentials:', error);
    throw error;
  }
};
