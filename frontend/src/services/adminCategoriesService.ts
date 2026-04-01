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

export type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  image?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

type CategoriesApiResponse = {
  success: boolean;
  message: string;
  data?: {
    categories?: Category[];
    category?: Category;
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

export async function getAdminCategories(
  page = 1,
  limit = 10,
): Promise<{
  categories: Category[];
  total: number;
  page: number;
  lastPage: number;
}> {
  try {
    const response = await axios.get<CategoriesApiResponse>(
      `${API_BASE_URL}/api/admin/categories?page=${page}&per_page=${limit}`,
      {
        headers: getAuthHeader(),
      },
    );

    const categories = response.data.data?.categories ?? [];
    const pagination = response.data.data?.pagination;

    return {
      categories,
      total: pagination?.total ?? categories.length,
      page: pagination?.current_page ?? page,
      lastPage: pagination?.last_page ?? 1,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to load categories";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to load categories");
  }
}

export async function createAdminCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  try {
    const response = await axios.post<CategoriesApiResponse>(
      `${API_BASE_URL}/api/admin/categories`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const category = response.data.data?.category;
    if (!category) {
      throw new AdminApiError("Category creation returned no data");
    }

    return category;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to create category";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to create category");
  }
}

export async function updateAdminCategory(
  categoryId: number,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  try {
    const response = await axios.patch<CategoriesApiResponse>(
      `${API_BASE_URL}/api/admin/categories/${categoryId}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const category = response.data.data?.category;
    if (!category) {
      throw new AdminApiError("Category update returned no data");
    }

    return category;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to update category";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to update category");
  }
}

export async function deleteAdminCategory(categoryId: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/api/admin/categories/${categoryId}`, {
      headers: getAuthHeader(),
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to delete category";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to delete category");
  }
}
