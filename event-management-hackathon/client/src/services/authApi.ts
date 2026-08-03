import axios, { AxiosResponse } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    email: string;
  };
}

const placeholderClient = axios.create({
  adapter: async (config) => {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

    const response: AxiosResponse<LoginResponse> = {
      data: {
        success: true,
        message: 'Login successful',
        user: {
          email: payload?.email ?? '',
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };

    return response;
  },
});

export const loginWithPlaceholderApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await placeholderClient.post<LoginResponse>('/placeholder-login', credentials);
  return response.data;
};
