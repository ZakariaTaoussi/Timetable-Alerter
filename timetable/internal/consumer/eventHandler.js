// eventHandler.js
import  pool from "../helpers/database.js";
import { convertISOToMySQLDateTime } from "./dateUtils.js";

// Fonction pour traiter un événement
export async function handleEvent(payload) {
  let { uid, location, start, end } = payload;
  console.log("Données reçues:", payload);

  try {
    // Vérification de l'existence de l'événement dans la base de données
    const [rows] = await pool.execute(
      'SELECT AgendaIDs, UID, Description, Name, Start, End, Location, LastUpdate FROM timetable.events WHERE UID = ? LIMIT 1',
      [uid]
    );
    
    if (rows && rows.length > 0) {
      const existingEvent = rows[0];

      // Conversion des dates pour la comparaison
      const newStart = convertISOToMySQLDateTime(start);
      const newEnd = convertISOToMySQLDateTime(end);

      // Formater les dates existantes en format MySQL pour la comparaison
      const existingStart = existingEvent.Start.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);
      const existingEnd = existingEvent.End.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);

      // Vérification des changements
      const changeLocation = existingEvent.Location !== location;
      const changeStart = existingStart !== newStart;
      const changeEnd = existingEnd !== newEnd;

      if (changeLocation || changeStart || changeEnd) {
        console.log(`✏️ Changement détecté pour l'événement ${uid}`);

        // Mise à jour des données dans la base de données
        let updates = [];
        let params = [];

        if (changeLocation) {
          updates.push('Location = ?');
          params.push(location);
        }
        if (changeStart) {
          updates.push('Start = ?');
          params.push(newStart);
        }
        if (changeEnd) {
          updates.push('End = ?');
          params.push(newEnd);
        }

        params.push(uid); // Ajouter l'UID à la fin pour la clause WHERE

        const sql = `UPDATE timetable.events SET ${updates.join(', ')} WHERE UID = ?`;
        await pool.execute(sql, params);
        console.log(`✅ Événement ${uid} mis à jour avec succès`);

        // Créer l'alerte à envoyer
        const alert = {
          agendaId: existingEvent.AgendaIDs, // Liste des AgendaIDs associés à cet événement
          details: [
            changeLocation ? `Location: ${existingEvent.Location} → ${location}` : null,
            changeStart ? `Start: ${existingStart} → ${newStart}` : null,
            changeEnd ? `End: ${existingEnd} → ${newEnd}` : null,
          ].filter(Boolean), // Filtre les changements null
          timestamp: new Date().toISOString(), // Horodatage de l'alerte
        };

        return alert; // Retourne l'alerte pour publication
      } else {
        console.log(`✅ Aucun changement pour l'événement ${uid}`);
      }
    } else {
      console.log(`❌ L'événement avec l'UID "${uid}" n'existe pas dans la base de données.`);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération ou de la mise à jour de l'événement:", error);
  }
}
