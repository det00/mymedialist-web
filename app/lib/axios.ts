import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "ngrok-skip-browser-warning": "69420" },
});

export default api;
