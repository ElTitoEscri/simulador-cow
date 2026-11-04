/* =========================================================
   APP: conecta los datos y los cálculos con la página.

   La idea clave:
   1. Guardamos TODO lo que el usuario ha elegido en "estado".
   2. Cuando algo cambia, modificamos "estado" y llamamos a pintar().
   3. pintar() redibuja la página a partir de "estado".
   ========================================================= */

const estado = {
  doctrina: "panasia",
  terreno: "llanuras",
  seccion: "infanteria",   // pestaña abierta en "Añadir unidad"
  nivelTransporte: 1,      // nivel del Barco de transporte (terreno Mar)
  avionesPorMar: false,    // ¿los aviones se trasladan por mar?
  // Cada fila del stack: qué unidad, de qué nivel y cuántas
  stack: [],
  // Pestaña Comparar: dos stacks y la unidad elegida en cada desplegable
  comparar: {
    a: [], b: [],
    doctrina: { a: "panasia", b: "panasia" },   // cada stack con su doctrina
    terreno: "llanuras",                         // terreno propio, distinto del simulador
    seleccion: { a: "", b: "" }
  },
  // Pestaña Unidades: qué ficha se está viendo
  unidades: { doctrina: "panasia", seccion: "infanteria", unidad: "inf", nivel: 1 }
};

/* ---------------------------------------------------------
   GUARDADO EN EL NAVEGADOR (localStorage)
   Cada vez que se redibuja la página guardamos "estado".
   Al abrirla, lo recuperamos. Todo va dentro de try/catch
   porque en algunos navegadores (modo privado) puede fallar.
   --------------------------------------------------------- */
const CLAVE_GUARDADO = "simulador-cow";

function guardarEstado() {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(estado));
  } catch (error) {
    // Si no se puede guardar, la web sigue funcionando igual
  }
}

// Devuelve solo las filas válidas de un stack guardado (o [] si no es una lista)
function limpiarStack(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.filter((f) => UNIDADES.some((u) => u.id === f.unidad) && f.cantidad > 0);
}

function cargarEstado() {
  try {
    const texto = localStorage.getItem(CLAVE_GUARDADO);
    if (!texto) return;                       // primera visita: no hay nada guardado
    const guardado = JSON.parse(texto);

    // Solo aceptamos valores que sigan existiendo (por si cambian los datos)
    if (DOCTRINAS.some((d) => d.id === guardado.doctrina)) estado.doctrina = guardado.doctrina;
    if (TERRENOS.some((t) => t.id === guardado.terreno)) estado.terreno = guardado.terreno;
    if (SECCIONES.some((x) => x.id === guardado.seccion)) estado.seccion = guardado.seccion;
    if (Number.isInteger(guardado.nivelTransporte)) estado.nivelTransporte = guardado.nivelTransporte;
    estado.avionesPorMar = guardado.avionesPorMar === true;

    estado.stack = limpiarStack(guardado.stack);
    if (guardado.comparar) {
      estado.comparar.a = limpiarStack(guardado.comparar.a);
      estado.comparar.b = limpiarStack(guardado.comparar.b);
      const sel = guardado.comparar.seleccion || {};
      estado.comparar.seleccion = { a: sel.a || "", b: sel.b || "" };
      const doc = guardado.comparar.doctrina || {};
      ["a", "b"].forEach((lado) => {
        if (DOCTRINAS.some((d) => d.id === doc[lado])) estado.comparar.doctrina[lado] = doc[lado];
      });
      if (TERRENOS.some((t) => t.id === guardado.comparar.terreno)) estado.comparar.terreno = guardado.comparar.terreno;
    }

    const g = guardado.unidades;
    if (g) {
      if (DOCTRINAS.some((d) => d.id === g.doctrina)) estado.unidades.doctrina = g.doctrina;
      if (SECCIONES.some((x) => x.id === g.seccion)) estado.unidades.seccion = g.seccion;
      if (UNIDADES.some((u) => u.id === g.unidad)) estado.unidades.unidad = g.unidad;
      if (Number.isInteger(g.nivel)) estado.unidades.nivel = g.nivel;
    }
  } catch (error) {
    // Datos guardados corruptos: empezamos de cero
  }
}

