"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/atomic/container";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLoginAlumni } from "@/services/alumni/hook";

export default function AlumniLoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLoginAlumni();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    login(form, {
      onSuccess: (data: any) => {
        if (data.status === 200) {
          if (typeof window !== "undefined" && data.data?.access_token) {
            localStorage.setItem("alumni_token", data.data.access_token);
          }
          toast.success("Login berhasil!");
          router.push("/alumni/profile");
        } else {
          toast.error(data.message || "Login gagal");
        }
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Terjadi kesalahan. Silakan coba lagi.";
        toast.error(msg);
      },
    });
  };

  return (
    <Container>
      <section className="bg-brand-steel text-white py-32 px-[5%] md:px-[7%] lg:px-[10%] w-full">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 flex items-center justify-center gap-3">
            Login Alumni
          </h1>
          <div className="h-[3px] w-[100px] bg-brand-mint"></div>
        </div>
      </section>

      <section className="px-[5%] md:px-[7%] lg:px-[10%] py-10 w-full bg-gray-50 min-h-[60vh]">
        <div className="max-w-md mx-auto">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-steel mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>

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
              className="w-full py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/70 transition-colors disabled:opacity-50"
            >
              {isPending ? "Memproses..." : "Login"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/alumni/register"
                className="text-brand-steel font-medium hover:underline"
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
