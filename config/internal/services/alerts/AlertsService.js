export class AlertsService {
  constructor(repo) {
    this.repo = repo;
  }

  async createAlert(body) {
    const ucaId = Number(body.ucaId);
    const userEmail = String(body.userEmail || "").trim();

    if (!ucaId || !userEmail) {
      return { ok: false, status: 400, error: "ucaId and userEmail are required" };
    }

    const created = await this.repo.create({ ucaId, userEmail });
    return { ok: true, status: 201, data: created };
  }

  async listAlerts() {
    const data = await this.repo.findAll();
    return { ok: true, status: 200, data };
  }

  async getAlert(id) {
    const alert = await this.repo.findById(Number(id));
    if (!alert) return { ok: false, status: 404, error: "alert not found" };
    return { ok: true, status: 200, data: alert };
  }

  async updateAlert(id, body) {
    const ucaId = Number(body.ucaId);
    const userEmail = String(body.userEmail || "").trim();

    if (!ucaId || !userEmail) {
      return { ok: false, status: 400, error: "ucaId and userEmail are required" };
    }

    const affected = await this.repo.update(Number(id), { ucaId, userEmail });
    if (affected === 0) return { ok: false, status: 404, error: "alert not found" };

    const updated = await this.repo.findById(Number(id));
    return { ok: true, status: 200, data: updated };
  }

  async deleteAlert(id) {
    const affected = await this.repo.delete(Number(id));
    if (affected === 0) return { ok: false, status: 404, error: "alert not found" };
    return { ok: true, status: 200, data: { deleted: true } };
  }
}
