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
  policies_id?: number;
  category_id?: number;
  brand_id?: number;
  name: string;
  slug?: string;
  description?: string;
  brand?: { id: number; name: string };
  category?: { id: number; name: string };
  deposit_price: string;
  daily_price: string;
  status: string;
  stock?: number;
  image?: string;
  images?: Array<string>;
  created_at: string;
  updated_at: string;
};

export type ProductCategoryOption = {
  id: number;
  name: string;
};

export type ProductBrandOption = {
  id: number;
  name: string;
};

export type ProductPolicyOption = {
  id: number;
  late_day_fee: string | number;
  max_late_day: number;
};

export type CreateProductPayload = {
  policies_id: number;
  category_id: number;
  brand_id: number;
  name: string;
  slug: string;
  description: string;
  deposit_price: string;
  daily_price: string;
  stock?: number;
  status: "ACTIVE" | "INACTIVE";
  image_source_urls?: string[];
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

type ListApiResponse<T> = {
  success: boolean;
  message: string;
  data?: {
    items?: T[];
    categories?: T[];
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

export async function getProductFormOptions(): Promise<{
  categories: ProductCategoryOption[];
  brands: ProductBrandOption[];
  policies: ProductPolicyOption[];
}> {
  try {
    const [categoriesRes, brandsRes, policiesRes] = await Promise.all([
      axios.get<ListApiResponse<ProductCategoryOption>>(
        `${API_BASE_URL}/api/categories`,
      ),
      axios.get<ListApiResponse<ProductBrandOption>>(`${API_BASE_URL}/api/brands`),
      axios.get<ListApiResponse<ProductPolicyOption>>(
        `${API_BASE_URL}/api/rental-policies`,
      ),
    ]);

    const categories =
      categoriesRes.data.data?.items ?? categoriesRes.data.data?.categories ?? [];
    const brands = brandsRes.data.data?.items ?? [];
    const policies = policiesRes.data.data?.items ?? [];

    return { categories, brands, policies };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to load product form options";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to load product form options");
  }
}
