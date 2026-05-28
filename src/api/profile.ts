import { queryOptions } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export interface UserProfile {
  email?: string;
  id?: string;
  name: string;
  role?: string;
  username?: string;
}

interface UserProfileDto {
  email?: unknown;
  id?: unknown;
  name?: unknown;
  role?: unknown;
  username?: unknown;
  user?: unknown;
}

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === "object";
};

const readString = (value: unknown) => {
  return typeof value === "string" ? value : undefined;
};

const mapUserProfileDto = (dto: unknown): UserProfile => {
  const source = isRecord(dto) && isRecord(dto.user) ? dto.user : dto;

  if (!isRecord(source)) {
    return { name: "Authenticated user" };
  }

  const profileDto = source as UserProfileDto;
  const username = readString(profileDto.username);
  const email = readString(profileDto.email);
  const name =
    readString(profileDto.name) ?? username ?? email ?? "Authenticated user";

  return {
    email,
    id: readString(profileDto.id),
    name,
    role: readString(profileDto.role)?.toLowerCase(),
    username
  };
};

const getCurrentProfile = async () => {
  const response = await httpClient<unknown>("/private/user-profile");

  return mapUserProfileDto(response);
};

export const profileApi = {
  getCurrentProfile
};

export const profileQueries = {
  current: () =>
    queryOptions({
      queryKey: profileQueryKeys.current(),
      queryFn: profileApi.getCurrentProfile
    })
};
