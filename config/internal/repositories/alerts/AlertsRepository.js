export class AlertsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ ucaId, userEmail }) {
    const sql = `INSERT INTO alerts (uca_id, user_email) VALUES (?, ?)`;
    const [result] = await this.pool.execute(sql, [ucaId, userEmail]);
    return { id: result.insertId, ucaId, userEmail };
  }

  async findAll() {
    const sql = `SELECT id, uca_id AS ucaId, user_email AS userEmail FROM alerts ORDER BY id DESC`;
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  async findById(id) {
    const sql = `SELECT id, uca_id AS ucaId, user_email AS userEmail FROM alerts WHERE id = ? LIMIT 1`;
    const [rows] = await this.pool.execute(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  async update(id, { ucaId, userEmail }) {
    const sql = `UPDATE alerts SET uca_id = ?, user_email = ? WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [ucaId, userEmail, id]);
    return result.affectedRows; // 0 si pas trouvé
  }

  async delete(id) {
    const sql = `DELETE FROM alerts WHERE id = ?`;
    const [result] = await this.pool.execute(sql, [id]);
    return result.affectedRows;
  }
}
