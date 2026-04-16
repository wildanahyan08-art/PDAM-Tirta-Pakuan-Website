import { getCookies } from "@/helper/cookies";
import Link from "next/link";
import Search from "./search";
import Drop from "./drop";

/* ================= TYPES ================= */

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
  // Tambahkan field lain sesuai response dari API
}

/* ================= FETCH ================= */

async function getCustomers(): Promise<CustomerResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/customers`; // Sesuaikan endpoint
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
        message: responseData.message,
        data: [],
        count: 0,
      };
    }

    return responseData;
  } catch {
    return {
      success: false,
      message: "Failed to fetch customers",
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

export default async function AdminCustomersPage(props: PageProp) {
  const { search } = await props.searchParams;
  const response = await getCustomers();

  if (!response.success) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-lg bg-red-50 border border-red-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-5 w-5 text-red-600">⚠️</div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{response.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter data berdasarkan search keyword di CLIENT SIDE
  const filteredCustomers = search
    ? response.data.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          // customer.email.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone.includes(search) ||
          customer.id.toString().includes(search) ||
          (customer.address && 
            customer.address.toLowerCase().includes(search.toLowerCase()))
      )
    : response.data;

  // Fungsi untuk mendapatkan style status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fungsi untuk mendapatkan teks status dalam bahasa Indonesia
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "inactive":
        return "Tidak Aktif";
      case "pending":
        return "Menunggu";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Daftar Customer
              </h1>
              <p className="text-gray-600 mt-1">
                Total: {response.data.length} customer
                {search && (
                  <span className="text-blue-600 ml-2">
                    • Pencarian: &quot;{search}&quot; ({filteredCustomers.length}{" "}
                    ditemukan)
                  </span>
                )}
              </p>
            </div>
            <Link
              href="/admin/customers/add"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span className="mr-2">+</span>
              Tambah Customer
            </Link>
          </div>

          {/* Search Component */}
          <div className="mb-6">
            <Search search={search || ""} />
          </div>
        </div>

        {/* CUSTOMER LIST */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <div className="text-2xl">👤</div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? "Customer tidak ditemukan" : "Tidak ada customer"}
              </h3>
              <p className="text-gray-600 mb-6">
                {search
                  ? `Tidak ditemukan customer dengan kata kunci "${search}"`
                  : "Belum ada data customer"}
              </p>
              {search ? (
                <Link
                  href="/admin/customers"
                  className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset Pencarian
                </Link>
              ) : (
                <Link
                  href="/admin/customers/add"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-2">+</span>
                  Tambah Customer
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="col-span-1 text-sm font-medium text-gray-500">
                ID
              </div>
              <div className="col-span-3 text-sm font-medium text-gray-500">
                Nama
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-500">
                Email
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-500">
                Telepon
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-500">
                Status
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-500 text-right">
                Aksi
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: #{customer.id}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/customers/edit/${customer.id}`}
                          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </Link>
                        <Drop
                          customerId={customer.id}
                          customerName={customer.name}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 w-16">Email:</span>
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 w-16">Telepon:</span>
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 w-16">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(customer.status)}`}>
                          {getStatusText(customer.status)}
                        </span>
                      </div>
                      {customer.address && (
                        <div className="flex items-start">
                          <span className="text-xs text-gray-500 w-16">Alamat:</span>
                          <span className="text-sm flex-1">{customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:contents">
                    <div className="col-span-1 flex items-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        #{customer.id}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                        {customer.address && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {customer.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <p className="text-gray-900">{customer.email}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <p className="text-gray-900">{customer.phone}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/customers/edit/${customer.id}`}
                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <Drop customerId={customer.id} customerName={customer.name} />
                      <Link
                        href={`/admin/customers/view/${customer.id}`}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500">
          Menampilkan {filteredCustomers.length} dari {response.data.length}{" "}
          customer
          {search && <span className="ml-2 font-medium">(difilter)</span>}
        </div>
      </div>
    </div>
  );
}