import { connect } from "nats";

// Fonction pour publier l'alerte dans la queue NATS ALERTS
export async function publishEventChangeAlert(agendaId, details) {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const js = nc.jetstream();

  const message = {
    agendaId: agendaId,
    details: details,
    timestamp: new Date().toISOString(),
  };

  let attempts = 0;
  const maxAttempts = 3; // Nombre de tentatives de réexécution

  while (attempts < maxAttempts) {
    try {
      // Tenter de publier le message
      await js.publish("ALERTS", JSON.stringify(message), { timeout: 5000 });
      console.log(`✅ Alerte envoyée : ${JSON.stringify(message)}`);
      break; // Si l'envoi est réussi, sortir de la boucle
    } catch (error) {
      attempts++;
      console.error(`❌ Erreur lors de l'envoi de l'alerte. Tentative ${attempts}/${maxAttempts}`, error);

      if (attempts === maxAttempts) {
        console.error("❌ Alerte non envoyée après plusieurs tentatives.");
      }
    }
  }

  await nc.drain();
}
