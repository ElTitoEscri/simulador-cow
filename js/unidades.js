/* =========================================================
   UNIDADES: ficha de consulta de cada unidad y nivel.
   Como comparar.js, se carga ANTES que app.js y app.js
   llama a pintarUnidades() desde pintar().
   ========================================================= */

const uni = {
    doctrinas: document.getElementById("uni-doctrinas"),
    secciones: document.getElementById("uni-secciones"),
    lista: document.getElementById("uni-lista"),
    ficha: document.getElementById("uni-ficha")
};

// Unidades que se pueden consultar en una sección (las que no se construyen, fuera)
function unidadesDeSeccion(idSeccion) {
    return UNIDADES.filter((u) => u.seccion === idSeccion && u.construible !== false);
}

/* ---------------------------------------------------------
   PINTAR
   --------------------------------------------------------- */

function pintarUnidades() {
    const e = estado.unidades;

    // Doctrina (mismas tarjetas que en el Simulador)
    uni.doctrinas.innerHTML = htmlDoctrinas(e.doctrina, "uni");

    // Pestañas de sección
    uni.secciones.innerHTML = SECCIONES.map((sec) => {
        const activa = sec.id === e.seccion;
        return `<button type="button" role="tab" aria-selected="${activa}"
              class="seccion ${activa ? "seccion--activa" : ""}"
              data-uni-seccion="${sec.id}">${sec.nombre}</button>`;
    }).join("");

    // Lista de unidades de la sección
    uni.lista.innerHTML = unidadesDeSeccion(e.seccion).map((u) => {
        const activa = u.id === e.unidad;
        const tieneDatos = nivelesDisponibles(u.id, e.doctrina).length > 0;
        return `
      <button type="button" class="unidad-catalogo ${activa ? "unidad-catalogo--activa" : ""}"
              data-uni-unidad="${u.id}" aria-pressed="${activa}">
        <svg class="unidad-catalogo__icono" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONOS[u.icono]}"/></svg>
        <span class="unidad-catalogo__nombre">${u.nombre}</span>
        <span class="unidad-catalogo__estado">${tieneDatos ? "Ver ficha" : "Sin datos"}</span>
      </button>`;
    }).join("");

    pintarFicha();
}

