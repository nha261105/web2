import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, Shield, ShieldCheck } from "lucide-react";
import {
  getAllPermissions,
  getAllRoles,
  syncRolePermissions,
} from "@/services/usersService";

type Permission = {
  id: number;
  name: string;
};

type Role = {
  id: number;
  name: string;
  permissions?: Permission[];
};

function parseRoleList(payload: unknown): Role[] {
  const root = payload as
    | {
        data?: unknown;
      }
    | undefined;
  const data = root?.data;

  if (Array.isArray(data)) {
    return data as Role[];
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { roles?: unknown }).roles)
  ) {
    return (data as { roles: Role[] }).roles;
  }

  return [];
}

function parsePermissionList(payload: unknown): Permission[] {
  const root = payload as
    | {
        data?: unknown;
      }
    | undefined;
  const data = root?.data;

  if (Array.isArray(data)) {
    return data as Permission[];
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { permissions?: unknown }).permissions)
  ) {
    return (data as { permissions: Permission[] }).permissions;
  }

  return [];
}

function getPermissionGroup(permissionName: string): string {
  const [group] = permissionName.split("_");
  return group || "OTHER";
}

function normalizePermissionSelection(
  permissionIds: number[],
  permissionList: Permission[],
) {
  const selected = new Set(permissionIds);
  const byId = new Map(
    permissionList.map((permission) => [permission.id, permission]),
  );
  const byName = new Map(
    permissionList.map((permission) => [permission.name, permission]),
  );

  permissionIds.forEach((permissionId) => {
    const permission = byId.get(permissionId);
    if (!permission) return;

    const [moduleName] = permission.name.split("_");
    if (!moduleName) return;

    const readPermission = byName.get(`${moduleName}_READ`);
    if (readPermission) {
      selected.add(readPermission.id);
    }
  });

  return Array.from(selected);
}

export default function AdminSettings() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      const [rolesRes, permissionsRes] = await Promise.all([
        getAllRoles(),
        getAllPermissions(),
      ]);

      if (!rolesRes?.success || !permissionsRes?.success) {
        setError("Không tải được dữ liệu phân quyền. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      const fetchedRoles = parseRoleList(rolesRes);
      const fetchedPermissions = parsePermissionList(permissionsRes);

      setRoles(fetchedRoles);
      setPermissions(fetchedPermissions);

      if (fetchedRoles.length > 0) {
        const firstRole = fetchedRoles[0];
        setSelectedRoleId(firstRole.id);
        setSelectedPermissionIds(
          Array.isArray(firstRole.permissions)
            ? normalizePermissionSelection(
                firstRole.permissions.map((permission) => permission.id),
                fetchedPermissions,
              )
            : [],
        );
      }

      setLoading(false);
    };

    void loadData();
  }, []);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>(
      (acc, permission) => {
        const group = getPermissionGroup(permission.name);
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
      },
      {},
    );
  }, [permissions]);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const onSelectRole = (role: Role) => {
    setSelectedRoleId(role.id);
    setSuccess("");
    setError("");

    setSelectedPermissionIds(
      Array.isArray(role.permissions)
        ? normalizePermissionSelection(
            role.permissions.map((permission) => permission.id),
            permissions,
          )
        : [],
    );
  };

  const onSavePermissions = async () => {
    if (!selectedRoleId) {
      setError("Vui lòng chọn vai trò trước khi lưu.");
      return;
    }

    if (selectedPermissionIds.length === 0) {
      setError("Mỗi vai trò cần ít nhất 1 quyền.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const response = await syncRolePermissions(
      selectedRoleId,
      normalizePermissionSelection(selectedPermissionIds, permissions),
    );

    if (!response?.success) {
      setError(response?.message || "Cập nhật quyền thất bại.");
      setSaving(false);
      return;
    }

    setRoles((prev) =>
      prev.map((role) =>
        role.id === selectedRoleId
          ? {
              ...role,
              permissions: permissions.filter((permission) =>
                normalizePermissionSelection(
                  selectedPermissionIds,
                  permissions,
                ).includes(permission.id),
              ),
            }
          : role,
      ),
    );

    setSuccess("Cập nhật quyền thành công.");
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-xl text-gray-900">Phân quyền hệ thống</h1>
        <p className="text-gray-500 text-sm">
          Chọn vai trò và bật/tắt quyền để áp dụng ngay trong trang quản trị.
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang tải dữ liệu phân quyền...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#0052CC]" />
              Danh sách vai trò
            </h2>

            <div className="space-y-2">
              {roles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => onSelectRole(role)}
                    className={`w-full text-left rounded-lg px-3 py-2 border transition-colors ${
                      isSelected
                        ? "border-[#0052CC] bg-blue-50 text-[#003a99]"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <p className="text-sm font-medium">{role.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {role.permissions?.length ?? 0} quyền
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0052CC]" />
                  Quyền của vai trò: {selectedRole?.name ?? "-"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Đang chọn {selectedPermissionIds.length} /{" "}
                  {permissions.length} quyền
                </p>
              </div>

              <button
                type="button"
                onClick={onSavePermissions}
                disabled={saving || !selectedRoleId}
                className="h-9 px-4 rounded-lg bg-[#0052CC] hover:bg-[#0747A6] text-white text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Lưu phân quyền
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            <div className="space-y-4">
              {Object.entries(groupedPermissions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([group, groupPermissions]) => (
                  <div
                    key={group}
                    className="border border-gray-100 rounded-lg p-3"
                  >
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      {group}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupPermissions.map((permission) => {
                        const checked = selectedPermissionIds.includes(
                          permission.id,
                        );
                        return (
                          <label
                            key={permission.id}
                            className={`flex items-center gap-2 rounded-md px-2.5 py-2 border cursor-pointer transition-colors ${
                              checked
                                ? "border-blue-200 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(permission.id)}
                              className="h-4 w-4"
                            />
                            <span className="text-xs text-gray-700 font-medium">
                              {permission.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
