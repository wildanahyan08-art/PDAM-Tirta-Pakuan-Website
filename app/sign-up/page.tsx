"use client";

import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        // Reset form
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-lg shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Buat Akun Admin Baru
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          PDAM Tirta Pakuan
        </p>
        <p className="text-center text-sm text-gray-600">
          Isi formulir di bawah untuk mendaftar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({...errors, name: ""});
                    }}
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Masukkan nama lengkap"
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors({...errors, username: ""});
                    }}
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out ${
                      errors.username ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Minimal 3 karakter"
                    disabled={loading}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ""});
                    }}
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Minimal 6 karakter"
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    <p>• Minimal 6 karakter</p>
                    <p>• Kombinasi huruf dan angka lebih baik</p>
                  </div>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({...errors, confirmPassword: ""});
                    }}
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out ${
                      errors.confirmPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Ulangi password"
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({...errors, phone: ""});
                  }}
                  className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="08xxxxxxxxxx"
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: 08xxxxxxxxxx (10-13 digit)
                </p>
              </div>
            </div>

            {/* Syarat dan Ketentuan */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Saya menyetujui syarat dan ketentuan
                </label>
                <p className="text-gray-500">
                  Dengan mendaftar, saya menyetujui semua persyaratan yang berlaku untuk akun admin PDAM.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses Pendaftaran...
                  </>
                ) : "Buat Akun Admin"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Sudah memiliki akun?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Masuk ke akun yang sudah ada
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>© {new Date().getFullYear()} PDAM Tirta Pakuan. Hak cipta dilindungi undang-undang.</p>
              <p className="mt-1">Sistem Informasi Manajemen Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}