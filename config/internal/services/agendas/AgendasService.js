export class AgendaService {
  constructor(repo) {
    this.repo = repo;
  }

  validatePayload(payload) {
    const uca_id = Number(payload.uca_id);
    const name = (payload.name ?? "").trim();

    if (!Number.isInteger(uca_id) || uca_id <= 0) {
      return { ok: false, error: "uca_id must be a positive integer" };
    }
    if (!name) {
      return { ok: false, error: "name is required" };
    }
    return { ok: true, uca_id, name };
  }

  async create(payload) {
    const v = this.validatePayload(payload);
    if (!v.ok) return { ok: false, status: 400, error: v.error };

    // Optionnel: empêcher doublon uca_id au niveau service
    const existing = await this.repo.findByUcaId(v.uca_id);
    if (existing) return { ok: false, status: 409, error: "uca_id already exists" };

    const created = await this.repo.create(v);
    return { ok: true, status: 201, data: created };
  }

  async getAll() {
    const rows = await this.repo.findAll();
    return { ok: true, status: 200, data: rows };
  }

async getByUcaId(uca_id) {
  const agenda = await this.repo.findByUcaId(Number(uca_id));
  if (!agenda) {
    return { ok: false, status: 404, error: "agenda not found" };
  }
  return { ok: true, status: 200, data: agenda };
}


  async update(id, payload) {
    const v = this.validatePayload(payload);
    if (!v.ok) return { ok: false, status: 400, error: v.error };

    const affected = await this.repo.update(Number(id), v);
    if (affected === 0) return { ok: false, status: 404, error: "agenda not found" };

    const updated = await this.repo.findById(Number(id));
    return { ok: true, status: 200, data: updated };
  }

  async delete(id) {
    const affected = await this.repo.delete(Number(id));
    if (affected === 0) return { ok: false, status: 404, error: "agenda not found" };
    return { ok: true, status: 204 };
  }
}
