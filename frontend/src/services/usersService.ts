import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

/**
 * Hàm đăng nhập bằng email và password
 *
 * @param string email: email của user
 * @param string password: password của user
 * @return json
 */

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
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

    const accessToken = response.data?.data?.token?.access_token;
    if (response.data.success && accessToken)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("auth_user", JSON.stringify(response.data.user));

    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return {
      success: false,
      error: "Exception",
      message: "Lỗi: " + message,
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
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
  }
}

export async function getMe() {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.usersMe}`, {
      headers: getAuthHeader(),
    });
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
      data,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
  }
}
