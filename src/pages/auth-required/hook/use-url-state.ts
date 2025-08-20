import { useSearchParams } from "react-router";

type UrlStateAction<T extends Record<string, number | string>> = {
    [K in keyof T]: { key: K; value: T[K] };
}[keyof T];

export function useUrlState<T extends Record<string, number | string>>(initialState: T, namespace?: string) {
    const [searchParams, setSearchParams] = useSearchParams();

    const state = Object.fromEntries(
        Object.entries(initialState).map(([key, defaultValue]) => {
            const value = searchParams.get(
                namespace
                    ? `${namespace}-${key}`
                    : key
            );
            return [
                key,
                value !== null
                    ? (typeof defaultValue === 'number' ? Number(value) : value)
                    : defaultValue
            ];
        })
    );

    const dispatch = (action: UrlStateAction<T>) => {
        const params = new URLSearchParams(searchParams);
        params.set(
            namespace
                ? `${namespace}-${String(action.key)}`
                : String(action.key),
            String(action.value)
        );
        setSearchParams(params);
    };

    return [state as T, dispatch] as const;
}