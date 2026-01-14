import { connect, StringCodec } from "nats";

let NatsConnection;
const sc = StringCodec();

export async function connectNats() {
  NatsConnection = await connect({ servers: "nats://localhost:4222" });
  console.log("✅ Connected to NATS");
}

// ✅ AJOUT: publish dans le sujet "EVENTS"
export function publishEventToNats(eventObj) {
  if (!NatsConnection) {
    throw new Error("NATS not connected. Call connectNats() first.");
  }

  const subject = "EVENTS"; // ta queue
  const payload = JSON.stringify(eventObj);

  NatsConnection.publish(subject, sc.encode(payload));
}
