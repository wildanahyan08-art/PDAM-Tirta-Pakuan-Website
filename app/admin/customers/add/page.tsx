"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

// Types
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

  // GET SERVICES
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
    
    // Khusus untuk NIK, hanya terima angka dan batasi 16 digit
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Memuat data layanan...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Tambah Customer Baru</h1>
              <p className="text-gray-600 mt-1">
                PDAM Tirta Pakuan • Sistem Manajemen Customer
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="mb-6 space-y-4">
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
                    Customer berhasil ditambahkan!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Mengalihkan ke halaman daftar customer...
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600">✗</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-red-800">Gagal menambahkan customer</p>
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
              Isi data customer dengan lengkap dan benar
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Identitas Customer */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Identitas Customer
              </h3>
              
              {/* Customer Number */}
              <div>
                <label
                  htmlFor="customer_number"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Nomor Customer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customer_number"
                  name="customer_number"
                  value={formData.customer_number}
                  onChange={handleChange}
                  placeholder="CUST-20250311-1234"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400 bg-gray-50"
                  readOnly
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500">
                    Nomor unik untuk identifikasi customer
                  </p>
                  <button
                    type="button"
                    onClick={generateCustomerNumber}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Generate Ulang
                  </button>
                </div>
              </div>
            </div>

            {/* Informasi Akun */}
            <div className="space-y-4 pt-2">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                Informasi Akun
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Username untuk login ke sistem
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">Minimal 6 karakter</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Pribadi */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                Informasi Pribadi
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                  />
                </div>

                {/* NIK dengan indikator 0/16 */}
                <div>
                  <label
                    htmlFor="nik"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                      {formData.nik.length}/16
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    16 digit angka sesuai KTP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nomor Telepon */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
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
                  <p className="mt-1 text-sm text-gray-500">
                    Nomor aktif untuk notifikasi
                  </p>
                </div>

                {/* Pilih Layanan */}
                <div>
                  <label
                    htmlFor="service_id"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Pilih Layanan <span className="text-red-500">*</span>
                  </label>
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
                        {service.name} (Min: {service.min_usage} m³, Max: {service.max_usage} m³) - Rp {service.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400 resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Alamat lengkap untuk pengiriman tagihan
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">i</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Informasi Penting:</p>
                  <ul className="mt-1 text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Nomor customer digenerate otomatis dan bersifat unik</li>
                    <li>Username dan password akan digunakan customer untuk login</li>
                    <li>Pastikan NIK sesuai dengan KTP (16 digit)</li>
                    <li>Nomor telepon harus aktif untuk menerima notifikasi</li>
                  </ul>
                </div>
              </div>
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
                      Simpan Customer
                    </>
                  )}
                </button>
                <Link
                  href="/admin/customers"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-center"
                >
                  Batalkan
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm">!</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900">Tips:</p>
              <ul className="mt-1 text-sm text-yellow-700 space-y-1">
                <li>• Nomor customer digenerate otomatis, Anda bisa klik "Generate Ulang" jika ingin mengubah</li>
                <li>• Gunakan password yang kuat (kombinasi huruf besar, kecil, angka, dan simbol)</li>
                <li>• Catat username dan password untuk diberikan kepada customer</li>
                <li>• Verifikasi kembali NIK dan nomor telepon sebelum menyimpan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PDAM Tirta Pakuan • Sistem Manajemen Customer v1.0</p>
          <p className="mt-1">Field dengan tanda * wajib diisi</p>
        </div>
      </div>
    </div>
  );
}