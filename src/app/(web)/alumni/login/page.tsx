"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/atomic/container";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLoginAlumni } from "@/services/alumni/hook";

export default function AlumniLoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLoginAlumni();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      return;
    }

    login(form, {
      onSuccess: (data: any) => {
        if (data.status === 200) {
          // Store token if needed for future alumni features
          if (typeof window !== "undefined" && data.data?.access_token) {
            localStorage.setItem("alumni_token", data.data.access_token);
          }
          router.push("/alumni");
        } else {
          setError(data.message || "Login gagal");
        }
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
        setError(msg);
      },
    });
  };

  return (
    <Container>
      <section className="bg-brand-dark text-white py-16 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10" />
            Login Alumni
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Masuk ke akun alumni Anda
          </p>
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
        <div className="max-w-md mx-auto">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-dark mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke daftar alumni
          </Link>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Masukkan password"
                  className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-brand-dark text-white rounded-xl font-medium hover:bg-brand-dark-hover transition-colors disabled:opacity-50"
            >
              {isPending ? "Memproses..." : "Login"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/alumni/register"
                className="text-brand-dark font-medium hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Container>
  );
}
