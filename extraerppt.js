let totalPptx = 0;
let totalImagenes = 0;
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

const carpetaBase = path.join(__dirname, 'fotos');
const carpetaDestino = path.join(__dirname, 'allpicturespptx');

// Crear carpeta destino si no existe
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino);
}

// Recorre las carpetas internas tipo fotos/0479/0479
fs.readdirSync(carpetaBase).forEach(folder => {
  const rutaIntermedia = path.join(carpetaBase, folder);
  const subcarpeta = path.join(rutaIntermedia, folder);
  if (fs.existsSync(subcarpeta) && fs.statSync(subcarpeta).isDirectory()) {
    const archivos = fs.readdirSync(subcarpeta)
      .filter(archivo => ['.ppt', '.pptx'].includes(path.extname(archivo).toLowerCase()));

    archivos.forEach((pptx, index) => {
      const rutaPptx = path.join(subcarpeta, pptx);
      let contador = 1;

      totalPptx++;

      const picpptxFolder = path.join(subcarpeta, 'picpptx');
      if (!fs.existsSync(picpptxFolder)) {
        fs.mkdirSync(picpptxFolder);
      }

      fs.createReadStream(rutaPptx)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
          const fileName = entry.path;
          const type = entry.type;

          if (fileName.startsWith('ppt/media/') && type === 'File') {
            const ext = path.extname(fileName);
            const nuevoNombre = contador === 1
              ? `${folder}${ext}`
              : `${folder}(${contador})${ext}`;
            contador++;
            totalImagenes++;

            const outputRutaLocal = path.join(picpptxFolder, nuevoNombre);
            const outputRutaGlobal = path.join(carpetaDestino, nuevoNombre);

            entry.pipe(fs.createWriteStream(outputRutaLocal));
            entry.pipe(fs.createWriteStream(outputRutaGlobal));
          } else {
            entry.autodrain();
          }
        })
        .on('close', () => {
          console.log(`📂 ${pptx} → ${contador - 1} imagen(es) extraída(s).`);
        });
    });
  }
});

setTimeout(() => {
  console.log(`\n✅ Total de presentaciones procesadas: ${totalPptx}`);
  console.log(`🖼️  Total de imágenes extraídas: ${totalImagenes}`);
}, 2000);