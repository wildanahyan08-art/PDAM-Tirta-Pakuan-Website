"use client";

import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi";
    }

    if (!phone.match(/^08[1-9][0-9]{7,11}$/)) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Harap perbaiki kesalahan pada form", {
        containerId: "toastSignUp",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const request = JSON.stringify({
        username,
        password,
        phone,
        name,
      });
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: request,
      });
      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "Gagal melakukan registrasi", {
          containerId: "toastSignUp",
        });
      } else {
        toast.success(responseData.message || "Registrasi berhasil!", {
          containerId: "toastSignUp",
        });
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setPhone("");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Terjadi kesalahan saat mendaftar", {
        containerId: "toastSignUp",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f5ff] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer
        containerId="toastSignUp"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#0077b6] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-5 text-center text-2xl font-bold text-[#0a1628]">Buat Akun Admin Baru</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          PDAM Tirta Pakuan · Isi formulir di bawah untuk mendaftar
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white rounded-xl border border-border p-8">
          <form className="space-y-5" onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="label-field">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`input-field ${errors.name ? "border-red-300" : ""}`}
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="username" className="label-field">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: "" });
                  }}
                  className={`input-field ${errors.username ? "border-red-300" : ""}`}
                  placeholder="Minimal 3 karakter"
                  disabled={loading}
                />
                {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="label-field">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`input-field ${errors.password ? "border-red-300" : ""}`}
                  placeholder="Minimal 6 karakter"
                  disabled={loading}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                  <p>• Minimal 6 karakter</p>
                  <p>• Kombinasi huruf dan angka lebih baik</p>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label-field">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`input-field ${errors.confirmPassword ? "border-red-300" : ""}`}
                  placeholder="Ulangi password"
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="label-field">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                className={`input-field ${errors.phone ? "border-red-300" : ""}`}
                placeholder="08xxxxxxxxxx"
                disabled={loading}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              <p className="mt-1 text-xs text-muted-foreground">Format: 08xxxxxxxxxx (10-13 digit)</p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-border text-[#0077b6] focus:ring-[#0077b6]"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm font-medium text-foreground">
                  Saya menyetujui syarat dan ketentuan
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dengan mendaftar, saya menyetujui semua persyaratan yang berlaku untuk akun admin PDAM.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0077b6] text-white text-sm font-medium rounded-lg hover:bg-[#00699e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses Pendaftaran...
                </>
              ) : (
                "Buat Akun Admin"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-muted-foreground">Sudah memiliki akun?</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0077b6] hover:text-[#00699e] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk ke akun yang sudah ada
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} PDAM Tirta Pakuan. Hak cipta dilindungi undang-undang.
            </p>
            <p className="text-xs text-muted-foreground text-center mt-0.5">Sistem Informasi Manajemen Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
