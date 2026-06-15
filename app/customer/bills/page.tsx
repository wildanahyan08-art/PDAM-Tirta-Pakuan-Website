import { getCookies } from "@/helper/cookies"
import Pay from "./pay"

export interface AllBillsResponse {
  success: boolean
  message: string
  data: Bill[]
  count: number
}

export interface Bill {
  id: number
  customer_id: number
  admin_id: number
  month: number
  year: number
  measurement_number: string
  usage_value: number
  price: number
  service_id: number
  paid: boolean
  owner_token: string
  createdAt: string
  updatedAt: string
  service: Service
  admin: Admin
  customer: Customer
  payments: any
  amount: number
  verified_payment: boolean
}

export interface Service {
  id: number
  name: string
  min_usage: number
  max_usage: number
  price: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  user_id: number
  name: string
  phone: string
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: number
  user_id: number
  customer_number: string
  name: string
  phone: string
  address: string
  service_id: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

/** function to grab all bill based on customer */
async function getAllBills(): Promise<Bill[]> {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/bills/me`
        const response = await fetch(url, {
            method: `GET`,
            headers: {
                "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization":`Bearer ${await getCookies(`token`)}`,
            },
            cache: `no-cache`
        })
        const responseData: AllBillsResponse = await response.json()
        if(!response.ok) {
            console.log(responseData.message)
            return []
        }
        return responseData.data
    } catch (error) {
        console.log("Error fetching bills:", error)
        return []
    }
}

export default async function BillPage() {
    const bills = await getAllBills()
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const getMonthName = (month: number) => {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ]
        return months[month - 1]
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="page-title">Tagihan Saya</h1>
                <p className="page-desc">PDAM Tirta Pakuan • Daftar tagihan air bersih Anda</p>
            </div>

            {/* Empty State */}
            {bills.length === 0 && (
                <div className="bg-white rounded-xl border border-border p-8 text-center">
                    <div className="max-w-xs mx-auto">
                        <div className="w-14 h-14 mx-auto bg-[#f0f5ff] rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">Belum ada tagihan</h3>
                        <p className="text-xs text-muted-foreground">Tagihan akan muncul setelah admin membuat tagihan untuk periode tertentu</p>
                    </div>
                </div>
            )}

            {/* Bills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bills.map((bill) => (
                    <div key={`bill-${bill.id}`} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-sm transition-shadow">
                        {/* Card Header dengan warna berdasarkan status */}
                        <div className={`px-4 py-3 ${
                            bill.paid
                                ? bill.verified_payment
                                    ? 'bg-emerald-600'
                                    : 'bg-amber-500'
                                : 'bg-red-500'
                        }`}>
                            <div className="flex justify-between items-center">
                                <span className="text-white text-[11px] font-medium">
                                    {getMonthName(bill.month)} {bill.year}
                                </span>
                                <span className="text-white text-[11px] font-mono opacity-80">
                                    #{bill.id}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-5">
                            {/* Nominal Tagihan */}
                            <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-0.5">Total Tagihan</p>
                                <p className="text-xl font-bold text-foreground">
                                    {formatCurrency(bill.amount)}
                                </p>
                            </div>

                            {/* Detail Penggunaan */}
                            <div className="space-y-1.5 text-xs mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Penggunaan Air</span>
                                    <span className="font-medium text-foreground">{bill.usage_value} m³</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Harga per m³</span>
                                    <span className="font-medium text-foreground">{formatCurrency(bill.price)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Layanan</span>
                                    <span className="font-medium text-foreground">{bill.service?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">No. Pengukuran</span>
                                    <span className="font-mono text-xs text-muted-foreground">{bill.measurement_number}</span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-4">
                                {bill.paid ? (
                                    bill.verified_payment ? (
                                        <div className="flex items-center gap-2.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                            <div>
                                                <p className="text-xs font-semibold text-emerald-800">Lunas & Terverifikasi</p>
                                                <p className="text-[11px] text-emerald-600">Terima kasih telah membayar tepat waktu</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                                            <svg className="w-5 h-5 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                            <div>
                                                <p className="text-xs font-semibold text-amber-800">Menunggu Verifikasi</p>
                                                <p className="text-[11px] text-amber-600">Pembayaran sedang diproses admin</p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex-1">
                                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                            <div>
                                                <p className="text-xs font-semibold text-red-800">Belum Dibayar</p>
                                                <p className="text-[11px] text-red-600">Segera lakukan pembayaran</p>
                                            </div>
                                        </div>
                                        <Pay billId={bill.id} amount={bill.amount} />
                                    </div>
                                )}
                            </div>

                            {/* Informasi Tambahan */}
                            <div className="pt-3 border-t border-border">
                                <p className="text-[11px] text-muted-foreground text-center">
                                    Informasi tambahan tentang tagihan ini
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            {bills.length > 0 && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <div>
                            <p className="text-xs font-semibold text-amber-800">Informasi Penting</p>
                            <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                                • Pastikan membayar tagihan sebelum tanggal 10 setiap bulan untuk menghindari denda
                                <br />
                                • Upload bukti pembayaran setelah transfer untuk proses verifikasi
                                <br />
                                • Status akan berubah menjadi &quot;Lunas&quot; setelah diverifikasi oleh admin
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
