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

export type Product = {
  id: number;
  name: string;
  description?: string;
  brand?: { id: number; name: string };
  category?: { id: number; name: string };
  deposit_price: string;
  daily_price: string;
  status: string;
  image?: string;
  images?: Array<string>;
  created_at: string;
  updated_at: string;
};

export type CreateProductPayload = {
  name: string;
  description?: string;
  brand_id?: number;
  category_id?: number;
  deposit_price: string;
  daily_price: string;
  status: string;
  image?: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

type ProductsApiResponse = {
  success: boolean;
  message: string;
  data?: {
    products?: Product[];
    product?: Product;
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

export async function getAdminProducts(
  page = 1,
  limit = 10,
  search?: string,
  categoryId?: number,
): Promise<{
  products: Product[];
  total: number;
  page: number;
  lastPage: number;
}> {
  try {
    let url = `${API_BASE_URL}/api/admin/products?page=${page}&per_page=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (categoryId) url += `&category_id=${categoryId}`;

    const response = await axios.get<ProductsApiResponse>(url, {
      headers: getAuthHeader(),
    });

    const products = response.data.data?.products ?? [];
    const pagination = response.data.data?.pagination;

    return {
      products,
      total: pagination?.total ?? products.length,
      page: pagination?.current_page ?? page,
      lastPage: pagination?.last_page ?? 1,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to load products";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to load products");
  }
}

export async function createAdminProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  try {
    const response = await axios.post<ProductsApiResponse>(
      `${API_BASE_URL}/api/admin/products`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const product = response.data.data?.product;
    if (!product) {
      throw new AdminApiError("Product creation returned no data");
    }

    return product;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to create product";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to create product");
  }
}

export async function updateAdminProduct(
  productId: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  try {
    const response = await axios.patch<ProductsApiResponse>(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const product = response.data.data?.product;
    if (!product) {
      throw new AdminApiError("Product update returned no data");
    }

    return product;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to update product";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to update product");
  }
}

export async function deleteAdminProduct(productId: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/api/admin/products/${productId}`, {
      headers: getAuthHeader(),
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to delete product";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to delete product");
  }
}
