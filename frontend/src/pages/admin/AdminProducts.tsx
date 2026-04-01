import { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { Plus, Search, Edit2, Trash2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  type Product,
  AdminApiError,
} from "@/services/adminProductsService";

type AddProductFormState = {
  name: string;
  description?: string;
  brand_id?: string;
  category_id?: string;
  deposit_price: string;
  daily_price: string;
  status: string;
};

const initialFormState: AddProductFormState = {
  name: "",
  description: "",
  brand_id: "",
  category_id: "",
  deposit_price: "",
  daily_price: "",
  status: "AVAILABLE",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  console.log(products)
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState<AddProductFormState>(initialFormState);
  const [editForm, setEditForm] =
    useState<AddProductFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminProducts(1, 20, search || undefined);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to load products";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.deposit_price || !form.daily_price || !form.status) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await createAdminProduct({
        name: form.name,
        description: form.description || undefined,
        brand_id: form.brand_id ? Number(form.brand_id) : undefined,
        category_id: form.category_id ? Number(form.category_id) : undefined,
        deposit_price: String(form.deposit_price),
        daily_price: String(form.daily_price),
        status: form.status,
      });
      setForm(initialFormState);
      setIsAddDialogOpen(false);
      await loadProducts();
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to create product";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingProductId) return;
    if (
      !editForm.name ||
      !editForm.deposit_price ||
      !editForm.daily_price ||
      !editForm.status
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateAdminProduct(editingProductId, {
        name: editForm.name,
        description: editForm.description || undefined,
        brand_id: editForm.brand_id ? Number(editForm.brand_id) : undefined,
        category_id: editForm.category_id
          ? Number(editForm.category_id)
          : undefined,
        deposit_price: String(editForm.deposit_price),
        daily_price: String(editForm.daily_price),
        status: editForm.status,
      });
      setEditForm(initialFormState);
      setIsEditDialogOpen(false);
      setEditingProductId(null);
      await loadProducts();
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to update product";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductForDelete) return;

    try {
      setIsSubmitting(true);
      await deleteAdminProduct(selectedProductForDelete.id);
      setIsDeleteDialogOpen(false);
      setSelectedProductForDelete(null);
      await loadProducts();
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Failed to delete product";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      brand_id: product.brand?.id.toString() || "",
      category_id: product.category?.id.toString() || "",
      deposit_price: String(product.deposit_price),
      daily_price: String(product.daily_price || ""),
      status: String(product.status),
    });
    setIsEditDialogOpen(true);
  };

  const filtered = products.filter((p) => {
    const keyword = search.toLowerCase().trim();
    const name = String(p.name ?? "").toLowerCase();
    const brandName = String(p.brand?.name ?? "").toLowerCase();
    const categoryName = String(p.category?.name ?? "").toLowerCase();

    return (
      name.includes(keyword) ||
      brandName.includes(keyword) ||
      categoryName.includes(keyword)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 h-10 px-5 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-800 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 text-sm focus:border-[#0052CC] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Loading products...</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Product",
                      "Category",
                      "Deposit",
                      "Daily Rate",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-medium text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                el.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%23f0f0f0' width='40' height='40'/%3E%3C/svg%3E";
                              }}
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-50">
                              {product.name || "Unnamed product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.brand?.name || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {product.category?.name || "N/A"}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">
                        ${product.deposit_price}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">
                        ${product.daily_price || "N/A"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-sm font-medium ${
                            product.status === "AVAILABLE"
                              ? "text-green-600"
                              : product.status === "MAINTENANCE"
                                ? "text-orange-600"
                                : "text-red-600"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProductForDelete(product);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">No products found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Create a new product for your rental inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">Title *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="MacBook Air M3"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">Deposit Price *</span>
              <input
                required
                type="number"
                min={0}
                value={form.deposit_price}
                onChange={(e) => setForm({ ...form, deposit_price: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="1000"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">
                Daily Price *
              </span>
              <input
                required
                type="number"
                min={0}
                value={form.daily_price}
                onChange={(e) =>
                  setForm({ ...form, daily_price: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="50"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">Status *</span>
              <select
                required
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">
                Description (optional)
              </span>
              <textarea
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] resize-none"
                placeholder="Product description..."
              />
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(initialFormState);
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0052CC] hover:bg-[#0747A6]"
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditProduct} className="space-y-4">
            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">Title *</span>
              <input
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="MacBook Air M3"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">Deposit Price *</span>
              <input
                required
                type="number"
                min={0}
                value={editForm.deposit_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, deposit_price: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="1000"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">
                Daily Price *
              </span>
              <input
                required
                type="number"
                min={0}
                value={editForm.daily_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, daily_price: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="50"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">Status *</span>
              <select
                required
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">
                Description (optional)
              </span>
              <textarea
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] resize-none"
                placeholder="Product description..."
              />
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0052CC] hover:bg-[#0747A6]"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProductForDelete?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
