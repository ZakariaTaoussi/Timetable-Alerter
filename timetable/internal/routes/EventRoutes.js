import { Router } from "express";

export function buildEventsRouter(eventsController) {
  const router = Router();

  router.get("/", eventsController.getAll);       // GET /events
  router.get("/:uid", eventsController.getByUid); // GET /events/:uid

  return router;
}
