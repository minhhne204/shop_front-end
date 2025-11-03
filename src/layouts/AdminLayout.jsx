import React from "react";
import Sidebar from "../admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar cố định */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex-1 ml-60 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
