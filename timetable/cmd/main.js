import express from "express";

import pool from "../internal/helpers/database.js";
import { EventsRepository } from "../internal/repositories/EventRepository.js";
import { EventsService } from "../internal/services/EventService.js";
import { EventsController } from "../internal/controllers/EventController.js";
import { buildEventsRouter } from "../internal/routes/EventRoutes.js";

const app = express();
app.use(express.json());

// DI simple
const eventsRepo = new EventsRepository(pool);
const eventsService = new EventsService(eventsRepo);
const eventsController = new EventsController(eventsService);

// Routes
app.use("/events", buildEventsRouter(eventsController));

app.get("/health", (req, res) => res.json({ ok: true }));

const port = 3000
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
