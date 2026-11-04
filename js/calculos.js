/* =========================================================
   CÁLCULOS
   Funciones "puras": reciben datos y devuelven un resultado,
   sin tocar la página.
   ========================================================= */

function buscarPorId(lista, id) {
  return lista.find((elemento) => elemento.id === id);
}

// Datos de una unidad para una doctrina y nivel (o null si no los tenemos)
function obtenerDatos(idUnidad, idDoctrina, nivel) {
  const unidad = buscarPorId(UNIDADES, idUnidad);
  const porDoctrina = unidad.datos[idDoctrina];
  if (!porDoctrina || !porDoctrina[nivel]) return null;
  return porDoctrina[nivel];
}

// Niveles con datos para esa unidad y doctrina, ordenados: [1, 2, 3...]
function nivelesDisponibles(idUnidad, idDoctrina) {
  const unidad = buscarPorId(UNIDADES, idUnidad);
  const porDoctrina = unidad.datos[idDoctrina];
  if (!porDoctrina) return [];
  return Object.keys(porDoctrina).map(Number).sort((a, b) => a - b);
}

// "noBlindado" → "No blindado"
function nombreTipo(clave) {
  const tipo = TIPOS.find((t) => t.clave === clave);
  return tipo ? tipo.etiqueta : clave;
}

// Máximo de unidades de un stack que infligen daño (regla del juego)
const MAX_UNIDADES_DANO = 10;

// Suma los "n" valores más altos de una lista: [5, 9, 2, 7], 2 → 9 + 7 = 16
function sumarMejores(valores, n) {
  return [...valores].sort((a, b) => b - a).slice(0, n).reduce((a, b) => a + b, 0);
}

/*
  En el mar, las unidades de tierra (y las aéreas si se trasladan por mar)
  viajan como Barco de transporte. Devuelve qué datos usar para combatir:
  { combate: datos de combate, transportada: "tierra" | "aire" | null }
*/
function datosEnCombate(idUnidad, datos, idDoctrina, idTerreno, opciones) {
  const medio = medioUnidad(buscarPorId(UNIDADES, idUnidad));
  const viajaEnBarco = idTerreno === "mar" &&
    (medio === "tierra" || (medio === "aire" && opciones.avionesPorMar));

  if (viajaEnBarco) {
    const transporte = obtenerDatos("transporte", idDoctrina, opciones.nivelTransporte);
    if (transporte) return { combate: transporte, transportada: medio };
  }
  return { combate: datos, transportada: null };
}

