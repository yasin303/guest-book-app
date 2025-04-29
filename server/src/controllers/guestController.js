import { addGuest, getAllGuests } from "../models/db.js";

export const createGuest = async (req, res) => {
  const { nama, pesan } = req.body;

  if (!nama || !pesan) {
    return res.status(400).json({ message: "Nama and Pesan are required" });
  }

  try {
    const guestId = await addGuest(nama, pesan);
    res.status(201).json({ message: "Guest added successfully", guestId });
  } catch (error) {
    console.error("Error adding guest:", error);
    res.status(500).json({ message: "Failed to add guest" });
  }
};

export const getGuests = async (req, res) => {
  try {
    const guests = await getAllGuests();
    res.status(200).json(guests);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ message: "Failed to fetch guests" });
  }
};
