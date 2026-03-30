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

function mapAxiosError(err: unknown) {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data as
      | { message?: string; errors?: Record<string, string[] | string> }
      | undefined;

    const validationErrors = responseData?.errors
      ? Object.values(responseData.errors)
          .flatMap((item) => (Array.isArray(item) ? item : [item]))
          .join("; ")
      : "";

    return {
      success: false,
      error: responseData?.message ?? err.code ?? "REQUEST_FAILED",
      message:
        validationErrors ||
        responseData?.message ||
        err.message ||
        "Yeu cau that bai",
      status: err.response?.status,
    };
  }

  const message = err instanceof Error ? err.message : "Exception";
  return { success: false, error: "Exception", message: "Loi: " + message };
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

    const accessToken = response.data?.data?.token?.access_token;
    if (response.data.success && accessToken)
      localStorage.setItem("token", accessToken);

    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
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
    return mapAxiosError(err);
  }
}

export async function getMe() {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.usersMe}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}

export async function updateMe(data: {
  name?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  bio?: string;
}) {
  try {
    const payload = {
      full_name: data.name,
      phone: data.phone,
      avatar: data.avatar,
      location: data.location,
      bio: data.bio
    };

    const response = await axios.patch(
      `${API_BASE_URL}${API_ENDPOINTS.updateMe}`,
      payload, 
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    return mapAxiosError(err);
  }
}
