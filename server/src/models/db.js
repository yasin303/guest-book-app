import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DATABASE_PATH = process.env.DATABASE_PATH || path.resolve(__dirname, "../../database.sqlite");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

let db;

async function initializeDatabase() {
  try {
    db = await open({
      filename: DATABASE_PATH,
      driver: sqlite3.Database,
    });
    console.log("Connected to the SQLite database.");

    await db.exec(`
            CREATE TABLE IF NOT EXISTS guests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama TEXT NOT NULL,
                pesan TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

    await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

    await db.exec(`
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama_lengkap TEXT NOT NULL,
                email TEXT NOT NULL,
                nomor_telepon TEXT NOT NULL,
                jumlah_pembayaran INTEGER NOT NULL,
                metode_pembayaran TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

    console.log("Tables created or already exist.");

    // Create Admin
    const adminExists = await db.get("SELECT email FROM users WHERE email = ?", [ADMIN_EMAIL]);
    if (!adminExists) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);
      await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [ADMIN_EMAIL, hashedPassword]);
      console.log(`Admin user created: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin user ${ADMIN_EMAIL} already exists.`);
    }
  } catch (err) {
    console.error("Error initializing database:", err.message);
    console.error("Database path used:", DATABASE_PATH);
    process.exit(1);
  }
}

function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase first.");
  }
  return db;
}

async function addGuest(nama, pesan) {
  const db = getDb();
  const result = await db.run("INSERT INTO guests (nama, pesan) VALUES (?, ?)", [nama, pesan]);
  return result.lastID;
}

async function getAllGuests() {
  const db = getDb();
  return await db.all("SELECT id, nama, pesan, DATETIME(timestamp, 'localtime') as timestamp FROM guests ORDER BY timestamp DESC");
}

async function findUserByEmail(email) {
  const db = getDb();
  return await db.get("SELECT * FROM users WHERE email = ?", [email]);
}

async function addPayment(data) {
  const db = getDb();
  const { nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran } = data;

  const amount = parseInt(jumlah_pembayaran, 10);
  if (isNaN(amount)) {
    throw new Error("Invalid payment amount");
  }
  const result = await db.run(
    `INSERT INTO payments (nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran)
         VALUES (?, ?, ?, ?, ?)`,
    [nama_lengkap, email, nomor_telepon, amount, metode_pembayaran]
  );
  return result.lastID;
}

async function getPaymentById(id) {
  const db = getDb();
  return await db.get("SELECT id, nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran, DATETIME(timestamp, 'localtime') as timestamp FROM payments WHERE id = ?", [id]);
}

async function getAllPayments() {
  const db = getDb();
  return await db.all("SELECT id, nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran, DATETIME(timestamp, 'localtime') as timestamp FROM payments ORDER BY timestamp DESC");
}

export { initializeDatabase, getDb, addGuest, getAllGuests, findUserByEmail, addPayment, getPaymentById, getAllPayments };
