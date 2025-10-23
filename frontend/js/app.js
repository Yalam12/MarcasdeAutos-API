// Bases del backend (agrega tu ivirtual público si aplica)
const CANDIDATE_BASES = [
  '',
  'http://localhost:8888',
  'http://127.0.0.1:8888'
  // 'https://ivirtual.tu-dominio:8888'
];

// Colores por marca
const BRAND_COLORS = {
  'Toyota':'#ef4444',
  'Honda':'#3b82f6',
  'Ford':'#1d4ed8',
  'Chevrolet':'#f59e0b',
  'Nissan':'#dc2626',
  'BMW':'#22d3ee',
  'Audi':'#9ca3af',
  'Mercedes-Benz':'#64748b',
  'Hyundai':'#0ea5e9',
  'Kia':'#f43f5e'
};

const $marca  = document.getElementById('marca');
const $modelo = document.getElementById('modelo');
const $estado = document.getElementById('estado');

let BASE_URL = '';

async function tryFetch(urls, path) {
  for (const base of urls) {
    try {
      const res = await fetch(base + path, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      BASE_URL = base;
      return await res.text();
    } catch {}
  }
  throw new Error('No se pudo contactar al backend');
}

function parsePlainList(text){
  return text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
}

function hexToRgba(hex, a=1){
  const h = hex.replace('#','');
  const v = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h,16);
  const r=(v>>16)&255, g=(v>>8)&255, b=v&255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* === Tema de color unificado para ambos selects === */
function applyBrandTheme(brand){
  const color = BRAND_COLORS[brand] || '#334155';
  const root = document.documentElement;
  root.style.setProperty('--brand', color);
  root.style.setProperty('--brand-tint', hexToRgba(color, .13));
  root.style.setProperty('--brand-ring', hexToRgba(color, .22));
  $marca.classList.add('themed');
  $modelo.classList.add('themed');
}

function clearBrandTheme(){
  const root = document.documentElement;
  root.style.removeProperty('--brand');
  root.style.removeProperty('--brand-tint');
  root.style.removeProperty('--brand-ring');
  $marca.classList.remove('themed');
  $modelo.classList.remove('themed');
}

/* === Marcas al abrir la página === */
async function cargarMarcas(){
  $estado.innerHTML = '<span class="status"><span class="dot"></span> Backend</span> consultando <span class="kbd">/marcas</span>…';
  try{
    const texto = await tryFetch(CANDIDATE_BASES, '/marcas');
    const marcas = parsePlainList(texto);

    $marca.innerHTML = '<option value="">— Selecciona una marca —</option>' +
      marcas.map(m=>`<option value="${m}">${m}</option>`).join('');
    $marca.disabled = false;

    $estado.innerHTML = '<span class="status"><span class="dot"></span> Backend</span> listo ✓ ' + (BASE_URL || 'mismo origen');
  }catch(err){
    $marca.innerHTML = '<option>Error al cargar marcas</option>';
    $estado.innerHTML = '⚠️ No fue posible contactar el backend. Revisa puerto 8888 o CANDIDATE_BASES.';
    console.error(err);
  }
}

/* === Modelos por marca + cambio de color === */
async function cargarModelos(brand){
  if(!brand){
    $modelo.innerHTML = '<option>Selecciona una marca primero…</option>';
    $modelo.disabled = true;
    clearBrandTheme();
    return;
  }

  applyBrandTheme(brand);
  $modelo.disabled = true;
  $modelo.innerHTML = '<option>Cargando modelos…</option>';

  try{
    const texto = await tryFetch(
      [BASE_URL, ...CANDIDATE_BASES.filter(b=>b!==BASE_URL)],
      '/modelos?marca=' + encodeURIComponent(brand)
    );

    // El backend devuelve líneas "Marca - Modelo"; nos quedamos con el modelo
    const modelos = parsePlainList(texto).map(linea=>{
      const idx = linea.indexOf(' - ');
      return idx>0 ? linea.slice(idx+3) : linea;
    });

    if(modelos.length===0){
      $modelo.innerHTML = '<option>No hay modelos disponibles</option>';
      $modelo.disabled = true;
    }else{
      $modelo.innerHTML = '<option value="">— Selecciona un modelo —</option>' +
        modelos.map(m=>`<option value="${m}">${m}</option>`).join('');
      $modelo.disabled = false;
    }
  }catch(err){
    $modelo.innerHTML = '<option>Error al cargar modelos</option>';
    $modelo.disabled = true;
    console.error(err);
  }
}

/* Eventos */
$marca.addEventListener('change', e=>cargarModelos(e.target.value));

/* Arranque */
cargarMarcas();
