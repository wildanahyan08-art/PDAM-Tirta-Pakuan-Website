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

  /** GET SERVICES FOR DROPDOWN */
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

  /** GET DETAIL CUSTOMER */
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

      // Set form data
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

  /** UPDATE CUSTOMER */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validation
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
      
      // Redirect setelah 1.5 detik
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Memuat data customer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                href="/admin/customers"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-2 transition-colors"
              >
                <span>←</span> Kembali ke Daftar Customer
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
              <p className="text-gray-600 mt-1">
                PDAM Tirta Pakuan • ID Customer: #{id}
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="mb-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-green-800">
                    Customer berhasil diperbarui!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Mengalihkan ke halaman daftar customer...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600">✗</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-red-800">Gagal memperbarui customer</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Customer
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ubah data customer sesuai kebutuhan
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Nomor Customer (Read-only) */}
            <div>
              <label
                htmlFor="customer_number"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Nomor Customer
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="customer_number"
                  name="customer_number"
                  value={formData.customer_number}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔢
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Nomor customer tidak dapat diubah
              </p>
            </div>

            {/* Nama Customer */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  👤
                </div>
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📱
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400 resize-none"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  📍
                </div>
              </div>
            </div>

            {/* Pilih Layanan */}
            <div>
              <label
                htmlFor="service_id"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Pilih Layanan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="service_id"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Pilih jenis layanan yang digunakan customer
              </p>
            </div>

            {/* Info Tambahan */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Informasi:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nomor customer bersifat unik dan tidak dapat diubah</li>
                <li>• Pastikan nomor telepon yang dimasukkan aktif</li>
                <li>• Alamat harus lengkap untuk keperluan penagihan</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✓</span>
                      Simpan Perubahan
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PDAM Tirta Pakuan • Sistem Manajemen Customer v1.0</p>
          <p className="mt-1">Semua perubahan akan disimpan secara permanen</p>
        </div>
      </div>
    </div>
  );
}