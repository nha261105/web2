import axios from "axios";

/**
 * Hàm đăng nhập bằng email và password
 *
 * @param string email: email của user
 * @param string password: password của user
 * @return json
 */
export async function signin(email: string, password: string) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/users/sign-in",
      { email, password },
    );

    if (response.data.success)
      localStorage.setItem("token", response.data.token.token);

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
