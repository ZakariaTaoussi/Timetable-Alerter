import { Router } from "express";

export function buildAgendaRouter(controller) {
  const router = Router();

  router.get("/", controller.getAll);
  router.get("/:uca_id", controller.getByUcaId);
  router.post("/", controller.create);
  router.put("/:uca_id", controller.updateByUcaId);
  router.delete("/:uca_id", controller.deleteByUcaId);

  return router;
}
