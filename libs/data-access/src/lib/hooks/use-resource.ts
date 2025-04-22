import { useState, useCallback, useMemo } from 'react';
import { ResourceService } from '../services/resource.service';
import { QueryOptions } from '../types';

interface ResourceHookState<T> {
    data: T | null;
    list: T[];
    loading: boolean;
    error: Error | null;
}

export interface ResourceHookActions<T, C, U> {
    fetch: (id: string | number) => Promise<T>;
    fetchAll: (options?: QueryOptions) => Promise<T[]>;
    create: (data: C) => Promise<T>;
    update: (id: string | number, data: U) => Promise<T>;
    remove: (id: string | number) => Promise<void>;
    reset: () => void;
}

export function useResource<T, C = Partial<T>, U = Partial<T>, S extends ResourceService<T, C, U> = ResourceService<T, C, U>>(
    resourceService: S
): [
    ResourceHookState<T>,
        ResourceHookActions<T, C, U> & {
        [K in keyof Omit<S, keyof ResourceService<T, C, U>>]: S[K]
    }
] {
    const [state, setState] = useState<ResourceHookState<T>>({
        data: null,
        list: [],
        loading: false,
        error: null,
    });

    const setLoading = useCallback(() => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
    }, []);

    const setError = useCallback((error: Error) => {
        setState((prev) => ({ ...prev, loading: false, error }));
    }, []);

    const fetch = useCallback(
        async (id: string | number) => {
            try {
                setLoading();
                const data = await resourceService.getById(id);
                setState((prev) => ({ ...prev, data, loading: false }));
                return data;
            } catch (error) {
                const err = error instanceof Error
                    ? error
                    : new Error('Failed to fetch resource');
                setError(err);
                throw err;
            }
        },
        [resourceService, setLoading, setError]
    );

    const fetchAll = useCallback(
        async (options?: QueryOptions) => {
            try {
                setLoading();
                const list = await resourceService.getAll(options);
                setState((prev) => ({ ...prev, list, loading: false }));
                return list;
            } catch (error) {
                const err = error instanceof Error
                    ? error
                    : new Error('Failed to fetch resources');
                setError(err);
                throw err;
            }
        },
        [resourceService, setLoading, setError]
    );

    const create = useCallback(
        async (data: C) => {
            try {
                setLoading();
                const result = await resourceService.create(data);
                setState((prev) => ({
                    ...prev,
                    data: result,
                    list: [...prev.list, result],
                    loading: false
                }));
                return result;
            } catch (error) {
                const err = error instanceof Error
                    ? error
                    : new Error('Failed to create resource');
                setError(err);
                throw err;
            }
        },
        [resourceService, setLoading, setError]
    );

    const update = useCallback(
        async (id: string | number, data: U) => {
            try {
                setLoading();
                const result = await resourceService.update(id, data);
                setState((prev) => ({
                    ...prev,
                    data: result,
                    list: prev.list.map((item: any) => (item.id === id ? result : item)),
                    loading: false,
                }));
                return result;
            } catch (error) {
                const err = error instanceof Error
                    ? error
                    : new Error('Failed to update resource');
                setError(err);
                throw err;
            }
        },
        [resourceService, setLoading, setError]
    );

    const remove = useCallback(
        async (id: string | number) => {
            try {
                setLoading();
                await resourceService.delete(id);
                setState((prev) => ({
                    ...prev,
                    data: prev.data && (prev.data as any).id === id ? null : prev.data,
                    list: prev.list.filter((item: any) => item.id !== id),
                    loading: false,
                }));
            } catch (error) {
                const err = error instanceof Error
                    ? error
                    : new Error('Failed to delete resource');
                setError(err);
                throw err;
            }
        },
        [resourceService, setLoading, setError]
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            list: [],
            loading: false,
            error: null,
        });
    }, []);

    const customMethods = useMemo(() => {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(resourceService))
            .filter(
                prop =>
                    typeof (resourceService as any)[prop] === 'function' &&
                    !['constructor', 'getAll', 'getById', 'create', 'update', 'delete', 'customEndpoint'].includes(prop)
            );

        return methods.reduce((acc, methodName) => {
            acc[methodName] = async (...args: any[]) => {
                try {
                    setLoading();
                    const result = await (resourceService as any)[methodName](...args);
                    setState((prev) => ({ ...prev, data: result, loading: false }));
                    return result;
                } catch (error) {
                    const err = error instanceof Error
                        ? error
                        : new Error(`Failed to execute ${methodName}`);
                    setError(err);
                    throw err;
                }
            };
            return acc;
        }, {} as Record<string, (...args: any[]) => Promise<any>>);
    }, [resourceService, setLoading, setError]);

    const actions = {
        fetch,
        fetchAll,
        create,
        update,
        remove,
        reset,
        ...customMethods
    };

    return [state, actions as ResourceHookActions<T, C, U> & { [K in keyof Omit<S, keyof ResourceService<T, C, U>>]: S[K] }];
}
