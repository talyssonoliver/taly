import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

interface UseFetchOptions<T> extends AxiosRequestConfig {
	skip?: boolean;
	onSuccess?: (data: T) => void;
	onError?: (error: AxiosError) => void;
}

interface UseFetchState<T> {
	data: T | null;
	error: string | null;
	loading: boolean;
	refetch: () => void;
}

export function useFetch<T = unknown>(
	url: string | null | undefined,
	options: UseFetchOptions<T> = {},
): UseFetchState<T> {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [refetchIndex, setRefetchIndex] = useState<number>(0);

	const refetch = useCallback(() => {
		setRefetchIndex((prev) => prev + 1);
	}, []);

	useEffect(() => {
		if (!url || options.skip) {
			// Early return if no URL or skip is true
			return;
		}

		let isMounted = true;
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const response: AxiosResponse<T> = await axios({
					url,
					method: options.method || "GET",
					headers: options.headers,
					params: options.params,
					data: options.data,
				});

				if (isMounted) {
					setData(response.data);
					options.onSuccess?.(response.data);
				}
			} catch (err) {
				if (isMounted) {
					const axiosError = err as AxiosError;
					setError(axiosError.message || "An error occurred");
					options.onError?.(axiosError);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	// refetchIndex is needed to trigger a refetch when the refetch function is called
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		url,
		refetchIndex,
		options.skip,
		options.method,
		options.headers,
		options.params,
		options.data,
		options.onSuccess,
		options.onError,
	]);

	return { data, error, loading, refetch };
}