// Referencias a los elementos de la página que vamos a rellenar
const elementos = {
  chipDoctrina: document.getElementById("chip-doctrina"),
  listaDoctrinas: document.getElementById("lista-doctrinas"),
  listaTerrenos: document.getElementById("lista-terrenos"),
  opcionesMar: document.getElementById("opciones-mar"),
  listaStack: document.getElementById("lista-stack"),
  listaResultados: document.getElementById("lista-resultados"),
  resumenResultados: document.getElementById("resumen-resultados"),
  pestanasSecciones: document.getElementById("pestanas-secciones"),
  listaCatalogo: document.getElementById("lista-catalogo"),
  botonVaciar: document.getElementById("boton-vaciar")
};

/* ---------------------------------------------------------
   PINTAR: una función por cada zona de la página
   --------------------------------------------------------- */

function pintarDoctrinas() {
  elementos.listaDoctrinas.innerHTML = htmlDoctrinas(estado.doctrina, "sim");
}

function pintarTerrenos() {
  elementos.listaTerrenos.innerHTML = htmlTerrenos(estado.terreno, "sim");
}

/*
  Tarjetas de doctrina y de terreno. Se usan en el Simulador y en Comparar.
  destino → a qué se aplica al pulsar: "sim" (simulador), "a" o "b" (stacks de
  Comparar) para doctrinas, y "sim" o "cmp" para terrenos.
*/
function htmlDoctrinas(elegida, destino) {
  return DOCTRINAS.map((d) => {
    const activa = d.id === elegida;
    return `
      <button type="button"
              class="tarjeta-doctrina ${activa ? "tarjeta-doctrina--activa" : ""}"
              data-doctrina="${d.id}" data-destino="${destino}"
              aria-pressed="${activa}">
        <span class="tarjeta-doctrina__medalla">${d.letra}</span>
        <span class="tarjeta-doctrina__nombre">${d.nombre}</span>
      </button>`;
  }).join("");
}

function htmlTerrenos(elegido, destino) {
  return TERRENOS.map((t) => {
    const activo = t.id === elegido;
    return `
      <button type="button"
              class="tarjeta-terreno ${activo ? "tarjeta-terreno--activa" : ""}"
              style="background-color: ${t.color}"
              data-terreno="${t.id}" data-destino="${destino}"
              aria-pressed="${activo}">
        <svg class="tarjeta-terreno__icono" viewBox="0 0 24 24" aria-hidden="true"><path d="${t.icono}"/></svg>
        <span class="tarjeta-terreno__nombre">${t.nombre}</span>
      </button>`;
  }).join("");
}

// Opciones del terreno Mar: nivel del transporte y traslado de aviones
function pintarOpcionesMar() {
  if (estado.terreno !== "mar") {
    elementos.opcionesMar.innerHTML = "";
    return;
  }

  const niveles = nivelesDisponibles("transporte", estado.doctrina);
  if (niveles.length === 0) {
    elementos.opcionesMar.innerHTML = `<p class="opciones-mar__aviso">No hay datos del Barco de transporte para esta doctrina.</p>`;
    return;
  }

  const n = estado.nivelTransporte;
  const puedeBajar = niveles.some((x) => x < n);
  const puedeSubir = niveles.some((x) => x > n);

  elementos.opcionesMar.innerHTML = `
    <div class="opciones-mar">
      <div class="opciones-mar__fila">
        <span class="opciones-mar__etiqueta">⚓ Barco de transporte</span>
        <span class="fila-unidad__nivel">Nivel ${n}</span>
        <span class="nivel">
          <button type="button" class="nivel__boton" data-transporte="bajar" ${puedeBajar ? "" : "disabled"}
                  aria-label="Bajar nivel del barco de transporte">▼</button>
          <button type="button" class="nivel__boton" data-transporte="subir" ${puedeSubir ? "" : "disabled"}
                  aria-label="Subir nivel del barco de transporte">▲</button>
        </span>
      </div>
      <label class="opciones-mar__casilla">
        <input type="checkbox" id="aviones-por-mar" ${estado.avionesPorMar ? "checked" : ""}>
        Los aviones viajan por mar (traslado de base)
      </label>
    </div>`;
}

