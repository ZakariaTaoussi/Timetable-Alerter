export class EventsService {
  constructor(eventsRepository) {
    this.repo = eventsRepository;
  }

  async getEvents() {
    return this.repo.findAll();
  }

  async getEventByUid(uid) {
    // Tu peux ajouter ici de la logique : validation uid, format, etc.
    return this.repo.findByUid(uid);
  }
}
