const fs = require('fs');
const path = require('path');

const carpetaBase = path.join(__dirname, 'fotos');
const carpetaDestino = path.join(__dirname, 'imagenes_renombradas');
const extensiones = ['.jpg', '.jpeg', '.png'];
let totalRenombradas = 0;

// Crear la carpeta destino si no existe
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino);
}

fs.readdirSync(carpetaBase).forEach(folder => {
  const rutaIntermedia = path.join(carpetaBase, folder);
  if (fs.statSync(rutaIntermedia).isDirectory()) {
    const subcarpeta = path.join(rutaIntermedia, folder); // fotos/0479/0479
    if (fs.existsSync(subcarpeta) && fs.statSync(subcarpeta).isDirectory()) {
      const archivos = fs.readdirSync(subcarpeta)
        .filter(nombreArchivo => {
          const ext = path.extname(nombreArchivo).toLowerCase();
          return extensiones.includes(ext);
        });

      archivos.forEach((archivo, index) => {
        const extension = path.extname(archivo);
        const nuevoNombre = index === 0
          ? `${folder}${extension}`
          : `${folder}(${index + 1})${extension}`;

        const rutaActual = path.join(subcarpeta, archivo);
        const rutaRenombrada = path.join(subcarpeta, nuevoNombre);
        const rutaDestino = path.join(carpetaDestino, nuevoNombre);

        // Renombrar dentro de la carpeta original
        if (!fs.existsSync(rutaRenombrada)) {
          fs.renameSync(rutaActual, rutaRenombrada);
          totalRenombradas++;
          console.log(`✅ Renombrado: ${archivo} → ${nuevoNombre}`);
        }

        // Copiar a carpeta allpictures
        if (!fs.existsSync(rutaDestino)) {
          fs.copyFileSync(rutaRenombrada, rutaDestino);
          console.log(`✅ Copiado: ${nuevoNombre}`);
        } else {
          console.log(`⚠️ Ya existe: ${nuevoNombre}, se omitió`);
        }
      });
    }
  }
});

console.log(`✅ Proceso completo: ${totalRenombradas} imágenes renombradas y copiadas.`);