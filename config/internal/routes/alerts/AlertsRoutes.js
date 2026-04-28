import { Router } from "express";

export function buildAlertsRouter(controller) {
  const router = Router();

  router.get("/by-agenda/:uca_id", controller.getByAgendaID); // ← EN PREMIER
  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}