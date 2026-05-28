import { getAccessToken, setAccessToken } from "./accessToken";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestBody = Record<string, unknown> | unknown[] | FormData | undefined;

interface HttpClientOptions {
  body?: RequestBody;
  headers?: HeadersInit;
  method?: HttpMethod;
  skipAuthRefresh?: boolean;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  readonly data: unknown;
  readonly status: number;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (endpoint: string) => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${API_BASE_URL}${normalizedEndpoint}`;
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const resolveErrorMessage = (data: unknown, fallback: string) => {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
};

const extractAccessToken = (data: unknown) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("accessToken" in data && typeof data.accessToken === "string") {
    return data.accessToken;
  }

  if ("access_token" in data && typeof data.access_token === "string") {
    return data.access_token;
  }

  if ("token" in data && typeof data.token === "string") {
    return data.token;
  }

  return null;
};

const refreshAccessToken = async () => {
  const response = await fetch(buildUrl("/refresh-token"), {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    setAccessToken(null);
    throw new ApiError(
      resolveErrorMessage(data, "Your session has expired."),
      response.status,
      data
    );
  }

  const nextAccessToken = extractAccessToken(data);
  setAccessToken(nextAccessToken);

  return nextAccessToken;
};

export const httpClient = async <TResponse>(
  endpoint: string,
  options: HttpClientOptions = {}
): Promise<TResponse> => {
  const makeRequest = async () => {
    const token = getAccessToken();
    const isFormData = options.body instanceof FormData;
    let requestBody: BodyInit | undefined;

    if (options.body instanceof FormData) {
      requestBody = options.body;
    } else if (options.body !== undefined) {
      requestBody = JSON.stringify(options.body);
    }

    return fetch(buildUrl(endpoint), {
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      },
      method: options.method ?? "GET",
      signal: options.signal,
      body: requestBody
    });
  };

  let response = await makeRequest();

  if (response.status === 401 && !options.skipAuthRefresh) {
    await refreshAccessToken();
    response = await makeRequest();
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      resolveErrorMessage(data, "Something went wrong. Please try again."),
      response.status,
      data
    );
  }

  return data as TResponse;
};
