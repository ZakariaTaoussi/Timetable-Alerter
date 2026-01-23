import { connectNats } from "./nats.js";
import { startScheduler } from "./scheduler.js";

async function main() {
  await connectNats();

  startScheduler({ everyMs: 200_000, nbWeeks: 1 });
}

main().catch((e) => console.error("Fatal:", e.message));
