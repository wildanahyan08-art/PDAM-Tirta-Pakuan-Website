"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

interface ServiceType {
  id: number;
  name: string;
  price: number;
  min_usage: number;
  max_usage: number;
}

interface CustomerFormData {
  username: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  nik: string;
  service_id: string;
  customer_number: string;
}

export default function AddCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [formData, setFormData] = useState<CustomerFormData>({
    username: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    nik: "",
    service_id: "",
    customer_number: "",
  });

  useEffect(() => {
    getServices();
    generateCustomerNumber();
  }, []);

  const getServices = async () => {
    setLoadingServices(true);
    try {
      const token = await getCookies("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services`, {
        method: "GET",
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        setServices(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const generateCustomerNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const customerNumber = `CUST-${dateStr}-${randomNum}`;

    setFormData(prev => ({
      ...prev,
      customer_number: customerNumber
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "nik") {
      const numericValue = value.replace(/\D/g, "").slice(0, 16);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    const cleanNik = formData.nik.replace(/\D/g, "");
    if (cleanNik.length !== 16) {
      setError("NIK harus 16 digit angka");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    if (!formData.service_id) {
      setError("Silakan pilih layanan");
      return false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setError("Nomor telepon harus 10-15 digit");
      return false;
    }

    if (!formData.customer_number.trim()) {
      setError("Nomor customer harus diisi");
      return false;
    }

    return true;
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = await getCookies("token");

      if (!token) {
        setError("Silakan login ulang");
        router.push("/sign-in");
        return;
      }

      const requestBody = {
        username: formData.username.trim(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.phone.replace(/\D/g, ""),
        address: formData.address.trim(),
        nik: formData.nik.replace(/\D/g, ""),
        service_id: parseInt(formData.service_id),
        customer_number: formData.customer_number.trim(),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Gagal menambahkan customer");
      }

      setSuccess(true);

      setFormData({
        username: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        nik: "",
        service_id: "",
        customer_number: "",
      });

      generateCustomerNumber();

      setTimeout(() => {
        router.push("/admin/customers");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loadingServices) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-6 w-6 mx-auto text-[#0077b6]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data layanan...</p>
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
        <h1 className="text-2xl font-bold text-[#0a1628]">Tambah Customer Baru</h1>
        <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — Sistem Manajemen Customer</p>
      </div>

      {success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Customer berhasil ditambahkan!</p>
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
            <p className="text-sm font-semibold text-red-800">Gagal menambahkan customer</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Informasi Customer</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Isi data customer dengan lengkap dan benar</p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded bg-[#0096c7]" />
              <h3 className="text-sm font-semibold text-foreground">Identitas Customer</h3>
            </div>

            <div>
              <label htmlFor="customer_number" className="label-field">
                Nomor Customer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="customer_number"
                  name="customer_number"
                  value={formData.customer_number}
                  onChange={handleChange}
                  placeholder="CUST-20250311-1234"
                  required
                  className="input-field pr-10 bg-[#f0f5ff] cursor-not-allowed"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">Nomor unik untuk identifikasi customer</p>
                <button
                  type="button"
                  onClick={generateCustomerNumber}
                  className="text-xs text-[#0077b6] hover:text-[#0096c7] font-medium transition-colors"
                >
                  Generate Ulang
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded bg-[#0077b6]" />
              <h3 className="text-sm font-semibold text-foreground">Informasi Akun</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="label-field">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  required
                  className="input-field"
                />
                <p className="mt-1 text-xs text-muted-foreground">Username untuk login ke sistem</p>
              </div>

              <div>
                <label htmlFor="password" className="label-field">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    required
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="btn-secondary whitespace-nowrap text-xs"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    Generate
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Minimal 6 karakter</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded bg-[#0096c7]" />
              <h3 className="text-sm font-semibold text-foreground">Informasi Pribadi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="label-field">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    required
                    className="input-field pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="nik" className="label-field">
                  NIK <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nik"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="16 digit NIK"
                    required
                    maxLength={16}
                    className="input-field pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {formData.nik.length}/16
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">16 digit angka sesuai KTP</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="mt-1 text-xs text-muted-foreground">Nomor aktif untuk notifikasi</p>
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
                        {service.name} (Min: {service.min_usage} m³, Max: {service.max_usage} m³) - Rp {service.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="label-field">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Contoh: Jl. Merdeka No. 123, RT 01 RW 02, Kel. Kebon Kelapa, Kec. Bogor Tengah, Kota Bogor"
                required
                rows={3}
                className="input-field resize-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Alamat lengkap untuk pengiriman tagihan</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-[#f0f5ff] p-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0077b6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-[#0077b6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Informasi Penting:</p>
                <ul className="mt-1 text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                  <li>Nomor customer digenerate otomatis dan bersifat unik</li>
                  <li>Username dan password akan digunakan customer untuk login</li>
                  <li>Pastikan NIK sesuai dengan KTP (16 digit)</li>
                  <li>Nomor telepon harus aktif untuk menerima notifikasi</li>
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
                    Simpan Customer
                  </>
                )}
              </button>
              <Link
                href="/admin/customers"
                className="btn-outline flex-1"
              >
                Batalkan
              </Link>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">Tips:</p>
            <ul className="mt-1 text-xs text-amber-700 space-y-0.5 list-disc list-inside">
              <li>Nomor customer digenerate otomatis, klik &quot;Generate Ulang&quot; jika ingin mengubah</li>
              <li>Gunakan password yang kuat (kombinasi huruf besar, kecil, angka, dan simbol)</li>
              <li>Catat username dan password untuk diberikan kepada customer</li>
              <li>Verifikasi kembali NIK dan nomor telepon sebelum menyimpan</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>PDAM Tirta Pakuan • Sistem Manajemen Customer v1.0</p>
        <p className="mt-0.5">Field dengan tanda * wajib diisi</p>
      </div>
    </div>
  );
}
