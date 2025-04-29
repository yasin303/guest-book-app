import { addPayment, getPaymentById, getAllPayments } from "../models/db.js";

export const createPayment = async (req, res) => {
  const { nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran } = req.body;

  if (!nama_lengkap || !email || !nomor_telepon || !jumlah_pembayaran || !metode_pembayaran) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof jumlah_pembayaran !== "number" || isNaN(jumlah_pembayaran) || jumlah_pembayaran < 10000) {
    return res.status(400).json({ message: "Invalid payment amount (minimum Rp 10.000)" });
  }

  try {
    const paymentId = await addPayment({
      nama_lengkap,
      email,
      nomor_telepon,
      jumlah_pembayaran,
      metode_pembayaran,
    });
    res.status(201).json({ message: "Payment initiated successfully", paymentId });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

export const getPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Failed to fetch payment details" });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: "Failed to fetch all payments" });
  }
};
