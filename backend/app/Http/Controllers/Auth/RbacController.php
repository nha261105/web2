<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RbacController extends Controller
{
    private function normalizePermissionIds(array $permissionIds): array
    {
        $permissions = Permission::query()
            ->whereIn('id', $permissionIds)
            ->get(['id', 'name']);

        $normalized = $permissions->pluck('id')->all();

        foreach ($permissions as $permission) {
            $parts = explode('_', $permission->name);
            if (count($parts) < 2) {
                continue;
            }

            $readPermissionName = $parts[0] . '_READ';
            $readPermissionId = Permission::query()
                ->where('name', $readPermissionName)
                ->value('id');

            if (
                $readPermissionId &&
                !in_array($readPermissionId, $normalized, true)
            ) {
                $normalized[] = (int) $readPermissionId;
            }
        }

        return array_values(array_unique(array_map('intval', $normalized)));
    }

    public function roles(): JsonResponse
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy('id')
            ->get();
        return ApiResponse::success($roles->toArray());
    }

    public function permissions(): JsonResponse
    {
        $permissions = Permission::query()->orderBy('id')->get();
        return ApiResponse::success($permissions->toArray());
    }

    public function userRoles(int $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);
        return ApiResponse::success([
            'roles' => $user->roles->toArray(),
        ]);
    }

    public function userPermissions(int $id): JsonResponse
    {
        $user = User::with('permissions')->findOrFail($id);

        return ApiResponse::success([
            'permissions' => $user->permissions->toArray(),
        ]);
    }

    public function assignRoleToUser(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $user = User::findOrFail($id);
        $user->roles()->syncWithoutDetaching([$validated['role_id']]);

        return ApiResponse::success([], 'Role assigned successfully');
    }

    public function removeRoleFromUser(int $id, int $roleId): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->roles()->detach([$roleId]);

        return ApiResponse::success([], 'Role removed successfully');
    }

    public function syncRolePermissions(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids' => 'required|array|min:1',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::findOrFail($id);
        $role
            ->permissions()
            ->sync($this->normalizePermissionIds($validated['permission_ids']));

        return ApiResponse::success([], 'Permissions updated successfully');
    }

    public function syncUserPermissions(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids' => 'present|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $user = User::findOrFail($id);
        $user
            ->permissions()
            ->sync(
                $this->normalizePermissionIds(
                    $validated['permission_ids'] ?? [],
                ),
            );

        return ApiResponse::success(
            [],
            'User permissions updated successfully',
        );
    }
}
