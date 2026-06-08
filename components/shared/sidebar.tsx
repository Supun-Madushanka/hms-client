"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiUser,
  FiLogOut,
  FiClock,
  FiUserCheck,
  FiPlusCircle,
} from "react-icons/fi";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <FiHome /> },
  { label: "Doctors", href: "/admin/doctors", icon: <FiUserCheck /> },
  { label: "Patients", href: "/admin/patients", icon: <FiUsers /> },
  { label: "Appointments", href: "/admin/appointments", icon: <FiCalendar /> },
];

const doctorNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: <FiHome /> },
  { label: "Appointments", href: "/doctor/appointments", icon: <FiCalendar /> },
  { label: "Profile", href: "/doctor/profile", icon: <FiUser /> },
];

const patientNavItems: NavItem[] = [
  { label: "Dashboard", href: "/patient/dashboard", icon: <FiHome /> },
  { label: "Book Appointment", href: "/patient/book", icon: <FiPlusCircle /> },
  { label: "My Appointments", href: "/patient/appointments", icon: <FiClock /> },
  { label: "Profile", href: "/patient/profile", icon: <FiUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const getNavItems = () => {
    if (user?.role === "ADMIN") return adminNavItems;
    if (user?.role === "DOCTOR") return doctorNavItems;
    return patientNavItems;
  };

  const getRoleBadgeColor = () => {
    if (user?.role === "ADMIN") return "bg-accent text-white";
    if (user?.role === "DOCTOR") return "bg-green-500 text-white";
    return "bg-blue-500 text-white";
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const getInitials = (email: string) => {
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <span className="text-sidebar-foreground text-xl font-bold">HMS</span>
            <p className="text-accent text-xs">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-accent text-white text-sm font-bold">
              {getInitials(user?.email || "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-medium truncate">
              {user?.email}
            </p>
            <Badge className={`text-xs mt-1 ${getRoleBadgeColor()}`}>
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {getNavItems().map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-accent text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 w-full"
        >
          <FiLogOut className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </aside>
  );
}