"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

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

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const token = await getCookies("token");
      const billRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${id}`, {
        headers: { "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
      });
      const billJson = await billRes.json();
      if (!billRes.ok) throw new Error(billJson.message);
      const billData: BillData = billJson.data;
      setOriginalBill(billData);

      const customersRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers`, {
        headers: { "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
      });
      const customersJson = await customersRes.json();
      if (customersRes.ok) setCustomers(customersJson.data || []);

      const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services`, {
        headers: { "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
      });
      const servicesJson = await servicesRes.json();
      if (servicesRes.ok) {
        setServices(servicesJson.data || []);
        const service = servicesJson.data.find((s: Service) => s.id === billData.service_id);
        setSelectedService(service || null);
      }

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
    } finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name === "service_id" && value) {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service || null);
      if (service && !formData.price) setFormData(prev => ({ ...prev, price: service.price.toString() }));
    }
  };

  const calculateTotalPrice = () => {
    const usage = parseFloat(formData.usage_value) || 0;
    const unitPrice = parseFloat(formData.price) || 0;
    return usage * unitPrice;
  };

  const validateForm = (): boolean => {
    if (!formData.customer_id) { setError("Pilih customer"); return false; }
    if (!formData.service_id) { setError("Pilih layanan"); return false; }
    if (!formData.month) { setError("Pilih bulan"); return false; }
    if (!formData.year) { setError("Pilih tahun"); return false; }
    if (!formData.measurement_number) { setError("Nomor pengukuran harus diisi"); return false; }
    if (!formData.usage_value || parseFloat(formData.usage_value) <= 0) { setError("Penggunaan harus lebih dari 0"); return false; }
    if (!formData.price || parseFloat(formData.price) <= 0) { setError("Harga harus lebih dari 0"); return false; }
    return true;
  };

  const getChangedFields = () => {
    if (!originalBill) return {};
    const changes: any = {};
    if (parseInt(formData.customer_id) !== originalBill.customer_id) changes.customer_id = parseInt(formData.customer_id);
    if (parseInt(formData.service_id) !== originalBill.service_id) changes.service_id = parseInt(formData.service_id);
    if (parseInt(formData.month) !== originalBill.month) changes.month = parseInt(formData.month);
    if (parseInt(formData.year) !== originalBill.year) changes.year = parseInt(formData.year);
    if (formData.measurement_number !== originalBill.measurement_number) changes.measurement_number = formData.measurement_number;
    if (parseFloat(formData.usage_value) !== originalBill.usage_value) changes.usage_value = parseFloat(formData.usage_value);
    if (parseFloat(formData.price) !== originalBill.price) changes.price = parseFloat(formData.price);
    if (formData.paid !== originalBill.paid) changes.paid = formData.paid;
    return changes;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setError("");

    try {
      const token = await getCookies("token");
      const changedFields = getChangedFields();
      if (Object.keys(changedFields).length === 0) {
        setSuccess(true);
        setTimeout(() => { router.push("/admin/bills"); router.refresh(); }, 1500);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
        body: JSON.stringify(changedFields),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Gagal update tagihan");
      setSuccess(true);
      setTimeout(() => { router.push("/admin/bills"); router.refresh(); }, 1500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally { setSaving(false); }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (error) setError("");
    handleChange(e);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#0077b6] border-r-transparent"></div>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data tagihan...</p>
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
        <h1 className="text-2xl font-bold text-[#0a1628]">Edit Tagihan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — ID Tagihan: #{id}</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <p className="text-sm font-medium text-emerald-800">Tagihan berhasil diperbarui!</p>
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
              <p className="text-sm font-medium text-red-800">Gagal memperbarui tagihan</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-[#f0f5ff]">
          <h2 className="text-sm font-semibold text-foreground">Informasi Tagihan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ubah data tagihan sesuai kebutuhan</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-4 rounded bg-[#0096c7]" />
              Informasi Customer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Customer <span className="text-red-500">*</span></label>
                <select name="customer_id" value={formData.customer_id} onChange={handleFieldChange} className="select-field">
                  <option value="">Pilih Customer</option>
                  {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} - {customer.customer_number}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Layanan <span className="text-red-500">*</span></label>
                <select name="service_id" value={formData.service_id} onChange={handleFieldChange} className="select-field">
                  <option value="">Pilih Layanan</option>
                  {services.map((service) => <option key={service.id} value={service.id}>{service.name} - Rp {service.price.toLocaleString()}/m³</option>)}
                </select>
                {selectedService && <p className="text-xs text-[#0077b6] mt-1">Range: {selectedService.min_usage} – {selectedService.max_usage} m³</p>}
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
                <label className="label-field">Bulan <span className="text-red-500">*</span></label>
                <select name="month" value={formData.month} onChange={handleFieldChange} className="select-field">
                  {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Tahun <span className="text-red-500">*</span></label>
                <select name="year" value={formData.year} onChange={handleFieldChange} className="select-field">
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Nomor Pengukuran <span className="text-red-500">*</span></label>
                <input type="text" name="measurement_number" value={formData.measurement_number} onChange={handleFieldChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Penggunaan (m³) <span className="text-red-500">*</span></label>
                <input type="number" name="usage_value" value={formData.usage_value} onChange={handleFieldChange} className="input-field" step="0.01" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Harga per m³ (Rp) <span className="text-red-500">*</span></label>
                <input type="number" name="price" value={formData.price} onChange={handleFieldChange} className="input-field" />
              </div>
              <div>
                <label className="label-field">Status Pembayaran</label>
                <label className="flex items-center gap-3 px-4 py-2.5 border border-border rounded-lg cursor-pointer hover:bg-[#f0f5ff]">
                  <input type="checkbox" name="paid" checked={formData.paid} onChange={handleFieldChange} className="w-4 h-4 rounded border-border text-[#0077b6] focus:ring-[#0077b6]" />
                  <span className="text-sm text-foreground">Sudah Lunas</span>
                </label>
              </div>
            </div>

            {formData.usage_value && formData.price && (
              <div className="bg-[#f0f5ff] border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Total Tagihan</p>
                    <p className="text-xs text-muted-foreground">{formData.usage_value} m³ × Rp {parseFloat(formData.price).toLocaleString()}</p>
                  </div>
                  <p className="text-xl font-bold text-[#0077b6]">Rp {calculateTotalPrice().toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#f0f5ff] border border-border rounded-lg p-3">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div>
                <p className="text-xs font-medium text-foreground">Informasi:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5 list-disc list-inside">
                  <li>Sistem hanya akan menyimpan field yang Anda ubah</li>
                  <li>Pastikan data yang diubah sudah sesuai</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Menyimpan...</>) : (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Simpan Perubahan</>)}
            </button>
            <Link href="/admin/bills" className="btn-outline flex-1 text-center">Batalkan</Link>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Field dengan tanda * wajib diisi</p>
    </div>
  );
}
