const fs = require('fs');

// Leggi il contenuto del file tracks.json
fs.readFile('tracks.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Errore durante la lettura del file:', err);
        return;
    }

    try {
        // Converti il contenuto del file JSON in un array di oggetti
        const tracks = JSON.parse(data);
        
        // Itera attraverso ogni traccia e aggiorna il nome della copertina
        tracks.forEach(track => {
            // Sostituisci gli spazi bianchi con underscore nei nomi delle cover
            track.cover = track.cover.replace(/\s+/g, '_');
        });
        
        // Converti l'array di oggetti aggiornato in formato JSON
        const updatedData = JSON.stringify(tracks, null, 2);

        // Sovrascrivi il file tracks.json con i dati aggiornati
        fs.writeFile('tracks.json', updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Errore durante la scrittura del file:', err);
                return;
            }
            console.log('Nomi delle cover aggiornati con successo.');
        });
    } catch (error) {
        console.error('Errore durante il parsing del file JSON:', error);
    }
});
