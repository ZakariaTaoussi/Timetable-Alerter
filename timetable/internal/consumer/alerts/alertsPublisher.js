// internal/alerts/alertsPublisher.js
import { StringCodec } from "nats";

// Utilisation de StringCodec pour encoder les données
const sc = StringCodec();

export function createAlertsPublisher(nc) {
  return {
    // Méthode pour publier une alerte sur NATS
    publishAlert(alert) {
      const payload = sc.encode(JSON.stringify(alert)); // Sérialisation de l'alerte
      nc.publish("ALERTS", payload); // Publication dans la queue ALERTS
      console.log("✅ Alerte envoyée:", alert);
    },
  };
}
