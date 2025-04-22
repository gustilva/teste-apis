import { apiClient } from '../api-client';
import { QueryOptions } from '../types';

export class ResourceService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
    constructor(private readonly baseEndpoint: string) {}

    async getAll(options?: QueryOptions): Promise<T[]> {
        const queryParams = this.buildQueryParams(options);
        return apiClient.get<T[]>(`${this.baseEndpoint}/getAll/${queryParams}`);
    }

    async getById(id: string | number): Promise<T> {
        return apiClient.get<T>(`${this.baseEndpoint}/getById/${id}`);
    }

    async create(data: CreateDTO): Promise<T> {
        return apiClient.post<T>(`${this.baseEndpoint}/create`, data);
    }

    async update(id: string | number, data: UpdateDTO): Promise<T> {
        return apiClient.patch<T>(`${this.baseEndpoint}/update/${id}`, data);
    }

    async delete(id: string | number): Promise<void> {
        return apiClient.delete<void>(`${this.baseEndpoint}/remove${id}`);
    }

    async customEndpoint<R>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        endpoint: string,
        data?: any,
        options?: QueryOptions
    ): Promise<R> {
        const url = `${this.baseEndpoint}/${endpoint}${this.buildQueryParams(options)}`;

        switch (method) {
            case 'GET':
                return apiClient.get<R>(url);
            case 'POST':
                return apiClient.post<R>(url, data);
            case 'PUT':
                return apiClient.put<R>(url, data);
            case 'PATCH':
                return apiClient.patch<R>(url, data);
            case 'DELETE':
                return apiClient.delete<R>(url);
            default:
                throw new Error(`Method ${method} is not supported`);
        }
    }

    private buildQueryParams(options?: QueryOptions): string {
        if (!options) return '';

        const params = new URLSearchParams();

        if (options.filters) {
            Object.entries(options.filters).forEach(([key, value]) => {
                params.append(key, String(value));
            });
        }

        if (options.page !== undefined) {
            params.append('page', String(options.page));
        }

        if (options.limit !== undefined) {
            params.append('limit', String(options.limit));
        }

        if (options.sort) {
            params.append('sort', options.sort);
        }

        if (options.order) {
            params.append('order', options.order);
        }

        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    }
}
