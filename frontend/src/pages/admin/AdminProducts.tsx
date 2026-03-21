import { useState } from "react";
import type { FormEvent } from "react";
import { PRODUCTS, CATEGORIES } from "../client/data";
import type { Product } from "../client/data";
import { Plus, Search, Edit2, Trash2, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function KitBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    sale: "bg-red-50 text-red-600",
    bestseller: "bg-yellow-50 text-yellow-700",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${styles[type] ?? "bg-gray-100 text-gray-600"}`}
    >
      {type}
    </span>
  );
}

type AddProductFormState = {
  title: string;
  brand: string;
  category: string;
  price: string;
  available: string;
  image: string;
  badge: "" | "new" | "sale" | "bestseller";
};

const initialFormState: AddProductFormState = {
  title: "",
  brand: "",
  category: "",
  price: "",
  available: "",
  image: "",
  badge: "",
};

const toFormState = (product: Product): AddProductFormState => ({
  title: product.title,
  brand: product.brand,
  category: product.category,
  price: String(product.price),
  available: String(product.available),
  image: product.image,
  badge: product.badge ?? "",
});

export default function AdminProducts() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<AddProductFormState>(initialFormState);
  const [editForm, setEditForm] = useState<AddProductFormState>(initialFormState);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditForm(toFormState(product));
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProductId(null);
    setEditForm(initialFormState);
  };

  const openAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleFormChange = (
    key: keyof AddProductFormState,
    value: AddProductFormState[keyof AddProductFormState],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleEditFormChange = (
    key: keyof AddProductFormState,
    value: AddProductFormState[keyof AddProductFormState],
  ) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const price = Number(form.price);
    const available = Number(form.available);
    if (
      !form.title ||
      !form.brand ||
      !form.category ||
      Number.isNaN(price) ||
      Number.isNaN(available)
    ) {
      return;
    }

    const safeImage =
      form.image.trim() ||
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

    const newProduct: Product = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      description: "No description yet.",
      price,
      priceLabel: `$${price}/day`,
      image: safeImage,
      gallery: [safeImage],
      badge: form.badge || undefined,
      category: form.category,
      brand: form.brand.trim(),
      rating: 0,
      reviews: 0,
      available,
      specs: {},
      tags: [],
    };

    setProducts((prev) => [newProduct, ...prev]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingProductId) {
      return;
    }

    const price = Number(editForm.price);
    const available = Number(editForm.available);

    if (
      !editForm.title ||
      !editForm.brand ||
      !editForm.category ||
      Number.isNaN(price) ||
      Number.isNaN(available)
    ) {
      return;
    }

    const safeImage =
      editForm.image.trim() ||
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== editingProductId) {
          return product;
        }

        return {
          ...product,
          title: editForm.title.trim(),
          brand: editForm.brand.trim(),
          category: editForm.category,
          price,
          priceLabel: `$${price}/day`,
          image: safeImage,
          gallery: [safeImage],
          available,
          badge: editForm.badge || undefined,
        };
      }),
    );

    closeEditDialog();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {products.length} total products
          </p>
        </div>
        {/* OPEN POPUP ADD PRODUCTS */}
        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-10 px-5 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* SEARCH + FILTER */}
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
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-sm appearance-none focus:border-[#0052CC] outline-none bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Price/Day",
                  "Available",
                  "Badge",
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
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-50">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-sm font-medium ${product.available > 3 ? "text-green-600" : product.available > 0 ? "text-orange-600" : "text-red-600"}`}
                    >
                      {product.available}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {product.badge ? (
                      <KitBadge type={product.badge} />
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
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
                        onClick={() => handleDelete(product.id)}
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
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Create a new product for your rental inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="MacBook Air M3"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  required
                  value={form.brand}
                  onChange={(e) => handleFormChange("brand", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="Apple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] bg-white"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Badge
                </label>
                <select
                  value={form.badge}
                  onChange={(e) =>
                    handleFormChange(
                      "badge",
                      e.target.value as AddProductFormState["badge"],
                    )
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] bg-white"
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="bestseller">Bestseller</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Price / day (USD)
                </label>
                <input
                  required
                  min={0}
                  type="number"
                  value={form.price}
                  onChange={(e) => handleFormChange("price", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="49"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Available Qty
                </label>
                <input
                  required
                  min={0}
                  type="number"
                  value={form.available}
                  onChange={(e) =>
                    handleFormChange("available", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Image URL (optional)
              </label>
              <input
                value={form.image}
                onChange={(e) => handleFormChange("image", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="https://..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0052CC] hover:bg-[#0747A6]">
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information for your rental inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    handleEditFormChange("title", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="MacBook Air M3"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  required
                  value={editForm.brand}
                  onChange={(e) =>
                    handleEditFormChange("brand", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="Apple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  required
                  value={editForm.category}
                  onChange={(e) =>
                    handleEditFormChange("category", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] bg-white"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Badge
                </label>
                <select
                  value={editForm.badge}
                  onChange={(e) =>
                    handleEditFormChange(
                      "badge",
                      e.target.value as AddProductFormState["badge"],
                    )
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC] bg-white"
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="bestseller">Bestseller</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Price / day (USD)
                </label>
                <input
                  required
                  min={0}
                  type="number"
                  value={editForm.price}
                  onChange={(e) => handleEditFormChange("price", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="49"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Available Qty
                </label>
                <input
                  required
                  min={0}
                  type="number"
                  value={editForm.available}
                  onChange={(e) =>
                    handleEditFormChange("available", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Image URL (optional)
              </label>
              <input
                value={editForm.image}
                onChange={(e) => handleEditFormChange("image", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="https://..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0052CC] hover:bg-[#0747A6]">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