// Si cambias de doctrina y ese nivel de transporte no existe, usa el más bajo disponible
function ajustarNivelTransporte() {
  const niveles = nivelesDisponibles("transporte", estado.doctrina);
  if (niveles.length && !niveles.includes(estado.nivelTransporte)) {
    estado.nivelTransporte = niveles[0];
  }
}

// Opciones que necesita calcularStack
function opcionesCalculo() {
  return { nivelTransporte: estado.nivelTransporte, avionesPorMar: estado.avionesPorMar };
}

function pintarStack() {
  elementos.botonVaciar.hidden = estado.stack.length === 0;   // solo si hay algo que vaciar
  elementos.listaStack.innerHTML = htmlStack(estado.stack, "sim",
    "Tu stack está vacío. Añade unidades abajo.");
}

/*
  Devuelve el HTML de las filas de un stack.
  idStack → "sim" (simulador), "a" o "b" (pestaña Comparar).
  Va en cada botón como data-stack, para saber a qué stack pertenece.
*/
function htmlStack(stack, idStack, textoVacio) {
  if (stack.length === 0) return `<p class="stack-vacio">${textoVacio}</p>`;

  const { doctrina, terreno: idTerreno } = contextoStack(idStack);
  const terreno = buscarPorId(TERRENOS, idTerreno);

  return stack.map((fila, indice) => {
    const u = buscarPorId(UNIDADES, fila.unidad);
    const niveles = nivelesDisponibles(fila.unidad, estado.doctrina);
    const datos = obtenerDatos(fila.unidad, estado.doctrina, fila.nivel);
    const puedeBajar = niveles.some((n) => n < fila.nivel);
    const puedeSubir = niveles.some((n) => n > fila.nivel);

    let subtitulo = "Sin datos para esta doctrina y nivel";
    if (datos) {
      const { transportada } = datosEnCombate(fila.unidad, datos, doctrina, idTerreno, opcionesCalculo());
      const enTerreno = datos.terreno[idTerreno];
      if (transportada) subtitulo = `En el mar: Barco de transporte N${estado.nivelTransporte}`;
      else if (!enTerreno) subtitulo = "Solo puede combatir en el mar";
      else subtitulo = `Clase en ${terreno.nombre.toLowerCase()}: ${nombreTipo(enTerreno.clase)}`;
    }

    // Atributos comunes de todos los botones de esta fila
    const datosBoton = `data-stack="${idStack}" data-indice="${indice}"`;

    return `
      <div class="fila-unidad">
        <span class="fila-unidad__icono">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONOS[u.icono]}"/></svg>
        </span>
        <span class="fila-unidad__info">
          <span class="fila-unidad__nombre">${u.nombre}</span>
          <span class="fila-unidad__titulo">
            <span class="fila-unidad__nivel">Nivel ${fila.nivel}</span>
            <span class="nivel">
              <button type="button" class="nivel__boton" data-accion="bajar" ${datosBoton}
                      ${puedeBajar ? "" : "disabled"} aria-label="Bajar nivel de ${u.nombre}">▼</button>
              <button type="button" class="nivel__boton" data-accion="subir" ${datosBoton}
                      ${puedeSubir ? "" : "disabled"} aria-label="Subir nivel de ${u.nombre}">▲</button>
            </span>
          </span>
          <span class="fila-unidad__tipo">${subtitulo}</span>
        </span>
        <span class="contador">
          <button type="button" class="contador__boton contador__boton--menos"
                  data-accion="menos" ${datosBoton}
                  aria-label="Quitar una unidad de ${u.nombre}">−</button>
          <span class="contador__numero">${fila.cantidad}</span>
          <button type="button" class="boton-verde contador__boton contador__boton--mas"
                  data-accion="mas" ${datosBoton}
                  aria-label="Añadir una unidad de ${u.nombre}">+</button>
        </span>
        <button type="button" class="quitar-fila"
                data-accion="quitar" ${datosBoton}
                aria-label="Quitar todas las unidades de ${u.nombre} nivel ${fila.nivel}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>`;
  }).join("");
}

