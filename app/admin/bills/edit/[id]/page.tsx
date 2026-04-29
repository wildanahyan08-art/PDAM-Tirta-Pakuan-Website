"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

// Types
interface BillData {
  id: number;
  customer_id: number;
  admin_id: number;
  month: number;
  year: number;
  measurement_number: string;
  usage_value: number;
  price: number;
  service_id: number;
  paid: boolean;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: number;
  name: string;
  customer_number: string;
  phone: string;
  address: string;
}

interface Service {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
}

interface FormData {
  customer_id: string;
  service_id: string;
  month: string;
  year: string;
  measurement_number: string;
  usage_value: string;
  price: string;
  paid: boolean;
}

export default function EditBillPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [originalBill, setOriginalBill] = useState<BillData | null>(null);

  const [formData, setFormData] = useState<FormData>({
    customer_id: "",
    service_id: "",
    month: "",
    year: "",
    measurement_number: "",
    usage_value: "",
    price: "",
    paid: false,
  });

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = await getCookies("token");
      
      // Fetch bill detail
      const billRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${id}`, {
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });
      const billJson = await billRes.json();
      
      if (!billRes.ok) throw new Error(billJson.message);
      
      const billData: BillData = billJson.data;
      setOriginalBill(billData);
      
      // Fetch customers
      const customersRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers`, {
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });
      const customersJson = await customersRes.json();
      if (customersRes.ok) {
        setCustomers(customersJson.data || []);
      }
      
      // Fetch services
      const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services`, {
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });
      const servicesJson = await servicesRes.json();
      if (servicesRes.ok) {
        setServices(servicesJson.data || []);
        const service = servicesJson.data.find((s: Service) => s.id === billData.service_id);
        setSelectedService(service || null);
      }
      
      // Set form data
      setFormData({
        customer_id: billData.customer_id.toString(),
        service_id: billData.service_id.toString(),
        month: billData.month.toString(),
        year: billData.year.toString(),
        measurement_number: billData.measurement_number,
        usage_value: billData.usage_value.toString(),
        price: billData.price.toString(),
        paid: billData.paid,
      });
      
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data tagihan");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "service_id" && value) {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service || null);
      
      // Auto-fill price from service if price hasn't been manually changed
      if (service && !formData.price) {
        setFormData(prev => ({
          ...prev,
          price: service.price.toString()
        }));
      }
    }
  };

  const calculateTotalPrice = () => {
    const usage = parseFloat(formData.usage_value) || 0;
    const unitPrice = parseFloat(formData.price) || 0;
    return usage * unitPrice;
  };

  const validateForm = (): boolean => {
    if (!formData.customer_id) {
      setError("Pilih customer");
      return false;
    }
    if (!formData.service_id) {
      setError("Pilih layanan");
      return false;
    }
    if (!formData.month) {
      setError("Pilih bulan");
      return false;
    }
    if (!formData.year) {
      setError("Pilih tahun");
      return false;
    }
    if (!formData.measurement_number) {
      setError("Nomor pengukuran harus diisi");
      return false;
    }
    if (!formData.usage_value || parseFloat(formData.usage_value) <= 0) {
      setError("Penggunaan harus lebih dari 0");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Harga harus lebih dari 0");
      return false;
    }
    return true;
  };

  // Fungsi untuk mendeteksi field mana yang berubah
  const getChangedFields = () => {
    if (!originalBill) return {};
    
    const changes: any = {};
    
    if (parseInt(formData.customer_id) !== originalBill.customer_id) {
      changes.customer_id = parseInt(formData.customer_id);
    }
    if (parseInt(formData.service_id) !== originalBill.service_id) {
      changes.service_id = parseInt(formData.service_id);
    }
    if (parseInt(formData.month) !== originalBill.month) {
      changes.month = parseInt(formData.month);
    }
    if (parseInt(formData.year) !== originalBill.year) {
      changes.year = parseInt(formData.year);
    }
    if (formData.measurement_number !== originalBill.measurement_number) {
      changes.measurement_number = formData.measurement_number;
    }
    if (parseFloat(formData.usage_value) !== originalBill.usage_value) {
      changes.usage_value = parseFloat(formData.usage_value);
    }
    if (parseFloat(formData.price) !== originalBill.price) {
      changes.price = parseFloat(formData.price);
    }
    if (formData.paid !== originalBill.paid) {
      changes.paid = formData.paid;
    }
    
    return changes;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    setError("");
    
    try {
      const token = await getCookies("token");
      
      // Hanya kirim field yang berubah
      const changedFields = getChangedFields();
      
      // Jika tidak ada perubahan, langsung redirect
      if (Object.keys(changedFields).length === 0) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/bills");
          router.refresh();
        }, 1500);
        return;
      }
      
      console.log("Fields yang diubah:", changedFields);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changedFields),
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json.message || "Gagal update tagihan");
      }
      
      setSuccess(true);
      
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

  // Reset error ketika user mulai mengedit
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (error) setError("");
    handleChange(e);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Memuat data tagihan...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Tagihan</h1>
              <p className="text-gray-600 mt-1">
                PDAM Tirta Pakuan • ID Tagihan: #{id}
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
                    Tagihan berhasil diperbarui!
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
                  <p className="font-medium text-red-800">Gagal memperbarui tagihan</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Informasi Tagihan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ubah data tagihan sesuai kebutuhan (hanya field yang diubah akan disimpan)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Informasi Customer */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Informasi Customer
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Pilih Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.customer_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Pilih Layanan</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Bulan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Pilih Bulan</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tahun <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Pilih Tahun</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nomor Pengukuran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="measurement_number"
                    value={formData.measurement_number}
                    onChange={handleFieldChange}
                    placeholder="INV-20240315-1234"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Penggunaan (m³) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="usage_value"
                    value={formData.usage_value}
                    onChange={handleFieldChange}
                    placeholder="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Harga per m³ (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFieldChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Status Pembayaran
                  </label>
                  <label className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="paid"
                      checked={formData.paid}
                      onChange={handleFieldChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700">Sudah Lunas</span>
                  </label>
                </div>
              </div>

              {/* Total Preview */}
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
                        Rp {calculateTotalPrice().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">ℹ️</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Informasi:</p>
                  <ul className="mt-1 text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Sistem hanya akan menyimpan field yang Anda ubah</li>
                    <li>Field yang tidak diubah akan tetap menggunakan data lama</li>
                    <li>Pastikan data yang diubah sudah sesuai</li>
                    <li>Nomor pengukuran harus unik untuk setiap tagihan</li>
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
                      Simpan Perubahan
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

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PDAM Tirta Pakuan • Sistem Manajemen Tagihan v1.0</p>
          <p className="mt-1">Field dengan tanda * wajib diisi</p>
        </div>
      </div>
    </div>
  );
}