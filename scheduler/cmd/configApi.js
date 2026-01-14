export async function getAgendaUcaIds() {
  const url = "http://localhost:3001/agendas";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Config API error ${response.status}`);
  }

  const agendas = await response.json();

  const ucaIds = agendas
    .map((a) => a.uca_id)
    .filter((id) => Number.isInteger(id));

  // enlever doublons (au cas où)
  return [...new Set(ucaIds)];
}
