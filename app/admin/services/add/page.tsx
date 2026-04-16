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

      // Redirect ke halaman services setelah 1.5 detik
      setTimeout(() => {
        router.push("/admin/services");
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan layanan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                href="/admin/services"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-2 transition-colors"
              >
                <span>←</span> Kembali ke Daftar Layanan
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Layanan Baru</h1>
              <p className="text-gray-600 mt-1">
                PDAM Tirta Pakuan • Sistem Manajemen Layanan
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
                    Layanan berhasil ditambahkan!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Mengalihkan ke halaman daftar layanan...
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
                  <p className="font-medium text-red-800">Gagal menambahkan layanan</p>
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
              Informasi Layanan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Isi semua field yang diperlukan
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Nama Layanan */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📝
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Nama layanan yang akan ditampilkan ke pelanggan
              </p>
            </div>

            {/* Min & Max Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="min_usage"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📊
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Batas minimum penggunaan air
                </p>
              </div>

              <div>
                <label
                  htmlFor="max_usage"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📈
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Batas maksimum penggunaan air
                </p>
              </div>
            </div>

            {/* Harga */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  Rp
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  💰
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Harga per unit layanan
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
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
                      Simpan Layanan
                    </>
                  )}
                </button>
                <Link
                  href="/admin/services"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-center"
                >
                  Batalkan
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Tips:</p>
              <ul className="mt-1 text-sm text-blue-700 space-y-1">
                <li>• Pastikan nama layanan jelas dan mudah dipahami</li>
                <li>• Min usage harus lebih kecil dari max usage</li>
                <li>• Harga harus sesuai dengan standar PDAM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PDAM Tirta Pakuan • Sistem Manajemen Layanan v1.0</p>
          <p className="mt-1">Semua field wajib diisi sebelum disimpan</p>
        </div>
      </div>
    </div>
  );
}