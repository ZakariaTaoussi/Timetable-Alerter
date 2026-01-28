// eventConsumer.js
import { connect, consumerOpts } from "nats";
import { handleEvent } from "./eventHandler.js";  // Importer handleEvent
import { createAlertsPublisher } from "../consumer/alerts/alertsPublisher.js";  // Importer le publisher d'alertes

export async function runEventsConsumer() {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const alertsPublisher = createAlertsPublisher(nc); // Création du publisher pour envoyer des alertes

  const js = nc.jetstream();
  const opts = consumerOpts().durable("EVENTS_DURABLE").manualAck().ackExplicit();
  const sub = await js.subscribe("EVENTS", opts);

  console.log("✅ JetStream consumer démarré: EVENTS_DURABLE");

  for await (const m of sub) {
    const seq = m.info?.streamSequence;
    console.log("📥 EVENTS_DURABLE reçoit seq =", seq);

    try {
      const payload = m.json();

      // Si payload est un tableau, traiter chaque événement
      if (Array.isArray(payload)) {
        for (let event of payload) {
          const alert = await handleEvent(event);  // Traiter chaque événement et récupérer l'alerte
          if (alert) {
            await alertsPublisher.publishAlert(alert); // Publier l'alerte si un changement a été détecté
          }
        }
      } else {
        const alert = await handleEvent(payload);  // Traiter un seul événement
        if (alert) {
          await alertsPublisher.publishAlert(alert); // Publier l'alerte
        }
      }

      m.ack(); // Accuser la réception du message
      console.log("✅ ack seq =", seq);
    } catch (e) {
      console.error("❌ erreur sur seq =", seq, e.message);
    }
  }
}
