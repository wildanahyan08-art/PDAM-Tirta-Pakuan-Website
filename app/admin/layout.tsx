import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 bg-[#f0f5ff] min-h-screen">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-white">
          <SidebarTrigger />
          <span className="text-xs text-muted-foreground">PDAM Tirta Pakuan — Admin Panel</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
