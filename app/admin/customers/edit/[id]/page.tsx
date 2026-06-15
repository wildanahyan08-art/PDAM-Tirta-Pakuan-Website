"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

export interface CustomerEditPage {
  id: number;
  user_id: number;
  customer_number: string;
  name: string;
  phone: string;
  address: string;
  service_id: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceOption {
  id: number;
  name: string;
}

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState<ServiceOption[]>([]);

  const [formData, setFormData] = useState({
    customer_number: "",
    name: "",
    phone: "",
    address: "",
    service_id: "",
  });

  async function getServices() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
        {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
        }
      );

      const json = await res.json();
      if (res.ok && json.data) {
        setServices(json.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data services:", error);
    }
  }

  async function getCustomerDetail() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${id}`,
        {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
          cache: "no-store",
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setFormData({
        customer_number: json.data.customer_number || "",
        name: json.data.name || "",
        phone: json.data.phone || "",
        address: json.data.address || "",
        service_id: json.data.service_id?.toString() || "",
      });
    } catch (error: any) {
      setError("Gagal mengambil data customer");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.service_id) {
      setError("Silakan pilih layanan");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            service_id: parseInt(formData.service_id),
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/customers");
      }, 1500);

    } catch (error: any) {
      setError(error.message || "Gagal update customer");
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    getServices();
    getCustomerDetail();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-6 w-6 mx-auto text-[#0077b6]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data customer...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Kembali ke Daftar Customer
        </Link>
        <h1 className="text-2xl font-bold text-[#0a1628]">Edit Customer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — ID Customer: #{id}</p>
      </div>

      {success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Customer berhasil diperbarui!</p>
            <p className="text-xs text-emerald-600 mt-0.5">Mengalihkan ke halaman daftar customer...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">Gagal memperbarui customer</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Informasi Customer</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ubah data customer sesuai kebutuhan</p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">
          <div>
            <label htmlFor="customer_number" className="label-field">
              Nomor Customer
            </label>
            <div className="relative">
              <input
                type="text"
                id="customer_number"
                name="customer_number"
                value={formData.customer_number}
                disabled
                className="input-field bg-[#f0f5ff] cursor-not-allowed text-muted-foreground pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Nomor customer tidak dapat diubah</p>
          </div>

          <div>
            <label htmlFor="name" className="label-field">
              Nama Customer <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap customer"
                required
                className="input-field pl-10"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="label-field">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="081234567890"
                required
                className="input-field pl-10"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="label-field">
              Alamat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Alamat lengkap customer"
                required
                rows={3}
                className="input-field resize-none pl-10"
              />
              <div className="absolute left-3 top-3 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="service_id" className="label-field">
              Pilih Layanan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="service_id"
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
                className="select-field"
              >
                <option value="">-- Pilih Layanan --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Pilih jenis layanan yang digunakan customer</p>
          </div>

          <div className="rounded-lg border border-border bg-[#f0f5ff] p-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0077b6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-[#0077b6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Informasi:</p>
                <ul className="mt-1 text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                  <li>Nomor customer bersifat unik dan tidak dapat diubah</li>
                  <li>Pastikan nomor telepon yang dimasukkan aktif</li>
                  <li>Alamat harus lengkap untuk keperluan penagihan</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline flex-1"
              >
                Batalkan
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>PDAM Tirta Pakuan • Sistem Manajemen Customer v1.0</p>
        <p className="mt-0.5">Semua perubahan akan disimpan secara permanen</p>
      </div>
    </div>
  );
}
