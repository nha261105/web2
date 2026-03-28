import { useState } from "react";
import { Eye, EyeOff, Save, Bell, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    newArrivals: true,
    priceDrops: true,
    sms: false,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      {/* Password */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0052CC]" /> Change Password
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Choose a strong password to protect your account
        </p>

        <form onSubmit={() => {}} className="space-y-4 max-w-md">
          {[
            { field: "current" as const, label: "Current Password" },
            { field: "next" as const, label: "New Password" },
            { field: "confirm" as const, label: "Confirm New Password" },
          ].map((f) => (
            <div key={f.field}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={passwords[f.field]}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, [f.field]: e.target.value }))
                  }
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
                {f.field === "current" && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#0747A6] transition-colors"
          >
            <Save className="w-4 h-4" /> Update Password
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0052CC]" /> Notification Preferences
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Choose what you want to be notified about
        </p>

        <div className="space-y-4">
          {[
            {
              key: "orderUpdates",
              label: "Order Updates",
              desc: "Status changes, delivery notifications",
            },
            {
              key: "promotions",
              label: "Promotions & Deals",
              desc: "Special offers and discount codes",
            },
            {
              key: "newsletter",
              label: "Newsletter",
              desc: "Weekly roundup of new tech arrivals",
            },
            {
              key: "newArrivals",
              label: "New Arrivals",
              desc: "When new products become available",
            },
            {
              key: "priceDrops",
              label: "Price Drops",
              desc: "When wishlisted items go on sale",
            },
            {
              key: "sms",
              label: "SMS Notifications",
              desc: "Text messages for order updates",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  toggleNotif(item.key as keyof typeof notifications)
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications]
                    ? "bg-[#0052CC]"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? "translate-x-5.5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {}}
          className="mt-5 h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#0747A6] transition-colors"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="text-base font-semibold text-red-600 mb-1 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          These actions cannot be undone
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="h-10 px-5 bg-white border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
            Delete Account
          </button>
          <button className="h-10 px-5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Export My Data
          </button>
        </div>
      </div>
    </div>
  );
}
