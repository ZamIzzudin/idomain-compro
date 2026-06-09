/** @format */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface ApiConfig {
  baseURL?: string;
  timeout?: number;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor(config: ApiConfig = {}) {
    this.instance = axios.create({
      baseURL:
        config.baseURL ||
        process.env.NEXT_PUBLIC_API ||
        "http://localhost:8000/api/v1",
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("alumni_token");
          if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  get api(): AxiosInstance {
    return this.instance;
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}

const AxiosClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API || "http://localhost:8000/api/v1",
  timeout: 10000,
});

export default AxiosClient;
