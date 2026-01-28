export function convertISOToMySQLDateTime(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return date.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);
}