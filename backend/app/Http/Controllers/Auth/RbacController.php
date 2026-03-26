<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RbacController extends Controller
{
    public function roles(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Role::query()->orderBy('id')->get(),
        ]);
    }

    public function permissions(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Permission::query()->orderBy('id')->get(),
        ]);
    }

    public function userRoles(int $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'roles' => $user->roles,
            ],
        ]);
    }

    public function assignRoleToUser(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $user = User::findOrFail($id);
        $user->roles()->syncWithoutDetaching([$validated['role_id']]);

        return response()->json([
            'success' => true,
            'message' => 'Gan role cho user thanh cong',
        ]);
    }

    public function removeRoleFromUser(int $id, int $roleId): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->roles()->detach([$roleId]);

        return response()->json([
            'success' => true,
            'message' => 'Xoa role khoi user thanh cong',
        ]);
    }

    public function syncRolePermissions(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids' => 'required|array|min:1',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::findOrFail($id);
        $role->permissions()->sync($validated['permission_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Cap nhat permission cho role thanh cong',
        ]);
    }
}
