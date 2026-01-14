export class AlertsController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    try {
      const r = await this.service.createAlert(req.body);
      return res.status(r.status).json(r.ok ? r.data : { error: r.error });
    } catch (e) {
      return res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const r = await this.service.listAlerts();
      return res.status(r.status).json(r.data);
    } catch (e) {
      return res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };

  getById = async (req, res) => {
    try {
      const r = await this.service.getAlert(req.params.id);
      return res.status(r.status).json(r.ok ? r.data : { error: r.error });
    } catch (e) {
      return res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };

  update = async (req, res) => {
    try {
      const r = await this.service.updateAlert(req.params.id, req.body);
      return res.status(r.status).json(r.ok ? r.data : { error: r.error });
    } catch (e) {
      return res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };

  remove = async (req, res) => {
    try {
      const r = await this.service.deleteAlert(req.params.id);
      return res.status(r.status).json(r.ok ? r.data : { error: r.error });
    } catch (e) {
      return res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };
}
