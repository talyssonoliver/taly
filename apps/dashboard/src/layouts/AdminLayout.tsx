import type React from "react";
import Header from "../../../shared-ui/src/components/Header";
import Sidebar from "../../../shared-ui/src/components/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
