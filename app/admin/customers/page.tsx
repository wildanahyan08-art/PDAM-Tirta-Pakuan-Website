import { getCookies } from "@/helper/cookies";
import Link from "next/link";
import Search from "./search";
import Drop from "./drop";

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: CustomerType[];
  count: number;
}

export interface CustomerType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
}

async function getCustomers(): Promise<CustomerResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        Authorization: `Bearer ${await getCookies("token")}`,
      },
    });
    const responseData: CustomerResponse = await response.json();
    if (!response.ok) return { success: false, message: responseData.message, data: [], count: 0 };
    return responseData;
  } catch {
    return { success: false, message: "Failed to fetch customers", data: [], count: 0 };
  }
}

type PageProp = { searchParams: Promise<{ search?: string }> };

export default async function AdminCustomersPage(props: PageProp) {
  const { search } = await props.searchParams;
  const response = await getCustomers();

  if (!response.success) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Error</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{response.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredCustomers = search
    ? response.data.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone.includes(search) ||
          customer.id.toString().includes(search) ||
          (customer.address && customer.address.toLowerCase().includes(search.toLowerCase()))
      )
    : response.data;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active": return "badge-active";
      case "inactive": return "badge-inactive";
      case "pending": return "badge-pending";
      default: return "badge bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Aktif";
      case "inactive": return "Tidak Aktif";
      case "pending": return "Menunggu";
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Daftar Customer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Total: {response.data.length} customer
            {search && (
              <span className="ml-1.5">• Pencarian: &quot;{search}&quot; ({filteredCustomers.length} ditemukan)</span>
            )}
          </p>
        </div>
        <Link href="/admin/customers/add" className="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Customer
        </Link>
      </div>

      <div className="mb-5"><Search search={search || ""} /></div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <div className="max-w-xs mx-auto">
            <div className="w-14 h-14 mx-auto bg-[#f0f5ff] rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{search ? "Customer tidak ditemukan" : "Tidak ada customer"}</h3>
            <p className="text-xs text-muted-foreground mb-5">
              {search ? `Tidak ditemukan customer dengan kata kunci "${search}"` : "Belum ada data customer"}
            </p>
            {search ? (
              <Link href="/admin/customers" className="btn-secondary text-sm">Reset Pencarian</Link>
            ) : (
              <Link href="/admin/customers/add" className="btn-primary text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Tambah Customer
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-12 bg-[#f0f5ff] px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Nama</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-2">Telepon</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Aksi</div>
          </div>

          <div className="divide-y divide-border">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 hover:bg-[#f0f5ff] transition-colors">
                <div className="md:hidden space-y-2 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{customer.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: #{customer.id}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Link href={`/admin/customers/edit/${customer.id}`} className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f0f5ff] text-foreground hover:bg-secondary transition-colors">Edit</Link>
                      <Drop customerId={customer.id} customerName={customer.name} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs"><span className="text-muted-foreground w-14">Email:</span><span>{customer.email}</span></div>
                    <div className="flex items-center gap-2 text-xs"><span className="text-muted-foreground w-14">Telepon:</span><span>{customer.phone}</span></div>
                    <div className="flex items-center gap-2 text-xs"><span className="text-muted-foreground w-14">Status:</span><span className={`${getStatusStyle(customer.status)}`}>{getStatusText(customer.status)}</span></div>
                    {customer.address && <div className="flex items-start gap-2 text-xs"><span className="text-muted-foreground w-14 flex-shrink-0">Alamat:</span><span>{customer.address}</span></div>}
                  </div>
                </div>

                <div className="hidden md:contents">
                  <div className="col-span-1 flex items-center">
                    <span className="text-xs font-mono text-muted-foreground">#{customer.id}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{customer.name}</p>
                      {customer.address && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{customer.address}</p>}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-foreground">{customer.email}</div>
                  <div className="col-span-2 flex items-center text-sm text-foreground">{customer.phone}</div>
                  <div className="col-span-2 flex items-center">
                    <span className={getStatusStyle(customer.status)}>{getStatusText(customer.status)}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <Link href={`/admin/customers/edit/${customer.id}`} className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f0f5ff] text-foreground hover:bg-secondary transition-colors">Edit</Link>
                    <Drop customerId={customer.id} customerName={customer.name} />
                    <Link href={`/admin/customers/view/${customer.id}`} className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f0f5ff] text-foreground hover:bg-secondary transition-colors">Detail</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 text-xs text-muted-foreground">
        Menampilkan {filteredCustomers.length} dari {response.data.length} customer
        {search && <span className="ml-1 font-medium">(difilter)</span>}
      </div>
    </div>
  );
}
