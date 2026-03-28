<?php
namespace App\Services\Category;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function list(): Collection
    {
        return Category::all();
    }

    public function findById(int $id): Category
    {
        return Category::query()->findOrFail($id);
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function updateById(int $id, array $data): Category
    {
        $category = $this->findById($id);
        $category->update($data);

        return $category;
    }

    public function deleteById(int $id): bool
    {
        $category = $this->findById($id);

        return $category->delete();
    }
}
