import axios from "axios";
import { API_BASE_URL } from "@/config/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getNotifications(page = 1, perPage = 15) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/notifications?page=${page}&per_page=${perPage}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch {
    return { success: false, message: "Không thể tải thông báo" };
  }
}

export async function markAsRead(id: number) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/notifications/${id}/read`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch {
    return { success: false };
  }
}

export async function markAllRead() {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/notifications/read-all`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch {
    return { success: false };
  }
}