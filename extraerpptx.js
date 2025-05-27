// extraerpptx.js - Versión robusta con validación de archivos

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

let totalPptx = 0;
let totalImagenes = 0;

const carpetaBase = path.join(__dirname, 'fotos');
const carpetaDestino = path.join(__dirname, 'imagenes_extraidas_pptx');

// Crear carpeta destino si no existe
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino);
}

// Función para validar que el archivo sea ZIP (cabecera de .pptx)
function esZipValido(rutaArchivo) {
  try {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(rutaArchivo, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return buffer.toString('hex') === '504b0304';
  } catch (err) {
    console.error(`❌ Error leyendo la cabecera de ${rutaArchivo}: ${err.message}`);
    return false;
  }
}

// Recorre las carpetas internas tipo fotos/0479/0479
fs.readdirSync(carpetaBase).forEach(folder => {
  const rutaIntermedia = path.join(carpetaBase, folder);
  const subcarpeta = path.join(rutaIntermedia, folder);

  if (fs.existsSync(subcarpeta) && fs.statSync(subcarpeta).isDirectory()) {
    const archivos = fs.readdirSync(subcarpeta)
      .filter(archivo => {
        const ext = path.extname(archivo).toLowerCase();
        if (ext === '.pptx') return true;
        if (ext === '.ppt') {
          console.log(`⚠️ Archivo no compatible para extracción directa: ${archivo}`);
          return false;
        }
        return false;
      });

    archivos.forEach(pptx => {
      const rutaPptx = path.join(subcarpeta, pptx);

      if (!esZipValido(rutaPptx)) {
        console.warn(`⚠️ Archivo corrupto o no es un .pptx válido: ${pptx}`);
        return;
      }

      let contador = 1;
      totalPptx++;

      const picpptxFolder = path.join(subcarpeta, 'picpptx');
      if (!fs.existsSync(picpptxFolder)) {
        fs.mkdirSync(picpptxFolder);
      }

      const stream = fs.createReadStream(rutaPptx);
      const unzip = unzipper.Parse();

      stream
        .on('error', err => {
          console.error(`❌ Error abriendo archivo: ${pptx} → ${err.message}`);
        })
        .pipe(unzip)
        .on('error', err => {
          console.error(`❌ Error descomprimiendo archivo: ${pptx} → ${err.message}`);
        })
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