import Link from "next/link";
import { getCookies } from "@/helper/cookies";

interface Admin {
  name: string;
  phone: string;
  user: {
    username: string;
    role: string;
  };
}

export default async function ProfilePage() {
  const token = await getCookies("token");

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl border border-border p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-red-50 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#0a1628] mb-2">Akses Terbatas</h2>
          <p className="text-sm text-muted-foreground mb-6">Anda perlu masuk untuk mengakses dashboard admin</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b6] text-white text-sm font-medium rounded-lg hover:bg-[#00699e] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg>
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admins/me`,
      {
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl border border-border p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-5 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/></svg>
            </div>
            <h2 className="text-lg font-bold text-[#0a1628] mb-2">Gagal Memuat Data</h2>
            <p className="text-sm text-muted-foreground mb-6">Terjadi kesalahan saat mengambil informasi profil</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-[#e5e0d9] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    const result = await response.json();
    const data: Admin = result.data || result;

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0a1628]">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — Sistem Manajemen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="h-24 bg-[#0a1628] relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-xl bg-[#0096c7] border-4 border-white shadow flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {data.name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-12 px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0a1628]">{data.name}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Administrator Sistem</p>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <span className="badge bg-[#0077b6]/10 text-[#0077b6]">Admin</span>
                    <span className="badge bg-emerald-50 text-emerald-700">Aktif</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailCard title="Username" value={data.user.username} icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  } />
                  <DetailCard title="Role" value={data.user.role} icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  } />
                  <DetailCard title="No. Telepon" value={data.phone} icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a1.998 1.998 0 01-2.18 2 19.791 19.791 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.791 19.791 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.758 12.758 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.758 12.758 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  } />
                  <DetailCard title="Status Akun" value="Aktif" icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                  } />
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-[#0a1628] mb-4">Aktivitas Sistem</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Layanan", value: "24" },
                      { label: "Pengguna", value: "156" },
                      { label: "Hari Ini", value: "12" },
                      { label: "Rating", value: "4.8" },
                    ].map((s, i) => (
                      <div key={i} className="text-center p-4 bg-[#f0f5ff] rounded-lg border border-border">
                        <div className="text-lg font-bold text-[#0a1628]">{s.value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Menu Utama
              </h3>
              <div className="space-y-2.5">
                <MenuButton href="/admin/services" label="Kelola Layanan" desc="Manajemen service PDAM" />
                <MenuButton href="/admin/customers" label="Kelola Pengguna" desc="Manajemen user sistem" />
                <MenuButton href="/admin/services" label="Kelola Layanan" desc="Manajemen service PDAM" />
              </div>
            </div>

            <div className="bg-[#0077b6] rounded-xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-3">Aksi Cepat</h3>
              <div className="space-y-2">
                {["Lihat Laporan", "Pengaturan", "Update Sistem"].map((label, i) => (
                  <button key={i} className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm text-left">
                    <span>{label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>Sistem Admin v2.0 • PDAM Tirta Pakuan</p>
              <p className="mt-0.5">© {new Date().getFullYear()} All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl border border-border p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-red-50 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-lg font-bold text-[#0a1628] mb-2">Kesalahan Sistem</h2>
          <p className="text-sm text-muted-foreground mb-6">Terjadi masalah teknis. Silakan coba beberapa saat lagi.</p>
          <div className="space-y-2.5">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-5 py-2.5 bg-[#0077b6] text-white text-sm font-medium rounded-lg hover:bg-[#00699e] transition-colors"
            >
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-block w-full px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

function DetailCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-[#f0f5ff] rounded-lg border border-border">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-[#0077b6]">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-semibold text-[#0a1628] mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MenuButton({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3.5 rounded-lg bg-[#f0f5ff] border border-border hover:border-[#0077b6]/20 hover:bg-white transition-all"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0a1628]">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M9 18l6-6-6-6"/></svg>
    </Link>
  );
}
