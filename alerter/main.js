import { connect } from "nats";
import { runAlertsConsumer } from "./Alerter.js";

async function main() {
  // 1) Créer le stream ALERTS si il n'existe pas
  const nc = await connect({ servers: "nats://localhost:4222" });
  const jsm = await nc.jetstreamManager();

  try {
    await jsm.streams.add({
      name: "ALERTS",
      subjects: ["ALERTS"],
      storage: "file",
      retention: "limits",
    });
    console.log("✅ Stream ALERTS créé");
  } catch (e) {
    if (e.message.includes("stream name already in use")) {
      console.log("ℹ️ Stream ALERTS existe déjà");
    } else {
      throw e;
    }
  }

  await nc.close();

  // 2) Démarrer le consumer
  await runAlertsConsumer();
}

main().catch((e) => console.error("Fatal:", e.message));