function pintarCatalogo() {
  // Pestañas de sección
  elementos.pestanasSecciones.innerHTML = SECCIONES.map((sec) => {
    const activa = sec.id === estado.seccion;
    return `
      <button type="button" role="tab" aria-selected="${activa}"
              class="seccion ${activa ? "seccion--activa" : ""}"
              data-seccion="${sec.id}">${sec.nombre}</button>`;
  }).join("");

  // Las unidades que no se construyen (el transporte) no salen en el catálogo
  const unidades = UNIDADES.filter((u) => u.seccion === estado.seccion && u.construible !== false);

  elementos.listaCatalogo.innerHTML = unidades.map((u) => {
    const tieneDatos = nivelesDisponibles(u.id, estado.doctrina).length > 0;
    return `
      <button type="button" class="unidad-catalogo" data-anadir="${u.id}"
              ${tieneDatos ? "" : "disabled"}
              aria-label="Añadir ${u.nombre}${tieneDatos ? "" : " (sin datos)"}">
        <svg class="unidad-catalogo__icono" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONOS[u.icono]}"/></svg>
        <span class="unidad-catalogo__nombre">${u.nombre}</span>
        <span class="unidad-catalogo__estado">${tieneDatos ? "+ Añadir" : "Sin datos"}</span>
      </button>`;
  }).join("");
}

// Pequeña tarjeta con un número (vida, velocidad, costes...)
function tarjetaDato(etiqueta, valor) {
  return `
    <div class="dato">
      <span class="dato__etiqueta">${etiqueta}</span>
      <span class="dato__valor">${formatearNumero(valor)}</span>
    </div>`;
}

// Celda de la tabla ataque/defensa: número + barra
function celdaBarra(valor, maximo, tipoBarra, sinValor) {
  if (sinValor) return `<span class="celda"><span class="celda__valor">–</span></span>`;
  return `
    <span class="celda">
      <span class="celda__valor">${formatearNumero(valor)}</span>
      <span class="barra">
        <span class="barra__relleno barra__relleno--${tipoBarra}" data-ancho="${porcentajeBarra(valor, maximo)}"></span>
      </span>
    </span>`;
}

// Bloque "Impacto de un solo uso" (bombas aéreas, cohetes...). Vacío si no hay.
function bloqueImpacto(r) {
  if (r.misiles === 0) return "";

  const maximo = Math.max(1, ...TIPOS.map((t) => r.impacto[t.clave]));
  const avisos = [];
  if (r.interceptables > 0) {
    avisos.push(`${r.interceptables} de ${r.misiles} pueden ser derribadas por antiaéreas antes de impactar.`);
  } else {
    avisos.push("Son supersónicas: no se pueden interceptar.");
  }
  if (r.fuegoAmigo) avisos.push("⚠ Fuego amigo: también dañan a tus unidades en la zona del impacto.");
  if (r.nuclear) avisos.push("☢ Arma nuclear: daña todo en un área de explosión de 50 y deja lluvia radiactiva, que también afecta a tus unidades y provincias.");

  return `
    <h3 class="subtitulo">💥 Impacto de un solo uso (${r.misiles})</h3>
    <div class="tabla-impacto">
      ${TIPOS.map((t) => `
        <span class="tabla-tipos__tipo">${t.etiqueta}</span>
        ${celdaBarra(r.impacto[t.clave], maximo, "impacto")}
      `).join("")}
    </div>
    <p class="nota">${avisos.join(" ")}</p>`;
}

