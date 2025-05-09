import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to each request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH APIs
export const signUpUser = async (data) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const loginUser = async (data) => {
  try {
    const res = await axios.post('http://localhost:8000/api/auth/login', data);
    return res.data;
  } catch (error) {
    return { message: error.response?.data?.message || 'Server error' };
  }
};


// EMPLOYEE APIs
export const getAllEmployees = () => api.get('/employees');
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const createEmployee = (employeeData) => api.post('/employees', employeeData);

export const fetchEmployees = async () => {
  const res = await fetch(`${BASE_URL}/employees`);
  return await res.json();
};

export const addEmployee = async (employeeData) => {
  const res = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData),
  });
  return await res.json();
};
// DEPARTMENT APIs
export const getDepartments = () => api.get('/departments');

// SALARY APIs
export const getSalarySlips = (employeeId) => api.get(`/salaries/${employeeId}`);
export const createSalarySlip = (data) => api.post('/salaries', data);

// Optional: Utility to manually set/reset token (not needed if you use loginUser)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
