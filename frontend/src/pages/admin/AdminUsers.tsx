import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, Trash2, AlertCircle } from "lucide-react";
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
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  type User,
  AdminApiError,
} from "@/services/adminUsersService";

type FormState = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

function getUserInitials(name: string | null | undefined): string {
  const safeName = String(name ?? "").trim();
  if (!safeName) {
    return "NA";
  }

  return safeName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  roles?: { id: number; name: string }[];
  rentals_count: number;
  total_spent: number;
  kyc_status?: string;
  verified_at?: string;
  id_card_number?: string;
}

interface PaginationMeta {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

const CACHE_KEY = "admin_users_cache";
const CACHE_TTL = 60_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function readCache(): { users: User[]; meta: PaginationMeta } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function writeCache(data: { users: User[]; meta: PaginationMeta }) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminUsers() {
  const cached = readCache();
  const [users, setUsers] = useState<User[]>(cached?.users ?? []);
  const [meta, setMeta] = useState<PaginationMeta>(
    cached?.meta ?? { total: 0, current_page: 1, per_page: 15, last_page: 1 }
  );
  const [loading, setLoading] = useState(!cached);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [viewTarget, setViewTarget] = useState<User | null>(null);

  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<{ id: number; name: string }[]>([]);

  const [availableRoles, setAvailableRoles] = useState<{ id: number; name: string }[]>([]);


  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "", email: "", phone: "", password: "", status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // ─── Close menu ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (page = 1, bustCache = false) => {
    if (!bustCache) {
      const hit = readCache();
      if (hit && page === 1) {
        setUsers(hit.users);
        setMeta(hit.meta);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    try {
      const res = await getAllUsers(page);

      if (res.success) {

        const usersList = Array.isArray(res.data) ? res.data : [];
        const metaInfo = res.meta || { total: 0, current_page: 1, per_page: 15, last_page: 1 };

        setUsers(usersList);
        setMeta(metaInfo);

        if (page === 1 && usersList.length > 0) {
          writeCache({ users: usersList, meta: metaInfo });
        }
      } else {
        setUsers([]);
        setMeta({ total: 0, current_page: 1, per_page: 15, last_page: 1 });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setMeta({ total: 0, current_page: 1, per_page: 15, last_page: 1 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);
  useEffect(() => {
    async function loadRoles() {
      const res = await getAllRoles();
      if (res.success) {
        setAvailableRoles(res.data.roles ?? []);
      }
    }
    loadRoles();
  }, []);
  // ─── Actions ───────────────────────────────────────────────────────────────
  const handleToggleStatus = async (userId: number, current: User["status"]) => {
    const newStatus = current === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await updateUserStatus(userId, newStatus);
    if (res.success) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
      sessionStorage.removeItem(CACHE_KEY);
    }
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteUser(deleteTarget.id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setMeta((m) => ({ ...m, total: m.total - 1 }));
      sessionStorage.removeItem(CACHE_KEY);
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const openRoleModal = async (user: User) => {
    setRoleTarget(user);
    setRoleLoading(true);
    setOpenMenuId(null);
    const res = await getUserRoles(user.id);
    if (res.success) {
      setUserRoles(res.data.roles ?? []);
    }
    setRoleLoading(false);
  };


  const handleAssignRole = async (roleName: string) => {
    if (!roleTarget) return;

    const role = availableRoles.find((r) => r.name === roleName);
    if (!role) {
      console.error("Role not found:", roleName);
      return;
    }

    if (userRoles.length > 0) {
      setRoleLoading(true);
      for (const oldRole of userRoles) {
        await removeRole(roleTarget.id, oldRole.id);
      }
    }

    const res = await assignRole(roleTarget.id, role.id);
    setRoleLoading(false);

    if (res.success) {
      setUserRoles([{ id: role.id, name: role.name }]);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    const res = await createUser(addForm);
    if (res.success) {
      setAddModal(false);
      setAddForm({ full_name: "", email: "", phone: "", password: "", status: "ACTIVE" });
      sessionStorage.removeItem(CACHE_KEY);
      await fetchUsers(1, true);
    } else {
      setAddError(res.message || "Failed to create user");
    }
    setAdding(false);
  };

  // ─── Derived ───────────────────────────────────────────────────────────────
  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const inactiveCount = users.filter((u) => u.status === "INACTIVE").length;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{meta.total} total users</p>
        </div>
        <Button
          onClick={() => setAddModal(true)}
          className="bg-[#0052CC] hover:bg-[#0747A6] text-white gap-2 h-9"
        >
          <UserPlus size={16} />
          Add User
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: meta.total, icon: Users, color: "text-[#0052CC] bg-blue-50" },
          { label: "Active", value: activeCount, icon: UserCheck, color: "text-green-600 bg-green-50" },
          { label: "Suspended", value: inactiveCount, icon: UserX, color: "text-red-500 bg-red-50" },
          {
            label: "Admins", value: users.filter(u => u.roles?.some(r => r.name === "ADMIN")).length || "—",
            icon: Shield, color: "text-orange-500 bg-orange-50"
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-lg border border-gray-200 text-sm focus:border-[#0052CC] outline-none transition-all"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-5 w-[25%]">User</TableHead>
              <TableHead className="w-[15%]">Orders</TableHead>
              <TableHead className="w-[15%]">Total Spent</TableHead>
              <TableHead className="w-[15%]">Joined</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="text-right px-5 w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <Loader2 className="animate-spin mx-auto text-[#0052CC] w-6 h-6" />
                  <p className="mt-2 text-sm text-gray-400">Loading users...</p>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    {searchTerm ? "No users match your search" : "No users found"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/60">
                  {/* User */}
                  <TableCell className="px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0052CC] to-[#0747A6] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {getInitials(user.full_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Orders */}
                  <TableCell className="text-sm text-gray-700">
                    {user.rentals_count ?? 0}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {Number(user.total_spent ?? 0).toLocaleString("vi-VN")}₫
                  </TableCell>

                  <TableCell className="text-sm text-gray-500">{formatDate(user.created_at)}</TableCell>

                  {/* Status badge */}
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${user.status === "ACTIVE"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-600 border-red-200"
                      }`}>
                      {user.status === "ACTIVE"
                        ? <ShieldCheck className="w-3 h-3" />
                        : <ShieldOff className="w-3 h-3" />}
                      {user.status === "ACTIVE" ? "active" : "suspended"}
                    </span>
                  </TableCell>

                  {/* Actions dropdown */}
                  <TableCell className="text-right px-5">
                    <div className="relative flex justify-end" ref={openMenuId === user.id ? menuRef : null}>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                          {/* View */}
                          <button type="button"
                            onClick={() => { setViewTarget(user); setOpenMenuId(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4 text-gray-400" />
                            View Profile
                          </button>
                          {/* Send Email — disabled */}
                          <button type="button" disabled
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 cursor-not-allowed">
                            <Mail className="w-4 h-4" />
                            Send Email
                          </button>
                          {/* Change Role */}
                          <button type="button"
                            onClick={() => openRoleModal(user)}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Shield className="w-4 h-4 text-gray-400" />
                            Change Role
                          </button>
                          {/* Toggle status */}
                          <button type="button"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${user.status === "ACTIVE"
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                              }`}>
                            {user.status === "ACTIVE"
                              ? <><ShieldOff className="w-4 h-4" /> Suspend</>
                              : <><ShieldCheck className="w-4 h-4" /> Activate</>}
                          </button>
                          <div className="border-t border-gray-100" />
                          {/* Delete */}
                          <button type="button"
                            onClick={() => { setDeleteTarget(user); setOpenMenuId(null); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Page {meta.current_page} of {meta.last_page} — {meta.total} users
            </p>
            <div className="flex gap-1">
              <button type="button" disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" disabled={currentPage >= meta.last_page}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal: Add User ──────────────────────────────────────────────────── */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Add New User</h3>
              <button type="button" onClick={() => { setAddModal(false); setAddError(""); }}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-5 space-y-3">
              {addError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {addError}
                </div>
              )}
              {[
                { key: "full_name", label: "Full Name", type: "text", placeholder: "Nguyen Van A" },
                { key: "email", label: "Email", type: "email", placeholder: "user@example.com" },
                { key: "phone", label: "Phone", type: "text", placeholder: "0901234567" },
                { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input required type={f.type} placeholder={f.placeholder}
                    value={addForm[f.key as keyof typeof addForm]}
                    onChange={(e) => setAddForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] outline-none" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setAddModal(false); setAddError(""); }}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={adding}
                  className="flex-1 h-10 rounded-xl bg-[#0052CC] text-white text-sm font-medium hover:bg-[#0747A6] flex items-center justify-center gap-2 disabled:opacity-60">
                  {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                  {adding ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: View Profile ──────────────────────────────────────────────── */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">User Profile</h3>
              <button type="button" onClick={() => setViewTarget(null)}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0052CC] to-[#0747A6] text-white flex items-center justify-center text-lg font-bold">
                {getInitials(viewTarget.full_name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{viewTarget.full_name}</p>
                <p className="text-sm text-gray-500">{viewTarget.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Phone", value: viewTarget.phone || "—" },
                { label: "Status", value: viewTarget.status },
                { label: "KYC Status", value: viewTarget.kyc_status || "PENDING" },
                { label: "Role", value: viewTarget.roles?.[0]?.name || "CUSTOMER" },
                { label: "Joined", value: formatDate(viewTarget.created_at) },
                { label: "Orders", value: `${viewTarget.rentals_count ?? 0} orders` },
                { label: "Spent", value: `${Number(viewTarget.total_spent ?? 0).toLocaleString("vi-VN")}₫` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-gray-900 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setViewTarget(null)}
              className="mt-5 w-full h-10 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ─── Modal: Change Role ───────────────────────────────────────────────── */}
      {roleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Change Role</h3>
                <p className="text-xs text-gray-500 mt-0.5">{roleTarget.full_name}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Current: <span className="font-semibold">
                    {userRoles.length > 0 ? userRoles[0].name : 'No role assigned'}
                  </span>
                </p>
              </div>
              <button type="button" onClick={() => setRoleTarget(null)}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {roleLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#0052CC]" />
              </div>
            ) : (
              <div className="space-y-2">
                {availableRoles.map((role) => {
                  const hasRole = userRoles.some((r) => r.id === role.id);
                  return (
                    <div key={role.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${hasRole ? "border-[#0052CC] bg-blue-50" : "border-gray-200 hover:border-[#0052CC]"
                      }`}>
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${hasRole ? "text-[#0052CC]" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium ${hasRole ? "text-[#0052CC]" : "text-gray-700"}`}>
                          {role.name}
                        </span>
                      </div>
                      {hasRole ? (
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          Current
                        </span>
                      ) : (
                        <button type="button"
                          onClick={() => handleAssignRole(role.name)}
                          disabled={roleLoading}
                          className="text-xs px-3 py-1 rounded-lg font-medium bg-[#0052CC] text-white hover:bg-[#0747A6] disabled:opacity-50">
                          Assign
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setRoleTarget(null)}
              className="mt-5 w-full h-10 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      )}

      {/* ─── Modal: Delete Confirm ────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete User</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{deleteTarget.full_name}</span>?
              All associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={handleDeleteConfirm} disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}