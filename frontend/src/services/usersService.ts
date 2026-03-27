import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

/**
 * Hàm đăng nhập bằng email và password
 *
 * @param string email: email của user
 * @param string password: password của user
 * @return json
 */
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
    const message = err instanceof Error ? err.message : "Exception";
    return {
      success: false,
      error: "Exception",
      message: "Lỗi: " + message,
    };
  }
}
