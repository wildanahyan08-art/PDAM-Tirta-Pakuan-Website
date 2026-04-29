"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

// Types
interface Customer {
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

interface Service {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

interface BillFormData {
  customer_id: string;
  service_id: string;
  month: string;
  year: string;
  measurement_number: string;
  usage_value: string;
  price: string;
}

export default function AddBillPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<BillFormData>({
    customer_id: "",
    service_id: "",
    month: "",
    year: "",
    measurement_number: "",
    usage_value: "",
    price: "",
  });

  // Months
  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Years (current year and 2 years back/forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    fetchCustomers();
    fetchServices();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = await getCookies("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers`, {
        method: "GET",
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      
      if (response.ok) {
        setCustomers(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchServices = async () => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // When service changes, update the service details
    if (name === "service_id" && value) {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service || null);
      
      // Auto-fill price from service
      if (service) {
        setFormData(prev => ({
          ...prev,
          price: service.price.toString()
        }));
      }
    }
  };

  const generateMeasurementNumber = () => {
    // Format: INV-YYYYMMDD-XXXX
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const measurementNumber = `INV-${dateStr}-${randomNum}`;
    
    setFormData(prev => ({
      ...prev,
      measurement_number: measurementNumber
    }));
  };

  const calculateTotalPrice = () => {
    const usage = parseFloat(formData.usage_value) || 0;
    const unitPrice = parseFloat(formData.price) || 0;
    const total = usage * unitPrice;
    
    return total.toLocaleString('id-ID');
  };

  const validateForm = (): boolean => {
    if (!formData.customer_id) {
      setError("Pilih customer terlebih dahulu");
      return false;
    }

    if (!formData.service_id) {
      setError("Pilih layanan terlebih dahulu");
      return false;
    }

    if (!formData.month) {
      setError("Pilih bulan tagihan");
      return false;
    }

    if (!formData.year) {
      setError("Pilih tahun tagihan");
      return false;
    }

    if (!formData.measurement_number) {
      setError("Nomor pengukuran harus diisi");
      return false;
    }

    if (!formData.usage_value || parseFloat(formData.usage_value) <= 0) {
      setError("Nilai penggunaan harus lebih dari 0");
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Harga harus lebih dari 0");
      return false;
    }

    // Check if bill already exists for this customer in the same month/year
    // This would typically be done by the backend, but we can add a warning

    return true;
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
        customer_id: parseInt(formData.customer_id),
        service_id: parseInt(formData.service_id),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        measurement_number: formData.measurement_number.trim(),
        usage_value: parseFloat(formData.usage_value),
        price: parseFloat(formData.price),
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills`, {
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
        throw new Error(json.message || "Gagal menambahkan tagihan");
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        customer_id: "",
        service_id: "",
        month: "",
        year: "",
        measurement_number: "",
        usage_value: "",
        price: "",
      });
      setSelectedService(null);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/admin/bills");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCustomers || loadingServices) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                href="/admin/bills"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-2 transition-colors"
              >
                <span>←</span> Kembali ke Daftar Tagihan
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Buat Tagihan Baru</h1>
              <p className="text-gray-600 mt-1">
                PDAM Tirta Pakuan • Sistem Manajemen Tagihan
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
                    Tagihan berhasil dibuat!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Mengalihkan ke halaman daftar tagihan...
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
                  <p className="font-medium text-red-800">Gagal membuat tagihan</p>
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
              Form Tagihan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Isi data tagihan dengan lengkap dan benar
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Informasi Customer */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Informasi Customer
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pilih Customer */}
                <div>
                  <label
                    htmlFor="customer_id"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Pilih Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="customer_id"
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">-- Pilih Customer --</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.customer_number}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Pilih customer yang akan ditagih
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - Rp {service.price.toLocaleString()}/m³
                      </option>
                    ))}
                  </select>
                  {selectedService && (
                    <p className="mt-1 text-sm text-blue-600">
                      Range: {selectedService.min_usage} - {selectedService.max_usage} m³
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Informasi Tagihan */}
            <div className="space-y-4 pt-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                Informasi Tagihan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bulan */}
                <div>
                  <label
                    htmlFor="month"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Bulan Tagihan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">-- Pilih Bulan --</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tahun */}
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Tahun Tagihan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">-- Pilih Tahun --</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nomor Pengukuran */}
                <div>
                  <label
                    htmlFor="measurement_number"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Nomor Pengukuran <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="measurement_number"
                      name="measurement_number"
                      value={formData.measurement_number}
                      onChange={handleChange}
                      placeholder="INV-20240315-1234"
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={generateMeasurementNumber}
                      className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Nomor unik untuk pengukuran tagihan
                  </p>
                </div>

                {/* Penggunaan */}
                <div>
                  <label
                    htmlFor="usage_value"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Penggunaan (m³) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="usage_value"
                    name="usage_value"
                    value={formData.usage_value}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Jumlah pemakaian air dalam m³
                  </p>
                </div>
              </div>

              {/* Harga per Unit */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Harga per m³ (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Harga per m³ (akan terisi otomatis dari layanan yang dipilih)
                </p>
              </div>

              {/* Total Tagihan Preview */}
              {formData.usage_value && formData.price && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Total Tagihan</p>
                      <p className="text-xs text-blue-700">
                        {formData.usage_value} m³ × Rp {parseFloat(formData.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">
                        Rp {calculateTotalPrice()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">!</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-900">Informasi Penting:</p>
                  <ul className="mt-1 text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Pastikan customer dan layanan sudah sesuai</li>
                    <li>Nomor pengukuran harus unik untuk setiap tagihan</li>
                    <li>Total tagihan akan dihitung otomatis berdasarkan penggunaan dan harga</li>
                    <li>Pastikan penggunaan sesuai dengan range layanan yang dipilih</li>
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
                      Simpan Tagihan
                    </>
                  )}
                </button>
                <Link
                  href="/admin/bills"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-center"
                >
                  Batalkan
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Tips Membuat Tagihan:</p>
              <ul className="mt-1 text-sm text-green-700 space-y-1">
                <li>• Pilih customer terlebih dahulu untuk memudahkan pengisian</li>
                <li>• Gunakan tombol "Generate" untuk membuat nomor pengukuran otomatis</li>
                <li>• Harga akan terisi otomatis setelah memilih layanan</li>
                <li>• Periksa kembali total tagihan sebelum menyimpan</li>
                <li>• Pastikan tidak ada duplikasi tagihan untuk periode yang sama</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PDAM Tirta Pakuan • Sistem Manajemen Tagihan v1.0</p>
          <p className="mt-1">Field dengan tanda * wajib diisi</p>
        </div>
      </div>
    </div>
  );
}