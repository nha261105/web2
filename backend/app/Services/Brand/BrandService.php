<?php
namespace App\Services\Brand;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BrandService
{
    use HasFactory;
    public function list(): Collection
    {
        return Brand::all();
    }

    public function findById(int $id): Brand
    {
        return Brand::query()->findOrFail($id);
    }
    public function create(array $data): Brand
    {
        return Brand::create($data);
    }
    public function updateById(int $id, array $data): Brand
    {
        $brand = $this->findById($id);
        $brand->update($data);
        return $brand;
    }
    public function deleteById(int $id): bool
    {
        $brand = $this->findById($id);
        return $brand->delete();
    }
}
