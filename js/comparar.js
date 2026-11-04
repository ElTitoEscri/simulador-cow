/* =========================================================
   COMPARAR: dos stacks (A y B) lado a lado.
   Usa las mismas funciones que el simulador (calcularStack,
   htmlStack, anadirUnidad...) y el mismo "estado".
   Se carga ANTES que app.js; sus funciones se usan cuando
   app.js llama a pintarComparar().
   ========================================================= */

const cmp = {
    doctrinaA: document.getElementById("cmp-doctrina-a"),
    doctrinaB: document.getElementById("cmp-doctrina-b"),
    terreno: document.getElementById("cmp-terreno"),
    listaA: document.getElementById("cmp-lista-a"),
    listaB: document.getElementById("cmp-lista-b"),
    selectA: document.getElementById("cmp-select-a"),
    selectB: document.getElementById("cmp-select-b"),
    tabla: document.getElementById("cmp-tabla")
};

/* ---------------------------------------------------------
   PINTAR
   --------------------------------------------------------- */


function pintarComparar() {
    const c = estado.comparar;

    // Tarjetas de doctrina de cada stack y de terreno (las mismas que en el Simulador)
    cmp.doctrinaA.innerHTML = htmlDoctrinas(c.doctrina.a, "a");
    cmp.doctrinaB.innerHTML = htmlDoctrinas(c.doctrina.b, "b");
    cmp.terreno.innerHTML = htmlTerrenos(c.terreno, "cmp");

    // Filas de cada stack (mismo diseño que en el simulador)
    cmp.listaA.innerHTML = htmlStack(estado.comparar.a, "a", "Stack A vacío.");
    cmp.listaB.innerHTML = htmlStack(estado.comparar.b, "b", "Stack B vacío.");

    // Desplegables para añadir unidades
    cmp.selectA.innerHTML = opcionesUnidades(c.seleccion.a, c.doctrina.a);
    cmp.selectB.innerHTML = opcionesUnidades(c.seleccion.b, c.doctrina.b);

    pintarTablaComparacion();
}

// <option> de las unidades con datos en esa doctrina, agrupadas por sección (<optgroup>)
function opcionesUnidades(seleccionada, doctrina) {
    const html = SECCIONES.map((sec) => {
        const unidades = UNIDADES.filter((u) =>
            u.seccion === sec.id && u.construible !== false &&
            nivelesDisponibles(u.id, doctrina).length > 0);
        if (unidades.length === 0) return "";
        return `<optgroup label="${sec.nombre}">
      ${unidades.map((u) =>
            `<option value="${u.id}" ${u.id === seleccionada ? "selected" : ""}>${u.nombre}</option>`).join("")}
    </optgroup>`;
    }).join("");
    return html || `<option value="">Aún no hay unidades para esta doctrina</option>`;
}

/*
  Lista de filas a comparar, agrupadas.
  mejor: "mayor" (gana el que más tiene) o "menor" (gana el que menos: costes).
*/
function filasComparacion(ra, rb) {
    const grupos = [
        {
            titulo: "General", filas: [
                { etiqueta: "Vida", a: ra.vida, b: rb.vida, mejor: "mayor" },
                { etiqueta: "Velocidad", a: ra.velocidad, b: rb.velocidad, mejor: "mayor" },
                { etiqueta: "Visión", a: ra.vision, b: rb.vision, mejor: "mayor" },
                { etiqueta: "Alcance", a: ra.alcance, b: rb.alcance, mejor: "mayor" }
            ]
        },
        {
            titulo: "Ataque cuerpo a cuerpo contra", filas: TIPOS.map((t) =>
                ({ etiqueta: t.etiqueta, a: ra.ataque[t.clave], b: rb.ataque[t.clave], mejor: "mayor" }))
        },
        {
            titulo: "Ataque a distancia contra", filas: TIPOS.map((t) =>
                ({ etiqueta: t.etiqueta, a: ra.ataqueDistancia[t.clave], b: rb.ataqueDistancia[t.clave], mejor: "mayor" }))
        },
        {
            titulo: "Defensa contra", filas: TIPOS.filter((t) => !t.soloAtaque).map((t) =>
                ({ etiqueta: t.etiqueta, a: ra.defensa[t.clave], b: rb.defensa[t.clave], mejor: "mayor" }))
        },
        {
            titulo: "💥 Impacto de un solo uso contra", filas: TIPOS.map((t) =>
                ({ etiqueta: t.etiqueta, a: ra.impacto[t.clave], b: rb.impacto[t.clave], mejor: "mayor" }))
        },
        {
            titulo: "Coste de producción", filas: RECURSOS.map((x) =>
                ({ etiqueta: x.etiqueta, a: ra.coste[x.clave], b: rb.coste[x.clave], mejor: "menor" }))
        },
        {
            titulo: "Mantenimiento diario", filas: RECURSOS.map((x) =>
                ({ etiqueta: x.etiqueta, a: ra.mantenimiento[x.clave], b: rb.mantenimiento[x.clave], mejor: "menor" }))
        }
    ];

    // Quitamos las filas en las que los dos son 0 (no aportan nada) y los grupos vacíos
    return grupos
        .map((g) => ({ ...g, filas: g.filas.filter((f) => f.a !== 0 || f.b !== 0) }))
        .filter((g) => g.filas.length > 0);
}

