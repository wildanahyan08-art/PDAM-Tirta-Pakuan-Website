import { getCookies } from "@/helper/cookies";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ================= TYPES ================= */

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: CustomerType;
}

export interface CustomerType {
  id: number;
  user_id: number;
  customer_number: string;
  name: string;
  phone: string;
  address: string;
  service_id: number;
  service_name?: string;
  service_price?: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
  // Jika ada field tambahan dari API
  email?: string;
  username?: string;
  status?: string;
}

export interface ServiceType {
  id: number;
  name: string;
  price: number;
}

/* ================= FETCH FUNCTIONS ================= */

async function getCustomer(id: string): Promise<CustomerResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${id}`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        Authorization: `Bearer ${await getCookies("token")}`,
      },
    });

    const responseData: CustomerResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || "Customer tidak ditemukan",
        data: {} as CustomerType,
      };
    }

    return responseData;
  } catch {
    return {
      success: false,
      message: "Failed to fetch customer",
      data: {} as CustomerType,
    };
  }
}

async function getService(id: number): Promise<ServiceType | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        Authorization: `Bearer ${await getCookies("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

/* ================= PAGE COMPONENT ================= */

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewCustomerPage(props: PageProps) {
  const { id } = await props.params;
  const customerResponse = await getCustomer(id);

  if (!customerResponse.success || !customerResponse.data) {
    notFound();
  }

  const customer = customerResponse.data;
  let serviceInfo = null;

  // Fetch service information if service_id exists
  if (customer.service_id) {
    serviceInfo = await getService(customer.service_id);
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format phone number
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
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
              <h1 className="text-3xl font-bold text-gray-900">
                Detail Customer
              </h1>
              <p className="text-gray-600 mt-1">
                PDAM Tirta Pakuan • Informasi Lengkap Customer
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/customers/edit/${customer.id}`}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                ✏️ Edit Customer
              </Link>
              <Link
                href="/admin/customers"
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                📋 Daftar Customer
              </Link>
            </div>
          </div>

          {/* Customer Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              ID: #{customer.id}
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {customer.customer_number}
            </div>
            <div className="text-sm text-gray-500">
              Bergabung: {formatDate(customer.createdAt)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Informasi Personal
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Data lengkap customer
                </p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Nama Lengkap
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {customer.name}
                    </p>
                  </div>

                  {/* Nomor Pelanggan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Nomor Pelanggan
                    </label>
                    <p className="text-lg font-semibold text-blue-700">
                      {customer.customer_number}
                    </p>
                  </div>

                  {/* Telepon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Nomor Telepon
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPhone(customer.phone)}
                    </p>
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      User ID
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      #{customer.user_id}
                    </p>
                  </div>
                </div>

                {/* Alamat */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Alamat Lengkap
                  </label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-line">
                      {customer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information Card */}
            {serviceInfo && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informasi Layanan
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Detail layanan yang digunakan
                  </p>
                </div>
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nama Layanan */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Nama Layanan
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {serviceInfo.name}
                      </p>
                    </div>

                    {/* Harga */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Harga Layanan
                      </label>
                      <p className="text-lg font-semibold text-green-700">
                        Rp {serviceInfo.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Service ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Service ID
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        #{serviceInfo.id}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/admin/services/view/${serviceInfo.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      👁️ Lihat detail layanan
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Informasi Tambahan
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Data sistem dan metadata
                </p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tanggal Dibuat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tanggal Dibuat
                    </label>
                    <p className="text-gray-900">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>

                  {/* Tanggal Diperbarui */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Terakhir Diperbarui
                    </label>
                    <p className="text-gray-900">
                      {formatDate(customer.updatedAt)}
                    </p>
                  </div>

                  {/* Owner Token */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Owner Token
                    </label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                      <code className="text-sm text-gray-700 font-mono">
                        {customer.owner_token}
                      </code>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Token identifikasi untuk keperluan sistem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aksi Cepat
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Tindakan untuk customer ini
                </p>
              </div>
              <div className="px-6 py-6 space-y-3">
                <Link
                  href={`/admin/customers/edit/${customer.id}`}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  ✏️ Edit Data
                </Link>
                <Link
                  href={`/admin/transactions?customer_id=${customer.id}`}
                  className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  💳 Lihat Transaksi
                </Link>
                <Link
                  href={`/admin/reports/customer/${customer.id}`}
                  className="flex items-center justify-center w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📊 Laporan
                </Link>
                <button className="flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                  🗑️ Hapus Customer
                </button>
              </div>
            </div>

            {/* Customer Summary Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Ringkasan
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Status dan informasi singkat
                </p>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Aktif
                    </span>
                  </div>

                  {/* Jumlah Transaksi */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Total Transaksi
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      12
                    </span>
                  </div>

                  {/* Tagihan Bulan Ini */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Tagihan Bulan Ini
                    </span>
                    <span className="text-lg font-semibold text-blue-700">
                      Rp 250.000
                    </span>
                  </div>

                  {/* Terakhir Bayar */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Terakhir Bayar
                    </span>
                    <span className="text-sm text-gray-900">
                      15 Jan 2024
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Kontak
                  </h3>
                  <div className="space-y-2">
                    <button className="flex items-center w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="mr-3">📞</span>
                      Telepon Customer
                    </button>
                    <button className="flex items-center w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      <span className="mr-3">✉️</span>
                      Kirim Email
                    </button>
                    <button className="flex items-center w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      <span className="mr-3">💬</span>
                      Kirim WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Catatan
                </h2>
              </div>
              <div className="px-6 py-6">
                <textarea
                  placeholder="Tambah catatan untuk customer ini..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400 resize-none"
                  rows={4}
                />
                <button className="mt-3 w-full px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Customer ID: {customer.id} • Terakhir dilihat: {new Date().toLocaleDateString("id-ID")}
          </div>
          <div className="flex gap-3">
            <Link
              href={`/admin/customers/edit/${customer.id}`}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Customer
            </Link>
            <Link
              href="/admin/customers"
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali ke Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}