"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerEditPage } from "./page"; // Sekarang bisa di-import

interface FormCustomerProps {
  customer: CustomerEditPage;
}

interface ServiceOption {
  id: number;
  name: string;
}

export default function FormCustomer({ customer }: FormCustomerProps) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address);
  const [serviceId, setServiceId] = useState(customer.service_id);
  const [services, setServices] = useState<ServiceOption[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Ambil daftar services untuk dropdown
    async function getServices() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services`, {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          },
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setServices(json.data);
        }
      } catch (error) {
        console.error("Gagal mengambil services:", error);
      }
    }

    getServices();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/${customer.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        service_id: serviceId,
      }),
    });

    router.push("/admin/customers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nomor Customer (Read-only) */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nomor Customer</label>
        <input
          type="text"
          value={customer.customer_number}
          disabled
          className="w-full p-3 rounded bg-slate-600 text-gray-300 cursor-not-allowed"
        />
      </div>

      {/* Nama Customer */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nama Customer</label>
        <input
          className="w-full p-3 rounded bg-slate-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap"
          required
        />
      </div>

      {/* Nomor Telepon */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Nomor Telepon</label>
        <input
          type="tel"
          className="w-full p-3 rounded bg-slate-700 text-white"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="081234567890"
          required
        />
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Alamat</label>
        <textarea
          className="w-full p-3 rounded bg-slate-700 text-white"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Alamat lengkap"
          rows={3}
          required
        />
      </div>

      {/* Pilih Layanan */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Layanan</label>
        <select
          className="w-full p-3 rounded bg-slate-700 text-white"
          value={serviceId}
          onChange={(e) => setServiceId(Number(e.target.value))}
          required
        >
          <option value="">-- Pilih Layanan --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        className="w-full bg-emerald-500 text-black font-bold py-3 rounded hover:bg-emerald-600 transition-colors"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}