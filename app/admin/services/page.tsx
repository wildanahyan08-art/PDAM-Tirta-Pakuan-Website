import { getCookies } from "@/helper/cookies";
import Link from "next/link";
import Search from "./search";
import Drop from "./drop";

/* ================= TYPES ================= */

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: ServiceType[];
  count: number;
}

export interface ServiceType {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= FETCH ================= */

async function getServices(): Promise<ServiceResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        Authorization: `Bearer ${await getCookies("token")}`,
      },
    });

    const responseData: ServiceResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message,
        data: [],
        count: 0,
      };
    }

    return responseData;
  } catch {
    return {
      success: false,
      message: "Failed to fetch services",
      data: [],
      count: 0,
    };
  }
}

/* ================= PAGE ================= */
type PageProp = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function AdminServicesPage(props: PageProp) {
  const { search } = await props.searchParams;
  const response = await getServices();

  if (!response.success) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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

  // Filter data berdasarkan search keyword di CLIENT SIDE
  const filteredServices = search
    ? response.data.filter(
        (service) =>
          service.name.toLowerCase().includes(search.toLowerCase()) ||
          service.id.toString().includes(search) ||
          service.price.toString().includes(search),
      )
    : response.data;

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Daftar Layanan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Total: {response.data.length} layanan
            {search && (
              <span className="ml-1.5">• Pencarian: &quot;{search}&quot; ({filteredServices.length} ditemukan)</span>
            )}
          </p>
        </div>
        <Link href="/admin/services/add" className="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Tambah Layanan
        </Link>
      </div>

      {/* Search Component */}
      <div className="mb-5">
        <Search search={search || ""} />
      </div>

      {/* SERVICE LIST */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <div className="max-w-xs mx-auto">
            <div className="w-14 h-14 mx-auto bg-[#f0f5ff] rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{search ? "Hasil tidak ditemukan" : "Tidak ada layanan"}</h3>
            <p className="text-xs text-muted-foreground mb-5">
              {search
                ? `Tidak ditemukan dengan kata kunci "${search}"`
                : "Belum ada data layanan"}
            </p>
            {search ? (
              <Link href="/admin/services" className="btn-secondary text-sm">Reset Pencarian</Link>
            ) : (
              <Link href="/admin/services/add" className="btn-primary text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Buat Layanan
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-[#f0f5ff] px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase">
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Nama Layanan</div>
            <div className="col-span-2">Min Usage</div>
            <div className="col-span-2">Max Usage</div>
            <div className="col-span-2">Harga</div>
            <div className="col-span-1 text-right">Aksi</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 hover:bg-[#f0f5ff] transition-colors"
              >
                {/* Mobile View */}
                <div className="md:hidden space-y-2 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{service.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: #{service.id}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Link
                        href={`/admin/services/edit/${service.id}`}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f0f5ff] text-foreground hover:bg-secondary transition-colors"
                      >
                        Edit
                      </Link>
                      <Drop serviceId={service.id} serviceName={service.name} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div><span className="text-muted-foreground">Min</span><p className="font-medium text-foreground mt-0.5">{service.min_usage}</p></div>
                    <div><span className="text-muted-foreground">Max</span><p className="font-medium text-foreground mt-0.5">{service.max_usage}</p></div>
                    <div><span className="text-muted-foreground">Harga</span><p className="font-medium text-foreground mt-0.5">Rp {service.price.toLocaleString()}</p></div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:contents">
                  <div className="col-span-2 flex items-center">
                    <span className="text-xs font-mono text-muted-foreground">#{service.id}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(service.createdAt).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-foreground">{service.min_usage}</div>
                  <div className="col-span-2 flex items-center text-sm text-foreground">{service.max_usage}</div>
                  <div className="col-span-2 flex items-center text-sm font-medium text-foreground">Rp {service.price.toLocaleString("id-ID")}</div>
                  <div className="col-span-1 flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/services/edit/${service.id}`}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f0f5ff] text-foreground hover:bg-secondary transition-colors"
                    >
                      Edit
                    </Link>
                    <Drop serviceId={service.id} serviceName={service.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 text-xs text-muted-foreground">
        Menampilkan {filteredServices.length} dari {response.data.length} layanan
        {search && <span className="ml-1 font-medium">(difilter)</span>}
      </div>
    </div>
  );
}
