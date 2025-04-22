import { useState, useCallback, useEffect } from 'react';
import { PaginatedResponse, QueryOptions } from '../types';
import { ResourceService } from '../services/resource.service';

interface PaginatedState<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    loading: boolean;
    error: Error | null;
}

export function usePaginatedResource<T, C = Partial<T>, U = Partial<T>>(
    resourceService: ResourceService<T, C, U>,
    initialOptions:  QueryOptions = { page: 1, limit: 10 }
) {
    const [options, setOptions] = useState<QueryOptions>(initialOptions);
    const [state, setState] = useState<PaginatedState<T>>({
        data: [],
        meta: null,
        loading: false,
        error: null,
    });

    const fetchPage = useCallback(
        async (newOptions?: QueryOptions) => {
            const fetchOptions = newOptions || options;
            try {
                setState((prev) => ({ ...prev, loading: true, error: null }));

                // Assuming the API returns a PaginatedResponse
                const response = await resourceService.customEndpoint<PaginatedResponse<T>>(
                    'GET',
                    'paginated',
                    undefined,
                    fetchOptions
                );

                setState({
                    data: response.data,
                    meta: response.meta,
                    loading: false,
                    error: null,
                });

                if (newOptions) {
                    setOptions(newOptions);
                }
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: error instanceof Error ? error : new Error('Failed to fetch resources'),
                }));
            }
        },
        [resourceService, options]
    );

    const goToPage = useCallback(
        (page: number) => {
            fetchPage({ ...options, page });
        },
        [fetchPage, options]
    );

    const changeLimit = useCallback(
        (limit: number) => {
            fetchPage({ ...options, limit, page: 1 });
        },
        [fetchPage, options]
    );

    const changeSort = useCallback(
        (sort: string, order: 'asc' | 'desc' = 'asc') => {
            fetchPage({ ...options, sort, order });
        },
        [fetchPage, options]
    );

    const applyFilters = useCallback(
        (filters: Record<string, string | number | boolean>) => {
            fetchPage({ ...options, filters, page: 1 });
        },
        [fetchPage, options]
    );

    useEffect(() => {
        fetchPage();
    }, []);

    return {
        ...state,
        options,
        fetchPage,
        goToPage,
        changeLimit,
        changeSort,
        applyFilters,
    };
}
