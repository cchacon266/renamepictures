const fs = require('fs');
const path = require('path');

const carpetaOrigen = path.join(__dirname, 'pptx'); // Cambia si tus archivos están en otra carpeta
const carpetaDestinoBase = path.join(__dirname, 'organizarpptx');

fs.readdirSync(carpetaOrigen).forEach(archivo => {
  if (['.ppt', '.pptx'].includes(path.extname(archivo).toLowerCase())) {
    const match = archivo.match(/TOOL\s*(\d{3,5})/i); // busca TOOL 1047, TOOL 1052, etc.
    if (match) {
      const toolNumber = match[1];
      const carpetaTool = path.join(carpetaDestinoBase, toolNumber, toolNumber);

      // Crear estructura /fotos/1047/1047/
      fs.mkdirSync(carpetaTool, { recursive: true });

      const origen = path.join(carpetaOrigen, archivo);
      const destino = path.join(carpetaTool, archivo);

      fs.renameSync(origen, destino);
      console.log(`✅ ${archivo} → ${toolNumber}/${toolNumber}/`);
    } else {
      console.log(`⚠️ No se encontró número de TOOL en: ${archivo}`);
    }
  }
});