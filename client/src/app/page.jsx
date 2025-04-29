"use client";

import { useState } from "react";
import Link from "next/link";
import { createGuest } from "@/lib/api";

export default function HomePage() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // state untuk error handling (rendering error message)
  const [error, setError] = useState(null);

  // State for success message
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    // Handling state
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Reset error state
    setSuccess(""); // Reset success state

    // Handling API Call
    try {
      const response = await createGuest({ nama, pesan });
      setSuccess("Berhasil menambahkan data tamu");
      console.log("Response data:", response.data);

      //   Reset isian form
      setNama("");
      setPesan("");

      setIsSubmitting(false);
    } catch (error) {
      setError("Gagal atau error pada server");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center text-black">Guest Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama */}
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {/* Pesan */}
        <div>
          <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-1">
            Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="pesan"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Render error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Render success message */}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* Button  */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Mengirim..." : "Kirim"}
        </button>

        <hr className="my-6 border-gray-300" />

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Opsi Lain:</p>
          <Link href="/payment" className="text-indigo-500 hover:text-indigo-700 hover:underline text-sm mx-2">
            Halaman Pembayaran
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
