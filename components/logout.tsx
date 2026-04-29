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
        <SidebarMenuButton className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </SidebarMenuButton>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />

        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          
          <AlertDialog.Title className="text-lg font-semibold">
            Yakin Ingin Logout ?
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm text-gray-500">
            Kamu harus login kembali untuk mengakses akun.
          </AlertDialog.Description>

          <div className="mt-4 flex justify-end gap-2">
            <AlertDialog.Cancel className="px-4 py-2 rounded bg-gray-200">
              Batal
            </AlertDialog.Cancel>

            <AlertDialog.Action
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 text-white"
            >
              Ya Logout
            </AlertDialog.Action>
          </div>

        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
