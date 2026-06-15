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
    if (!confirm(`Yakin hapus customer "${customerName}"?`)) return;
    
    setIsDeleting(true);
    
    try {
      const token = await getCookies("token");
      
      if (!token) {
        alert("Silakan login ulang");
        window.location.href = "/sign-in";
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${customerId}`;
      
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("✅ Customer berhasil dihapus!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return;
      }
      
      const errorText = await response.text();
      
      if (errorText.includes("Foreign key constraint") || 
          errorText.includes("customer_id") ||
          errorText.includes("still referenced")) {
        
        const tryForceDelete = confirm(
          `Customer "${customerName}" tidak bisa dihapus karena masih memiliki data transaksi/history.\n\n` +
          `Ingin coba hapus dengan menghapus data terkait juga?`
        );
        
        if (tryForceDelete) {
          await deleteWithCascade(customerId, token, customerName);
        }
        
      } else {
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

  const deleteWithCascade = async (id: number, token: string, name: string) => {
    try {
      alert(
        `Fitur cascade delete membutuhkan endpoint khusus di backend.\n\n` +
        `Minta backend developer untuk:\n` +
        `1. Tambahkan cascade delete di database\n` +
        `2. Atau buat endpoint DELETE dengan force flag\n` +
        `3. Atau implement soft delete (ubah status menjadi inactive)`
      );
      
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
      className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
    >
      {isDeleting ? (
        <>
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menghapus...
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          Hapus
        </>
      )}
    </button>
  );
}
