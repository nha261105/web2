import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function signin(email: string, password: string, isRemember: boolean) {
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
    const e = err as { response?: { data?: { message?: string; code?: string; success?: boolean } } };
    // Trả về chi tiết lỗi từ backend
    return {
      success: false,
      message: e.response?.data?.message || "Đăng nhập thất bại",
      code: e.response?.data?.code || "ERROR",
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
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
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
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
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
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
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
    const e = err as { response?: { data?: { message?: string } } };
    return { success: false, message: e.response?.data?.message || "Failed to load users" };
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
    const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
    const errors = e.response?.data?.errors;
    const firstError = errors ? Object.values(errors).flat()[0] : null;
    return {
      success: false,
      message: firstError || e.response?.data?.message || "Failed to create user",
    };
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
    const e = err as { response?: { data?: { message?: string } } };
    return { success: false, message: e.response?.data?.message || "Failed to update status" };
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
    const e = err as { response?: { data?: { message?: string } } };
    return { success: false, message: e.response?.data?.message || "Failed to delete user" };
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
    const e = err as { response?: { data?: { message?: string } } };
    return { success: false, message: e.response?.data?.message || "Failed to load roles" };
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
    const e = err as { response?: { data?: { message?: string } } };
    return { success: false, message: e.response?.data?.message || "Failed to assign role" };
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
    const e = err as { response?: { data?: { message?: string } } };
    return { success: false, message: e.response?.data?.message || "Failed to remove role" };
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
    const e = err as { response?: { data?: { message?: string } } };
    console.error('Error fetching roles:', e.response?.data);
    return {
      success: false,
      message: e.response?.data?.message || "Failed to load roles"
    };
  }
}