function pintarFicha() {
    const e = estado.unidades;
    const u = buscarPorId(UNIDADES, e.unidad);

    if (!u) {
        uni.ficha.innerHTML = `<p class="stack-vacio">Elige una unidad para ver su ficha.</p>`;
        return;
    }

    const niveles = nivelesDisponibles(u.id, e.doctrina);
    if (niveles.length === 0) {
        uni.ficha.innerHTML = `<p class="stack-vacio">Aún no hay datos de ${u.nombre} para ${buscarPorId(DOCTRINAS, e.doctrina).nombre}.</p>`;
        return;
    }

    // Si el nivel guardado no existe en esta doctrina, usamos el más bajo
    if (!niveles.includes(e.nivel)) e.nivel = niveles[0];
    const d = obtenerDatos(u.id, e.doctrina, e.nivel);

    const puedeBajar = niveles.some((n) => n < e.nivel);
    const puedeSubir = niveles.some((n) => n > e.nivel);

    // Etiquetas de habilidades especiales
    const etiquetas = [];
    if (d.alcance > 0) etiquetas.push("Ataque a distancia");
    if (u.unSoloUso) etiquetas.push("Un solo uso");
    if (u.supersonico) etiquetas.push("Supersónico");
    if (u.fuegoAmigo) etiquetas.push("Fuego amigo");
    if (u.nuclear) etiquetas.push("☢ Arma nuclear");
    if (d.capacidadAviones) etiquetas.push(`✈ Lleva ${d.capacidadAviones} aviones`);

    // Cuántas hay de esta unidad y nivel en el stack del simulador
    const enStack = estado.stack
        .filter((f) => f.unidad === u.id && f.nivel === e.nivel)
        .reduce((total, f) => total + f.cantidad, 0);

    // Tabla ataque / defensa (con barras)
    const maximo = Math.max(1, ...TIPOS.map((t) => Math.max(d.ataque[t.clave] ?? 0, d.defensa[t.clave] ?? 0)));
    const tipoAtaque = d.alcance > 0 ? "distancia" : "ataque";

    // Recursos que usa esta unidad (sin ceros)
    const recursos = RECURSOS.filter((x) => (d.coste[x.clave] ?? 0) > 0 || (d.mantenimiento[x.clave] ?? 0) > 0);

    uni.ficha.innerHTML = `
    <div class="ficha__cabecera">
      <span class="fila-unidad__icono ficha__icono">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONOS[u.icono]}"/></svg>
      </span>
      <div class="ficha__titulo">
        <h3 class="ficha__nombre">${u.nombre}</h3>
        <span class="fila-unidad__titulo">
          <span class="fila-unidad__nivel">Nivel ${e.nivel} de ${niveles[niveles.length - 1]}</span>
          <span class="nivel">
            <button type="button" class="nivel__boton" data-uni-nivel="bajar" ${puedeBajar ? "" : "disabled"}
                    aria-label="Nivel anterior">▼</button>
            <button type="button" class="nivel__boton" data-uni-nivel="subir" ${puedeSubir ? "" : "disabled"}
                    aria-label="Nivel siguiente">▲</button>
          </span>
        </span>
      </div>
      <div class="ficha__accion">
        <button type="button" class="boton-verde" data-uni-anadir>+ AÑADIR AL SIMULADOR</button>
        <span class="nota">${enStack > 0 ? `En tu stack: ${enStack}` : ""}</span>
      </div>
    </div>

    ${etiquetas.length ? `<div class="ficha__etiquetas">${etiquetas.map((x) => `<span class="ficha__etiqueta">${x}</span>`).join("")}</div>` : ""}

    <div class="datos">
      ${tarjetaDato("Vida", d.vida)}
      ${tarjetaDato("Velocidad", d.velocidad)}
      ${tarjetaDato("Visión", d.vision)}
      ${tarjetaDato("Alcance", d.alcance)}
    </div>

    <h3 class="subtitulo">Estadísticas de combate</h3>
    <div class="ficha__tabla">
      <span class="tabla-tipos__cabecera">Contra</span>
      <span class="tabla-tipos__cabecera">${d.alcance > 0 ? "Ataque a distancia" : "Ataque"}</span>
      <span class="tabla-tipos__cabecera">Defensa</span>
      ${TIPOS.map((t) => `
        <span class="tabla-tipos__tipo">${t.etiqueta}</span>
        ${celdaBarra(d.ataque[t.clave] ?? 0, maximo, tipoAtaque)}
        ${celdaBarra(d.defensa[t.clave] ?? 0, maximo, "defensa", t.soloAtaque || u.unSoloUso)}
      `).join("")}
    </div>

    <h3 class="subtitulo">Efectos del terreno</h3>
    ${tablaTerreno(d)}

    <h3 class="subtitulo">Coste de producción</h3>
    <div class="datos">${recursos.map((x) => tarjetaDato(x.etiqueta, d.coste[x.clave] ?? 0)).join("") || `<p class="nota">No se construye.</p>`}</div>

    ${recursos.length ? `
    <h3 class="subtitulo">Mantenimiento diario</h3>
    <div class="datos">${recursos.map((x) => tarjetaDato(x.etiqueta, d.mantenimiento[x.clave] ?? 0)).join("")}</div>` : ""}

    <h3 class="subtitulo">Evolución por nivel</h3>
    ${tablaEvolucion(u, niveles)}`;

    // Animación de las barras (igual que en Resultados)
    requestAnimationFrame(() => {
        uni.ficha.querySelectorAll(".barra__relleno").forEach((barra) => {
            barra.style.width = barra.dataset.ancho + "%";
        });
    });
}

// "+25 %", "−50 %" o "–" si no cambia
function textoPorcentaje(valor) {
    if (!valor) return "–";
    return `${valor > 0 ? "+" : "−"}${Math.abs(valor)} %`;
}