function pintarResultados() {
  const doctrina = buscarPorId(DOCTRINAS, estado.doctrina);
  const terreno = buscarPorId(TERRENOS, estado.terreno);
  const r = calcularStack(estado.stack, estado.doctrina, estado.terreno, opcionesCalculo());

  const resumen = `${r.totalUnidades} unidades · ${terreno.nombre} · ${doctrina.nombre}`;
  elementos.resumenResultados.textContent = resumen;
  elementos.chipDoctrina.textContent = doctrina.nombre.toUpperCase();

  // La barra más larga de la tabla ocupa el 100 %; las demás, en proporción
  const maximo = Math.max(1, ...TIPOS.map((t) =>
    Math.max(r.ataque[t.clave], r.ataqueDistancia[t.clave], r.defensa[t.clave])));

  let aviso = r.sinDatos > 0
    ? `<p class="aviso">${r.sinDatos} unidad(es) sin datos para esta doctrina y nivel: no cuentan en el cálculo.</p>`
    : "";

  // Aviso de barcos en un terreno de tierra
  if (r.fueraDeTerreno > 0) {
    aviso += `<p class="aviso">⚓ ${r.fueraDeTerreno} unidad(es) naval(es) no pueden combatir en ${terreno.nombre}: solo cuentan en el Mar.</p>`;
  }

  // Aviso de unidades que viajan como Barco de transporte
  const transportadas = r.transportadas.tierra + r.transportadas.aire;
  if (transportadas > 0) {
    const detalle = r.transportadas.aire > 0
      ? ` (${r.transportadas.tierra} terrestres, ${r.transportadas.aire} aéreas)`
      : "";
    aviso += `<p class="aviso aviso--mar">⚓ En el mar, ${transportadas} unidad(es)${detalle} viajan como Barco de transporte Nivel ${estado.nivelTransporte}. El coste sigue siendo el de las unidades reales.</p>`;
  }

  // Portaaviones: plazas para aviones
  if (r.capacidadAviones > 0) {
    const sobran = r.aviones > r.capacidadAviones;
    aviso += `<p class="aviso ${sobran ? "" : "aviso--mar"}">✈ Portaaviones: ${r.aviones} / ${r.capacidadAviones} plazas de aviones ocupadas${sobran ? ". ¡Hay más aviones que plazas!" : "."}</p>`;
  }

  // Aviso de la regla de las 10 unidades
  const unidadesConDatos = r.totalUnidades - r.sinDatos - r.fueraDeTerreno - r.misiles;
  if (unidadesConDatos > MAX_UNIDADES_DANO) {
    aviso += `<p class="aviso">⚠ ${unidadesConDatos} / ${MAX_UNIDADES_DANO} unidades: solo las ${MAX_UNIDADES_DANO} más poderosas infligen daño. Las demás suman vida, pero no daño.</p>`;
  }

  const clases = r.clases.length ? r.clases.map(nombreTipo).join(", ") : "–";

  // Solo mostramos los recursos que el stack gasta de verdad (sin ceros)
  const recursosUsados = RECURSOS.filter((x) => r.coste[x.clave] > 0 || r.mantenimiento[x.clave] > 0);

  elementos.listaResultados.innerHTML = `
    ${aviso}
    <div class="datos">
      ${tarjetaDato("Vida", r.vida)}
      ${tarjetaDato("Velocidad", r.velocidad)}
      ${tarjetaDato("Visión", r.vision)}
      ${tarjetaDato("Alcance", r.alcance)}
    </div>
    <p class="clase-stack">Clase en ${terreno.nombre.toLowerCase()}: <strong>${clases}</strong></p>

    <div class="tabla-tipos">
      <span class="tabla-tipos__cabecera">Contra</span>
      <span class="tabla-tipos__cabecera">Cuerpo a cuerpo</span>
      <span class="tabla-tipos__cabecera">A distancia</span>
      <span class="tabla-tipos__cabecera">Defensa</span>
      ${TIPOS.map((t) => `
        <span class="tabla-tipos__tipo">${t.etiqueta}</span>
        ${celdaBarra(r.ataque[t.clave], maximo, "ataque")}
        ${celdaBarra(r.ataqueDistancia[t.clave], maximo, "distancia")}
        ${celdaBarra(r.defensa[t.clave], maximo, "defensa", t.soloAtaque)}
      `).join("")}
    </div>

    ${bloqueImpacto(r)}

    <h3 class="subtitulo">Coste de producción</h3>
    <div class="datos">${recursosUsados.map((x) => tarjetaDato(x.etiqueta, r.coste[x.clave])).join("")}</div>

    <h3 class="subtitulo">Mantenimiento diario</h3>
    <div class="datos">${recursosUsados.map((x) => tarjetaDato(x.etiqueta, r.mantenimiento[x.clave])).join("")}</div>`;

  // Ponemos el ancho en el siguiente "frame" para que se vea la animación de la barra
  requestAnimationFrame(() => {
    elementos.listaResultados.querySelectorAll(".barra__relleno").forEach((barra) => {
      barra.style.width = barra.dataset.ancho + "%";
    });
  });
}

