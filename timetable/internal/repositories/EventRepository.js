export class EventsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const sql = `
      SELECT AgendaIDs, UID, Description, Name, Start, End, Location, LastUpdate
      FROM timetable.events
      ORDER BY Start ASC
    `;
    const [rows] = await this.pool.query(sql);

    // AgendaIDs est un JSON MySQL -> mysql2 te le renvoie souvent déjà comme objet,
    // sinon ce sera une string JSON: on sécurise
    return rows.map((r) => ({
      agendaIds: typeof r.AgendaIDs === "string" ? JSON.parse(r.AgendaIDs) : r.AgendaIDs,
      uid: r.UID,
      description: r.Description,
      name: r.Name,
      start: r.Start,
      end: r.End,
      location: r.Location,
      lastUpdate: r.LastUpdate
    }));
  }

  async findByUid(uid) {
    const sql = `
      SELECT AgendaIDs, UID, Description, Name, Start, End, Location, LastUpdate
      FROM timetable.events
      WHERE UID = ?
      LIMIT 1
    `;
    const [rows] = await this.pool.execute(sql, [uid]);

    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      agendaIds: typeof r.AgendaIDs === "string" ? JSON.parse(r.AgendaIDs) : r.AgendaIDs,
      uid: r.UID,
      description: r.Description,
      name: r.Name,
      start: r.Start,
      end: r.End,
      location: r.Location,
      lastUpdate: r.LastUpdate
    };
  }
}
