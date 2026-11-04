/* =========================================================
   GUÍA: casi todo es texto fijo en index.html.
   Aquí solo se genera la tabla de qué datos hay de cada doctrina.
   ========================================================= */

function pintarGuia() {
    // Unidades que se construyen (el transporte y la bomba atómica no cuentan)
    const construibles = UNIDADES.filter((u) => u.construible !== false);

    const filas = DOCTRINAS.map((d) => {
        const conDatos = construibles.filter((u) => nivelesDisponibles(u.id, d.id).length > 0);
        const niveles = conDatos.reduce((total, u) => total + nivelesDisponibles(u.id, d.id).length, 0);
        const completa = conDatos.length === construibles.length;
        const estadoTexto = completa ? "✔ Completa" : conDatos.length === 0 ? "Pendiente" : "En curso";
        return `
      <span class="tabla-tipos__tipo">${d.nombre}</span>
      <span>${conDatos.length} / ${construibles.length}</span>
      <span>${niveles}</span>
      <span class="${completa ? "tabla-ficha__mas" : ""}">${estadoTexto}</span>`;
    }).join("");

    document.getElementById("guia-datos").innerHTML = `
    <div class="tabla-ficha guia__tabla">
      <span class="tabla-tipos__cabecera">Doctrina</span>
      <span class="tabla-tipos__cabecera">Unidades</span>
      <span class="tabla-tipos__cabecera">Niveles</span>
      <span class="tabla-tipos__cabecera">Estado</span>
      ${filas}
    </div>`;
}