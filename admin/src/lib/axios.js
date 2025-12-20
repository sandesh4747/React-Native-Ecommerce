import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "import.meta.env.VITE_API_BASE_URL",
  withCreadentials: true, // by adding this field browser will send cookies to server automatically, on every single request
});

export default axiosInstance;
