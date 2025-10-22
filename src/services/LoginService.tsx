import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountInstance } from "../api/axiosinstance";
import axios from "axios";

export interface TenantInfo {
  username: string;
  client_id?: number;
  client_username?: string;
  alias?: string;
}

export interface AuthState {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  tenant_info?: TenantInfo;
}

// ---------------- Utilities ----------------

// Always read current auth state from localStorage
export function getAuthState(): AuthState | null {
  const raw = localStorage.getItem("authState");
  return raw ? JSON.parse(raw) : null;
}

// Save auth state and preserve tenant alias
export function saveAuthState(authState: AuthState | null) {
  if (authState) {
    localStorage.setItem("authState", JSON.stringify(authState));
    localStorage.setItem("access_token", authState.access_token);
    localStorage.setItem("refresh_token", authState.refresh_token);
    if (authState.tenant_info?.alias) {
      localStorage.setItem("tenant_alias", authState.tenant_info.alias);
    }
  }
}

// Refresh access token without losing tenant info
export async function refreshAccessToken(): Promise<string | null> {
  const authState = getAuthState();
  if (!authState?.refresh_token) return null;

  try {
    const response = await AccountInstance.post("/api/token/refresh/", {
      refresh: authState.refresh_token,
    });

    const { access, refresh } = response.data;
    const newAuthState: AuthState = {
      ...authState,
      access_token: access,
      refresh_token: refresh ?? authState.refresh_token,
    };

    saveAuthState(newAuthState);
    return access;
  } catch (err) {
    // Keep tenant_alias in storage even if token refresh fails
    localStorage.removeItem("authState");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}

// Utility to parse Axios errors
function parseError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as any)?.detail || err.message || "Request failed";
  }
  return (err as Error)?.message || "Request failed";
}

// ---------------- Component ----------------
const LoginService: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getAuthState());

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await AccountInstance.post<AuthState>("/api/login/", {
        username,
        password,
      });

      const { access_token, refresh_token, tenant, token_type } = response.data;

      const newAuthState: AuthState = {
        access_token,
        refresh_token,
        tenant_info: tenant,
        token_type,
      };

      saveAuthState(newAuthState);

      setLoggedIn(true);
      navigate("/fitout", { replace: true });
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear tokens but KEEP tenant alias
    localStorage.removeItem("authState");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setError(null);
    window.location.href = "/";
  };

  if (loggedIn) {
    const authState = getAuthState();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Welcome, {authState?.tenant_info?.username || username}!
          </h2>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg transform transition-all hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Login
        </h2>
        {error && (
          <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginService;
