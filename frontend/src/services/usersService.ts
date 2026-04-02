import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function mapAxiosError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data as
      | { message?: string; code?: string; errors?: Record<string, string[] | string> }
      | undefined;

    const validationErrors = responseData?.errors
      ? Object.values(responseData.errors)
          .flatMap((item) => (Array.isArray(item) ? item : [item]))
          .join("; ")
      : "";

    return {
      success: false,
      code: responseData?.code ?? err.code ?? "REQUEST_FAILED",
      message:
        validationErrors ||
        responseData?.message ||
        err.message ||
        "Yeu cau that bai",
      status: err.response?.status,
    };
  }

  const message = err instanceof Error ? err.message : "Exception";
  return { success: false, code: "EXCEPTION", message: "Loi: " + message };
}

export async function signup(
  email: string,
  password: string,
  fullName: string,
  phone: string,
) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.signUp}`, {
      email,
      password,
      full_name: fullName,
      phone,
    });

    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function signin(
  email: string,
  password: string,
  isRemember: boolean,
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.signIn}`,
      { email, password, isRemember },
    );
    if (response.data.success) {
      const token = response.data.data?.token?.access_token;
      const user = response.data.data?.user;
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    }
    return response.data;
  } catch (err: unknown) {
    // Sử dụng mapAxiosError nhưng vẫn giữ cấu trúc có code
    const mappedError = mapAxiosError(err);
    return {
      success: false,
      message: mappedError.message,
      code: mappedError.code,
    };
  }
}

export async function signout() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.signOut}`,
      {},
      { headers: getAuthHeader() },
    );
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

// ─── Me ───────────────────────────────────────────────────────────────────────
export async function getMe() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.usersMe}`,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function updateMe(data: {
  name?: string;
  phone?: string;
  avatar?: string;
}) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${API_ENDPOINTS.updateMe}`,
      { full_name: data.name, phone: data.phone, avatar: data.avatar },
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${API_ENDPOINTS.changePassword}`,
      data,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

// ─── Admin — User CRUD ────────────────────────────────────────────────────────
export async function getAllUsers(page = 1, perPage = 15) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.users}`,
      { params: { page, per_page: perPage }, headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function createUser(data: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  status?: string;
}) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.users}`,
      data,
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function updateUserStatus(userId: number, status: "ACTIVE" | "INACTIVE") {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${API_ENDPOINTS.users}/${userId}/status`,
      { status },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function deleteUser(userId: number) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.users}/${userId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

// ─── Admin — User Roles ───────────────────────────────────────────────────────
export async function getUserRoles(userId: number) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.users}/${userId}/roles`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function assignRole(userId: number, roleId: number) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.users}/${userId}/roles`,
      { role_id: roleId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function removeRole(userId: number, roleId: number) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.users}/${userId}/roles/${roleId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function getAllRoles() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/roles`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}