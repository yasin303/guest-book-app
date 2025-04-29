"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPaymentById } from "@/lib/api"; 
import Link from "next/link";
import { AxiosError } from "axios"; 

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
          console.warn("Invalid date string received:", dateString);
          return "Tanggal tidak valid";
      }
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      });
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Gagal format tanggal";
    }
  };

export default function PaymentConfirmationPage() {
  const params = useParams();
  const id = params?.id;
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    
    setPayment(null);
    setError(null);
    setIsNotFound(false); 
    setIsLoading(true);

    if (!id) {
      setError("ID Pembayaran tidak valid atau tidak ada di URL.");
      setIsLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        console.log(`Fetching payment details for ID: ${id}`);
        const data = await getPaymentById(id);

        if (!data) {
          console.warn(`API returned no data for ID: ${id}, treating as Not Found.`);
          
          setIsNotFound(true);
          setError(`Data pembayaran untuk ID "${id}" tidak ditemukan.`); 
        } else {
          setPayment(data);
          setIsNotFound(false); 
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
        
        if (err instanceof AxiosError && err.response?.status === 404) {
          setError(`Pembayaran dengan ID "${id}" tidak ditemukan di sistem.`);
          setIsNotFound(true); 
        } else {
          
          setError(err.message || "Gagal memuat detail pembayaran. Silakan coba lagi nanti.");
          setIsNotFound(false); 
        }
      } finally {
        setIsLoading(false); 
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Memuat detail pembayaran...</p>
        {/* Optional: Add a spinner */}
      </div>
    );
  }

  
  if (isNotFound) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md text-center mt-10">
        {/* Not Found Icon (contoh: tanda tanya atau search) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Pembayaran Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">{error}</p> {/* Tampilkan pesan error spesifik dari state */}
        <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md text-center mt-10">
         {/* Error Icon */}
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-red-700 mb-3">Terjadi Kesalahan</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }
  if (!payment) {
     return (
      <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md text-center mt-10">
         <h1 className="text-2xl font-bold text-gray-700 mb-3">Data Tidak Dapat Ditampilkan</h1>
        <p className="text-gray-700 mb-6">Tidak dapat menampilkan detail pembayaran saat ini. Silakan coba lagi atau hubungi support.</p>
         <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Kembali ke Beranda
         </Link>
       </div>
     );
  }

  return (  
    <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md mt-10 mb-10">
      <div className="text-center mb-6">
        {/* Success Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h1 className="text-2xl font-bold text-gray-800">Pembayaran Berhasil</h1>
        <p className="text-gray-600 mt-2">
          Terima kasih, pembayaran Anda sebesar{" "}
          <strong>{formatCurrency(payment.jumlah_pembayaran)}</strong> telah
          berhasil diproses.
        </p>
      </div>
      <hr className="my-6 border-gray-200" />

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Detail Pembayaran</h2>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
            <span className="font-medium text-gray-500">Nama Lengkap:</span>
            <span>{payment.nama_lengkap || "-"}</span>
        </div>
         <div className="flex justify-between">
            <span className="font-medium text-gray-500">Email:</span>
            <span>{payment.email || "-"}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-medium text-gray-500">Nomor Telepon:</span>
            <span>{payment.nomor_telepon || "-"}</span>
        </div>
         <div className="flex justify-between">
            <span className="font-medium text-gray-500">Jumlah Pembayaran:</span>
            <span className="font-semibold">{formatCurrency(payment.jumlah_pembayaran)}</span>
        </div>
         <div className="flex justify-between">
            <span className="font-medium text-gray-500">Metode Pembayaran:</span>
            <span>{payment.metode_pembayaran || "-"}</span>
        </div>
         <div className="flex justify-between">
            <span className="font-medium text-gray-500">Waktu Transaksi:</span>
            <span>{formatDateTime(payment.timestamp)}</span>
        </div>
         {/* Contoh detail tambahan */}
         {payment.transaction_id && (
            <div className="flex justify-between">
                <span className="font-medium text-gray-500">ID Transaksi:</span>
                <span className="font-mono text-xs">{payment.transaction_id}</span>
            </div>
         )}
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Bukti pembayaran detail (jika berlaku) akan dikirimkan ke email Anda.
      </p>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-5 rounded hover:bg-blue-700 transition duration-200 text-sm font-medium">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
