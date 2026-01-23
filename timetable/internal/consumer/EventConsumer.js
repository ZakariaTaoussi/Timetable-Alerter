import { connect, consumerOpts } from "nats";

export async function runEventsConsumer({ handleEvent }) {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const js = nc.jetstream();

  const SUBJECT = "EVENTS";
  const DURABLE = "EVENTS_DURABLE";

  const opts = consumerOpts();
  opts.durable(DURABLE);                 // durable
  opts.deliverTo("timetable_events_inbox"); // ✅ obligatoire pour push consumer
  opts.manualAck();                      // ack après traitement
  opts.ackExplicit();                    // ack explicite
  opts.filterSubject(SUBJECT);           // ne lit que EVENTS

const sub = await js.subscribe(SUBJECT, opts);
  console.log("✅ JetStream consumer démarré:", DURABLE);

  for await (const m of sub) {
  const seq = m.info?.streamSequence;
  console.log("📥 EVENTS_DURABLE reçoit seq =", seq);

  try {
    const payload = m.json();
    console.log("📦 payload =", payload);

    await handleEvent(payload);
    m.ack();
    console.log("✅ ack seq =", seq);
  } catch (e) {
    console.error("❌ erreur sur seq =", seq, e.message);
    // pas d'ack → redelivery
  }
}

}
