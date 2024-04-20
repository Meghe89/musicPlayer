const fs = require('fs');
const path = require('path');

// Leggi la directory corrente
fs.readdir('.', (err, files) => {
    if (err) {
        console.error('Errore durante la lettura della directory:', err);
        return;
    }

    // Filtra solo i file JPG
    const jpgFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg');

    // Rinomina ciascun file JPG sostituendo gli spazi bianchi con underscore
    jpgFiles.forEach(jpgFile => {
        const newFileName = jpgFile.replace(/\s+/g, '_');
        fs.rename(jpgFile, newFileName, (err) => {
            if (err) {
                console.error('Errore durante la rinomina del file:', err);
                return;
            }
            console.log(`Il file ${jpgFile} è stato rinominato in ${newFileName}.`);
        });
    });
});