// ¿Quién gana en una fila? "a", "b" o "empate"
function ganadorFila(f) {
    if (Math.abs(f.a - f.b) < 0.05) return "empate";   // diferencias de redondeo cuentan como empate
    const aMejor = f.mejor === "mayor" ? f.a > f.b : f.a < f.b;
    return aMejor ? "a" : "b";
}

function nombreDoctrina(id) {
    return buscarPorId(DOCTRINAS, id).nombre;
}

// Texto corto de un stack para la cabecera: "12 unidades ⚠ solo 10 hacen daño"
function resumenStack(r) {
    const combatientes = r.totalUnidades - r.sinDatos - r.fueraDeTerreno - r.misiles;
    let texto = `${r.totalUnidades} unidad(es)`;
    if (r.sinDatos > 0) texto += ` · ⚠ ${r.sinDatos} sin datos`;
    if (combatientes > MAX_UNIDADES_DANO) texto += ` · ⚠ solo ${MAX_UNIDADES_DANO} hacen daño`;
    if (r.fueraDeTerreno > 0) texto += ` · ${r.fueraDeTerreno} no combaten aquí`;
    return texto;
}

function pintarTablaComparacion() {
    const a = estado.comparar.a;
    const b = estado.comparar.b;

    if (a.length === 0 || b.length === 0) {
        cmp.tabla.innerHTML = `<p class="stack-vacio">Añade unidades a los dos stacks para compararlos.</p>`;
        return;
    }

    const c = estado.comparar;
    const ra = calcularStack(a, c.doctrina.a, c.terreno, opcionesCalculo());
    const rb = calcularStack(b, c.doctrina.b, c.terreno, opcionesCalculo());
    const grupos = filasComparacion(ra, rb);

    // Marcador: en cuántas filas gana cada uno
    let ganaA = 0, ganaB = 0;
    grupos.forEach((g) => g.filas.forEach((f) => {
        const w = ganadorFila(f);
        if (w === "a") ganaA++;
        if (w === "b") ganaB++;
    }));

    const celda = (valor, quien, ganador) => {
        const clase = ganador === "empate" ? "" : (ganador === quien ? "cmp-gana" : "cmp-pierde");
        return `<span class="cmp-valor ${clase}">${formatearNumero(valor)}</span>`;
    };

    const diferencia = (f, ganador) => {
        if (ganador === "empate") return `<span class="cmp-dif">=</span>`;
        return `<span class="cmp-dif">${ganador.toUpperCase()} +${formatearNumero(Math.abs(f.a - f.b))}</span>`;
    };

    cmp.tabla.innerHTML = `
    <div class="cmp-marcador">
      <span class="cmp-marcador__lado"><strong>A</strong> gana en ${ganaA}</span>
      <span class="cmp-marcador__vs">vs</span>
      <span class="cmp-marcador__lado"><strong>B</strong> gana en ${ganaB}</span>
    </div>

    <div class="cmp-tabla">
      <span class="cmp-tabla__cabecera">Estadística</span>
      <span class="cmp-tabla__cabecera">A<small>${nombreDoctrina(c.doctrina.a)} · ${resumenStack(ra)}</small></span>
      <span class="cmp-tabla__cabecera">B<small>${nombreDoctrina(c.doctrina.b)} · ${resumenStack(rb)}</small></span>
      <span class="cmp-tabla__cabecera">Diferencia</span>

      ${grupos.map((g) => `
        <span class="cmp-tabla__grupo">${g.titulo}</span>
        ${g.filas.map((f) => {
        const w = ganadorFila(f);
        return `
            <span class="cmp-tabla__etiqueta">${f.etiqueta}</span>
            ${celda(f.a, "a", w)}
            ${celda(f.b, "b", w)}
            ${diferencia(f, w)}`;
    }).join("")}
      `).join("")}
    </div>
    <p class="nota">Verde: gana. Rojo: pierde. En costes gana el que gasta menos.</p>`;
}

/* ---------------------------------------------------------
   EVENTOS (los botones de las filas los maneja app.js)
   --------------------------------------------------------- */

// (Las tarjetas de doctrina y terreno las maneja app.js con data-destino)

// Recordamos qué unidad hay elegida en cada desplegable
document.addEventListener("change", (evento) => {
    const select = evento.target.closest("[data-cmp-select]");
    if (!select) return;
    estado.comparar.seleccion[select.dataset.cmpSelect] = select.value;
    guardarEstado();
});

document.addEventListener("click", (evento) => {
    const anadir = evento.target.closest("[data-cmp-anadir]");
    const copiar = evento.target.closest("[data-cmp-copiar]");
    const vaciar = evento.target.closest("[data-cmp-vaciar]");

    if (anadir) {
        const lado = anadir.dataset.cmpAnadir;               // "a" o "b"
        const select = lado === "a" ? cmp.selectA : cmp.selectB;
        if (!select.value) return;
        estado.comparar.seleccion[lado] = select.value;
        anadirUnidad(estado.comparar[lado], select.value, estado.comparar.doctrina[lado]);
        pintar();
    }

    if (copiar) {
        const lado = copiar.dataset.cmpCopiar;
        // Copia independiente: cambiar luego un stack no cambia el otro
        estado.comparar[lado] = estado.stack.map((f) => ({ ...f }));
        estado.comparar.doctrina[lado] = estado.doctrina;   // también su doctrina
        pintar();
    }

    if (vaciar) {
        estado.comparar[vaciar.dataset.cmpVaciar] = [];
        pintar();
    }
});