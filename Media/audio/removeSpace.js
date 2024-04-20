const fs = require('fs');
const path = require('path');

// Leggi la directory corrente
fs.readdir('.', (err, files) => {
    if (err) {
        console.error('Errore durante la lettura della directory:', err);
        return;
    }

    // Filtra solo i file JPG
    const mp3files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

    // Rinomina ciascun file JPG sostituendo gli spazi bianchi con underscore
    mp3files.forEach(mp3File => {
        const parts = mp3File. split(' - ');
        const title = parts[1].replaceAll(' ', '_');
        const newTitle = `${parts[0]} - ${title}`;
        fs.rename(mp3File, newTitle, (err) => {
            if (err) {
                console.error('Errore durante la rinomina del file:', err);
                return;
            }
            console.log(`Il file ${mp3File} è stato rinominato in ${newTitle}.`);
        });
    });
});
