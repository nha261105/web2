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
    public function roles(): JsonResponse
    {
        $roles = Role::query()->orderBy('id')->get();
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
        return ApiResponse::success($user->roles->toArray());
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
        $role->permissions()->sync($validated['permission_ids']);

        return ApiResponse::success([], 'Permissions updated successfully');
    }
}
