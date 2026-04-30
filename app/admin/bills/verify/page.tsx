"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

// Types
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

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    fetchUnverifiedPayments();
  }, []);

  const fetchUnverifiedPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getCookies("token");
      
      if (!token) {
        setError("Silakan login kembali");
        router.push("/sign-in");
        return;
      }

      // Fetch all payments (tanpa filter verified=false karena mungkin tidak support)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments`, {
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });

      const json: PaymentResponse = await response.json();

      if (response.ok && json.success) {
        // Filter manual untuk yang belum diverifikasi
        const paymentsData = (json.data || []).filter(p => !p.verified);
        
        // Fetch bill details for each payment
        const paymentsWithBills = await Promise.all(
          paymentsData.map(async (payment) => {
            try {
              const billResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${payment.bill_id}`, {
                headers: {
                  "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
                  Authorization: `Bearer ${token}`,
                },
              });
              const billJson = await billResponse.json();
              if (billResponse.ok && billJson.data) {
                return { ...payment, bill: billJson.data };
              }
            } catch (err) {
              console.error(`Error fetching bill ${payment.bill_id}:`, err);
            }
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
    } finally {
      setLoading(false);
    }
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
      
      // Opsi 1: Coba PATCH ke payments langsung (tanpa /verify)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/${selectedPayment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verified: true }),
      });

      let json = await response.json();

      // Opsi 2: Jika gagal, coba PATCH ke bills
      if (!response.ok) {
        console.log("Trying to update bill instead...");
        
        const billResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bills/${selectedPayment.bill_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            paid: true,
            verified_payment: true 
          }),
        });

        json = await billResponse.json();

        if (!billResponse.ok) {
          throw new Error(json.message || "Gagal memverifikasi pembayaran");
        }

        setSuccess(`Pembayaran untuk bill #${selectedPayment.bill_id} berhasil diverifikasi`);
      } else {
        setSuccess(`Pembayaran #${selectedPayment.id} berhasil diverifikasi`);
      }

      setShowModal(false);
      setSelectedPayment(null);
      
      // Refresh data
      await fetchUnverifiedPayments();
      
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Terjadi kesalahan saat verifikasi");
    } finally {
      setVerifying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
          >
            <span>←</span> Kembali ke Dashboard
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-purple-100">
              <h1 className="text-2xl font-bold text-gray-900">Verifikasi Pembayaran</h1>
              <p className="text-gray-600 mt-1">
                Verifikasi bukti pembayaran dari customer
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600">!</span>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Pembayaran Menunggu Verifikasi
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {payments.length} pembayaran perlu diverifikasi
            </p>
          </div>
          
          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">✅</span>
                  <p>Tidak ada pembayaran yang menunggu verifikasi</p>
                  <p className="text-sm">Semua pembayaran telah diverifikasi</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bukti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#{payment.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{payment.bill?.customer?.name || '-'}</div>
                        <div className="text-sm text-gray-500">{payment.bill?.customer?.customer_number || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {payment.bill ? `${months[payment.bill.month - 1]} ${payment.bill.year}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payment.total_amount)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(payment.payment_date)}</td>
                      <td className="px-6 py-4">
                        {payment.payment_proof && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${payment.payment_proof}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Lihat
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleVerify(payment)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Verifikasi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Konfirmasi */}
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Konfirmasi Verifikasi</h3>
              <div className="space-y-2 mb-4">
                <p>Apakah Anda yakin ingin memverifikasi pembayaran ini?</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p>ID Payment: #{selectedPayment.id}</p>
                  <p>ID Bill: #{selectedPayment.bill_id}</p>
                  <p>Jumlah: {formatCurrency(selectedPayment.total_amount)}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmVerification}
                  disabled={verifying}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {verifying ? "Memproses..." : "Ya, Verifikasi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}