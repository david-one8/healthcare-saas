import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export default function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="md:pl-72">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="container-app py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}