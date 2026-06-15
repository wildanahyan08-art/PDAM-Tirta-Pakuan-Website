"use client";

import { deleteCookies } from "@/helper/cookies";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";

export function LogoutButton() {
  const handleLogout = () => {
    deleteCookies("token");
    window.location.href = "/sign-in";
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <SidebarMenuButton className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </SidebarMenuButton>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
          <AlertDialog.Title className="text-base font-semibold text-[#0a1628]">
            Yakin Ingin Logout?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            Kamu harus login kembali untuk mengakses akun.
          </AlertDialog.Description>

          <div className="mt-5 flex justify-end gap-2.5">
            <AlertDialog.Cancel className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-[#e5e0d9] transition-colors">
              Batal
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Ya Logout
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
