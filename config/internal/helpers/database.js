import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "config",
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
