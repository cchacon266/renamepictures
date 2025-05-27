


# 📸 Rename-pic

Este repositorio contiene scripts en Node.js para organizar, renombrar y extraer imágenes desde carpetas estructuradas y archivos PowerPoint.

## Scripts disponibles

---

### 🖼️ 1. renombrarfotos.js

Renombra todas las imágenes dentro de subcarpetas con el nombre de la carpeta contenedora. Luego, copia las imágenes renombradas en una carpeta global llamada `imagenes_renombradas`.

**Uso:**
```bash o cmd
node renombrarfotos.js
```
Archivos de entrada deben estar en la carpeta `fotos/`.

Estructura esperada: `fotos/1047/1047/imagen.jpg` → `1047.jpg`, `1047(2).jpg`, etc.

---

### 📂 2. organizarpptx.js

Busca archivos `.pptx` o `.ppt` y crea una estructura de carpetas usando el número de TOOL en el nombre del archivo (por ejemplo: `TOOL 1047` → `1047/1047/archivo.pptx`).

**Uso:**
```bash o cmd
node organizarpptx.js
```

Archivos de entrada deben estar en la carpeta `archivos/`.

---

### 📸 3. extraerpptx.js

Extrae las imágenes incrustadas en archivos `.pptx` (no `.ppt`) y las guarda en dos lugares:
- En una subcarpeta `picpptx` dentro de su carpeta.
- En una carpeta global `imagenes_extraidas_pptx`.

**Uso:**
```bash o cmd
node extraerpptx.js
```

También muestra en consola el total de imágenes extraídas y los archivos procesados.