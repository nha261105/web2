import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export class AdminApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export type User = {
  id: number;
  name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles: Array<{ id: number; name: string }>;
  created_at: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

type UsersApiResponse = {
  success: boolean;
  message: string;
  data?: {
    users?: User[];
    user?: User;
    pagination?: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
};

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAdminUsers(
  page = 1,
  limit = 10,
): Promise<{
  users: User[];
  total: number;
  page: number;
  lastPage: number;
}> {
  try {
    const response = await axios.get<UsersApiResponse>(
      `${API_BASE_URL}/api/users?page=${page}&per_page=${limit}`,
      {
        headers: getAuthHeader(),
      },
    );

    const users = response.data.data?.users ?? [];
    const pagination = response.data.data?.pagination;

    return {
      users,
      total: pagination?.total ?? users.length,
      page: pagination?.current_page ?? page,
      lastPage: pagination?.last_page ?? 1,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to load users";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to load users");
  }
}

export async function createAdminUser(
  payload: CreateUserPayload,
): Promise<User> {
  try {
    const response = await axios.post<UsersApiResponse>(
      `${API_BASE_URL}/api/users`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const user = response.data.data?.user;
    if (!user) {
      throw new AdminApiError("User creation returned no data");
    }

    return user;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to create user";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to create user");
  }
}

export async function deleteAdminUser(userId: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
      headers: getAuthHeader(),
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to delete user";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to delete user");
  }
}

export async function assignRoleToUser(
  userId: number,
  roleId: number,
): Promise<void> {
  try {
    await axios.post(
      `${API_BASE_URL}/api/users/${userId}/roles`,
      { role_id: roleId },
      {
        headers: getAuthHeader(),
      },
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to assign role";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to assign role");
  }
}
