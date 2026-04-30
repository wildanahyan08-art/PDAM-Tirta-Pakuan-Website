import { Card, CardContent } from "@/components/ui/card"
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
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100">
                            <h1 className="text-2xl font-bold text-gray-900">Tagihan Saya</h1>
                            <p className="text-gray-600 mt-1">
                                PDAM Tirta Pakuan • Daftar tagihan air bersih Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {bills.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-5xl">📋</span>
                            <p className="text-yellow-800 font-medium">Belum ada tagihan</p>
                            <p className="text-yellow-600 text-sm">Tagihan akan muncul setelah admin membuat tagihan untuk periode tertentu</p>
                        </div>
                    </div>
                )}

                {/* Bills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bills.map((bill) => (
                        <Card key={`bill-${bill.id}`} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                            {/* Card Header dengan warna berdasarkan status */}
                            <div className={`px-4 py-3 ${
                                bill.paid 
                                    ? bill.verified_payment 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                                    : 'bg-gradient-to-r from-red-500 to-red-600'
                            }`}>
                                <div className="flex justify-between items-center">
                                    <span className="text-white text-xs font-medium">
                                        {getMonthName(bill.month)} {bill.year}
                                    </span>
                                    <span className="text-white text-xs">
                                        #{bill.id}
                                    </span>
                                </div>
                            </div>
                            
                            <CardContent className="p-5">
                                {/* Nominal Tagihan */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(bill.amount)}
                                    </p>
                                </div>

                                {/* Detail Penggunaan */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Penggunaan Air</span>
                                        <span className="font-semibold text-gray-700">{bill.usage_value} m³</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Harga per m³</span>
                                        <span className="font-semibold text-gray-700">{formatCurrency(bill.price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Layanan</span>
                                        <span className="font-semibold text-gray-700">{bill.service?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">No. Pengukuran</span>
                                        <span className="font-mono text-sm text-gray-600">{bill.measurement_number}</span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-4">
                                    {bill.paid ? (
                                        bill.verified_payment ? (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                                                <span className="text-green-600 text-lg">✓</span>
                                                <div>
                                                    <p className="text-green-800 font-semibold text-sm">Lunas & Terverifikasi</p>
                                                    <p className="text-green-600 text-xs">Terima kasih telah membayar tepat waktu</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                                                <span className="text-orange-600 text-lg">⏳</span>
                                                <div>
                                                    <p className="text-orange-800 font-semibold text-sm">Menunggu Verifikasi</p>
                                                    <p className="text-orange-600 text-xs">Pembayaran sedang diproses admin</p>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex-1">
                                                <span className="text-red-600 text-lg">⚠️</span>
                                                <div>
                                                    <p className="text-red-800 font-semibold text-sm">Belum Dibayar</p>
                                                    <p className="text-red-600 text-xs">Segera lakukan pembayaran</p>
                                                </div>
                                            </div>
                                            <Pay billId={bill.id} amount={bill.amount} />
                                        </div>
                                    )}
                                </div>

                                {/* Informasi Tambahan */}
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 text-center">
                                        Informasi tambahan tentang tagihan ini
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Info */}
                {bills.length > 0 && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-blue-600 text-xl">ℹ️</span>
                            <div>
                                <p className="text-sm font-medium text-blue-900">Informasi Penting</p>
                                <p className="text-xs text-blue-700 mt-1">
                                    • Pastikan membayar tagihan sebelum tanggal 10 setiap bulan untuk menghindari denda
                                    <br />
                                    • Upload bukti pembayaran setelah transfer untuk proses verifikasi
                                    <br />
                                    • Status akan berubah menjadi "Lunas" setelah diverifikasi oleh admin
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}