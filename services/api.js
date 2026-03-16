import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getTopGrossing = async () => {
  const response = await axios.get(`${API_BASE_URL}/analytics/top-grossing`);
  return response.data;
};

export const getBudgetRevenue = async () => {
  const response = await axios.get(`${API_BASE_URL}/analytics/budget-vs-revenue`);
  return response.data;
};

export const getGenrePopularity = async () => {
  const response = await axios.get(`${API_BASE_URL}/analytics/genre-popularity`);
  return response.data;
};

export const getCorrelation = async () => {
  const response = await axios.get(`${API_BASE_URL}/analytics/correlation`);
  return response.data;
};

export const getMovies = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies/`);
  return response.data;
};

export const addMovie = async (movieData) => {
  const response = await axios.post(`${API_BASE_URL}/movies/`, movieData);
  return response.data;
};

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await axios.post(`${API_BASE_URL}/analytics/dynamic-parse`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};