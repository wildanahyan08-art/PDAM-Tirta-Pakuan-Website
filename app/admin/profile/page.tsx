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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Akses Terbatas</h2>
          <p className="text-gray-600 mb-8">Anda perlu masuk untuk mengakses dashboard admin</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <span className="mr-2">→</span>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Gagal Memuat Data</h2>
            <p className="text-gray-600 mb-8">Terjadi kesalahan saat mengambil informasi profil</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    const result = await response.json();
    const data: Admin = result.data || result;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          
          {/* Header dengan Gradient */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 text-lg">PDAM Tirta Pakuan - Sistem Manajemen</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri - Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Card dengan Gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {data.name?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Profile Content */}
                <div className="pt-20 px-8 pb-8">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                      <p className="text-gray-600 mt-1">Administrator Sistem</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-medium rounded-full text-sm">
                          Admin
                        </span>
                        <span className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium rounded-full text-sm">
                          Aktif
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailCard 
                      title="Username"
                      value={data.user.username}
                      icon="👤"
                      colorType="blue"
                    />
                    <DetailCard 
                      title="Role"
                      value={data.user.role}
                      icon="🔑"
                      colorType="purple"
                    />
                    <DetailCard 
                      title="No. Telepon"
                      value={data.phone}
                      icon="📱"
                      colorType="green"
                    />
                    <DetailCard 
                      title="Status Akun"
                      value="Aktif"
                      icon="✓"
                      colorType="emerald"
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Aktivitas Sistem</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatBox label="Layanan" value="24" />
                      <StatBox label="Pengguna" value="156" />
                      <StatBox label="Hari Ini" value="12" />
                      <StatBox label="Rating" value="4.8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan - Menu Utama */}
            <div className="space-y-8">
              {/* Main Menu Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">⚡</span>
                  Menu Utama
                </h3>
                
                <div className="space-y-4">
                  <MenuButton
                    href="/admin/services"
                    icon="📋"
                    title="Kelola Layanan"
                    description="Manajemen service PDAM"
                    gradient="from-blue-500 to-blue-600"
                  />
                  <MenuButton
                    href="/admin/customers"
                    icon="👥"
                    title="Kelola Pengguna"
                    description="Manajemen user sistem"
                    gradient="from-green-500 to-green-600"
                  />
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Aksi Cepat</h3>
                <div className="space-y-3">
                  <QuickAction icon="📊" label="Lihat Laporan" />
                  <QuickAction icon="⚙️" label="Pengaturan" />
                  <QuickAction icon="🔄" label="Update Sistem" />
                </div>
              </div>

              {/* Footer Mini */}
              <div className="text-center text-gray-500 text-sm">
                <p>Sistem Admin v2.0 • PDAM Tirta Pakuan</p>
                <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Kesalahan Sistem</h2>
          <p className="text-gray-600 mb-8">Terjadi masalah teknis. Silakan coba beberapa saat lagi.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

/* ===== COMPONENTS ===== */

type ColorType = "blue" | "purple" | "green" | "emerald";

function DetailCard({ title, value, icon, colorType }: { 
  title: string; 
  value: string; 
  icon: string;
  colorType: ColorType;
}) {
  const colorClasses: Record<ColorType, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  const colorClass = colorClasses[colorType];

  return (
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MenuButton({ href, icon, title, description, gradient }: { 
  href: string; 
  icon: string;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className={`block p-5 rounded-xl bg-gradient-to-r ${gradient} text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-white/80 text-sm mt-1">{description}</p>
        </div>
        <span className="text-xl">→</span>
      </div>
    </Link>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-xl">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
      <span>→</span>
    </button>
  );
}