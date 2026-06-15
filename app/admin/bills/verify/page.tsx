"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

interface Payment {
  id: number;
  bill_id: number;
  payment_date: string;
  verified: boolean;
  total_amount: number;
  payment_proof: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
  bill?: Bill;
}

interface Bill {
  id: number;
  customer_id: number;
  month: number;
  year: number;
  measurement_number: string;
  usage_value: number;
  price: number;
  amount: number;
  paid: boolean;
  customer?: {
    id: number;
    name: string;
    customer_number: string;
    phone: string;
    address: string;
  };
  service?: {
    id: number;
    name: string;
  };
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment[];
  count: number;
}

export default function VerifyPaymentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  useEffect(() => { fetchUnverifiedPayments(); }, []);

  const fetchUnverifiedPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getCookies("token");
      if (!token) { setError("Silakan login kembali"); router.push("/sign-in"); return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments`, {
        headers: { "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
      });

      const json: PaymentResponse = await response.json();

      if (response.ok && json.success) {
        const paymentsData = (json.data || []).filter(p => !p.verified);
        const paymentsWithBills = await Promise.all(
          paymentsData.map(async (payment) => {
            try {
              const billResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${payment.bill_id}`, {
                headers: { "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
              });
              const billJson = await billResponse.json();
              if (billResponse.ok && billJson.data) return { ...payment, bill: billJson.data };
            } catch (err) { console.error(`Error fetching bill ${payment.bill_id}:`, err); }
            return payment;
          })
        );
        setPayments(paymentsWithBills);
      } else {
        setError(json.message || "Gagal mengambil data pembayaran");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally { setLoading(false); }
  };

  const handleVerify = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const confirmVerification = async () => {
    if (!selectedPayment) return;
    setVerifying(true);
    setError("");

    try {
      const token = await getCookies("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/${selectedPayment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ verified: true }),
      });

      let json = await response.json();

      if (!response.ok) {
        const billResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${selectedPayment.bill_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ paid: true, verified_payment: true }),
        });
        json = await billResponse.json();
        if (!billResponse.ok) throw new Error(json.message || "Gagal memverifikasi pembayaran");
        setSuccess(`Pembayaran untuk bill #${selectedPayment.bill_id} berhasil diverifikasi`);
      } else {
        setSuccess(`Pembayaran #${selectedPayment.id} berhasil diverifikasi`);
      }

      setShowModal(false);
      setSelectedPayment(null);
      await fetchUnverifiedPayments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Terjadi kesalahan saat verifikasi");
    } finally { setVerifying(false); }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#0077b6] border-r-transparent"></div>
          <p className="mt-3 text-sm text-muted-foreground">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-[#0a1628]">Verifikasi Pembayaran</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Verifikasi bukti pembayaran dari customer</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <p className="text-sm text-emerald-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-[#f0f5ff]">
          <h2 className="text-sm font-semibold text-foreground">Daftar Pembayaran Menunggu Verifikasi</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{payments.length} pembayaran perlu diverifikasi</p>
        </div>

        {payments.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <svg className="w-10 h-10 mx-auto text-emerald-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="16 8 11 13 8 10"/></svg>
            <p className="text-sm text-muted-foreground">Tidak ada pembayaran yang menunggu verifikasi</p>
            <p className="text-xs text-muted-foreground mt-1">Semua pembayaran telah diverifikasi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#f0f5ff]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">ID Payment</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Periode</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Jumlah</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Tanggal Bayar</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Bukti</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#f0f5ff]">
                    <td className="px-4 py-3.5 text-xs">#{payment.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-foreground">{payment.bill?.customer?.name || '-'}</div>
                      <div className="text-xs text-muted-foreground">{payment.bill?.customer?.customer_number || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">
                      {payment.bill ? `${months[payment.bill.month - 1]} ${payment.bill.year}` : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-foreground">{formatCurrency(payment.total_amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">{formatDate(payment.payment_date)}</td>
                    <td className="px-4 py-3.5">
                      {payment.payment_proof && (
                        <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${payment.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#0077b6] hover:text-[#00699e]">
                          Lihat
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => handleVerify(payment)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                        Verifikasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-base font-semibold text-foreground mb-3">Konfirmasi Verifikasi</h3>
            <p className="text-sm text-muted-foreground mb-4">Apakah Anda yakin ingin memverifikasi pembayaran ini?</p>
            <div className="bg-[#f0f5ff] rounded-lg p-3 space-y-1 mb-5">
              <p className="text-xs">ID Payment: #{selectedPayment.id}</p>
              <p className="text-xs">ID Bill: #{selectedPayment.bill_id}</p>
              <p className="text-xs">Jumlah: {formatCurrency(selectedPayment.total_amount)}</p>
            </div>
            <div className="flex justify-end gap-2.5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-[#e5e0d9] transition-colors">Batal</button>
              <button onClick={confirmVerification} disabled={verifying} className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {verifying ? "Memproses..." : "Ya, Verifikasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
