import axios from "axios";

/**
 * Hàm kiểm tra token lưu trong localStorage có hợp lệ kho
 * @returns json
 */
export async function checkToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token)
      return {
        success: false,
        error: "LocalStorage",
        message: "Token không có trong localStorage",
      };

    const response = await axios.post(
      "http://127.0.0.1:8000/api/user-tokens/check-token",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

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
