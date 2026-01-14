// src/icalParser.js

// 1) Unfold : recolle les lignes qui commencent par " " ou "\t"
function unfoldIcalLines(icsText) {
  // iCal utilise CRLF souvent, mais parfois LF -> on normalise
  const rawLines = icsText.replace(/\r\n/g, "\n").split("\n");

  const lines = [];
  for (const line of rawLines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      // continuation de la ligne précédente
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

// 2) Parse date iCal "YYYYMMDDTHHMMSSZ" -> ISO string
function parseIcalDateToIso(s) {
  // exemples: 20260114T123000Z
  // on garde simple : si format inattendu, on retourne null
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(s);
  if (!m) return null;
  const [, Y, M, D, h, min, sec] = m;
  return new Date(`${Y}-${M}-${D}T${h}:${min}:${sec}Z`).toISOString();
}

function unescapeIcalText(v) {
  // iCalendar escape: \n, \N, \, \; (classique)
  return String(v || "")
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .trim();
}

export function parseIcalEvents(icsText) {
  const lines = unfoldIcalLines(icsText);

  const events = [];
  let inEvent = false;
  let current = {};

  for (const line of lines) {
    if (!inEvent) {
      if (line === "BEGIN:VEVENT") {
        inEvent = true;
        current = {};
      }
      continue;
    }

    if (line === "END:VEVENT") {
      // pousser l'event brut
      events.push(current);
      inEvent = false;
      current = {};
      continue;
    }

    // ligne "KEY:VALUE" (parfois KEY;PARAM=...:VALUE)
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const left = line.slice(0, idx);  // ex: DTSTART ou DTSTART;TZID=...
    const value = line.slice(idx + 1);

    const key = left.split(";")[0]; // on ignore les paramètres pour l’instant
    current[key] = value;
  }

  // mapper vers un objet propre
  return events.map((e) => ({
    uid: e["UID"] || null,
    name: unescapeIcalText(e["SUMMARY"]),
    start: parseIcalDateToIso(e["DTSTART"]),
    end: parseIcalDateToIso(e["DTEND"]),
    location: unescapeIcalText(e["LOCATION"]),
    description: unescapeIcalText(e["DESCRIPTION"]),
    lastUpdate: parseIcalDateToIso(e["LAST-MODIFIED"]) || parseIcalDateToIso(e["DTSTAMP"]),
    sequence: e["SEQUENCE"] ? Number(e["SEQUENCE"]) : null
  }));
}
