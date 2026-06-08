"use client";

import { useAuthStore } from "@/store/authStore";
import { FiBell, FiMenu } from "react-icons/fi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { user } = useAuthStore();

  const getInitials = (email: string) => {
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-primary">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
          <FiBell className="text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-primary text-white text-sm font-bold">
            {getInitials(user?.email || "")}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}