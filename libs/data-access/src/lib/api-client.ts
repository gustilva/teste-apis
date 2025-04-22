import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { environment } from './environment.prod';


export class ApiClient {
    private readonly client: AxiosInstance;
    private static instance: ApiClient;

    private constructor() {
        this.client = axios.create({
            baseURL: environment.apiUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        this.setupInterceptors();
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }


        return ApiClient.instance;
    }

    private setupInterceptors(): void {

        this.client.interceptors.request.use((config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use((response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('spesiaRefreshToken');
                        if (refreshToken) {
                            const response = await axios.post(`${environment.apiUrl}/auth/refresh`,
                                { refreshToken }
                            );

                            const { token, userId } = response.data;
                            localStorage.setItem('spesiaAccessToken', token);
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return this.client(originalRequest);

                        }
                    } catch (error) {
                        localStorage.removeItem('spesiaAccessToken');
                        localStorage.removeItem('spesiaRefreshToken');
                        window.dispatchEvent(new CustomEvent('logout'));
                    }
                }

                return Promise.reject(error);
            });
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse = await this.client.get(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config);
        return response.data;
    }

}

export const apiClient = ApiClient.getInstance();