function tablaTerreno(d) {
    return `
    <div class="tabla-ficha tabla-ficha--terreno">
      <span class="tabla-tipos__cabecera">Terreno</span>
      <span class="tabla-tipos__cabecera">Vida</span>
      <span class="tabla-tipos__cabecera">Clase</span>
      <span class="tabla-tipos__cabecera">Velocidad</span>
      <span class="tabla-tipos__cabecera">Fuerza</span>
      ${TERRENOS.map((t) => {
        const x = d.terreno[t.id];
        if (!x) {
            return `<span class="tabla-tipos__tipo">${t.nombre}</span>
                  <span class="tabla-ficha__fila-entera">No puede estar aquí</span>`;
        }
        const clasePorcentaje = (v) => v > 0 ? "tabla-ficha__mas" : v < 0 ? "tabla-ficha__menos" : "";
        return `
          <span class="tabla-tipos__tipo">${t.nombre}</span>
          <span>${x.vida}</span>
          <span>${nombreTipo(x.clase)}</span>
          <span class="${clasePorcentaje(x.velocidad)}">${textoPorcentaje(x.velocidad)}</span>
          <span class="${clasePorcentaje(x.fuerza)}">${textoPorcentaje(x.fuerza)}</span>`;
    }).join("")}
    </div>`;
}

// Tabla con una fila por nivel: vida, velocidad, alcance, mejor ataque y coste total
function tablaEvolucion(u, niveles) {
    const e = estado.unidades;
    return `
    <div class="tabla-ficha tabla-ficha--evolucion">
      <span class="tabla-tipos__cabecera">Nivel</span>
      <span class="tabla-tipos__cabecera">Vida</span>
      <span class="tabla-tipos__cabecera">Velocidad</span>
      <span class="tabla-tipos__cabecera">Alcance</span>
      <span class="tabla-tipos__cabecera">Mejor ataque</span>
      <span class="tabla-tipos__cabecera">Coste total</span>
      ${niveles.map((n) => {
        const d = obtenerDatos(u.id, e.doctrina, n);
        // El tipo contra el que más daño hace este nivel
        const mejor = TIPOS.reduce((m, t) => ((d.ataque[t.clave] ?? 0) > (d.ataque[m.clave] ?? 0) ? t : m), TIPOS[0]);
        const costeTotal = RECURSOS.reduce((total, x) => total + (d.coste[x.clave] ?? 0), 0);
        const actual = n === e.nivel ? "tabla-ficha__actual" : "";
        return `
          <span class="${actual}"><strong>${n}</strong></span>
          <span class="${actual}">${formatearNumero(d.vida)}</span>
          <span class="${actual}">${formatearNumero(d.velocidad)}</span>
          <span class="${actual}">${formatearNumero(d.alcance)}</span>
          <span class="${actual}">${formatearNumero(d.ataque[mejor.clave] ?? 0)} <small>vs ${mejor.etiqueta.toLowerCase()}</small></span>
          <span class="${actual}">${formatearNumero(costeTotal)}</span>`;
    }).join("")}
    </div>`;
}

/* ---------------------------------------------------------
   EVENTOS
   (La tarjeta de doctrina la maneja app.js con data-destino="uni")
   --------------------------------------------------------- */

document.addEventListener("click", (evento) => {
    const e = estado.unidades;

    const seccion = evento.target.closest("[data-uni-seccion]");
    if (seccion) {
        e.seccion = seccion.dataset.uniSeccion;
        e.unidad = unidadesDeSeccion(e.seccion)[0].id;     // primera unidad de la sección
        e.nivel = 1;                                        // al cambiar de unidad, empezamos en nivel 1
        pintar();
        return;
    }

    const unidad = evento.target.closest("[data-uni-unidad]");
    if (unidad) {
        e.unidad = unidad.dataset.uniUnidad;
        e.nivel = 1;
        pintar();
        return;
    }

    const nivel = evento.target.closest("[data-uni-nivel]");
    if (nivel) {
        const niveles = nivelesDisponibles(e.unidad, e.doctrina);
        const nuevo = nivel.dataset.uniNivel === "subir"
            ? niveles.find((n) => n > e.nivel)
            : [...niveles].reverse().find((n) => n < e.nivel);
        if (nuevo !== undefined) e.nivel = nuevo;
        pintar();
        return;
    }

    if (evento.target.closest("[data-uni-anadir]")) {
        // Se añade al stack del simulador en el nivel que estás viendo
        const existente = estado.stack.find((f) => f.unidad === e.unidad && f.nivel === e.nivel);
        if (existente) existente.cantidad += 1;
        else estado.stack.push({ unidad: e.unidad, nivel: e.nivel, cantidad: 1 });
        pintar();
    }
});