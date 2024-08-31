import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/results/`, {
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const fetchReportById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/results/${id}/`, {
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching report with id ${id}:`, error);
    throw error;
  }
};

export default {
  fetchReports,
  fetchReportById
};