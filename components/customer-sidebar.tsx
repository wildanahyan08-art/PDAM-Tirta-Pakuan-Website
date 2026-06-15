"use client";

import Link from "next/link";
import { User, Receipt, CreditCard } from "lucide-react";
import { LogoutButton } from "@/components/logout";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function CustomerSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0096c7] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 4 8.5 4 14a8 8 0 0016 0C20 8.5 12 2 12 2z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground leading-tight">PDAM</p>
              <p className="text-[10px] text-sidebar-foreground/50">Customer Area</p>
            </div>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/customer/profile">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/customer/bills">
                  <Receipt className="h-4 w-4" />
                  <span>Bills</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/customer/payments">
                  <CreditCard className="h-4 w-4" />
                  <span>Payments</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
