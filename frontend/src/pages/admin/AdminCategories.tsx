import { useState } from "react";
import type { FormEvent } from "react";

import { CATEGORIES } from "../client/data";

import {
  Plus,
  Eye,
  Trash2,
  X,
  CirclePlus,
  Tag,
  Laptop,
  Camera,
  AudioLines,
  Drone,
  Tablet,
  Projector,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CategoryItem = {
  id: string;
  name: string;
  count: number;
  icon: string;
  description?: string;
};

type AddCategoryFormState = {
  name: string;
  iconName: string;
  description: string;
};

const initialFormState: AddCategoryFormState = {
  name: "",
  iconName: "",
  description: "",
};

const CATEGORY_ICON_NAME_MAP: Record<string, LucideIcon> = {
  laptop: Laptop,
  camera: Camera,
  audio: AudioLines,
  drone: Drone,
  tablet: Tablet,
  projector: Projector,
  tag: Tag,
};

export default function AdminCategories() {
  const [category, setCategory] = useState<CategoryItem[]>(CATEGORIES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [form, setForm] = useState<AddCategoryFormState>(initialFormState);

  const openAdd = () => {
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleFormChange = (
    key: keyof AddCategoryFormState,
    value: AddCategoryFormState[keyof AddCategoryFormState],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resolveCategoryIcon = (iconName: string): LucideIcon => {
    return CATEGORY_ICON_NAME_MAP[iconName.toLowerCase().trim()] ?? Tag;
  };

  const handleAddCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    if (!name) {
      return;
    }

    const iconName = form.iconName.toLowerCase().trim();
    const description = form.description.trim();

    const newCategory = {
      id: crypto.randomUUID(),
      name,
      count: 0,
      icon: iconName,
      description,
    };

    setCategory((prev) => [newCategory, ...prev]);
    closeAddDialog();
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategory((prev) => prev.filter((item) => item.id !== categoryId));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-gray-900">Category</h1>
          <p className="text-gray-500 text-sm">{category.length} category</p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-10 px-5 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* START CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {category.map((cat: CategoryItem) => {
          const Icon = resolveCategoryIcon(cat.icon);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.count} products
                    </p>
                    <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    aria-label={`View ${cat.name} details`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${cat.name}`}
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your rental inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="Accessories"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Icon Name
              </label>
              <input
                required
                value={form.iconName}
                onChange={(e) => handleFormChange("iconName", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="laptop, camera, audio, drone, tablet, projector"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                required
                value={form.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
                placeholder="Devices and accessories for your workflow"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeAddDialog}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0052CC] hover:bg-[#0747A6] flex items-center gap-2"
              >
                <CirclePlus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
