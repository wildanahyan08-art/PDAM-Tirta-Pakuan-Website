"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

export interface ServiceAddResponse {
  success: boolean;
  message: string;
  data: AddServiceType;
}

export interface AddServiceType {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    min_usage: "",
    max_usage: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await getCookies("token");
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          min_usage: parseInt(formData.min_usage),
          max_usage: parseInt(formData.max_usage),
          price: parseInt(formData.price),
        }),
      });

      const responseData: ServiceAddResponse = await response.json();

      if (!response.ok) {
        setError(responseData?.message || "Gagal menambahkan layanan");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ name: "", min_usage: "", max_usage: "", price: "" });

      setTimeout(() => {
        router.push("/admin/services");
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan layanan");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali ke Daftar Layanan
        </Link>
        <h1 className="page-title">Tambah Layanan Baru</h1>
        <p className="page-desc">PDAM Tirta Pakuan • Sistem Manajemen Layanan</p>
      </div>

      {/* Status Messages */}
      <div className="mb-6 space-y-3">
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Layanan berhasil ditambahkan!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Mengalihkan ke halaman daftar layanan...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800">Gagal menambahkan layanan</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Informasi Layanan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Isi semua field yang diperlukan</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Nama Layanan */}
          <div>
            <label htmlFor="name" className="label-field">
              Nama Layanan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Sambungan Rumah, Instalasi Baru"
                required
                className="input-field"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Nama layanan yang akan ditampilkan ke pelanggan</p>
          </div>

          {/* Min & Max Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="min_usage" className="label-field">
                Penggunaan Minimum (m³) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="min_usage"
                  name="min_usage"
                  value={formData.min_usage}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="input-field"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Batas minimum penggunaan air</p>
            </div>

            <div>
              <label htmlFor="max_usage" className="label-field">
                Penggunaan Maximum (m³) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="max_usage"
                  name="max_usage"
                  value={formData.max_usage}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="input-field"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Batas maksimum penggunaan air</p>
            </div>
          </div>

          {/* Harga */}
          <div>
            <label htmlFor="price" className="label-field">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm font-medium">Rp</div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                required
                min="0"
                className="input-field pl-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Harga per unit layanan</p>
          </div>

          {/* Form Actions */}
          <div className="pt-5 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    Simpan Layanan
                  </>
                )}
              </button>
              <Link href="/admin/services" className="btn-outline flex-1 text-center">
                Batalkan
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* Form Tips */}
      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">Tips:</p>
            <ul className="mt-1 text-xs text-amber-700 space-y-0.5 list-disc list-inside">
              <li>Pastikan nama layanan jelas dan mudah dipahami</li>
              <li>Min usage harus lebih kecil dari max usage</li>
              <li>Harga harus sesuai dengan standar PDAM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>PDAM Tirta Pakuan • Sistem Manajemen Layanan v1.0</p>
        <p className="mt-0.5">Semua field wajib diisi sebelum disimpan</p>
      </div>
    </div>
  );
}
