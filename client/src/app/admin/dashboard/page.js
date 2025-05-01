"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, getAllGuest, getAllPayments } from "../../../lib/api";

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

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [guests, setGuests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/admin");
    } else {
      fetchGuests();
      fetchPayments();
    }
  }, [router]);

  const fetchGuests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllGuest();

      console.log(response);

      setGuests(response || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Terjadi kesalahan saat mengambil data tamu.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllPayments();
      console.log(response);
      setPayments(response || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Terjadi kesalahan saat mengambil data pembayaran.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/admin");
  };

  if (isAuthenticated) {
    return <div className="text-center py-10">Memeriksa autentikasi ...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Logout
        </button>
      </div>

      <h2 className="text-lg font-medium text-gray-700 mb-4">Daftar Tamu</h2>

      {isLoading && <p className="text-center text-gray-500">Memuat data tamu ...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          {/* Table for guest data */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pesan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.length === 0 ? (
                <tr className="text-center">
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data tamu
                  </td>
                </tr>
              ) : (
                guests.map((guest, index) => (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.pesan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(guest.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h2 className="text-lg font-medium text-gray-700 mb-4 mt-20">Table Pembayaran</h2>

          {/* Table for payments */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Pembayaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode Pembayaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pembayaran</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr className="text-center">
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data tamu
                  </td>
                </tr>
              ) : (
                payments.map((guest, index) => (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.nama_lengkap}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.nomor_telepon}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(guest.jumlah_pembayaran)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{capitalizeFirstLetter(guest.metode_pembayaran)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(guest.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
