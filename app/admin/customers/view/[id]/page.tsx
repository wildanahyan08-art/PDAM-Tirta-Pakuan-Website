import { getCookies } from "@/helper/cookies";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  email?: string;
  username?: string;
  status?: string;
}

export interface ServiceType {
  id: number;
  name: string;
  price: number;
}

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

  if (customer.service_id) {
    serviceInfo = await getService(customer.service_id);
  }

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

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Kembali ke Daftar Customer
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0a1628]">Detail Customer</h1>
            <p className="text-sm text-muted-foreground mt-0.5">PDAM Tirta Pakuan — Informasi Lengkap Customer</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/customers/edit/${customer.id}`} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              Edit Customer
            </Link>
            <Link href="/admin/customers" className="btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              Daftar Customer
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f5ff] text-xs font-medium text-foreground border border-border">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            ID: #{customer.id}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 border border-emerald-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            {customer.customer_number}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Bergabung: {formatDate(customer.createdAt)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded bg-[#0096c7]" />
                <h2 className="text-sm font-semibold text-foreground">Informasi Personal</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Data lengkap customer</p>
            </div>
            <div className="px-5 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nama Lengkap</p>
                  <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nomor Pelanggan</p>
                  <p className="text-sm font-semibold text-[#0077b6]">{customer.customer_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nomor Telepon</p>
                  <p className="text-sm font-semibold text-foreground">{formatPhone(customer.phone)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User ID</p>
                  <p className="text-sm font-semibold text-foreground">#{customer.user_id}</p>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-xs text-muted-foreground mb-1">Alamat Lengkap</p>
                <div className="mt-1.5 p-3 bg-[#f0f5ff] rounded-lg border border-border">
                  <p className="text-sm text-foreground whitespace-pre-line">{customer.address}</p>
                </div>
              </div>
            </div>
          </div>

          {serviceInfo && (
            <div className="bg-white rounded-xl border border-border">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 rounded bg-[#0077b6]" />
                  <h2 className="text-sm font-semibold text-foreground">Informasi Layanan</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Detail layanan yang digunakan</p>
              </div>
              <div className="px-5 py-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nama Layanan</p>
                    <p className="text-sm font-semibold text-foreground">{serviceInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Harga Layanan</p>
                    <p className="text-sm font-semibold text-emerald-700">Rp {serviceInfo.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Service ID</p>
                    <p className="text-sm font-semibold text-foreground">#{serviceInfo.id}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/admin/services/view/${serviceInfo.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0077b6] hover:text-[#0096c7] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    Lihat detail layanan
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded bg-[#0096c7]" />
                <h2 className="text-sm font-semibold text-foreground">Informasi Tambahan</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Data sistem dan metadata</p>
            </div>
            <div className="px-5 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tanggal Dibuat</p>
                  <p className="text-sm text-foreground">{formatDate(customer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Terakhir Diperbarui</p>
                  <p className="text-sm text-foreground">{formatDate(customer.updatedAt)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Owner Token</p>
                  <div className="mt-1.5 p-3 bg-[#f0f5ff] rounded-lg border border-border overflow-x-auto">
                    <code className="text-xs text-foreground font-mono break-all">{customer.owner_token}</code>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Token identifikasi untuk keperluan sistem</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded bg-[#0096c7]" />
                <h2 className="text-sm font-semibold text-foreground">Aksi Cepat</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Tindakan untuk customer ini</p>
            </div>
            <div className="px-5 py-5 space-y-2.5">
              <Link href={`/admin/customers/edit/${customer.id}`} className="btn-primary w-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit Data
              </Link>
              <Link href={`/admin/transactions?customer_id=${customer.id}`} className="btn-secondary w-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                Lihat Transaksi
              </Link>
              <Link href={`/admin/reports/customer/${customer.id}`} className="btn-secondary w-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                Laporan
              </Link>
              <button className="btn-danger w-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                Hapus Customer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded bg-[#0077b6]" />
                <h2 className="text-sm font-semibold text-foreground">Ringkasan</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Status dan informasi singkat</p>
            </div>
            <div className="px-5 py-5">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="badge bg-emerald-50 text-emerald-700">Aktif</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Transaksi</span>
                  <span className="text-sm font-semibold text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tagihan Bulan Ini</span>
                  <span className="text-sm font-semibold text-[#0077b6]">Rp 250.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Terakhir Bayar</span>
                  <span className="text-xs text-foreground">15 Jan 2024</span>
                </div>
              </div>

              <div className="my-4 border-t border-border" />

              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Kontak</h3>
                <div className="space-y-2">
                  <button className="flex items-center gap-2.5 w-full p-2.5 bg-[#f0f5ff] text-foreground rounded-lg hover:bg-secondary transition-colors text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                    Telepon Customer
                  </button>
                  <button className="flex items-center gap-2.5 w-full p-2.5 bg-[#f0f5ff] text-foreground rounded-lg hover:bg-secondary transition-colors text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    Kirim Email
                  </button>
                  <button className="flex items-center gap-2.5 w-full p-2.5 bg-[#f0f5ff] text-foreground rounded-lg hover:bg-secondary transition-colors text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    Kirim WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Catatan</h2>
            </div>
            <div className="px-5 py-5">
              <textarea
                placeholder="Tambah catatan untuk customer ini..."
                className="input-field resize-none"
                rows={4}
              />
              <button className="btn-secondary w-full mt-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Customer ID: {customer.id} • Terakhir dilihat: {new Date().toLocaleDateString("id-ID")}
        </p>
        <div className="flex gap-2">
          <Link href={`/admin/customers/edit/${customer.id}`} className="btn-primary text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Edit Customer
          </Link>
          <Link href="/admin/customers" className="btn-outline text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}
