import axios from "axios";
import { apiurl } from "./api";

export const getSSHCreds = async () => {
  try {
    const response = await axios.get(`${apiurl()}/ssh_creds/`);
    return response;
  } catch (error) {
    console.error('Error fetching SSH credentials:', error);
    throw error;
  }
};

export const createSSHCreds = async (sshData) => {
  try {
    const formData = new FormData();
    for (const key in sshData) {
      if (sshData[key] !== null && sshData[key] !== undefined) {
        formData.append(key, sshData[key]);
      }
    }
    const response = await axios.post(`${apiurl()}/ssh_creds/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating SSH credentials:', error);
    throw error;
  }
};

export const updateSSHCreds = async (sshCredsId, sshData) => {
  try {
    const formData = new FormData();
    for (const key in sshData) {
      if (sshData[key] !== null && sshData[key] !== undefined) {
        formData.append(key, sshData[key]);
      }
    }
    const response = await axios.put(`${apiurl()}/ssh_creds/${sshCredsId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating SSH credentials:', error);
    throw error;
  }
};

export const deleteSSHCreds = async (sshCredsId) => {
  try {
    const response = await axios.delete(`${apiurl()}/ssh_creds/${sshCredsId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting SSH credentials:', error);
    throw error;
  }
};
