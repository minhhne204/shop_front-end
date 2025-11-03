import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

const Sidebar = () => {
  const baseClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition";
  const normal = `${baseClass} text-gray-700 hover:bg-blue-100`;
  const active = `${baseClass} bg-blue-500 text-white`;

  return (
    <aside className="w-60 bg-white shadow-md fixed top-0 left-0 h-screen p-4">
      <h1 className="text-xl font-bold text-blue-600 mb-8">Admin Panel</h1>
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? active : normal)}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? active : normal)}>
          <Package size={18} /> Sản phẩm
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? active : normal)}>
          <ShoppingBag size={18} /> Đơn hàng
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? active : normal)}>
          <Users size={18} /> Người dùng
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
