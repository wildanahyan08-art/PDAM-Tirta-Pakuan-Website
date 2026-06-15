"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

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
      if (response.ok) setCustomers(json.data || []);
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
      if (response.ok) setServices(json.data || []);
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
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "service_id" && value) {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service || null);
      if (service) {
        setFormData(prev => ({ ...prev, price: service.price.toString() }));
      }
    }
  };

  const generateMeasurementNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, measurement_number: `INV-${dateStr}-${randomNum}` }));
  };

  const calculateTotalPrice = () => {
    const usage = parseFloat(formData.usage_value) || 0;
    const unitPrice = parseFloat(formData.price) || 0;
    return (usage * unitPrice).toLocaleString('id-ID');
  };

  const validateForm = (): boolean => {
    if (!formData.customer_id) { setError("Pilih customer terlebih dahulu"); return false; }
    if (!formData.service_id) { setError("Pilih layanan terlebih dahulu"); return false; }
    if (!formData.month) { setError("Pilih bulan tagihan"); return false; }
    if (!formData.year) { setError("Pilih tahun tagihan"); return false; }
    if (!formData.measurement_number) { setError("Nomor pengukuran harus diisi"); return false; }
    if (!formData.usage_value || parseFloat(formData.usage_value) <= 0) { setError("Nilai penggunaan harus lebih dari 0"); return false; }
    if (!formData.price || parseFloat(formData.price) <= 0) { setError("Harga harus lebih dari 0"); return false; }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      const token = await getCookies("token");
      if (!token) { setError("Silakan login ulang"); router.push("/sign-in"); return; }

      const requestBody = {
        customer_id: parseInt(formData.customer_id),
        service_id: parseInt(formData.service_id),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        measurement_number: formData.measurement_number.trim(),
        usage_value: parseFloat(formData.usage_value),
        price: parseFloat(formData.price),
      };

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
      if (!response.ok) throw new Error(json.message || "Gagal menambahkan tagihan");

      setSuccess(true);
      setFormData({
        customer_id: "", service_id: "", month: "", year: "",
        measurement_number: "", usage_value: "", price: "",
      });
      setSelectedService(null);
      setTimeout(() => { router.push("/admin/bills"); router.refresh(); }, 1500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCustomers || loadingServices) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#0077b6] border-r-transparent"></div>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/bills" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-[#0a1628]">Buat Tagihan Baru</h1>
        <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — Sistem Manajemen Tagihan</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <p className="text-sm font-medium text-emerald-800">Tagihan berhasil dibuat!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Mengalihkan ke halaman daftar tagihan...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <div>
              <p className="text-sm font-medium text-red-800">Gagal membuat tagihan</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-[#f0f5ff]">
          <h2 className="text-sm font-semibold text-foreground">Form Tagihan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Isi data tagihan dengan lengkap dan benar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-4 rounded bg-[#0096c7]" />
              Informasi Customer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer_id" className="label-field">Pilih Customer <span className="text-red-500">*</span></label>
                <select id="customer_id" name="customer_id" value={formData.customer_id} onChange={handleChange} required className="select-field">
                  <option value="">-- Pilih Customer --</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name} - {customer.customer_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="service_id" className="label-field">Pilih Layanan <span className="text-red-500">*</span></label>
                <select id="service_id" name="service_id" value={formData.service_id} onChange={handleChange} required className="select-field">
                  <option value="">-- Pilih Layanan --</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name} - Rp {service.price.toLocaleString()}/m³</option>
                  ))}
                </select>
                {selectedService && (
                  <p className="text-xs text-[#0077b6] mt-1">Range: {selectedService.min_usage} – {selectedService.max_usage} m³</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-4 rounded bg-[#0077b6]" />
              Informasi Tagihan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="month" className="label-field">Bulan <span className="text-red-500">*</span></label>
                <select id="month" name="month" value={formData.month} onChange={handleChange} required className="select-field">
                  <option value="">-- Pilih Bulan --</option>
                  {months.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="label-field">Tahun <span className="text-red-500">*</span></label>
                <select id="year" name="year" value={formData.year} onChange={handleChange} required className="select-field">
                  <option value="">-- Pilih Tahun --</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="measurement_number" className="label-field">Nomor Pengukuran <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input type="text" id="measurement_number" name="measurement_number" value={formData.measurement_number} onChange={handleChange} placeholder="INV-20240315-1234" required className="input-field flex-1" />
                  <button type="button" onClick={generateMeasurementNumber} className="btn-secondary text-xs whitespace-nowrap">Generate</button>
                </div>
              </div>
              <div>
                <label htmlFor="usage_value" className="label-field">Penggunaan (m³) <span className="text-red-500">*</span></label>
                <input type="number" id="usage_value" name="usage_value" value={formData.usage_value} onChange={handleChange} placeholder="0" required min="0" step="0.01" className="input-field" />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="label-field">Harga per m³ (Rp) <span className="text-red-500">*</span></label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="0" required min="0" className="input-field" />
            </div>

            {formData.usage_value && formData.price && (
              <div className="bg-[#f0f5ff] border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Total Tagihan</p>
                    <p className="text-xs text-muted-foreground">{formData.usage_value} m³ × Rp {parseFloat(formData.price).toLocaleString()}</p>
                  </div>
                  <p className="text-xl font-bold text-[#0077b6]">Rp {calculateTotalPrice()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div>
                <p className="text-xs font-medium text-amber-900">Informasi Penting:</p>
                <ul className="text-xs text-amber-700 mt-1 space-y-0.5 list-disc list-inside">
                  <li>Pastikan customer dan layanan sudah sesuai</li>
                  <li>Nomor pengukuran harus unik untuk setiap tagihan</li>
                  <li>Pastikan penggunaan sesuai dengan range layanan yang dipilih</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Menyimpan...</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Simpan Tagihan</>
              )}
            </button>
            <Link href="/admin/bills" className="btn-outline flex-1 text-center">Batalkan</Link>
          </div>
        </form>
      </div>

      <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-start gap-2.5">
          <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <div>
            <p className="text-xs font-medium text-emerald-900">Tips:</p>
            <ul className="text-xs text-emerald-700 mt-1 space-y-0.5">
              <li>• Gunakan tombol "Generate" untuk membuat nomor pengukuran otomatis</li>
              <li>• Harga akan terisi otomatis setelah memilih layanan</li>
              <li>• Pastikan tidak ada duplikasi tagihan untuk periode yang sama</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Field dengan tanda * wajib diisi</p>
    </div>
  );
}
