import mysql from "mysql2";

require("dotenv").config();

export const db_agc = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_UNICONTROL_AGC,
});