import { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, X, CirclePlus, AlertCircle } from "lucide-react";
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
  getAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
  type Category,
  AdminApiError,
} from "@/services/adminCategoriesService";

type AddCategoryFormState = {
  name: string;
  description?: string;
  image?: string;
};

const initialFormState: AddCategoryFormState = {
  name: "",
  description: "",
  image: "",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [form, setForm] = useState<AddCategoryFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] =
    useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAdminCategories(1, 50);
      setCategories(result.categories);
      setTotal(result.total);
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : "Failed to load categories";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name) {
      setError("Please enter a category name");
      return;
    }

    try {
      setIsSubmitting(true);
      await createAdminCategory({
        name: form.name,
        description: form.description || undefined,
        image: form.image || undefined,
      });
      setForm(initialFormState);
      setIsAddDialogOpen(false);
      await loadCategories();
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : "Failed to create category";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryForDelete) return;

    try {
      setIsSubmitting(true);
      await deleteAdminCategory(selectedCategoryForDelete.id);
      setIsDeleteDialogOpen(false);
      setSelectedCategoryForDelete(null);
      await loadCategories();
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : "Failed to delete category";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{total} categories</p>
        </div>

        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 h-10 px-5 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
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

      {/* Categories Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = "none";
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {cat.description}
                      </p>
                    )}
                    <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryForDelete(cat);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No categories found</p>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your rental inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">
                Category Name *
              </span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="Laptops"
              />
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
                placeholder="Description of this category..."
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-gray-600">
                Image URL (optional)
              </span>
              <input
                type="url"
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="https://..."
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
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0052CC] hover:bg-[#0747A6]"
              >
                {isSubmitting ? (
                  <>
                    <CirclePlus className="w-4 h-4" />
                    Adding...
                  </>
                ) : (
                  <>
                    <CirclePlus className="w-4 h-4" />
                    Add Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCategoryForDelete?.name}?
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
              onClick={handleDeleteCategory}
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
