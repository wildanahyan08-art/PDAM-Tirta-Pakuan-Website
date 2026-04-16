"use client";

import { useState } from "react";
import { getCookies } from "@/helper/cookies";

interface DropProps {
  serviceId: number;
  serviceName: string;
}

export default function Drop({ serviceId, serviceName }: DropProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Konfirmasi
    if (!confirm(`Yakin hapus service "${serviceName}"?`)) return;
    
    setIsDeleting(true);
    
    try {
      // Get token
      const token = await getCookies("token");
      
      if (!token) {
        alert("Silakan login ulang");
        window.location.href = "/sign-in";
        return;
      }

      // URL API
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${serviceId}`;
      
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
        alert("✅ Service berhasil dihapus!");
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
          errorText.includes("service_id")) {
        
        // Coba approach alternatif: hapus dengan cascade
        const tryForceDelete = confirm(
          `Service "${serviceName}" tidak bisa dihapus karena masih digunakan.\n\n` +
          `Ingin coba hapus dengan menghapus data terkait juga?`
        );
        
        if (tryForceDelete) {
          await deleteWithCascade(serviceId, token, serviceName);
        }
        
      } else {
        alert(`Gagal menghapus: ${errorText.substring(0, 200)}`);
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
        `3. Atau implement soft delete`
      );
      
      // Alternative: Coba delete dengan query parameter force
      const forceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}?force=true`;
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
      }
      
    } catch (error) {
      console.error("Cascade delete error:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </button>
  );
}