export class AgendaRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ uca_id, name }) {
    const [result] = await this.pool.execute(
      "INSERT INTO agendas (uca_id, name) VALUES (?, ?)",
      [uca_id, name]
    );

    return { id: result.insertId, uca_id, name };
  }

  async findAll() {
    const [rows] = await this.pool.execute(
      "SELECT id, uca_id, name FROM agendas ORDER BY id DESC"
    );
    return rows;
  }

  async findByUcaId(uca_id) {
    const [rows] = await this.pool.execute(
      "SELECT id, uca_id, name FROM agendas WHERE uca_id = ?",
      [uca_id]
    );
    return rows[0] ?? null;
  }

  async update(id, { uca_id, name }) {
    const [result] = await this.pool.execute(
      "UPDATE agendas SET uca_id = ?, name = ? WHERE id = ?",
      [uca_id, name, id]
    );

    return result.affectedRows; // 0 si rien modifié / id inexistant
  }

  async delete(id) {
    const [result] = await this.pool.execute(
      "DELETE FROM agendas WHERE id = ?",
      [id]
    );

    return result.affectedRows; // 0 si id inexistant
  }
}
