"use client";

import { useState } from "react";
import { getCookies } from "@/helper/cookies";

interface DropProps {
  customerId: number;
  customerName: string;
}

export default function Drop({ customerId, customerName }: DropProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Konfirmasi
    if (!confirm(`Yakin hapus customer "${customerName}"?`)) return;
    
    setIsDeleting(true);
    
    try {
      // Get token
      const token = await getCookies("token");
      
      if (!token) {
        alert("Silakan login ulang");
        window.location.href = "/sign-in";
        return;
      }

      // URL API - SESUAIKAN DENGAN ENDPOINT CUSTOMERS
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${customerId}`;
      
      // DELETE request
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle response
      if (response.ok) {
        alert("✅ Customer berhasil dihapus!");
        // Refresh halaman
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return;
      }
      
      // Jika error
      const errorText = await response.text();
      
      // Jika error karena foreign key constraint
      if (errorText.includes("Foreign key constraint") || 
          errorText.includes("customer_id") ||
          errorText.includes("still referenced")) {
        
        // Coba approach alternatif: hapus dengan cascade
        const tryForceDelete = confirm(
          `Customer "${customerName}" tidak bisa dihapus karena masih memiliki data transaksi/history.\n\n` +
          `Ingin coba hapus dengan menghapus data terkait juga?`
        );
        
        if (tryForceDelete) {
          await deleteWithCascade(customerId, token, customerName);
        }
        
      } else {
        // Coba parse error sebagai JSON
        try {
          const errorJson = JSON.parse(errorText);
          alert(`Gagal menghapus: ${errorJson.message || errorText.substring(0, 200)}`);
        } catch {
          alert(`Gagal menghapus: ${errorText.substring(0, 200)}`);
        }
      }
      
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsDeleting(false);
    }
  };

  // Fungsi untuk hapus dengan cascade (hapus data terkait dulu)
  const deleteWithCascade = async (id: number, token: string, name: string) => {
    try {
      // NOTE: Ini butuh endpoint khusus di backend
      // Untuk sekarang, kita coba request ke endpoint yang sama dengan approach berbeda
      
      alert(
        `Fitur cascade delete membutuhkan endpoint khusus di backend.\n\n` +
        `Minta backend developer untuk:\n` +
        `1. Tambahkan cascade delete di database\n` +
        `2. Atau buat endpoint DELETE dengan force flag\n` +
        `3. Atau implement soft delete (ubah status menjadi inactive)`
      );
      
      // Alternative 1: Coba delete dengan query parameter force
      const forceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${id}?force=true`;
      const forceResponse = await fetch(forceUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (forceResponse.ok) {
        alert("✅ Berhasil dihapus dengan force!");
        window.location.reload();
        return;
      }
      
      // Alternative 2: Soft delete - ubah status menjadi inactive
      const softDeleteConfirm = confirm(
        `Apakah Anda ingin melakukan soft delete?\n\n` +
        `Customer akan diubah statusnya menjadi "inactive" daripada dihapus permanen.`
      );
      
      if (softDeleteConfirm) {
        await softDeleteCustomer(id, token);
      }
      
    } catch (error) {
      console.error("Cascade delete error:", error);
      alert("Gagal melakukan cascade delete");
    }
  };

  // Fungsi untuk soft delete (ubah status menjadi inactive)
  const softDeleteCustomer = async (id: number, token: string) => {
    try {
      const updateUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${id}`;
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "inactive"
        }),
      });

      if (response.ok) {
        alert("✅ Status customer berhasil diubah menjadi inactive!");
        window.location.reload();
      } else {
        const errorText = await response.text();
        alert(`Gagal mengubah status: ${errorText.substring(0, 200)}`);
      }
    } catch (error) {
      console.error("Soft delete error:", error);
      alert("Gagal mengubah status customer");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <>
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menghapus...
          </span>
        </>
      ) : (
        "Hapus"
      )}
    </button>
  );
}