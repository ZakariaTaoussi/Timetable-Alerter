export async function fetchUcaIcal({ ucaIds, nbWeeks = 1 }) {
  if (!Array.isArray(ucaIds) || ucaIds.length === 0) {
    throw new Error("ucaIds is empty");
  }

  const resources = ucaIds.join(",");

  const baseUrl =
    "https://edt.uca.fr/jsp/custom/modules/plannings/anonymous_cal.jsp";

  const params = new URLSearchParams({
    resources,
    projectId: "3",
    calType: "ical",
    nbWeeks: String(nbWeeks),
    displayConfigId: "128",
  });

  const url = `${baseUrl}?${params.toString()}`;

  // timeout simple
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const resp = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "text/calendar,text/plain,*/*" },
    });

    if (!resp.ok) {
      const preview = (await resp.text()).slice(0, 300);
      throw new Error(`UCA iCal HTTP ${resp.status}. Preview: ${preview}`);
    }

    const icsText = await resp.text();
    return { url, resources, icsText };
  } finally {
    clearTimeout(timeout);
  }
}
