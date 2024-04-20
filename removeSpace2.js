const fs = require('fs');

// Leggi il contenuto del file JSON
fs.readFile('./tracks.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Errore nella lettura del file:', err);
    return;
  }
  
  try {
    // Parsifica il contenuto JSON in un array di oggetti
    let musicFiles = JSON.parse(data);
    
    // Funzione per sostituire gli spazi con _ solo nel titolo del brano dopo il trattino (-)
    function replaceSpacesInFileName(files) {
      files.forEach(file => {
        if (file.url) {
            const parts = file.url.split('-');
            const title = parts[1].replaceAll(' ', '_');
            //console.log(`${parts[0]}-${title.replace('_', ' ')}`)
            file.url = `${parts[0]}-${title.replace('_', ' ')}`;
        }
      });
    }

    // Chiama la funzione passando l'array di file
    replaceSpacesInFileName(musicFiles);

    // Sovrascrivi il contenuto del file JSON con l'array modificato
    fs.writeFile('./tracks.json', JSON.stringify(musicFiles, null, 2), err => {
      if (err) {
        console.error('Errore durante la scrittura del file:', err);
        return;
      }
      console.log('Le modifiche sono state apportate con successo!');
    });
  } catch (error) {
    console.error('Errore durante il parsing del file JSON:', error);
  }
});
