import express from "express";
import cors from "cors";
import { runEventsConsumer } from "../internal/consumer/EventConsumer.js";
import pool from "../internal/helpers/database.js";
import { EventsRepository } from "../internal/repositories/EventRepository.js";
import { EventsService } from "../internal/services/EventService.js";
import { EventsController } from "../internal/controllers/EventController.js";
import { buildEventsRouter } from "../internal/routes/EventRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // garde ça uniquement si tu utilises cookies/sessions
}));

app.use(express.json());

const eventsRepo = new EventsRepository(pool);
const eventsService = new EventsService(eventsRepo);
const eventsController = new EventsController(eventsService);

app.use("/events", buildEventsRouter(eventsController));
app.get("/health", (req, res) => res.json({ ok: true }));

const port = 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
runEventsConsumer({
  handleEvent: async (payload) => {
    console.log("handleEvent:", payload);
  }
});