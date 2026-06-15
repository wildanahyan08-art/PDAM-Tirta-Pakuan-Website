"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookies } from "@/helper/cookies";

interface PayProps {
  billId: number;
  amount: number;
  onSuccess?: () => void;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    bill_id: number;
    payment_date: string;
    verified: boolean;
    total_amount: number;
    payment_proof: string;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function Pay({ billId, amount, onSuccess }: PayProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [error, setError] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file maksimal 2MB");
        return;
      }
      
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setError("Format file harus JPG, PNG, atau PDF");
        return;
      }
      
      setPaymentProof(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentProof) {
      setError("Silakan pilih bukti pembayaran");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getCookies("token");
      
      const formData = new FormData();
      formData.append("bill_id", billId.toString());
      formData.append("file", paymentProof);

      console.log("Sending payment for bill ID:", billId);
      console.log("File name:", paymentProof.name);
      console.log("File type:", paymentProof.type);
      console.log("File size:", paymentProof.size, "bytes");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json: PaymentResponse = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Gagal mengirim pembayaran");
      }

      if (json.success) {
        setOpen(false);
        setPaymentProof(null);
        
        if (onSuccess) {
          onSuccess();
        }
        
        router.refresh();
      } else {
        throw new Error(json.message || "Gagal mengirim pembayaran");
      }
      
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Terjadi kesalahan saat mengirim pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary text-xs !px-3 !py-1.5 !rounded-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          Bayar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
          <DialogDescription>
            Silakan transfer sesuai nominal dan upload bukti pembayaran
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nominal Tagihan */}
          <div className="bg-[#f0f5ff] rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-0.5">Total Tagihan</p>
            <p className="text-2xl font-bold text-[#0077b6]">
              {formatCurrency(amount)}
            </p>
          </div>

          {/* Informasi Bank */}
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 2 9 22 9 22 7 12 2"/><rect x="4" y="9" width="16" height="4"/><path d="M6 13v6M10 13v6M14 13v6M18 13v6"/></svg>
              Informasi Bank
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bank BCA</span>
                <span className="font-mono font-semibold text-foreground">123 456 7890</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bank Mandiri</span>
                <span className="font-mono font-semibold text-foreground">987 654 3210</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                a.n PDAM Tirta Pakuan
              </p>
            </div>
          </div>

          {/* Upload Bukti */}
          <div>
            <Label htmlFor="payment_proof" className="text-sm font-semibold text-foreground">
              Bukti Pembayaran <span className="text-red-500">*</span>
            </Label>
            <Input
              id="payment_proof"
              type="file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileChange}
              className="mt-1"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: JPG, PNG, PDF (Max 2MB)
            </p>
            {error && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </p>
            )}
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Perhatian:</span> Pastikan bukti transfer 
                menunjukkan nama pengirim, nomor rekening tujuan, jumlah transfer, dan tanggal transfer.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setError("");
                setPaymentProof(null);
              }}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !paymentProof}
              className="min-w-[120px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Mengirim...
                </span>
              ) : (
                "Kirim Bukti"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
