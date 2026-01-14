import express from "express";
import pool from "../internal/helpers/database.js";

import { AgendaRepository } from "../internal/repositories/agendas/AgendaRepository.js";
import { AgendaService } from "../internal/services/agendas/AgendasService.js";
import { AgendaController } from "../internal/controllers/agendas/AgendasController.js";
import { buildAgendaRouter } from "../internal/routes/agendas/AgendasRoutes.js";

const app = express();
app.use(express.json());

// 🔹 Dependency Injection
const agendaRepo = new AgendaRepository(pool);
const agendaService = new AgendaService(agendaRepo);
const agendaController = new AgendaController(agendaService);

// 🔹 Routes
app.use("/agendas", buildAgendaRouter(agendaController));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

const port = 3001;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
