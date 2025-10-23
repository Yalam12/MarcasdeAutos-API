# Ejercicio: Marcas → Modelos (FETCH) con Node.js + Express (ivirtual)

**Requisitos cumplidos:**
- Cargar mediante **FETCH**, al abrir la página, una lista desplegable de **marcas de carros**.
- Al seleccionar una **marca**, cargar los **modelos** en otra lista desplegable.
- **Cambiar el color** del selector de modelos dependiendo de la marca (color asignado por marca).
- Usar el **servicio de Node.js y Express** que se encuentra en **ivirtual** para el ejercicio.

## Estructura
```
backend/         # Node.js + Express (puerto 8888)
  ├─ package.json
  ├─ server.js   # /marcas, /modelos?marca=Nombre
  └─ data/
     └─ modelos.txt  # "Marca - Modelo" por línea

frontend/        # Página estática (HTML/CSS/JS)
  ├─ index.html
  ├─ css/styles.css
  └─ js/app.js   # Lógica de fetch y colores por marca
```

## Backend (puede vivir en ivirtual)
1. Ingresa a `backend/`
2. Instala dependencias y arranca:
```bash
npm install
npm start
# Servirá en http://localhost:8888 (o el puerto definido en ivirtual)
```
- Endpoints:
  - `GET /marcas` → texto plano (una marca por línea)
  - `GET /modelos?marca=Toyota` → texto plano, líneas `"Marca - Modelo"` filtradas por marca

> Si ya tienes un servicio **en ivirtual**, asegúrate de que exponga exactamente estas rutas. Si la URL es pública (por ejemplo `https://ivirtual.tu-dominio:8888`), agrégala a `CANDIDATE_BASES` en `frontend/js/app.js`.

## Frontend
1. Abre `frontend/index.html` en un navegador.
2. El script intentará conectarse al backend usando estas bases por defecto:
   - `""` (mismo origen)
   - `http://localhost:8888`
   - `http://127.0.0.1:8888`

Para usar un **ivirtual público**, edita `frontend/js/app.js`:
```js
const CANDIDATE_BASES = [
  '',
  'http://localhost:8888',
  'http://127.0.0.1:8888',
  'https://ivirtual.tu-dominio:8888' // <--- agrega tu URL
];
```

## Datos de ejemplo
Edita `backend/data/modelos.txt` para agregar/ajustar marcas y modelos:
```
Toyota - Corolla
Honda - Civic
Ford - Focus
...
```

¡Listo! La página cargará las **marcas** al abrir (FETCH → `/marcas`), y al elegir una marca, cargará sus **modelos** (FETCH → `/modelos?marca=...`) y **pintará** el selector según la marca elegida.
