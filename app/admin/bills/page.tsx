"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

interface Bill {
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
  service: Service;
  admin: Admin;
  customer: Customer;
  payments?: Payments;
  amount: number;
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

interface Admin {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

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

interface Payments {
  id: number;
  bill_id: number;
  payment_date: string;
  verified: boolean;
  total_amount: number;
  payment_proof: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

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
    fetchBills();
  }, [currentPage, selectedMonth, selectedYear, selectedStatus]);

  const fetchBills = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getCookies("token");

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);
      if (selectedStatus === "paid") params.append("paid", "true");
      if (selectedStatus === "unpaid") params.append("paid", "false");
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bills?${params.toString()}`,
        {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Gagal mengambil data tagihan");
      }

      setBills(json.data || []);
      setTotalPages(Math.ceil(json.count / itemsPerPage));
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBills();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setSelectedYear("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    return months.find(m => parseInt(m.value) === month)?.label || "";
  };

  const getStatusBadge = (paid: boolean, paymentVerified?: boolean) => {
    if (paid && paymentVerified) {
      return <span className="badge bg-emerald-50 text-emerald-700">Lunas & Terverifikasi</span>;
    } else if (paid && !paymentVerified) {
      return <span className="badge bg-amber-50 text-amber-700">Menunggu Verifikasi</span>;
    } else {
      return <span className="badge bg-red-50 text-red-700">Belum Dibayar</span>;
    }
  };

  if (loading && bills.length === 0) {
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Manajemen Tagihan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — Daftar tagihan pelanggan</p>
        </div>
        <Link href="/admin/bills/add" className="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Buat Tagihan Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border p-4 mb-5">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label-field">Cari</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari tagihan..."
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Bulan</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="select-field">
              <option value="">Semua Bulan</option>
              {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Tahun</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="select-field">
              <option value="">Semua Tahun</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="select-field">
              <option value="">Semua Status</option>
              <option value="paid">Lunas</option>
              <option value="unpaid">Belum Dibayar</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Cari</button>
          <button type="button" onClick={resetFilters} className="btn-secondary">Reset</button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-xs">!</span>
            </div>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#f0f5ff]">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Periode</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Penggunaan</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Tanggal</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Tidak ada data tagihan
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-[#f0f5ff] transition-colors">
                    <td className="px-4 py-3.5 font-medium text-foreground">#{bill.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-foreground">{bill.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{bill.customer.customer_number}</div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {getMonthName(bill.month)} {bill.year}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{bill.usage_value} m³</td>
                    <td className="px-4 py-3.5 font-semibold text-foreground">{formatCurrency(bill.amount)}</td>
                    <td className="px-4 py-3.5">{getStatusBadge(bill.paid, bill.payments?.verified)}</td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">{formatDate(bill.createdAt)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/bills/${bill.id}`} className="text-xs font-medium text-[#0077b6] hover:text-[#00699e]">
                          Detail
                        </Link>
                        {!bill.paid && (
                          <>
                            <span className="text-border">|</span>
                            <Link href={`/admin/bills/edit/${bill.id}`} className="text-xs font-medium text-[#0096c7] hover:text-[#0084b3]">
                              Edit
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border bg-[#f0f5ff] flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {(currentPage - 1) * itemsPerPage + 1} – {Math.min(currentPage * itemsPerPage, bills.length)} dari {bills.length}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Tagihan", value: bills.length, color: "text-[#0077b6]" },
          { label: "Lunas", value: bills.filter(b => b.paid && b.payments?.verified).length, color: "text-emerald-600" },
          { label: "Menunggu Verifikasi", value: bills.filter(b => b.paid && !b.payments?.verified).length, color: "text-amber-600" },
          { label: "Belum Dibayar", value: bills.filter(b => !b.paid).length, color: "text-red-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
