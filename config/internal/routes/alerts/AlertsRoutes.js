import { Router } from "express";

export function buildAlertsRouter(controller) {
  const router = Router();

  router.get("/", controller.getAll);        // GET /alerts
  router.get("/:id", controller.getById);    // GET /alerts/:id
  router.post("/", controller.create);       // POST /alerts
  router.put("/:id", controller.update);     // PUT /alerts/:id
  router.delete("/:id", controller.remove);  // DELETE /alerts/:id

  return router;
}
