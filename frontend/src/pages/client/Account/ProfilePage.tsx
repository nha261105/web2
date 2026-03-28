import { useState } from "react";
import { Camera, Save, User } from "lucide-react";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    name: "Nguyễn Thanh Sang",
    email: "demo@gmail.com",
    phone: "+1 (415) 555-0199",
    location: "San Francisco, CA",
    bio: "Freelance creative professional who loves renting top-tier tech for projects.",
  });

  return (
    <div className="space-y-3">
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Profile Photo
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
                )} */}
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-black" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#0052CC] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#0747A6] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {"Nguyễn Thanh Sang"}
            </p>
            <p className="text-xs text-gray-500 mb-3">{"demo@gmail.com"}</p>
            <button className="h-8 px-4 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
              Change Photo
            </button>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Personal Information
        </h2>
        <form onSubmit={() => {}}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[
              {
                field: "name",
                label: "Full Name",
                placeholder: "Your full name",
              },
              {
                field: "email",
                label: "Email",
                placeholder: "your@email.com",
                type: "email",
              },
              {
                field: "phone",
                label: "Phone",
                placeholder: "+1 (555) 000-0000",
              },
              {
                field: "location",
                label: "Location",
                placeholder: "City, State",
              },
            ].map((f) => (
              <div key={f.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type || "text"}
                  value={form[f.field as keyof ProfileForm]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [f.field]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </div>

      {/* Account stats */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Account Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: "5",
              color: "bg-blue-50 text-[#0052CC]",
            },
            {
              label: "Active Rentals",
              value: "1",
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Total Spent",
              value: "$1,044",
              color: "bg-orange-50 text-[#FF6A00]",
            },
            {
              label: "Saved Items",
              value: "2",
              color: "bg-pink-50 text-pink-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl p-4 ${stat.color.split(" ")[0]}`}
            >
              <p className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
