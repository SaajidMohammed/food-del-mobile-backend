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
const connectDB = async (retryCount = 0) => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
    console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL);
  } catch (error) {
    console.error("Database Connection failed", error.message);
    console.error("Full Error:", error);
    if (retryCount < 5) { // Retry up to 5 times
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying database connection in ${delay / 1000} seconds... (Attempt ${retryCount + 1})`);
      await new Promise(res => setTimeout(res, delay));
      await connectDB(retryCount + 1);
    } else {
      console.error("Max retries reached. Exiting process.");
      process.exit(1);
    }
  }
};

module.exports = { pool, connectDB };
