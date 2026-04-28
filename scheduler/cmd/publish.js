import { connect, StringCodec } from "nats";

const sc = StringCodec();
const nc = await connect({ servers: "nats://localhost:4222" });

const event = {
  uid: "ADE60323032352d323032362d5543412d34313837392d302d33",
  name: "CM Big Data Infrastructure",
  description: "MASTER 1 INFO\nM1 IA S2\nTOUMANI FAROUK",
  start: "2026-02-02T12:30:00Z",
  end: "2026-02-02T15:30:00Z",
  location: "G Amphi 3",
  lastUpdate: "2026-01-06T11:10:00Z"
};

const payload = JSON.stringify(event);
console.log("📤 Publishing:", payload);

nc.publish("EVENTS", sc.encode(payload));
await nc.flush();
await nc.close();
console.log("✅ Done");