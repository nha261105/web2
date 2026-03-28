import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Package,
  Settings,
  LogOut,
  Camera,
  Shield,
  Bell,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  Download,
  ChevronRight,
  Home,
  Save,
} from "lucide-react";
import { getMe, updateMe, signout } from "@/services/usersService";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type CreateAddressPayload,
} from "@/services/addressService";
import { checkToken } from "@/services/userTokensService";

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

type Tab = "profile" | "orders" | "settings" | "addresses";

// ─── Mock rentals (chờ Hoàng Anh merge feature/rental-core) ──────────────────
const MOCK_RENTALS = [
  {
    id: 1, code: "ORD-001", status: "delivered",
    placed_on: "February 10, 2026", items: ["MacBook Pro 16\"", "Sony Camera", "Tripod"],
    item_count: 3, total: 312,
  },
  {
    id: 2, code: "ORD-002", status: "active",
    placed_on: "February 15, 2026", items: ["DJI Mavic 3 Pro"],
    item_count: 1, total: 125,
  },
  {
    id: 3, code: "ORD-003", status: "pending",
    placed_on: "February 20, 2026", items: ["Sony FX3", "Lens Kit"],
    item_count: 2, total: 84,
  },
  {
    id: 4, code: "ORD-004", status: "delivered",
    placed_on: "January 28, 2026", items: ["Meta Quest 3"],
    item_count: 1, total: 45,
  },
  {
    id: 5, code: "ORD-005", status: "delivered",
    placed_on: "January 15, 2026", items: ["Sony FX3", "Lens Kit", "Tripod", "Microphone"],
    item_count: 4, total: 478,
  },
];

const ORDER_STATUS: Record<string, { text: string; className: string }> = {
  delivered: { text: "Delivered", className: "text-green-700 bg-green-50 border border-green-200" },
  active:    { text: "Active",    className: "text-blue-700 bg-blue-50 border border-blue-200" },
  pending:   { text: "Pending",   className: "text-orange-600 bg-orange-50 border border-orange-200" },
  cancelled: { text: "Cancelled", className: "text-red-600 bg-red-50 border border-red-200" },
};

