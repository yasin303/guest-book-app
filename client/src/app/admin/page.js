"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loginAdmin, setToken, getToken } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/admin/dashboard");
    }
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await loginAdmin({ email, password });
      setToken(response.token);
      router.push("/admin/dashboard");
    } catch (error) {
      const errorMessage = error.message || "Login gagal, Periksa kembali email dan password Anda.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 mt-4 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href={"/"} className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline">
          Kembali ke halaman utama
        </Link>
      </div>
    </div>
  );
}