/*
  Calcula el resultado de un stack.

  stack → lista de filas: [{ unidad: "inf", nivel: 1, cantidad: 4 }, ...]

  opciones → { nivelTransporte, avionesPorMar } (solo cuentan en el mar).

  La fuerza del terreno (+40 %, +70 %...) multiplica ataque y defensa.
  Vida, coste y mantenimiento se suman.
  Velocidad: la de la unidad más lenta (con el % del terreno).
  Visión y alcance: los de la unidad que más tenga.
*/
function calcularStack(stack, idDoctrina, idTerreno, opciones) {
  const r = {
    totalUnidades: 0,
    sinDatos: 0,
    vida: 0,
    velocidad: Infinity,
    vision: 0,
    alcance: 0,
    ataque: {},            // cuerpo a cuerpo (unidades con alcance 0)
    ataqueDistancia: {},   // a distancia (unidades con alcance > 0)
    defensa: {},
    coste: {},
    mantenimiento: {},
    clases: [],
    transportadas: { tierra: 0, aire: 0 },  // cuántas viajan como Barco de transporte
    fueraDeTerreno: 0,                       // barcos en un terreno de tierra: no combaten
    capacidadAviones: 0,                     // plazas para aviones (portaaviones)
    aviones: 0,                              // aviones que hay en el stack
    impacto: {},                             // daño total de las unidades de un solo uso
    misiles: 0,                              // cuántas unidades de un solo uso hay
    interceptables: 0,                       // de ellas, cuántas pueden ser derribadas
    fuegoAmigo: false,                       // ¿alguna daña también a tus unidades?
    nuclear: false                           // ¿hay algún arma nuclear?
  };
  TIPOS.forEach((tipo) => { r.impacto[tipo.clave] = 0; });

  // Guardamos el daño de CADA unidad por separado para luego quedarnos con las 10 mejores
  const danoAtaque = {};
  const danoDistancia = {};
  const danoDefensa = {};
  TIPOS.forEach((t) => { danoAtaque[t.clave] = []; danoDistancia[t.clave] = []; danoDefensa[t.clave] = []; });
  TIPOS.forEach((t) => { danoAtaque[t.clave] = []; danoDefensa[t.clave] = []; });
  RECURSOS.forEach((x) => { r.coste[x.clave] = 0; r.mantenimiento[x.clave] = 0; });

  for (const fila of stack) {
    const c = fila.cantidad;
    r.totalUnidades += c;

    const datosUnidad = obtenerDatos(fila.unidad, idDoctrina, fila.nivel);
    if (!datosUnidad) { r.sinDatos += c; continue; }

    // Plazas de portaaviones y número de aviones (cuentan en cualquier terreno)
    r.capacidadAviones += (datosUnidad.capacidadAviones ?? 0) * c;
    if (medioUnidad(buscarPorId(UNIDADES, fila.unidad)) === "aire") r.aviones += c;

    // "d" son los datos con los que combate (los suyos o los del transporte)
    const { combate: d, transportada } = datosEnCombate(fila.unidad, datosUnidad, idDoctrina, idTerreno, opciones);
    if (transportada) r.transportadas[transportada] += c;

    // Si la unidad no puede estar en este terreno (un barco en Llanuras), no cuenta
    const t = d.terreno[idTerreno];
    if (!t) { r.fueraDeTerreno += c; continue; }
    const multiplicadorFuerza = 1 + t.fuerza / 100;

    r.vida += t.vida * c;


    // Unidades de un solo uso (bombas, cohetes): golpean una vez y desaparecen.
    // Su daño se suma aparte (todas impactan) y no entran en la regla de las 10.
    const unidad = buscarPorId(UNIDADES, fila.unidad);
    if (unidad.unSoloUso) {
      r.misiles += c;
      if (!unidad.supersonico) r.interceptables += c;
      if (unidad.fuegoAmigo) r.fuegoAmigo = true;
      if (unidad.nuclear) r.nuclear = true;
      TIPOS.forEach(({ clave }) => { r.impacto[clave] += (d.ataque[clave] ?? 0) * c; });
      RECURSOS.forEach(({ clave }) => {
        r.coste[clave] += (datosUnidad.coste[clave] ?? 0) * c;
        r.mantenimiento[clave] += (datosUnidad.mantenimiento[clave] ?? 0) * c;
      });
      continue;   // no suma a ataque, defensa, velocidad ni visión del stack
    }

    // El ataque va a una lista u otra según si la unidad ataca a distancia
    const listaAtaque = d.alcance > 0 ? danoDistancia : danoAtaque;

    // Una entrada por unidad: 4 de infantería = 4 valores en la lista
    TIPOS.forEach(({ clave }) => {
      for (let i = 0; i < c; i++) {
        listaAtaque[clave].push((d.ataque[clave] ?? 0) * multiplicadorFuerza);
        danoDefensa[clave].push((d.defensa[clave] ?? 0) * multiplicadorFuerza);
      }
    });

    r.velocidad = Math.min(r.velocidad, d.velocidad * (1 + t.velocidad / 100));
    r.vision = Math.max(r.vision, d.vision);
    r.alcance = Math.max(r.alcance, d.alcance);

    RECURSOS.forEach(({ clave }) => {
      // El coste es siempre el de la unidad real, aunque viaje en barco
      r.coste[clave] += (datosUnidad.coste[clave] ?? 0) * c;               // si no usa ese recurso, cuenta 0
      r.mantenimiento[clave] += (datosUnidad.mantenimiento[clave] ?? 0) * c;
    });

    if (!r.clases.includes(t.clase)) r.clases.push(t.clase);
  }

  // Regla del juego: solo las 10 unidades más poderosas infligen daño.
  // Se eligen por separado para cada tipo de objetivo.
  TIPOS.forEach(({ clave }) => {
    r.ataque[clave] = sumarMejores(danoAtaque[clave], MAX_UNIDADES_DANO);
    r.ataqueDistancia[clave] = sumarMejores(danoDistancia[clave], MAX_UNIDADES_DANO);
    r.defensa[clave] = sumarMejores(danoDefensa[clave], MAX_UNIDADES_DANO);
  });

  if (r.velocidad === Infinity) r.velocidad = 0;
  return r;
}

// 12.5 → "12,5"
function formatearNumero(valor) {
  return (Math.round(valor * 10) / 10).toLocaleString("es-ES");
}

function porcentajeBarra(valor, maximo) {
  return Math.max(0, Math.min(100, (valor / maximo) * 100));
}