import { useState } from "react";
import { Bell, CircleDollarSign, Settings2, Shield, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
};

function ToggleRow({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-label={label}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#0052CC]" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [siteName, setSiteName] = useState("RentalTech");
  const [contactEmail, setContactEmail] = useState("hello@rentaltech.io");
  const [currency, setCurrency] = useState("VND");
  const [timezone, setTimezone] = useState("VietNam/HCM");

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [newUserRegistrations, setNewUserRegistrations] = useState(false);

  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("200");
  const [baseDeliveryFee, setBaseDeliveryFee] = useState("15");

  const [minRentalDays, setMinRentalDays] = useState("1");
  const [maxRentalDays, setMaxRentalDays] = useState("90");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-bold text-xl text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your platform configuration
        </p>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Settings2 className="w-4 h-4 text-[#0052CC]" />
          General Settings
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">Site Name</span>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">
              Contact Email
            </span>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">Currency</span>
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">Timezone</span>
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>
        </div>

        <ToggleRow
          checked={maintenanceMode}
          onChange={setMaintenanceMode}
          label="Maintenance Mode"
          description="Disable public access temporarily"
        />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Bell className="w-4 h-4 text-[#0052CC]" />
          Notification Settings
        </div>

        <ToggleRow
          checked={orderNotifications}
          onChange={setOrderNotifications}
          label="Order Notifications"
          description="Get notified for new orders"
        />
        <ToggleRow
          checked={lowStockAlerts}
          onChange={setLowStockAlerts}
          label="Low Stock Alerts"
          description="Alert when stock falls below 3"
        />
        <ToggleRow
          checked={newUserRegistrations}
          onChange={setNewUserRegistrations}
          label="New User Registrations"
          description="Alert when new users sign up"
        />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <CircleDollarSign className="w-4 h-4 text-[#0052CC]" />
          Payment Settings
        </div>

        <ToggleRow
          checked={stripeEnabled}
          onChange={setStripeEnabled}
          label="Stripe"
          description="Accept credit & debit cards"
        />
        <ToggleRow
          checked={paypalEnabled}
          onChange={setPaypalEnabled}
          label="PayPal"
          description="Accept PayPal payments"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">
              Free Delivery Threshold ($)
            </span>
            <input
              type="number"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">
              Base Delivery Fee ($)
            </span>
            <input
              type="number"
              value={baseDeliveryFee}
              onChange={(e) => setBaseDeliveryFee(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Shield className="w-4 h-4 text-[#0052CC]" />
          Rental Policy
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">
              Min Rental Days
            </span>
            <input
              type="number"
              value={minRentalDays}
              onChange={(e) => setMinRentalDays(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-gray-600">
              Max Rental Days
            </span>
            <input
              type="number"
              value={maxRentalDays}
              onChange={(e) => setMaxRentalDays(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052CC]"
            />
          </label>
        </div>
      </section>

      <Button className="bg-[#0052CC] hover:bg-[#0747A6] text-white cursor-pointer">
        <Save className="w-4 h-4" />
        Save All Settings
      </Button>
    </div>
  );
}
