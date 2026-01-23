import { connect } from "nats";

export async function ensureEventsStream() {
  const nc = await connect({ servers: "nats://localhost:4222" });

  const jsm = await nc.jetstreamManager();

  const STREAM_NAME = "EVENTS_STREAM";

  try {
    // Vérifier si le stream existe déjà
    await jsm.streams.info(STREAM_NAME);
    console.log("✅ JetStream EVENTS_STREAM already exists");
  } catch {
    // Sinon, on le crée
    await jsm.streams.add({
      deliver_policy: "new",
      name: STREAM_NAME,
      subjects: ["EVENTS"], // 👈 capte TOUT ce qui est publié sur EVENTS
      storage: "file",      // persistant sur disque
      retention: "limits",
      max_msgs: -1,         // illimité
      max_age: 7 * 24 * 60 * 60 * 1_000_000_000 // 7 jours (en nanosecondes)
    });

    console.log("✅ JetStream EVENTS_STREAM created");
  }

  await nc.drain();
}
