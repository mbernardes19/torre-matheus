export interface HttpServiceConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
}

export interface HttpService {
  get: <T = unknown>(url: string, config?: RequestConfig) => Promise<T>;
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<T>;
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<T>;
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<T>;
  delete: <T = unknown>(url: string, config?: RequestConfig) => Promise<T>;
}

export function createHttpService(config: HttpServiceConfig = {}): HttpService {
  const {
    baseURL = "",
    headers: defaultHeaders = {},
    timeout: defaultTimeout = 30000,
  } = config;

  function buildURL(url: string, params?: Record<string, string>): string {
    const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`;

    if (!params) {
      return fullURL;
    }

    const urlObj = new URL(fullURL);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });

    return urlObj.toString();
  }

  function mergeHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...customHeaders,
    };
  }

  async function request<T>(
    url: string,
    method: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      params,
      timeout = defaultTimeout,
      headers: customHeaders,
      ...fetchConfig
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(buildURL(url, params), {
        method,
        headers: mergeHeaders(customHeaders as Record<string, string>),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...fetchConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw new Error("An unknown error occurred");
    }
  }

  function get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return request<T>(url, "GET", undefined, config);
  }

  function post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return request<T>(url, "POST", data, config);
  }

  function put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return request<T>(url, "PUT", data, config);
  }

  function patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return request<T>(url, "PATCH", data, config);
  }

  function deleteRequest<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<T> {
    return request<T>(url, "DELETE", undefined, config);
  }

  return {
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
  };
}
