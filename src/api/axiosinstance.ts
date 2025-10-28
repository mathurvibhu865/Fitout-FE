// src/api/axiosinstance.ts
import axios from "axios";
import type { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthState, saveAuthState, refreshAccessToken } from "../services/LoginService";

const AccountURL = "http://127.0.0.1:8000";
const FitoutRequestURL = "http://127.0.0.1:8001/api/";

// ---------------- Axios Instances ----------------
const AccountInstance: AxiosInstance = axios.create({ baseURL: AccountURL });
const FitoutRequestInstance: AxiosInstance = axios.create({ baseURL: FitoutRequestURL });

// ---------------- Token Refresh Queue ----------------
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const sub = (cb: (token: string | null) => void) => queue.push(cb);
const flush = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

// ---------------- Tenant Alias Helpers ----------------
const getTenantAlias = (): string | null => {
  const authState = getAuthState();
  return authState?.tenant_info?.alias || localStorage.getItem("tenantAlias");
};

// ---------------- Attach Interceptors ----------------
function attachAuthInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    const authState = getAuthState();
    config.headers = config.headers ?? {};


    // Attach access token
    if (authState?.access_token) {
      (config.headers as any).Authorization = `Bearer ${authState.access_token}`;
    }

    // Attach tenant alias (persistent fallback)
    const tenantAlias = getTenantAlias();
    if (tenantAlias) {
      (config.headers as any)["X-Tenant-Alias"] = tenantAlias;
    }

    // Remove Content-Type if sending FormData (browser sets boundary)
    if (config.data instanceof FormData) {
      delete (config.headers as any)["Content-Type"];
    }

    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const detail = (error.response?.data as any)?.detail;
      const original = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Handle token refresh
      if ((status === 401 || status === 403) && detail === "Token expired." && !original._retry) {
        original._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newAuthState = await refreshAccessToken();
            saveAuthState(newAuthState); // persist new token + tenant info
            isRefreshing = false;
            flush(newAuthState.access_token);
          } catch (err) {
            isRefreshing = false;
            flush(null);
            return Promise.reject(err);
          }
        }

        return new Promise((resolve, reject) => {
          sub((newToken) => {
            if (newToken) {
              original.headers = original.headers ?? {};
              (original.headers as any).Authorization = `Bearer ${newToken}`;
              resolve(instance(original));
            } else reject(error);
          });
        });
      }

      return Promise.reject(error);
    }
  );
}

// ---------------- Initialize ----------------
attachAuthInterceptors(AccountInstance);
attachAuthInterceptors(FitoutRequestInstance);

export { AccountInstance, FitoutRequestInstance };



