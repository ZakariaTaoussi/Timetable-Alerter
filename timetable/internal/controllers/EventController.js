export class EventsController {
  constructor(eventsService) {
    this.service = eventsService;
  }

  getAll = async (req, res) => {
    try {
      const events = await this.service.getEvents();
      res.json(events);
    } catch (e) {
      res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };

  getByUid = async (req, res) => {
    try {
      const { uid } = req.params;
      const event = await this.service.getEventByUid(uid);

      if (!event) {
        return res.status(404).json({ error: "NOT_FOUND", message: "Event not found" });
      }
      res.json(event);
    } catch (e) {
      res.status(500).json({ error: "SERVER_ERROR", message: e.message });
    }
  };
}
