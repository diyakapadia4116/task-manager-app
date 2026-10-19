import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5000/api/auth";

const client = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

export const register = (data) => client.post("/register", data);
export const login = (data) => client.post("/login", data);
