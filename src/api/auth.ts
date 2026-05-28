import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { setAccessToken } from "./accessToken";
import { httpClient } from "./httpClient";

export interface ILoginCredentials {
  userName: string;
  password: string;
}

export interface AuthUser {
  email?: string;
  id?: string;
  name: string;
  role?: string;
  username?: string;
}

export interface AuthSession {
  accessToken: string | null;
  user: AuthUser;
}

interface AuthUserDto {
  email?: unknown;
  id?: unknown;
  name?: unknown;
  role?: unknown;
  username?: unknown;
}

interface AuthSessionDto {
  access_token?: unknown;
  accessToken?: unknown;
  token?: unknown;
  user?: AuthUserDto | unknown;
}

export const authQueryKeys = {
  all: ["auth"] as const,
  session: () => [...authQueryKeys.all, "session"] as const
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === "object";
};

const readString = (value: unknown) => {
  return typeof value === "string" ? value : undefined;
};

const getAccessTokenFromResponse = (dto: AuthSessionDto) => {
  return (
    readString(dto.accessToken) ??
    readString(dto.access_token) ??
    readString(dto.token) ??
    null
  );
};

const mapAuthUserDto = (dto: unknown): AuthUser => {
  if (!isRecord(dto)) {
    return { name: "Authenticated user" };
  }

  const username = readString(dto.username);
  const email = readString(dto.email);
  const name = readString(dto.name) ?? username ?? email ?? "Authenticated user";

  return {
    email,
    id: readString(dto.id),
    name,
    role: readString(dto.role)?.toLowerCase(),
    username
  };
};

const mapAuthSessionDto = (dto: unknown): AuthSession => {
  if (!isRecord(dto)) {
    setAccessToken(null);

    return {
      accessToken: null,
      user: { name: "Authenticated user" }
    };
  }

  const sessionDto = dto as AuthSessionDto;
  const accessToken = getAccessTokenFromResponse(sessionDto);
  const userDto = isRecord(sessionDto.user) ? sessionDto.user : sessionDto;
  setAccessToken(accessToken);

  return {
    accessToken,
    user: mapAuthUserDto(userDto)
  };
};

const assertAuthSession = (response: unknown) => {
  const session = mapAuthSessionDto(response);

  if (!session.accessToken) {
    throw new Error("The auth response did not include an access token.");
  }

  return session;
};

const login = async ({ userName, password }: ILoginCredentials) => {
  const response = await httpClient<unknown>("/login", {
    method: "POST",
    skipAuthRefresh: true,
    body: {
      username: userName,
      password
    }
  });

  return assertAuthSession(response);
};

const getCurrentSession = async () => {
  const response = await httpClient<unknown>("/check-auth", {
    skipAuthRefresh: true
  });

  return assertAuthSession(response);
};

const logout = async () => {
  try {
    await httpClient<void>("/logout", {
      method: "POST",
      skipAuthRefresh: true
    });
  } finally {
    setAccessToken(null);
  }
};

export const authApi = {
  getCurrentSession,
  logout,
  login
};

export const authQueries = {
  session: () =>
    queryOptions({
      queryKey: authQueryKeys.session(),
      queryFn: authApi.getCurrentSession,
      retry: false
    })
};

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: authApi.login
    }),
  logout: () =>
    mutationOptions({
      mutationFn: authApi.logout
    })
};
