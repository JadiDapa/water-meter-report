import {
  Home,
  Settings,
  Users,
  MessagesSquare,
  LucideIcon,
  ScrollText,
} from "lucide-react";

export type SubmenuItem = {
  title: string;
  url: string;
};

export type MenuItem = {
  title: string;
  url?: string;
  icon: LucideIcon;
  submenu?: SubmenuItem[];
};

export const adminMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Daftar Laporan", url: "/admin/reports", icon: ScrollText },
  { title: "Daftar Keluhan", url: "/admin/complaints", icon: MessagesSquare },
  {
    title: "Pengguna",
    icon: Users,
    submenu: [
      { title: "Pelanggan", url: "/admin/users/customers" },
      { title: "Teknisi", url: "/admin/users/technicians" },
      { title: "Semua", url: "/admin/users" },
    ],
  },
  { title: "Pengaturan", url: "/admin/settings", icon: Settings },
];

export const technicianMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/technician", icon: Home },
  { title: "Laporan Saya", url: "/technician/my-reports", icon: ScrollText },
  {
    title: "Keluhan Saya",
    url: "/technician/my-complaints",
    icon: MessagesSquare,
  },
  { title: "Pelanggan", url: "/technician/customers", icon: Users },
  { title: "Pengaturan", url: "/technician/settings", icon: Settings },
];
