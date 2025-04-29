import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// TOKEN MANAGEMENT

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

// API INSTANCE / INTERCEPTORS

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      removeToken();
      window.location.href = "/admin"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Usage API calls

export const getAllGuest = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    const res = await axiosInstance.get("/guests", config);

    console.log("Response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching guests:", error);
    throw error;
  }
};

export const createGuest = async (guestData) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    const res = await axiosInstance.post("/guests", guestData, config);

    console.log("Response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating guest:", error);
    throw error;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const res = await axiosInstance.post("/auth/login", credentials);

    console.log("Response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const res = await axiosInstance.post("/payments", paymentData);
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getAllPayments = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    const res = await axiosInstance.get("/payments", config);

    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const res = await axiosInstance.get(`/payments/${paymentId}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    throw error;
  }
};
