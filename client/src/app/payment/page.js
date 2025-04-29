"use client";

import { useState } from "react";
import Link from "next/link";
import { createPayment } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    nomor_telepon: "",
    jumlah_pembayaran: 0,
    metode_pembayaran: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // state untuk error handling (rendering error message)
  const [error, setError] = useState(null);

  // State for success message
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    setError(null); // Reset error state

    if (formData.jumlah_pembayaran < 10000) {
      setError("Jumlah pembayaran minimal 10000");
      return;
    }

    if (!formData.metode_pembayaran) {
      setError("Pilih metode pembayaran");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createPayment(formData);
      setSuccess("Berhasil menambahkan data pembayaran");
      console.log("Response data:", response.paymentId);

      router.push(`/payment/confirmation/${response.paymentId}`);
      
    } catch (error) {
      setError("Gagal atau error pada server");
      setIsSubmitting(false);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center text-black">Payment Form</h1>
      <form action={handleSubmit} className="space-y-4">
        {/* Nama */}
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama_lengkap"
            value={formData?.nama_lengkap}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo
500 sm:text-sm"
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo
500 sm:text-sm"
          />
        </div>
        {/* No Telepon */}
        <div>
          <label htmlFor="nomor_telepon" className="block text-sm font-medium text-gray-700 mb-1">
            No Telepon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="nomor_telepon"
            name="nomor_telepon"
            value={formData.nomor_telepon}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo
500 sm:text-sm"
          />
        </div>
        {/* Jumlah Pembayaran */}
        <div>
          <label htmlFor="jumlah_pembayaran" className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah Pembayaran <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="jumlah_pembayaran"
            name="jumlah_pembayaran"
            value={formData.jumlah_pembayaran}
            onChange={handleChange}
            required
            min={10000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {/* Metode Pembayaran */}
        <div>
          <label htmlFor="metode_pembayaran" className="block text-sm font-medium text-gray-700 mb-1">
            Metode Pembayaran <span className="text-red-500">*</span>
          </label>
          <select
            id="metode_pembayaran"
            name="metode_pembayaran"
            value={formData.metode_pembayaran}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Pilih metode pembayaran</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="e-Wallet">e-Wallet</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>
        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Mengkonfirmasi Pembayaran ..." : "Bayar Sekarang"}
        </button>
        {/* Render error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* Render success message */}
        {success && <p className="text-green-500 text-sm">{success}</p>} <hr className="my-6 border-gray-300" />
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Opsi Lain:</p>

          <Link href="/" className="text-indigo-500 hover:text-indigo-700 hover:underline text-sm mx-2">
            Halaman Utama
          </Link>

          <span className="text-gray-500 text-sm">|</span>
          <Link href="/admin" className="text-indigo-500 hover:text-indigo-700 hover:underline text-sm mx-2">
            Halaman Admin
          </Link>
        </div>
      </form>
    </div>
  );
}
