import axios from "axios";

const API_URL = "http://localhost:3000"; // Asegúrate que coincida con tu backend
const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});
