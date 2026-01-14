import { getAgendaUcaIds } from "./configApi.js";
import { fetchUcaIcal } from "./ical.js";
import { parseIcalEvents } from "./icalParser.js";
import { publishEventToNats } from "./nats.js";

let isRunning = false;

export function startScheduler({ everyMs , nbWeeks } = {}) {
  async function runOnce() {
    if (isRunning) return; // évite 2 runs en même temps
    isRunning = true;

    try {
      // 1) récupérer uca_id depuis Config API
      const ucaIds = await getAgendaUcaIds();

      // 2) récupérer le iCal depuis UCA
      const { icsText, resources } = await fetchUcaIcal({ ucaIds, nbWeeks });

      // 3) parser les events
      const events = parseIcalEvents(icsText);

      console.log(`[SCHEDULER] events=${events.length} resources=${resources}`);

      // 4) publier dans NATS (1 message par event)
      for (const ev of events) {
        publishEventToNats({
          ...ev,
          agendaResources: resources, // optionnel (utile debug)
        });
      }

      console.log(`[SCHEDULER] published=${events.length}`);
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("[SCHEDULER] Timeout UCA (15s)");
      } else {
        console.error("[SCHEDULER] Error:", e.message);
      }
    } finally {
      isRunning = false;
    }
  }

  // run immédiat + run régulier
  runOnce();
  setInterval(runOnce, everyMs);

  console.log(`[SCHEDULER] started every ${Math.round(everyMs / 1000)}s`);
}
