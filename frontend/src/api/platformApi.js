import axios from "axios";

import { apiurl } from "./api";

export const getPlatforms = () => axios.get(`${apiurl()}/platforms/`);

export const createPlatform = async (profileData) => {
  const response = await axios.post(`${apiurl()}/platforms/`, profileData);
  return response.data;
};
