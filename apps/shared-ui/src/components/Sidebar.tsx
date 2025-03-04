import type { FC } from "react";
import { useRouter } from "next/router";
import React from "react";

const Sidebar: FC = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bookings", path: "/bookings" },
    { name: "Payments", path: "/payments" },
    { name: "Reports", path: "/reports" },
    { name: "Config", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-5 shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Menu</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-3">
              <button
                type="button"
                className={`w-full text-left px-4 py-2 rounded transition ${
                  router.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() =>
                  router.push(item.path, undefined, { shallow: true })
                }
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