// Redibuja todo
function pintar() {
  ajustarNivelTransporte();
  pintarDoctrinas();
  pintarTerrenos();
  pintarOpcionesMar();
  pintarStack();
  pintarCatalogo();
  pintarResultados();
  pintarComparar();     // pestaña Comparar (está en comparar.js)
  pintarUnidades();     // pestaña Unidades (está en unidades.js)
  pintarGuia();         // pestaña Guía (está en guia.js)
  guardarEstado();
}

/* ---------------------------------------------------------
   EVENTOS
   Usamos "delegación": un solo listener en el contenedor
   que mira qué botón de dentro se ha pulsado.
   --------------------------------------------------------- */

// Tarjetas de doctrina y terreno (Simulador y Comparar).
// data-destino dice dónde aplicar la elección.
document.addEventListener("click", (evento) => {
  const doctrina = evento.target.closest("[data-doctrina][data-destino]");
  if (doctrina) {
    const destino = doctrina.dataset.destino;
    if (destino === "sim") estado.doctrina = doctrina.dataset.doctrina;
    else if (destino === "uni") estado.unidades.doctrina = doctrina.dataset.doctrina;
    else estado.comparar.doctrina[destino] = doctrina.dataset.doctrina;   // "a" o "b"
    pintar();
    return;
  }

  const terreno = evento.target.closest("[data-terreno][data-destino]");
  if (terreno) {
    if (terreno.dataset.destino === "sim") estado.terreno = terreno.dataset.terreno;
    else estado.comparar.terreno = terreno.dataset.terreno;              // "cmp"
    pintar();
  }
});

// Flechas del nivel de transporte
elementos.opcionesMar.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-transporte]");
  if (!boton) return;
  const niveles = nivelesDisponibles("transporte", estado.doctrina);
  const nuevo = boton.dataset.transporte === "subir"
    ? niveles.find((x) => x > estado.nivelTransporte)
    : [...niveles].reverse().find((x) => x < estado.nivelTransporte);
  if (nuevo === undefined) return;
  estado.nivelTransporte = nuevo;
  pintar();
});

// Casilla de "los aviones viajan por mar"
elementos.opcionesMar.addEventListener("change", (evento) => {
  if (evento.target.id !== "aviones-por-mar") return;
  estado.avionesPorMar = evento.target.checked;
  pintar();
});

// Doctrina y terreno con los que se calcula cada stack
function contextoStack(idStack) {
  if (idStack === "sim") return { doctrina: estado.doctrina, terreno: estado.terreno };
  return { doctrina: estado.comparar.doctrina[idStack], terreno: estado.comparar.terreno };
}

// Devuelve el stack (la lista) a partir de su id: "sim", "a" o "b"
function stackPorId(idStack) {
  return idStack === "sim" ? estado.stack : estado.comparar[idStack];
}

