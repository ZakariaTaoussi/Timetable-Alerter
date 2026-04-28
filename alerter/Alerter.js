import { connect, StringCodec } from "nats";
import { Resend } from "resend";

import "dotenv/config";

const sc = StringCodec();
const resend = new Resend(RESEND_API_KEY);

export async function runAlertsConsumer() {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const js = nc.jetstream();
  const jsm = await nc.jetstreamManager();

  try {
    await jsm.consumers.add("ALERTS", {
      durable_name: "ALERTS_DURABLE",
      ack_policy: "explicit",
      deliver_policy: "all",
    });
    console.log("✅ Consumer ALERTS_DURABLE créé");
  } catch (e) {
    if (e.message.includes("consumer name already in use")) {
      console.log("ℹ️ Consumer ALERTS_DURABLE existe déjà");
    } else {
      throw e;
    }
  }
  const consumer = await js.consumers.get("ALERTS", "ALERTS_DURABLE");
  console.log("✅ ALERTS consumer démarré");

  const messages = await consumer.consume();
  for await (const m of messages) {
    const seq = m.seq;
    console.log("📥 ALERTS reçoit seq =", seq);

    try {
      const payload = JSON.parse(sc.decode(m.data));
      const agendaId = payload.agendaId[0];

      const resp = await fetch(`http://localhost:3001/alerts/by-agenda/${agendaId}`);
      if (!resp.ok) {
        console.warn(` Aucune alerte trouvée pour agendaId=${agendaId}`);
        m.ack();
        continue;
      }

      const alert = await resp.json();

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: alert.userEmail,
        subject: "EDU Middleware - Événement modifié",
        html: `
          <p>Bonjour,</p>
          <p>Un événement de votre agenda a été modifié :</p>
          <ul>
            ${payload.details.map(d => `<li>${d}</li>`).join("")}
          </ul>
          <p>Date : ${new Date(payload.timestamp).toLocaleString("fr-FR")}</p>
        `
      });

      console.log(`✅ Mail envoyé à ${alert.userEmail} pour agenda ${agendaId}`);
      m.ack();

    } catch (e) {
      console.error("❌ erreur seq =", seq, e.message);
      m.ack();
    }
  }
}