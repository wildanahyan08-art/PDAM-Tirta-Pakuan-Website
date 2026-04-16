"use client";

import { getCookies } from "@/helper/cookies";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= TYPES ================= */
interface Service {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  address?: string;
  user: {
    username: string;
    role: string;
  };
  service?: Service | Service[];
}

/* ================= PAGE ================= */
export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = await getCookies("token");
        if (!token) {
          setError("Silakan login untuk melihat profil");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/customers/me`,
          {
            headers: {
              "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Gagal mengambil data pelanggan");
        }

        const json = await res.json();
        setCustomer(json.data || json);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data customer");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Memuat data pelanggan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="h-16 w-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const services = customer?.service
    ? Array.isArray(customer.service)
      ? customer.service
      : [customer.service]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil Pelanggan</h1>
          <p className="text-gray-600 mt-1">PDAM Tirta Pakuan • Dashboard Pelanggan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {customer?.name?.charAt(0) || "P"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Profile Content */}
              <div className="pt-16 px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{customer?.name}</h2>
                    <p className="text-gray-600 mt-1">Pelanggan PDAM</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 font-medium rounded-full text-sm">
                        Aktif
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
                        Pelanggan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    label="Username"
                    value={`@${customer?.user.username}`}
                    icon="👤"
                    colorType="blue"
                  />
                  <InfoCard
                    label="Nomor Telepon"
                    value={customer?.phone || "-"}
                    icon="📱"
                    colorType="green"
                  />
                  <InfoCard
                    label="Alamat"
                    value={customer?.address || "Belum diisi"}
                    icon="🏠"
                    colorType="purple"
                  />
                  <InfoCard
                    label="Status Akun"
                    value="Aktif"
                    icon="✓"
                    colorType="emerald"
                  />
                </div>
              </div>
            </div>

            {/* Services Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Layanan Berlangganan</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {services.length} Layanan
                </span>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📭</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Layanan</h4>
                  <p className="text-gray-600 mb-6">Anda belum terdaftar pada layanan apapun</p>
                  <Link
                    href="/services"
                    className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lihat Daftar Layanan
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Akun</h3>
              <div className="space-y-3">
                <StatusItem label="Verifikasi Email" value="✓ Selesai" />
                <StatusItem label="Status Akun" value="Aktif" />
                <StatusItem label="Pembayaran" value="Lancar" />
                <StatusItem label="Tagihan Bulan Ini" value="Rp 0" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <QuickAction icon="📋" label="Lihat Tagihan" href="/bills" />
                <QuickAction icon="📊" label="Riwayat Pembayaran" href="/history" />
                <QuickAction icon="⚙️" label="Pengaturan Akun" href="/settings" />
                <QuickAction icon="📞" label="Hubungi Support" href="/support" />
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Butuh Bantuan?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Hubungi customer service untuk pertanyaan terkait akun atau layanan.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-blue-800">📞 1500 123</p>
                <p className="text-sm text-blue-800">✉️ support@pdam-tirtapakuan.co.id</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>PDAM Tirta Pakuan • Sistem Pelanggan</p>
              <p className="mt-1">© {new Date().getFullYear()} Hak Cipta Dilindungi</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/help"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Bantuan & FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

type ColorType = "blue" | "green" | "purple" | "emerald";

function InfoCard({ 
  label, 
  value, 
  icon, 
  colorType 
}: { 
  label: string; 
  value: string; 
  icon: string;
  colorType: ColorType;
}) {
  const colorClasses: Record<ColorType, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  const colorClass = colorClasses[colorType];

  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <span>{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="p-5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {service.name}
        </h4>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
          ID: {service.id}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Range Penggunaan:</span>
          <span className="font-medium text-gray-900">
            {service.min_usage} - {service.max_usage} m³
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Harga per m³:</span>
          <span className="font-bold text-blue-600">
            Rp {service.price.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href={`/services/${service.id}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Lihat Detail
          <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded">
        {value}
      </span>
    </div>
  );
}

function QuickAction({ 
  icon, 
  label, 
  href 
}: { 
  icon: string; 
  label: string; 
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
        {label}
      </span>
      <span className="ml-auto text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
    </Link>
  );
}