// Cambia el nivel de una fila. Si ya hay otra fila con esa unidad y ese nivel, las junta.
function cambiarNivel(stack, indice, nuevoNivel) {
  const fila = stack[indice];
  const otra = stack.find((f, i) => i !== indice && f.unidad === fila.unidad && f.nivel === nuevoNivel);
  if (otra) {
    otra.cantidad += fila.cantidad;
    stack.splice(indice, 1);
  } else {
    fila.nivel = nuevoNivel;
  }
}

// Añade una unidad a un stack en su nivel más bajo; si ya está esa fila, suma 1
function anadirUnidad(stack, idUnidad, doctrina) {
  const nivel = nivelesDisponibles(idUnidad, estado.doctrina)[0];
  if (nivel === undefined) return;
  const existente = stack.find((f) => f.unidad === idUnidad && f.nivel === nivel);
  if (existente) existente.cantidad += 1;
  else stack.push({ unidad: idUnidad, nivel, cantidad: 1 });
}

// Un solo listener para los botones de TODAS las filas (simulador y comparar).
// data-stack dice a qué stack pertenece el botón pulsado.
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion][data-stack]");
  if (!boton) return;

  const stack = stackPorId(boton.dataset.stack);
  const indice = Number(boton.dataset.indice);
  const fila = stack[indice];
  const accion = boton.dataset.accion;

  if (accion === "mas") {
    fila.cantidad = Math.min(fila.cantidad + 1, 99);
  } else if (accion === "quitar") {
    stack.splice(indice, 1);   // quita la fila entera de una vez
  } else if (accion === "menos") {
    fila.cantidad -= 1;
    if (fila.cantidad <= 0) stack.splice(indice, 1);   // a 0 desaparece del stack
  } else {
    const niveles = nivelesDisponibles(fila.unidad, contextoStack(boton.dataset.stack).doctrina);
    const nuevoNivel = accion === "subir"
      ? niveles.find((n) => n > fila.nivel)                 // el siguiente nivel con datos
      : [...niveles].reverse().find((n) => n < fila.nivel); // el anterior nivel con datos
    if (nuevoNivel === undefined) return;
    cambiarNivel(stack, indice, nuevoNivel);
  }
  pintar();
});

elementos.pestanasSecciones.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-seccion]");
  if (!boton) return;
  estado.seccion = boton.dataset.seccion;
  pintarCatalogo();   // solo cambia el catálogo, no hace falta redibujar todo
  guardarEstado();
});

elementos.listaCatalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-anadir]");
  if (!boton || boton.disabled) return;
  anadirUnidad(estado.stack, boton.dataset.anadir, estado.doctrina);
  pintar();
});

/* ---------------------------------------------------------
   NAVEGACIÓN ENTRE PESTAÑAS
   La pestaña activa va en la dirección (#simulador, #comparar...).
   Así funcionan los botones atrás/adelante del navegador y
   puedes compartir un enlace directo a una pestaña.
   --------------------------------------------------------- */
const VISTAS = ["simulador", "unidades", "comparar", "guia"];

function mostrarVista() {
  const pedida = location.hash.slice(1);                 // "#comparar" → "comparar"
  const vista = VISTAS.includes(pedida) ? pedida : "simulador";

  // Enseña la vista elegida y oculta las demás
  document.querySelectorAll("main[data-vista]").forEach((main) => {
    main.hidden = main.dataset.vista !== vista;
  });

  // Marca la pestaña activa
  document.querySelectorAll(".pestana[data-vista]").forEach((pestana) => {
    const activa = pestana.dataset.vista === vista;
    pestana.classList.toggle("pestana--activa", activa);
    if (activa) pestana.setAttribute("aria-current", "page");
    else pestana.removeAttribute("aria-current");
  });
}

// Se ejecuta cada vez que cambia el # de la dirección (al pulsar una pestaña)
window.addEventListener("hashchange", mostrarVista);

// Botón "Vaciar stack"
elementos.botonVaciar.addEventListener("click", () => {
  estado.stack = [];
  pintar();
});

// Al cargar la página: recuperamos lo guardado y pintamos
cargarEstado();
mostrarVista();
pintar();
