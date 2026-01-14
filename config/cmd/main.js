import express from "express";
import pool from "../internal/helpers/database.js";

import { AgendaRepository } from "../internal/repositories/agendas/AgendaRepository.js";
import { AgendaService } from "../internal/services/agendas/AgendasService.js";
import { AgendaController } from "../internal/controllers/agendas/AgendasController.js";
import { buildAgendaRouter } from "../internal/routes/agendas/AgendasRoutes.js";
import { AlertsRepository } from "../internal/repositories/alerts/AlertsRepository.js";
import { AlertsService } from "../internal/services/alerts/AlertsService.js";
import { AlertsController } from "../internal/controllers/alerts/AlertsController.js";
import { buildAlertsRouter } from "../internal/routes/alerts/AlertsRoutes.js";
const app = express();
app.use(express.json());

// 🔹 Dependency Injection
const agendaRepo = new AgendaRepository(pool);
const agendaService = new AgendaService(agendaRepo);
const agendaController = new AgendaController(agendaService);
const alertsRepo = new AlertsRepository(pool);
const alertsService = new AlertsService(alertsRepo);
const alertsController = new AlertsController(alertsService);
// 🔹 Routes
app.use("/agendas", buildAgendaRouter(agendaController));
app.use("/alerts", buildAlertsRouter(alertsController));

const port = 3001;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
