import { useState } from "react";

import { Search, EllipsisVertical, UserPlus } from "lucide-react";

import { USER_CARD, USERS, USER_STATUS_STYLES } from "./admindata";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const [users] = useState(USERS);
  const [roleKeyword, setRoleKeyword] = useState("");

  const filteredUsers = users.filter((user) =>
    user.role.toLowerCase().includes(roleKeyword.toLowerCase().trim()),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{users.length} users</p>
        </div>

        <Button className="bg-[#0052CC] hover:bg-[#0747A6] text-white cursor-pointer">
          <i>
            <UserPlus />
          </i>
          <span>Add User</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {USER_CARD.map((item) => (
          <div
            key={item.label}
            className="bg-white border border-gray-200 p-5 rounded-xl"
          >
            <h1 className={`${item.text} font-bold text-xl`}>{item.value}</h1>
            <span className="text-gray-500 text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-5 text-gray-400" />
          <input
            type="text"
            value={roleKeyword}
            onChange={(e) => setRoleKeyword(e.target.value)}
            placeholder="Search by role..."
            className="w-full h-9 pl-9 rounded-lg border border-gray-200 text-sm focus:border-[#0052CC] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "User",
                  "Role",
                  "Orders",
                  "Total Spent",
                  "Joined",
                  "Status",
                  "Detail",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="text-left px-5 py-3 text-xs font-medium text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center text-xs font-semibold">
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {user.orders}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    ${user.totalSpent}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {user.joined}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${USER_STATUS_STYLES[user.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      aria-label={`View ${user.name} details`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                    >
                      <EllipsisVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
