import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// Automatically attach JWT token from localStorage to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("nook_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTasks = () => client.get("/");
export const createTask = (task) => client.post("/", task);
export const updateTask = (id, task) => client.put(`/${id}`, task);
export const deleteTask = (id) => client.delete(`/${id}`);
