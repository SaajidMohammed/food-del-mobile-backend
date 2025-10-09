require("dotenv").config();
console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL);

const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
    console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL);
  } catch (error) {
    console.error("Database Connection failed", error.message);
    console.error("Full Error:", error);
    process.exit();
  }
};

module.exports = { pool, connectDB };
