//services/auth.ts
import axios from "axios";

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    CNE?: string;
    registrationNumber?: string;
    groupId?: number;
    groupName?: string;
    phone?: string;
    }


interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  role: string;
  userDetails: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + "/api/auth";

export const register = async (userData: UserData): Promise<void> => {
  await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
};

export const login = async (credentials: SignInData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};
