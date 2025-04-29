"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPaymentById } from "@/lib/api";
import Link from "next/link";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PaymentConfirmationPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Payment ID tidak valid.");
      setIsLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPaymentById(id);
        setPayment(data);

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <Link href="/">Kembali ke Beranda</Link>
      </div>
    );
  }

  if (!id) {
    return <p>Payment tidak ditemukan.</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        {/* Success Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800">Pembayaran Berhasil</h1>

        <p className="text-gray-600">Terima kasih, pembayaran Anda sebesar {formatCurrency(payment.jumlah_pembayaran)} telah berhasil diproses.</p>
      </div>

      <hr className="my-4 border-gray-200" />
      <div className="space-y-3 txt-sm text-gray-700 mt-7">
        <p>
          <strong>Nama Lengkap :</strong> {payment.nama_lengkap}
        </p>
        <p>
          <strong>Email :</strong> {payment.email}
        </p>
        <p>
          <strong>Nomor Telepon :</strong> {payment.nomor_telepon}
        </p>
        <p>
          <strong>Jumlah Pembayaran :</strong> {formatCurrency(payment.jumlah_pembayaran)}
        </p>
        <p>
          <strong>Metode Pembayaran :</strong> {payment.metode_pembayaran}
        </p>
        <p>
          <strong>Tanggal :</strong> {formatDateTime(payment.timestamp)}
        </p>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">Bukti Pembayaran (jika ada) akan dikirimkan ke email Anda.</p>

      <div>
        <Link href="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
