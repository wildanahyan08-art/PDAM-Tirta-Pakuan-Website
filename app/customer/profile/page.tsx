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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0077b6] border-r-transparent"></div>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data pelanggan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Terjadi Kesalahan</h2>
          <p className="text-xs text-muted-foreground mb-5">{error}</p>
          <Link href="/" className="btn-primary text-sm">
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Profil Pelanggan</h1>
        <p className="page-desc">PDAM Tirta Pakuan • Dashboard Pelanggan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info & Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#0077b6] to-[#0096c7] relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-full bg-[#0077b6] border-4 border-white shadow-sm flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {customer?.name?.charAt(0) || "P"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-12 px-5 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{customer?.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Pelanggan PDAM</p>
                </div>
                <div className="flex gap-1.5 mt-3 sm:mt-0">
                  <span className="badge-active">Aktif</span>
                  <span className="badge bg-[#e0ecff] text-foreground">Pelanggan</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  label="Username"
                  value={`@${customer?.user.username}`}
                  colorClass="bg-[#e0ecff] text-[#0077b6]"
                />
                <InfoCard
                  label="Nomor Telepon"
                  value={customer?.phone || "-"}
                  colorClass="bg-[#e0ecff] text-[#0077b6]"
                />
                <InfoCard
                  label="Alamat"
                  value={customer?.address || "Belum diisi"}
                  colorClass="bg-[#e0ecff] text-[#0077b6]"
                />
                <InfoCard
                  label="Status Akun"
                  value="Aktif"
                  colorClass="bg-emerald-50 text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-1 h-4 bg-[#0096c7] rounded-full"></div>
                Layanan Berlangganan
              </h3>
              <span className="badge bg-[#e0ecff] text-foreground">{services.length} Layanan</span>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 bg-[#f0f5ff] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Belum Ada Layanan</h4>
                <p className="text-xs text-muted-foreground mb-4">Anda belum terdaftar pada layanan apapun</p>
                <Link href="/services" className="btn-primary text-sm">
                  Lihat Daftar Layanan
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-5">
          {/* Account Status */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Status Akun</h3>
            <div className="space-y-2.5">
              <StatusItem label="Verifikasi Email" value="Selesai" valueClass="text-emerald-600" />
              <StatusItem label="Status Akun" value="Aktif" valueClass="text-emerald-600" />
              <StatusItem label="Pembayaran" value="Lancar" valueClass="text-emerald-600" />
              <StatusItem label="Tagihan Bulan Ini" value="Rp 0" valueClass="text-foreground font-semibold" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Aksi Cepat</h3>
            <div className="space-y-2">
              <QuickAction icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
              } label="Lihat Tagihan" href="/customer/bills" />
              <QuickAction icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              } label="Riwayat Pembayaran" href="/customer/bills" />
              <QuickAction icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              } label="Pengaturan" href="/customer/settings" />
              <QuickAction icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              } label="Hubungi Support" href="/customer/support" />
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-[#e0ecff] border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Butuh Bantuan?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Hubungi customer service untuk pertanyaan terkait akun atau layanan.
            </p>
            <div className="space-y-1.5 text-xs text-foreground">
              <p className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                1500 123
              </p>
              <p className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                support@pdam-tirtapakuan.co.id
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-5 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-muted-foreground">
            <p>PDAM Tirta Pakuan • Sistem Pelanggan</p>
            <p className="mt-0.5">© {new Date().getFullYear()} Hak Cipta Dilindungi</p>
          </div>
          <Link
            href="/help"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Bantuan & FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function InfoCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="p-3.5 rounded-lg border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="p-4 rounded-lg border border-border hover:border-[#0096c7] hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-2.5">
        <h4 className="text-sm font-semibold text-foreground group-hover:text-[#0077b6] transition-colors">
          {service.name}
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground bg-[#f0f5ff] px-1.5 py-0.5 rounded">#{service.id}</span>
      </div>
      
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Range Penggunaan:</span>
          <span className="font-medium text-foreground">{service.min_usage} - {service.max_usage} m³</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Harga per m³:</span>
          <span className="font-bold text-[#0077b6]">Rp {service.price.toLocaleString('id-ID')}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <Link
          href={`/services/${service.id}`}
          className="inline-flex items-center gap-1 text-xs text-[#0096c7] hover:text-[#0077b6] transition-colors"
        >
          Lihat Detail
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}

function StatusItem({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-[#0096c7] hover:bg-[#f0f5ff] transition-all group"
    >
      <span className="text-muted-foreground group-hover:text-[#0096c7] transition-colors">{icon}</span>
      <span className="text-xs font-medium text-foreground group-hover:text-[#0077b6] transition-colors">{label}</span>
      <svg className="ml-auto w-3.5 h-3.5 text-muted-foreground group-hover:text-[#0096c7] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </Link>
  );
}
