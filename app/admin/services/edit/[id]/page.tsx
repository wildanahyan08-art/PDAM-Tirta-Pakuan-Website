"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

interface ServiceType {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
}

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    min_usage: "",
    max_usage: "",
    price: "",
  });

  /** GET DETAIL SERVICE */
  async function getServiceDetail() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`,
        {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
          cache: "no-store",
        },
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setFormData({
        name: json.data.name || "",
        min_usage: json.data.min_usage?.toString() || "",
        max_usage: json.data.max_usage?.toString() || "",
        price: json.data.price?.toString() || "",
      });
    } catch (error: any) {
      setError("Gagal mengambil data service");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  /** UPDATE SERVICE */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (parseInt(formData.min_usage) > parseInt(formData.max_usage)) {
      setError("Min usage tidak boleh lebih besar dari Max usage");
      setSaving(false);
      return;
    }

    if (parseInt(formData.price) < 0) {
      setError("Harga tidak boleh negatif");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            min_usage: parseInt(formData.min_usage),
            max_usage: parseInt(formData.max_usage),
            price: parseInt(formData.price),
          }),
        },
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/services");
      }, 1500);

    } catch (error: any) {
      setError(error.message || "Gagal update service");
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    getServiceDetail();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0077b6] border-r-transparent"></div>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data service...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="page-title">Edit Layanan</h1>
        <p className="page-desc">PDAM Tirta Pakuan • ID Service: #{id}</p>
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
                <p className="text-sm font-semibold text-emerald-800">Service berhasil diperbarui!</p>
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
                <p className="text-sm font-semibold text-red-800">Gagal memperbarui layanan</p>
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
          <p className="text-xs text-muted-foreground mt-0.5">Ubah data service sesuai kebutuhan</p>
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
                placeholder="Nama layanan"
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

          {/* Current Values */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
              <div>
                <p className="text-xs font-semibold text-amber-800">Catatan:</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Mengubah data layanan akan mempengaruhi semua transaksi yang menggunakan layanan ini.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-5 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? (
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
                    Simpan Perubahan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline flex-1 text-center"
              >
                Batalkan
              </button>
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
            <p className="text-xs font-semibold text-amber-800">Peringatan:</p>
            <ul className="mt-1 text-xs text-amber-700 space-y-0.5 list-disc list-inside">
              <li>Pastikan data yang diubah sudah benar</li>
              <li>Perubahan harga akan mempengaruhi transaksi mendatang</li>
              <li>Min usage tidak boleh lebih besar dari Max usage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>PDAM Tirta Pakuan • Sistem Manajemen Layanan v1.0</p>
        <p className="mt-0.5">Semua perubahan akan disimpan secara permanen</p>
      </div>
    </div>
  );
}
