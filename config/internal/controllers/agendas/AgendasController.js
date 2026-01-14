export class AgendaController {
  constructor(service) {
    this.service = service;
  }

  // GET /agendas
  getAll = async (req, res) => {
    const r = await this.service.getAll();
    res.status(r.status).json(r.data);
  };

  // GET /agendas/uca/:uca_id
  getByUcaId = async (req, res) => {
    const r = await this.service.getByUcaId(req.params.uca_id);
    if (!r.ok) {
      return res.status(r.status).json({ error: r.error });
    }
    res.status(r.status).json(r.data);
  };

  // POST /agendas
  create = async (req, res) => {
    const r = await this.service.create(req.body);
    if (!r.ok) {
      return res.status(r.status).json({ error: r.error });
    }
    res.status(r.status).json(r.data);
  };

  // PUT /agendas/uca/:uca_id
  updateByUcaId = async (req, res) => {
    const r = await this.service.updateByUcaId(
      req.params.uca_id,
      req.body
    );
    if (!r.ok) {
      return res.status(r.status).json({ error: r.error });
    }
    res.status(r.status).json(r.data);
  };

  // DELETE /agendas/uca/:uca_id
  deleteByUcaId = async (req, res) => {
    const r = await this.service.deleteByUcaId(req.params.uca_id);
    if (!r.ok) {
      return res.status(r.status).json({ error: r.error });
    }
    res.status(204).send();
  };
}
