"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormEvent, startTransition, useState, useTransition } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { storeCookies } from "../../helper/cookies";

export interface LoginResponse {
  success?: boolean;
  message: string;
  token?: string;
  role?: string;
  error?: string;
  statusCode?: string;
}

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [pending] = useTransition();
  const router = useRouter();

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Terjadi kesalahan server", {
          containerId: "toastLogin",
        });
        return;
      }

      if (data.success) {
        toast.success(data.message, {
          containerId: "toastLogin",
        });

        startTransition(async function () {
          await storeCookies("token", data.token || "");
          if (data.role === "ADMIN") {
            setTimeout(() => {
              router.push(`/admin/profile`);
            }, 1000);
          } else if (data.role === "CUSTOMER") {
            setTimeout(() => {
              router.push("/customer/profile");
            }, 1000);
          }
        });
      } else {
        toast.warning(data.message, {
          containerId: "toastLogin",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi", {
        containerId: "toastLogin",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/3 -right-16 w-[300px] h-[300px] rounded-full bg-white" />
        <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full bg-white" />
      </div>

      <ToastContainer containerId="toastLogin" position="top-right" autoClose={3000} theme="colored" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#0096c7] flex items-center justify-center mb-4 shadow-lg">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 4 8.5 4 14a8 8 0 0016 0C20 8.5 12 2 12 2z" fill="white" opacity="0.95"/>
              <path d="M12 8C12 8 8 11.5 8 14a4 4 0 008 0C16 11.5 12 8 12 8z" fill="white" opacity="0.45"/>
            </svg>
          </div>
          <h1 className="text-white text-xl font-bold">PDAM Tirta Pakuan</h1>
          <p className="text-white/50 text-sm mt-1">Portal Pelanggan Air Bersih</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0a1628]">Selamat Datang</h2>
            <p className="text-sm text-muted-foreground mt-1">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="label-field" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Masukkan username Anda"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || pending}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0077b6] text-white text-sm font-medium rounded-lg hover:bg-[#00699e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">Belum punya akun?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link
            href="/sign-up"
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-secondary transition-colors text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Daftar Akun Baru
          </Link>
        </div>

        <p className="text-center mt-6 text-xs text-white/30">
          © 2024 PDAM Tirta Pakuan · Kota Bogor
        </p>
      </div>
    </div>
  );
}