type OrderFilter = "all" | "active" | "delivered" | "pending";

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Main AccountPage ─────────────────────────────────────────────────────────
export default function AccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Addresses (for future address tab — currently embedded in profile)
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Orders filter
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");

  // Settings — password
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);

  // Settings — notifications
  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    newArrivals: true,
    priceDrops: true,
    sms: false,
  });

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const [tokenCheck, meRes] = await Promise.all([checkToken(), getMe()]);
      if (!tokenCheck.success) { navigate("/signin"); return; }
      if (meRes.success) {
        const u = meRes.data;
        setUser(u);
        setName(u.name ?? "");
        setPhone(u.phone ?? "");
        setBio(u.bio ?? "");
        setLocation(u.location ?? "");
      } else {
        toast.error("Không lấy được thông tin tài khoản");
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

  // ── Load addresses ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    getAddresses(user.id).then((res) => {
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setAddresses(list);
      }
    });
  }, [user]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const res = await updateMe({ name, phone });
    if (res.success) {
      toast.success("Profile updated successfully");
      setUser((u) => (u ? { ...u, name, phone } : u));
    } else {
      toast.error(res.message ?? "Update failed");
    }
    setSavingProfile(false);
  };

  const handleSignOut = async () => {
    await signout();
    navigate("/signin");
  };

  const handleUpdatePassword = () => {
    if (!currentPass || !newPass || !confirmPass) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }
    // TODO: gọi API đổi password khi backend có endpoint
    toast.success("Password updated successfully");
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
          <div className="w-56 flex-shrink-0 animate-pulse">
            <div className="bg-blue-600 rounded-t-2xl h-36" />
            <div className="bg-white rounded-b-2xl p-4 flex flex-col gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-9 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-6 animate-pulse flex flex-col gap-4">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orderFilter === "all"
    ? MOCK_RENTALS
    : MOCK_RENTALS.filter((o) => o.status === orderFilter);

  // ── Account stats ────────────────────────────────────────────────────────────
  const stats = [
    { label: "Total Orders",   value: "5",      color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Active Rentals", value: "1",      color: "text-green-600",  bg: "bg-green-50" },
    { label: "Total Spent",    value: "$1,044", color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Saved Items",    value: "2",      color: "text-pink-500",   bg: "bg-pink-50" },
  ];

  const sidebarItems: { tabKey: Tab; icon: typeof User; label: string }[] = [
    { tabKey: "profile",  icon: User,     label: "Profile" },
    { tabKey: "orders",   icon: Package,  label: "My Orders" },
    { tabKey: "settings", icon: Settings, label: "Settings" },
  ];

  const notifItems: { key: keyof typeof notifs; label: string; desc: string }[] = [
    { key: "orderUpdates", label: "Order Updates",      desc: "Status changes, delivery notifications" },
    { key: "promotions",   label: "Promotions & Deals", desc: "Special offers and discount codes" },
    { key: "newsletter",   label: "Newsletter",         desc: "Weekly roundup of new tech arrivals" },
    { key: "newArrivals",  label: "New Arrivals",       desc: "When new products become available" },
    { key: "priceDrops",   label: "Price Drops",        desc: "When wishlisted items go on sale" },
    { key: "sms",          label: "SMS Notifications",  desc: "Text messages for order updates" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="flex items-center gap-1 hover:text-gray-700">
            <Home size={13} /> Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-800 font-medium">My Account</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ─── Sidebar ─────────────────────────────────────────── */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            {/* Blue header card */}
            <div className="bg-blue-700 rounded-t-2xl px-5 pt-6 pb-5 text-white">
              <div className="relative w-16 h-16 mb-3">
                <div className="w-16 h-16 rounded-full bg-blue-400 border-2 border-white overflow-hidden flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold select-none">
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </span>
                  )}
                </div>
              </div>
              <div className="font-semibold text-base leading-tight">{user?.name}</div>
              <div className="text-blue-200 text-xs mt-0.5 truncate">{user?.email}</div>
            </div>

            {/* Nav items */}
            <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden">
              {sidebarItems.map(({ tabKey, icon: Icon, label }) => (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm transition-all text-left border-b border-gray-50 last:border-0 ${
                    tab === tabKey
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* ─── Main content ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* ════ Tab: Profile ════════════════════════════════════ */}
            {tab === "profile" && (
              <>
                {/* Profile Photo */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Profile Photo</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-blue-400 overflow-hidden flex items-center justify-center">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-white select-none">
                            {user?.name?.charAt(0).toUpperCase() ?? "U"}
                          </span>
                        )}
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                        <Camera size={11} className="text-white" />
                      </button>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{user?.name}</div>
                      <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
                      <button className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition text-gray-600">
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-5">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">Full Name</label>
                      <input
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">Email</label>
                      <input
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                        value={user?.email ?? ""}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">Phone</label>
                      <input
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (415) 555-0199"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">Location</label>
                      <input
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-sm text-gray-500">Bio</label>
                      <textarea
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="mt-5 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Save size={14} />
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* Account Stats */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Account Stats</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stats.map((s) => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ════ Tab: My Orders ══════════════════════════════════ */}
            {tab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
                {/* Header + filter */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-base font-semibold text-gray-900">My Orders</h2>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(["all", "active", "delivered", "pending"] as OrderFilter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
                          orderFilter === f
                            ? "bg-white shadow text-gray-800"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {f === "all" ? "All Orders" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order list */}
                <div className="flex flex-col gap-3">
                  {filteredOrders.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No orders found</div>
                  ) : (
                    filteredOrders.map((order) => {
                      const s = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
                      return (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-gray-800">{order.code}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.className}`}>
                                {s.text}
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-semibold text-gray-900">${order.total}</div>
                              <div className="text-xs text-gray-400">{order.item_count} {order.item_count === 1 ? "item" : "items"}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mb-2">Placed on {order.placed_on}</div>
                          <div className="text-sm text-gray-600 mb-3">{order.items.join(" · ")}</div>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition text-gray-600">
                              <Eye size={12} /> View Details
                            </button>
                            {order.status === "delivered" && (
                              <button className="flex items-center gap-1.5 text-xs border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition text-blue-600">
                                <RotateCcw size={12} /> Rent Again
                              </button>
                            )}
                            {order.status === "active" && (
                              <button className="flex items-center gap-1.5 text-xs border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition text-orange-500">
                                Extend Rental
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Rental tip */}
                <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="text-sm font-medium text-blue-700">Rental Tip </span>
                    <span className="text-sm text-blue-600">
                      Need to extend a rental? Contact us at least 24 hours before your return date to check availability.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ════ Tab: Settings ═══════════════════════════════════ */}
            {tab === "settings" && (
              <>
                {/* Change Password */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={16} className="text-blue-600" />
                    <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-5">Choose a strong password to protect your account</p>

                  <div className="flex flex-col gap-4 max-w-md">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">New Password</label>
                      <input
                        type="password"
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-500">Confirm New Password</label>
                      <input
                        type="password"
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      className="flex items-center gap-2 w-fit bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                    >
                      <Save size={14} /> Update Password
                    </button>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell size={16} className="text-blue-600" />
                    <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-5">Choose what you want to be notified about</p>

                  <div className="flex flex-col divide-y divide-gray-50">
                    {notifItems.map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{label}</div>
                          <div className="text-xs text-gray-400">{desc}</div>
                        </div>
                        <Toggle
                          checked={notifs[key]}
                          onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => toast.success("Preferences saved")}
                    className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <Save size={14} /> Save Preferences
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Trash2 size={16} className="text-red-500" />
                    <h2 className="text-base font-semibold text-red-500">Danger Zone</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">These actions cannot be undone</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                          toast.error("Account deletion is not available yet");
                        }
                      }}
                      className="border border-red-300 text-red-500 rounded-xl px-4 py-2 text-sm hover:bg-red-50 transition"
                    >
                      Delete Account
                    </button>
                    <button className="border border-gray-200 text-gray-600 rounded-xl px-4 py-2 text-sm hover:bg-gray-50 transition flex items-center gap-1.5">
                      <Download size={13} /> Export My Data
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}