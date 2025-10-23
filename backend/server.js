import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(morgan('dev'));

// Datos base: archivo de texto con líneas "Marca - Modelo"
const dataPath = path.join(__dirname, 'data', 'modelos.txt');

function cargarLineas() {
  try {
    const txt = fs.readFileSync(dataPath, 'utf-8');
    return txt.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  } catch (e) {
    console.error('No se pudo leer modelos.txt:', e.message);
    return [];
  }
}

function obtenerMarca(linea) {
  const idx = linea.indexOf(' - ');
  return idx > 0 ? linea.slice(0, idx) : linea;
}

function obtenerModelo(linea) {
  const idx = linea.indexOf(' - ');
  return idx > 0 ? linea.slice(idx + 3) : linea;
}

// GET /marcas -> texto plano, una marca por línea
app.get('/marcas', (req, res) => {
  const lineas = cargarLineas();
  const marcas = Array.from(new Set(lineas.map(obtenerMarca))).sort((a,b)=>a.localeCompare(b));
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(marcas.join('\n'));
});

// GET /modelos?marca=Toyota -> texto plano, una línea por modelo ("Marca - Modelo")
app.get('/modelos', (req, res) => {
  const marca = (req.query.marca || '').trim();
  if (!marca) {
    res.status(400).send('Falta query param: marca');
    return;
  }
  const lineas = cargarLineas();
  const filtradas = lineas.filter(linea => obtenerMarca(linea).toLowerCase() === marca.toLowerCase());
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(filtradas.join('\n'));
});

app.get('/', (req, res) => {
  res.type('text/plain').send('OK - Backend de Marcas de Autos. Endpoints: /marcas, /modelos?marca=Toyota');
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
