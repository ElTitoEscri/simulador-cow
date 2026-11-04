/* =========================================================
   DATOS DEL JUEGO
   Los valores se copian TAL CUAL de la ficha "Información de
   la unidad" del juego (ya llevan aplicada la doctrina).
   ========================================================= */

const DOCTRINAS = [
  { id: "eje", nombre: "Eje", letra: "E" },
  { id: "aliados", nombre: "Aliados", letra: "A" },
  { id: "comintern", nombre: "Comunista", letra: "C" },
  { id: "panasia", nombre: "Panasianismo", letra: "P" }
];

const TERRENOS = [
  {
    id: "llanuras", nombre: "Llanuras", color: "#5d6b2c",
    icono: "M2 17h20M4 13h5M13 13h7M7 9h10"
  },
  {
    id: "colinas", nombre: "Colinas", color: "#6b5a2e",
    icono: "M2 18c3-6 6-6 9 0M9 18c3-8 7-8 11 0M2 18h20"
  },
  {
    id: "montanas", nombre: "Montañas", color: "#5e4f7a",
    icono: "M2 20l7-13 4 7 2-3 7 9zM7 11l2 2 2-2"
  },
  {
    id: "bosque", nombre: "Bosque", color: "#2f4a26",
    icono: "M7 3l-4 7h8zM7 10l-5 7h10zM7 17v4M17 6l-4 7h8zM17 13v8"
  },
  {
    id: "urbano", nombre: "Urbano", color: "#7a3b2a",
    icono: "M3 21V9h6v12M9 21V4h7v17M16 21v-9h5v9M2 21h20M12 8h1M12 12h1M12 16h1"
  },
  {
    id: "mar", nombre: "Mar", color: "#1f4a63",
    icono: "M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"
  }
];

// Los 8 tipos de objetivo de la tabla "Estadísticas de combate"
const TIPOS = [
  { clave: "noBlindado", etiqueta: "No blindado" },
  { clave: "ligero", etiqueta: "Blindaje ligero" },
  { clave: "pesado", etiqueta: "Blindaje pesado" },
  { clave: "avion", etiqueta: "Avión" },
  { clave: "barco", etiqueta: "Barco" },
  { clave: "submarino", etiqueta: "Submarino" },
  { clave: "edificios", etiqueta: "Edificios" },
  { clave: "moral", etiqueta: "Moral de provincia", soloAtaque: true }
];

// Recursos del juego. Para añadir uno nuevo (p. ej. materiales raros),
// basta con añadir una línea aquí y usar su clave en coste/mantenimiento.
const RECURSOS = [
  { clave: "comida", etiqueta: "Comida" },
  { clave: "mano", etiqueta: "Mano de obra" },
  { clave: "metal", etiqueta: "Metal" },
  { clave: "petroleo", etiqueta: "Petróleo" },
  { clave: "dinero", etiqueta: "Dinero" }
];

// Efectos del terreno de la infantería: iguales en todos los niveles,
// solo cambia la vida (en el mar siempre tiene 9 y pasa a clase "barco").
function terrenoInfanteria(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 40 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la milicia: iguales en todos los niveles, solo cambia la vida.
function terrenoMilicia(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 45 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 45 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la infantería motorizada: iguales en todos los niveles, solo cambia la vida.
function terrenoMotorizada(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 25, fuerza: 45 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: -25, fuerza: 0 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: -25, fuerza: 0 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 45 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la infantería mecanizada: en tierra es Blindaje ligero.
function terrenoMecanizada(vida) {
  return {
    llanuras: { vida: vida, clase: "ligero", velocidad: 25, fuerza: 45 },
    colinas: { vida: vida, clase: "ligero", velocidad: -25, fuerza: 0 },
    montanas: { vida: vida, clase: "ligero", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "ligero", velocidad: -25, fuerza: 0 },
    urbano: { vida: vida, clase: "ligero", velocidad: 0, fuerza: 45 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de los comandos: fuertes en montaña y bosque.
function terrenoComandos(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 70 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de los paracaidistas (en tierra).
function terrenoParacaidistas(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 45 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la unidad antitanque: fuerte en bosque y ciudad.
function terrenoAntitanque(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 45 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la artillería: fuerte en colinas y montañas.
function terrenoArtilleria(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 70 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la artillería AP: en tierra es Blindaje ligero.
function terrenoArtilleriaAP(vida) {
  return {
    llanuras: { vida: vida, clase: "ligero", velocidad: 25, fuerza: 40 },
    colinas: { vida: vida, clase: "ligero", velocidad: -25, fuerza: 70 },
    montanas: { vida: vida, clase: "ligero", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "ligero", velocidad: -25, fuerza: 0 },
    urbano: { vida: vida, clase: "ligero", velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la unidad antiaérea: fuerte en colinas y ciudad.
function terrenoAntiaerea(vida) {
  return {
    llanuras: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    colinas: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 70 },
    montanas: { vida: vida, clase: "noBlindado", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 0 },
    urbano: { vida: vida, clase: "noBlindado", velocidad: 0, fuerza: 45 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de la SP antiaérea: en tierra es Blindaje ligero.
function terrenoSPAntiaerea(vida) {
  return {
    llanuras: { vida: vida, clase: "ligero", velocidad: 25, fuerza: 45 },
    colinas: { vida: vida, clase: "ligero", velocidad: -25, fuerza: 70 },
    montanas: { vida: vida, clase: "ligero", velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: "ligero", velocidad: -25, fuerza: 0 },
    urbano: { vida: vida, clase: "ligero", velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno de los blindados rápidos (coche blindado, tanque ligero, tanque mediano):
// muy fuertes en llanuras. "clase" es "ligero" o "pesado" según la unidad.
function terrenoBlindado(vida, clase) {
  return {
    llanuras: { vida: vida, clase: clase, velocidad: 25, fuerza: 70 },
    colinas: { vida: vida, clase: clase, velocidad: -25, fuerza: 0 },
    montanas: { vida: vida, clase: clase, velocidad: -50, fuerza: 0 },
    bosque: { vida: vida, clase: clase, velocidad: -25, fuerza: 0 },
    urbano: { vida: vida, clase: clase, velocidad: 0, fuerza: 0 },
    mar: { vida: 9, clase: "barco", velocidad: 0, fuerza: 0 }
  };
}

// Efectos del terreno del destructor de tanques: como los tanques, pero además
// +45 % en bosque (su terreno de emboscada).
function terrenoDestructor(vida) {
  const t = terrenoBlindado(vida, "pesado");
  t.bosque.fuerza = 45;
  return t;
}

// Efectos del terreno de los aviones: vuelan, así que el terreno no les afecta.
// Son clase "Avión" en todas partes, también sobre el mar.
function terrenoAvion(vida) {
  const t = {};
  TERRENOS.forEach((ter) => {
    t[ter.id] = { vida: vida, clase: "avion", velocidad: 0, fuerza: 0 };
  });
  return t;
}

// Efectos del terreno del barco de transporte: solo existe en el mar.
function terrenoTransporte(vida) {
  return { mar: { vida: vida, clase: "barco", velocidad: 0, fuerza: 0 } };
}

// ¿Por dónde se mueve una unidad? "tierra", "aire" o "mar".
// Se deduce de la sección; una unidad puede indicarlo con la propiedad "medio".
function medioUnidad(unidad) {
  if (unidad.medio) return unidad.medio;
  if (unidad.seccion === "aire") return "aire";
  if (unidad.seccion === "naval") return "mar";
  return "tierra";
}

// Efectos del terreno de los barcos: solo pueden estar (y combatir) en el mar.
// "clase" es "barco" por defecto; los submarinos usan "submarino".
function terrenoNaval(vida, clase = "barco") {
  return { mar: { vida: vida, clase: clase, velocidad: 0, fuerza: 0 } };
}

// Efectos del terreno del cañón ferroviario: Blindaje pesado, la velocidad
// cambia como en los tanques pero no tiene bonus de fuerza en ningún terreno.
function terrenoCanon(vida) {
  const t = terrenoBlindado(vida, "pesado");
  t.llanuras.fuerza = 0;
  return t;
}

/*
  UNIDADES
  datos → doctrina → nivel → estadísticas de ese nivel.
  terreno: vida y clase que tiene la unidad en cada terreno,
           y % de velocidad y fuerza (0 = sin cambio).
*/
// Iconos por clase de unidad (trazados SVG), como los del árbol de investigación
const ICONOS = {
  soldado: "M12 3a2 2 0 1 0 .01 0M9 8h6l1 6h-2l-1 7h-2l-1-7H8zM15 9l5-3",
  vehiculo: "M3 15h18v4H3zM7 11h8v4H7zM15 12.5h6M5 19v1M19 19v1",
  tanque: "M2 15h20v4H2zM6 10h10v5H6zM16 11.5h6M4 19v1M20 19v1",
  avion: "M12 2v20M3 11l9-2 9 2M8 20l4-2 4 2",
  barco: "M12 3v15M8 7h8M5 12c0 5 3 8 7 8s7-3 7-8M3 12h4M17 12h4",
  submarino: "M2 15c0-3 4-4 10-4s10 1 10 4-4 3-10 3-10 0-10-3zM10 11V7h4v4M12 7V4"
};

// Secciones del árbol de investigación, en el mismo orden que el juego
const SECCIONES = [
  { id: "infanteria", nombre: "Infantería" },
  { id: "artilleria", nombre: "Artillería" },
  { id: "tanques", nombre: "Tanques" },
  { id: "aire", nombre: "Aire" },
  { id: "naval", nombre: "Naval" },
  { id: "secreto", nombre: "Secreto" }
];

/*
  UNIDADES
  seccion → a qué pestaña pertenece.
  icono   → clave de ICONOS.
  datos   → doctrina → nivel → estadísticas de ese nivel.
            Vacío ({}) = aún no hemos metido sus datos.
  terreno: vida y clase que tiene la unidad en cada terreno,
           y % de velocidad y fuerza (0 = sin cambio).
*/
const UNIDADES = [
  // ---------- INFANTERÍA ----------
  {
    id: "milicia", nombre: "Milicia", seccion: "infanteria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 14, velocidad: 29, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.7, ligero: 1.0, pesado: 0.5, avion: 1.0, barco: 0.5, submarino: 0.5, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 2.5, ligero: 1.5, pesado: 0.7, avion: 1.5, barco: 0.7, submarino: 0.7, edificios: 0.6 },
          terreno: terrenoMilicia(14),
          coste: { comida: 500, mano: 800, metal: 200, dinero: 600 },
          mantenimiento: { comida: 25, mano: 40, metal: 10, dinero: 30 }
        },
        2: {
          vida: 18, velocidad: 34, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.2, ligero: 1.7, pesado: 1.0, avion: 1.7, barco: 1.3, submarino: 1.3, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 4.8, ligero: 2.5, pesado: 1.5, avion: 2.5, barco: 1.9, submarino: 1.9, edificios: 0.9 },
          terreno: terrenoMilicia(18),
          coste: { comida: 550, mano: 850, metal: 250, dinero: 650 },
          mantenimiento: { comida: 28, mano: 43, metal: 13, dinero: 33 }
        },
        3: {
          vida: 27, velocidad: 38, vision: 54, alcance: 0,
          ataque: { noBlindado: 5.8, ligero: 3.0, pesado: 2.0, avion: 3.0, barco: 2.0, submarino: 2.0, edificios: 0.8, moral: 0.2 },
          defensa: { noBlindado: 8.7, ligero: 4.5, pesado: 3.0, avion: 4.5, barco: 3.0, submarino: 3.0, edificios: 1.2 },
          terreno: terrenoMilicia(27),
          coste: { comida: 650, mano: 850, metal: 300, dinero: 750 },
          mantenimiento: { comida: 33, mano: 43, metal: 15, dinero: 38 }
        },
        4: {
          vida: 41, velocidad: 43, vision: 54, alcance: 0,
          ataque: { noBlindado: 10.0, ligero: 5.8, pesado: 3.5, avion: 5.0, barco: 3.3, submarino: 3.3, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 15.0, ligero: 8.7, pesado: 5.3, avion: 7.5, barco: 4.9, submarino: 4.9, edificios: 1.8 },
          terreno: terrenoMilicia(41),
          coste: { comida: 750, mano: 900, metal: 350, dinero: 900 },
          mantenimiento: { comida: 38, mano: 45, metal: 18, dinero: 45 }
        }
      }
    }
  },
  {
    id: "inf", nombre: "Infantería", seccion: "infanteria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 15, velocidad: 43, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.0, ligero: 1.5, pesado: 1.0, avion: 1.0, barco: 0.5, submarino: 0.5, edificios: 0.2, moral: 0.1 },
          defensa: { noBlindado: 4.5, ligero: 2.3, pesado: 1.5, avion: 1.5, barco: 0.8, submarino: 0.8, edificios: 0.3 },
          terreno: terrenoInfanteria(15),
          coste: { comida: 1100, mano: 950, metal: 250, dinero: 800 },
          mantenimiento: { comida: 55, mano: 48, metal: 13, dinero: 40 }
        },
        2: {
          vida: 20, velocidad: 47, vision: 54, alcance: 0,
          ataque: { noBlindado: 4.0, ligero: 2.0, pesado: 1.5, avion: 1.5, barco: 1.0, submarino: 1.0, edificios: 0.3, moral: 0.1 },
          defensa: { noBlindado: 6.0, ligero: 3.0, pesado: 2.3, avion: 2.3, barco: 1.5, submarino: 1.5, edificios: 0.4 },
          terreno: terrenoInfanteria(20),
          coste: { comida: 1200, mano: 950, metal: 250, dinero: 800 },
          mantenimiento: { comida: 58, mano: 48, metal: 13, dinero: 40 }
        },
        3: {
          vida: 25, velocidad: 50, vision: 54, alcance: 0,
          ataque: { noBlindado: 5.5, ligero: 2.7, pesado: 2.0, avion: 2.0, barco: 1.5, submarino: 1.5, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 8.3, ligero: 4.1, pesado: 3.0, avion: 3.0, barco: 2.3, submarino: 2.3, edificios: 0.6 },
          terreno: terrenoInfanteria(25),
          coste: { comida: 1200, mano: 950, metal: 250, dinero: 850 },
          mantenimiento: { comida: 60, mano: 48, metal: 13, dinero: 43 }
        },
        4: {
          vida: 30, velocidad: 54, vision: 54, alcance: 0,
          ataque: { noBlindado: 7.0, ligero: 4.0, pesado: 3.0, avion: 3.0, barco: 2.0, submarino: 2.0, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 10.5, ligero: 6.0, pesado: 4.5, avion: 4.5, barco: 3.0, submarino: 3.0, edificios: 0.9 },
          terreno: terrenoInfanteria(30),
          coste: { comida: 1300, mano: 1000, metal: 250, dinero: 900 },
          mantenimiento: { comida: 63, mano: 50, metal: 13, dinero: 45 }
        },
        5: {
          vida: 40, velocidad: 58, vision: 54, alcance: 0,
          ataque: { noBlindado: 9.0, ligero: 5.0, pesado: 4.0, avion: 4.0, barco: 3.0, submarino: 3.0, edificios: 0.8, moral: 0.2 },
          defensa: { noBlindado: 13.5, ligero: 7.5, pesado: 6.0, avion: 6.0, barco: 4.5, submarino: 4.5, edificios: 1.2 },
          terreno: terrenoInfanteria(40),
          coste: { comida: 1400, mano: 1000, metal: 300, dinero: 1000 },
          mantenimiento: { comida: 70, mano: 50, metal: 15, dinero: 50 }
        },
        6: {
          vida: 50, velocidad: 61, vision: 54, alcance: 0,
          ataque: { noBlindado: 12.0, ligero: 7.0, pesado: 5.3, avion: 5.3, barco: 4.0, submarino: 4.0, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 18.0, ligero: 10.5, pesado: 8.0, avion: 8.0, barco: 6.0, submarino: 6.0, edificios: 1.8 },
          terreno: terrenoInfanteria(50),
          coste: { comida: 1600, mano: 1100, metal: 350, dinero: 1200 },
          mantenimiento: { comida: 80, mano: 53, metal: 18, dinero: 58 }
        },
        7: {
          vida: 65, velocidad: 65, vision: 54, alcance: 0,
          ataque: { noBlindado: 15.3, ligero: 9.3, pesado: 7.0, avion: 7.0, barco: 5.7, submarino: 5.7, edificios: 1.8, moral: 0.3 },
          defensa: { noBlindado: 22.9, ligero: 13.9, pesado: 10.5, avion: 10.5, barco: 8.5, submarino: 8.5, edificios: 2.7 },
          terreno: terrenoInfanteria(65),
          coste: { comida: 1800, mano: 1100, metal: 400, dinero: 1300 },
          mantenimiento: { comida: 88, mano: 53, metal: 20, dinero: 63 }
        }
      }
    }
  },
  {
    id: "inf-motorizada", nombre: "Infantería motorizada", seccion: "infanteria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 72, vision: 93, alcance: 0,
          ataque: { noBlindado: 6.0, ligero: 3.0, pesado: 2.3, avion: 2.3, barco: 1.5, submarino: 1.5, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 4.0, ligero: 2.0, pesado: 1.5, avion: 1.5, barco: 1.0, submarino: 1.0, edificios: 0.3 },
          terreno: terrenoMotorizada(18),
          coste: { comida: 1000, mano: 1200, petroleo: 1500, dinero: 1300 },
          mantenimiento: { comida: 50, mano: 58, petroleo: 75, dinero: 63 }
        },
        2: {
          vida: 23, velocidad: 80, vision: 93, alcance: 0,
          ataque: { noBlindado: 8.3, ligero: 4.2, pesado: 3.0, avion: 3.0, barco: 2.3, submarino: 2.3, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 5.5, ligero: 2.8, pesado: 2.0, avion: 2.0, barco: 1.5, submarino: 1.5, edificios: 0.4 },
          terreno: terrenoMotorizada(23),
          coste: { comida: 1100, mano: 1200, petroleo: 1600, dinero: 1300 },
          mantenimiento: { comida: 53, mano: 58, petroleo: 78, dinero: 65 }
        },
        3: {
          vida: 27, velocidad: 89, vision: 93, alcance: 0,
          ataque: { noBlindado: 11.0, ligero: 6.0, pesado: 4.5, avion: 4.5, barco: 3.0, submarino: 3.0, edificios: 1.0, moral: 0.1 },
          defensa: { noBlindado: 7.3, ligero: 4.0, pesado: 3.0, avion: 3.0, barco: 2.0, submarino: 2.0, edificios: 0.7 },
          terreno: terrenoMotorizada(27),
          coste: { comida: 1200, mano: 1200, petroleo: 1800, dinero: 1500 },
          mantenimiento: { comida: 58, mano: 58, petroleo: 88, dinero: 73 }
        },
        4: {
          vida: 36, velocidad: 97, vision: 93, alcance: 0,
          ataque: { noBlindado: 14.0, ligero: 7.5, pesado: 6.0, avion: 6.0, barco: 4.5, submarino: 4.5, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 9.3, ligero: 5.0, pesado: 4.0, avion: 4.0, barco: 3.0, submarino: 3.0, edificios: 0.8 },
          terreno: terrenoMotorizada(36),
          coste: { comida: 1300, mano: 1200, petroleo: 2000, dinero: 1700 },
          mantenimiento: { comida: 65, mano: 60, petroleo: 100, dinero: 83 }
        },
        5: {
          vida: 45, velocidad: 106, vision: 93, alcance: 0,
          ataque: { noBlindado: 18.5, ligero: 10.5, pesado: 8.0, avion: 8.0, barco: 6.0, submarino: 6.0, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 12.3, ligero: 7.0, pesado: 5.3, avion: 5.3, barco: 4.0, submarino: 4.0, edificios: 1.2 },
          terreno: terrenoMotorizada(45),
          coste: { comida: 1500, mano: 1300, petroleo: 2200, dinero: 1900 },
          mantenimiento: { comida: 75, mano: 63, petroleo: 110, dinero: 93 }
        },
        6: {
          vida: 59, velocidad: 114, vision: 93, alcance: 0,
          ataque: { noBlindado: 23.0, ligero: 14.0, pesado: 10.5, avion: 10.5, barco: 8.5, submarino: 8.5, edificios: 2.8, moral: 0.3 },
          defensa: { noBlindado: 15.3, ligero: 9.3, pesado: 7.0, avion: 7.0, barco: 5.7, submarino: 5.7, edificios: 1.9 },
          terreno: terrenoMotorizada(59),
          coste: { comida: 1700, mano: 1300, petroleo: 2500, dinero: 2100 },
          mantenimiento: { comida: 83, mano: 63, petroleo: 123, dinero: 103 }
        }
      }
    }
  },
  {
    id: "inf-mecanizada", nombre: "Infantería mecanizada", seccion: "infanteria", icono: "vehiculo",
    datos: {
      panasia: {
        1: {
          vida: 32, velocidad: 66, vision: 54, alcance: 0,
          ataque: { noBlindado: 8.5, ligero: 4.5, pesado: 3.5, avion: 3.5, barco: 2.0, submarino: 2.3, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 8.5, ligero: 4.5, pesado: 3.5, avion: 3.5, barco: 2.0, submarino: 2.3, edificios: 0.6 },
          terreno: terrenoMecanizada(32),
          coste: { mano: 1300, metal: 1500, petroleo: 1300, dinero: 1600 },
          mantenimiento: { mano: 63, metal: 73, petroleo: 65, dinero: 80 }
        },
        2: {
          vida: 41, velocidad: 74, vision: 54, alcance: 0,
          ataque: { noBlindado: 11.5, ligero: 6.5, pesado: 4.8, avion: 4.8, barco: 3.0, submarino: 3.0, edificios: 0.8, moral: 0.1 },
          defensa: { noBlindado: 11.5, ligero: 6.5, pesado: 4.8, avion: 4.8, barco: 3.0, submarino: 3.0, edificios: 0.8 },
          terreno: terrenoMecanizada(41),
          coste: { mano: 1300, metal: 1700, petroleo: 1500, dinero: 1900 },
          mantenimiento: { mano: 65, metal: 85, petroleo: 75, dinero: 93 }
        },
        3: {
          vida: 50, velocidad: 83, vision: 54, alcance: 0,
          ataque: { noBlindado: 14.5, ligero: 8.8, pesado: 6.5, avion: 6.5, barco: 4.5, submarino: 4.5, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 14.5, ligero: 8.8, pesado: 6.5, avion: 6.5, barco: 4.5, submarino: 4.5, edificios: 1.2 },
          terreno: terrenoMecanizada(50),
          coste: { mano: 1300, metal: 1900, petroleo: 1700, dinero: 2100 },
          mantenimiento: { mano: 65, metal: 95, petroleo: 85, dinero: 105 }
        },
        4: {
          vida: 63, velocidad: 91, vision: 54, alcance: 0,
          ataque: { noBlindado: 19.0, ligero: 11.5, pesado: 8.8, avion: 8.8, barco: 6.8, submarino: 6.0, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 19.0, ligero: 11.5, pesado: 8.8, avion: 8.8, barco: 6.8, submarino: 6.0, edificios: 1.8 },
          terreno: terrenoMecanizada(63),
          coste: { mano: 1400, metal: 2200, petroleo: 1900, dinero: 2400 },
          mantenimiento: { mano: 68, metal: 108, petroleo: 95, dinero: 118 }
        },
        5: {
          vida: 77, velocidad: 100, vision: 54, alcance: 0,
          ataque: { noBlindado: 23.5, ligero: 14.5, pesado: 11.5, avion: 11.5, barco: 8.5, submarino: 8.5, edificios: 2.8, moral: 0.3 },
          defensa: { noBlindado: 23.5, ligero: 14.5, pesado: 11.5, avion: 11.5, barco: 8.5, submarino: 8.5, edificios: 2.8 },
          terreno: terrenoMecanizada(77),
          coste: { mano: 1400, metal: 2400, petroleo: 2100, dinero: 2600 },
          mantenimiento: { mano: 70, metal: 118, petroleo: 105, dinero: 130 }
        }
      }
    }
  },
  {
    id: "comandos", nombre: "Comandos", seccion: "infanteria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 27, velocidad: 48, vision: 54, alcance: 0,
          ataque: { noBlindado: 8.0, ligero: 9.0, pesado: 6.0, avion: 2.0, barco: 2.0, submarino: 1.0, edificios: 4.0, moral: 0.4 },
          defensa: { noBlindado: 4.0, ligero: 4.5, pesado: 3.0, avion: 1.0, barco: 1.0, submarino: 0.5, edificios: 2.0 },
          terreno: terrenoComandos(27),
          coste: { comida: 2200, mano: 1100, petroleo: 1000, dinero: 2200 },
          mantenimiento: { comida: 108, mano: 53, petroleo: 50, dinero: 108 }
        },
        2: {
          vida: 36, velocidad: 55, vision: 54, alcance: 0,
          ataque: { noBlindado: 11.0, ligero: 12.0, pesado: 8.0, avion: 2.5, barco: 2.5, submarino: 1.5, edificios: 6.0, moral: 0.6 },
          defensa: { noBlindado: 5.5, ligero: 6.0, pesado: 4.0, avion: 1.2, barco: 1.2, submarino: 0.8, edificios: 3.0 },
          terreno: terrenoComandos(36),
          coste: { comida: 2500, mano: 1100, petroleo: 1200, dinero: 2500 },
          mantenimiento: { comida: 123, mano: 55, petroleo: 58, dinero: 123 }
        },
        3: {
          vida: 45, velocidad: 64, vision: 54, alcance: 0,
          ataque: { noBlindado: 14.5, ligero: 16.5, pesado: 11.0, avion: 3.5, barco: 3.5, submarino: 2.5, edificios: 8.5, moral: 0.9 },
          defensa: { noBlindado: 7.3, ligero: 8.3, pesado: 5.5, avion: 1.8, barco: 1.8, submarino: 1.3, edificios: 4.2 },
          terreno: terrenoComandos(45),
          coste: { comida: 2800, mano: 1100, petroleo: 1300, dinero: 2800 },
          mantenimiento: { comida: 138, mano: 55, petroleo: 65, dinero: 138 }
        },
        4: {
          vida: 59, velocidad: 72, vision: 54, alcance: 0,
          ataque: { noBlindado: 20.0, ligero: 23.0, pesado: 15.0, avion: 5.0, barco: 5.0, submarino: 3.5, edificios: 12.0, moral: 1.2 },
          defensa: { noBlindado: 10.0, ligero: 11.5, pesado: 7.5, avion: 2.5, barco: 2.5, submarino: 1.7, edificios: 6.0 },
          terreno: terrenoComandos(59),
          coste: { comida: 3200, mano: 1200, petroleo: 1500, dinero: 3200 },
          mantenimiento: { comida: 160, mano: 58, petroleo: 75, dinero: 160 }
        }
      }
    }
  },
  {
    // Datos de la forma "En tierra" (la forma aérea solo sirve para desplegarse)
    id: "paracaidistas", nombre: "Paracaidistas", seccion: "infanteria", icono: "avion",
    datos: {
      panasia: {
        1: {
          vida: 32, velocidad: 50, vision: 54, alcance: 0,
          ataque: { noBlindado: 9.0, ligero: 4.5, pesado: 3.0, avion: 1.0, barco: 1.0, submarino: 1.0, edificios: 0.8, moral: 0.1 },
          defensa: { noBlindado: 9.0, ligero: 4.5, pesado: 3.0, avion: 1.0, barco: 1.0, submarino: 1.0, edificios: 0.8 },
          terreno: terrenoParacaidistas(32),
          coste: { comida: 1400, mano: 1400, petroleo: 1200, dinero: 2600 },
          mantenimiento: { comida: 68, mano: 68, petroleo: 60, dinero: 128 }
        },
        2: {
          vida: 41, velocidad: 55, vision: 54, alcance: 0,
          ataque: { noBlindado: 11.0, ligero: 5.5, pesado: 4.0, avion: 1.5, barco: 1.5, submarino: 1.5, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 11.0, ligero: 5.5, pesado: 4.0, avion: 1.5, barco: 1.5, submarino: 1.5, edificios: 1.2 },
          terreno: terrenoParacaidistas(41),
          coste: { comida: 1600, mano: 1400, petroleo: 1400, dinero: 2900 },
          mantenimiento: { comida: 78, mano: 70, petroleo: 68, dinero: 145 }
        },
        3: {
          vida: 50, velocidad: 60, vision: 54, alcance: 0,
          ataque: { noBlindado: 14.5, ligero: 7.5, pesado: 5.5, avion: 2.5, barco: 2.5, submarino: 2.5, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 14.5, ligero: 7.5, pesado: 5.5, avion: 2.5, barco: 2.5, submarino: 2.5, edificios: 1.8 },
          terreno: terrenoParacaidistas(50),
          coste: { comida: 1800, mano: 1500, petroleo: 1500, dinero: 3300 },
          mantenimiento: { comida: 88, mano: 73, petroleo: 75, dinero: 163 }
        },
        4: {
          vida: 63, velocidad: 65, vision: 54, alcance: 0,
          ataque: { noBlindado: 20.0, ligero: 10.0, pesado: 7.0, avion: 4.0, barco: 4.0, submarino: 4.0, edificios: 2.8, moral: 0.3 },
          defensa: { noBlindado: 20.0, ligero: 10.0, pesado: 7.0, avion: 4.0, barco: 4.0, submarino: 4.0, edificios: 2.8 },
          terreno: terrenoParacaidistas(63),
          coste: { comida: 2000, mano: 1500, petroleo: 1800, dinero: 3800 },
          mantenimiento: { comida: 100, mano: 75, petroleo: 88, dinero: 190 }
        }
      }
    }
  },

  // ---------- ARTILLERÍA ----------
  {
    id: "antitanque", nombre: "Unidad antitanque", seccion: "artilleria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 14, velocidad: 36, vision: 54, alcance: 0,
          ataque: { noBlindado: 0.5, ligero: 2.3, pesado: 3.0, avion: 0.5, barco: 0.5, submarino: 0.5, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 1.0, ligero: 4.6, pesado: 6.0, avion: 1.0, barco: 1.0, submarino: 1.0, edificios: 0.8 },
          terreno: terrenoAntitanque(14),
          coste: { comida: 1100, mano: 750, metal: 550, dinero: 800 },
          mantenimiento: { comida: 53, mano: 38, metal: 28, dinero: 40 }
        },
        2: {
          vida: 18, velocidad: 42, vision: 54, alcance: 0,
          ataque: { noBlindado: 0.8, ligero: 3.3, pesado: 4.3, avion: 1.0, barco: 0.8, submarino: 0.8, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 1.6, ligero: 6.6, pesado: 8.6, avion: 2.0, barco: 1.6, submarino: 1.6, edificios: 1.2 },
          terreno: terrenoAntitanque(18),
          coste: { comida: 1200, mano: 750, metal: 600, dinero: 900 },
          mantenimiento: { comida: 58, mano: 38, metal: 30, dinero: 45 }
        },
        3: {
          vida: 27, velocidad: 46, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.0, ligero: 4.8, pesado: 6.0, avion: 1.5, barco: 1.0, submarino: 1.0, edificios: 0.8, moral: 0.1 },
          defensa: { noBlindado: 2.0, ligero: 9.6, pesado: 12.0, avion: 3.0, barco: 2.0, submarino: 2.0, edificios: 1.6 },
          terreno: terrenoAntitanque(27),
          coste: { comida: 1300, mano: 800, metal: 700, dinero: 1000 },
          mantenimiento: { comida: 63, mano: 40, metal: 35, dinero: 50 }
        },
        4: {
          vida: 36, velocidad: 49, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.5, ligero: 6.5, pesado: 8.0, avion: 2.0, barco: 1.5, submarino: 1.5, edificios: 1.2, moral: 0.1 },
          defensa: { noBlindado: 3.0, ligero: 13.0, pesado: 16.0, avion: 4.0, barco: 3.0, submarino: 3.0, edificios: 2.4 },
          terreno: terrenoAntitanque(36),
          coste: { comida: 1500, mano: 800, metal: 800, dinero: 1100 },
          mantenimiento: { comida: 73, mano: 40, metal: 40, dinero: 55 }
        },
        5: {
          vida: 45, velocidad: 54, vision: 54, alcance: 0,
          ataque: { noBlindado: 2.0, ligero: 8.5, pesado: 11.0, avion: 3.0, barco: 2.0, submarino: 2.0, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 4.0, ligero: 17.0, pesado: 22.0, avion: 6.0, barco: 4.0, submarino: 4.0, edificios: 3.6 },
          terreno: terrenoAntitanque(45),
          coste: { comida: 1600, mano: 850, metal: 850, dinero: 1300 },
          mantenimiento: { comida: 80, mano: 43, metal: 43, dinero: 63 }
        },
        6: {
          vida: 59, velocidad: 58, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.0, ligero: 11.3, pesado: 14.5, avion: 4.0, barco: 3.0, submarino: 3.0, edificios: 2.6, moral: 0.2 },
          defensa: { noBlindado: 6.0, ligero: 22.6, pesado: 29.0, avion: 8.0, barco: 6.0, submarino: 6.0, edificios: 5.2 },
          terreno: terrenoAntitanque(59),
          coste: { comida: 1800, mano: 850, metal: 950, dinero: 1400 },
          mantenimiento: { comida: 90, mano: 43, metal: 48, dinero: 70 }
        }
      }
    }
  },
  {
    id: "artilleria", nombre: "Artillería", seccion: "artilleria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 9, velocidad: 36, vision: 54, alcance: 50,
          ataque: { noBlindado: 1.7, ligero: 2.7, pesado: 2.0, avion: 1.0, barco: 2.0, submarino: 1.0, edificios: 2.5, moral: 0.7 },
          defensa: { noBlindado: 0.4, ligero: 0.7, pesado: 0.5, avion: 0.2, barco: 0.5, submarino: 0.2, edificios: 0.6 },
          terreno: terrenoArtilleria(9),
          coste: { comida: 1600, mano: 990, metal: 680, dinero: 1300 },
          mantenimiento: { comida: 90, mano: 55, metal: 38, dinero: 70 }
        },
        2: {
          vida: 14, velocidad: 42, vision: 54, alcance: 50,
          ataque: { noBlindado: 2.3, ligero: 4.0, pesado: 3.0, avion: 1.5, barco: 3.0, submarino: 1.5, edificios: 3.0, moral: 1.0 },
          defensa: { noBlindado: 0.6, ligero: 1.0, pesado: 0.8, avion: 0.4, barco: 0.8, submarino: 0.4, edificios: 0.8 },
          terreno: terrenoArtilleria(14),
          coste: { comida: 1800, mano: 990, metal: 770, dinero: 1400 },
          mantenimiento: { comida: 98, mano: 55, metal: 43, dinero: 78 }
        },
        3: {
          vida: 18, velocidad: 46, vision: 54, alcance: 50,
          ataque: { noBlindado: 3.2, ligero: 5.5, pesado: 4.0, avion: 2.0, barco: 4.0, submarino: 2.0, edificios: 4.0, moral: 1.4 },
          defensa: { noBlindado: 0.8, ligero: 1.4, pesado: 1.0, avion: 0.5, barco: 1.0, submarino: 0.5, edificios: 1.0 },
          terreno: terrenoArtilleria(18),
          coste: { comida: 2000, mano: 990, metal: 860, dinero: 1500 },
          mantenimiento: { comida: 110, mano: 55, metal: 48, dinero: 85 }
        },
        4: {
          vida: 23, velocidad: 49, vision: 54, alcance: 50,
          ataque: { noBlindado: 4.4, ligero: 7.5, pesado: 5.5, avion: 2.8, barco: 5.5, submarino: 2.8, edificios: 5.5, moral: 2.0 },
          defensa: { noBlindado: 1.1, ligero: 1.9, pesado: 1.4, avion: 0.7, barco: 1.4, submarino: 0.7, edificios: 1.4 },
          terreno: terrenoArtilleria(23),
          coste: { comida: 2300, mano: 1000, metal: 950, dinero: 1800 },
          mantenimiento: { comida: 125, mano: 58, metal: 53, dinero: 98 }
        },
        5: {
          vida: 27, velocidad: 54, vision: 54, alcance: 50,
          ataque: { noBlindado: 5.8, ligero: 10.3, pesado: 7.5, avion: 3.8, barco: 7.5, submarino: 3.8, edificios: 7.5, moral: 2.7 },
          defensa: { noBlindado: 1.5, ligero: 2.6, pesado: 1.9, avion: 1.0, barco: 1.9, submarino: 1.0, edificios: 1.9 },
          terreno: terrenoArtilleria(27),
          coste: { comida: 2500, mano: 1100, metal: 1100, dinero: 2000 },
          mantenimiento: { comida: 140, mano: 60, metal: 60, dinero: 110 }
        },
        6: {
          vida: 36, velocidad: 58, vision: 54, alcance: 50,
          ataque: { noBlindado: 7.5, ligero: 13.5, pesado: 9.8, avion: 5.0, barco: 9.8, submarino: 5.0, edificios: 10.0, moral: 3.5 },
          defensa: { noBlindado: 1.9, ligero: 3.4, pesado: 2.4, avion: 1.2, barco: 2.4, submarino: 1.2, edificios: 2.5 },
          terreno: terrenoArtilleria(36),
          coste: { comida: 2800, mano: 1100, metal: 1200, dinero: 2200 },
          mantenimiento: { comida: 155, mano: 60, metal: 65, dinero: 120 }
        }
      }
    }
  },
  {
    id: "artilleria-ap", nombre: "Artillería AP", seccion: "artilleria", icono: "vehiculo",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 59, vision: 54, alcance: 50,
          ataque: { noBlindado: 2.5, ligero: 3.5, pesado: 5.0, avion: 2.0, barco: 3.5, submarino: 2.0, edificios: 3.5, moral: 1.0 },
          defensa: { noBlindado: 0.6, ligero: 0.9, pesado: 1.3, avion: 0.5, barco: 0.9, submarino: 0.5, edificios: 0.9 },
          terreno: terrenoArtilleriaAP(18),
          coste: { mano: 1400, metal: 1800, petroleo: 1700, dinero: 2200 },
          mantenimiento: { mano: 70, metal: 90, petroleo: 83, dinero: 110 }
        },
        2: {
          vida: 23, velocidad: 66, vision: 54, alcance: 50,
          ataque: { noBlindado: 3.3, ligero: 4.5, pesado: 6.5, avion: 2.8, barco: 4.5, submarino: 2.8, edificios: 4.5, moral: 1.4 },
          defensa: { noBlindado: 0.8, ligero: 1.1, pesado: 1.6, avion: 0.7, barco: 1.1, submarino: 0.7, edificios: 1.1 },
          terreno: terrenoArtilleriaAP(23),
          coste: { mano: 1500, metal: 2100, petroleo: 1900, dinero: 2500 },
          mantenimiento: { mano: 73, metal: 105, petroleo: 95, dinero: 125 }
        },
        3: {
          vida: 27, velocidad: 73, vision: 54, alcance: 50,
          ataque: { noBlindado: 4.3, ligero: 6.0, pesado: 8.5, avion: 3.8, barco: 6.0, submarino: 3.8, edificios: 6.0, moral: 2.0 },
          defensa: { noBlindado: 1.1, ligero: 1.5, pesado: 2.1, avion: 1.0, barco: 1.5, submarino: 1.0, edificios: 1.5 },
          terreno: terrenoArtilleriaAP(27),
          coste: { mano: 1500, metal: 2400, petroleo: 2200, dinero: 2900 },
          mantenimiento: { mano: 73, metal: 118, petroleo: 108, dinero: 143 }
        },
        4: {
          vida: 36, velocidad: 80, vision: 54, alcance: 50,
          ataque: { noBlindado: 5.5, ligero: 8.0, pesado: 11.0, avion: 5.0, barco: 8.0, submarino: 5.0, edificios: 8.0, moral: 2.7 },
          defensa: { noBlindado: 1.4, ligero: 2.0, pesado: 2.8, avion: 1.3, barco: 2.0, submarino: 1.3, edificios: 2.0 },
          terreno: terrenoArtilleriaAP(36),
          coste: { mano: 1500, metal: 2700, petroleo: 2400, dinero: 3200 },
          mantenimiento: { mano: 75, metal: 133, petroleo: 118, dinero: 158 }
        },
        5: {
          vida: 50, velocidad: 88, vision: 54, alcance: 50,
          ataque: { noBlindado: 7.0, ligero: 10.5, pesado: 14.0, avion: 6.5, barco: 10.5, submarino: 6.5, edificios: 11.0, moral: 3.5 },
          defensa: { noBlindado: 1.8, ligero: 2.6, pesado: 3.5, avion: 1.6, barco: 2.6, submarino: 1.6, edificios: 2.7 },
          terreno: terrenoArtilleriaAP(50),
          coste: { mano: 1600, metal: 2900, petroleo: 2600, dinero: 3500 },
          mantenimiento: { mano: 78, metal: 145, petroleo: 130, dinero: 175 }
        }
      }
    }
  },
  {
    id: "antiaerea", nombre: "Unidad antiaérea", seccion: "artilleria", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 11, velocidad: 36, vision: 54, alcance: 0,
          ataque: { noBlindado: 0.5, ligero: 0.8, pesado: 1.3, avion: 2.8, barco: 0.5, submarino: 0.5, edificios: 0.2, moral: 0.1 },
          defensa: { noBlindado: 1.0, ligero: 1.6, pesado: 2.6, avion: 5.6, barco: 1.0, submarino: 1.0, edificios: 0.4 },
          terreno: terrenoAntiaerea(11),
          coste: { comida: 1000, mano: 850, metal: 600, dinero: 850 },
          mantenimiento: { comida: 50, mano: 43, metal: 30, dinero: 43 }
        },
        2: {
          vida: 15, velocidad: 42, vision: 54, alcance: 0,
          ataque: { noBlindado: 0.8, ligero: 1.0, pesado: 2.0, avion: 4.0, barco: 0.8, submarino: 0.8, edificios: 0.3, moral: 0.1 },
          defensa: { noBlindado: 1.6, ligero: 2.0, pesado: 4.0, avion: 8.0, barco: 1.6, submarino: 1.6, edificios: 0.6 },
          terreno: terrenoAntiaerea(15),
          coste: { comida: 1100, mano: 900, metal: 650, dinero: 900 },
          mantenimiento: { comida: 55, mano: 45, metal: 33, dinero: 45 }
        },
        3: {
          vida: 20, velocidad: 46, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.0, ligero: 1.5, pesado: 3.0, avion: 5.5, barco: 1.0, submarino: 1.0, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 2.0, ligero: 3.0, pesado: 6.0, avion: 11.0, barco: 2.0, submarino: 2.0, edificios: 0.8 },
          terreno: terrenoAntiaerea(20),
          coste: { comida: 1200, mano: 900, metal: 700, dinero: 1000 },
          mantenimiento: { comida: 60, mano: 45, metal: 35, dinero: 50 }
        },
        4: {
          vida: 24, velocidad: 49, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.5, ligero: 2.0, pesado: 4.3, avion: 7.5, barco: 1.5, submarino: 1.5, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 3.0, ligero: 4.0, pesado: 8.6, avion: 15.0, barco: 3.0, submarino: 3.0, edificios: 1.2 },
          terreno: terrenoAntiaerea(24),
          coste: { comida: 1400, mano: 950, metal: 800, dinero: 1200 },
          mantenimiento: { comida: 70, mano: 48, metal: 40, dinero: 58 }
        },
        5: {
          vida: 29, velocidad: 54, vision: 54, alcance: 0,
          ataque: { noBlindado: 2.0, ligero: 3.0, pesado: 6.0, avion: 10.0, barco: 2.0, submarino: 2.0, edificios: 0.8, moral: 0.2 },
          defensa: { noBlindado: 4.0, ligero: 6.0, pesado: 12.0, avion: 20.0, barco: 4.0, submarino: 4.0, edificios: 1.6 },
          terreno: terrenoAntiaerea(29),
          coste: { comida: 1600, mano: 950, metal: 900, dinero: 1300 },
          mantenimiento: { comida: 78, mano: 48, metal: 45, dinero: 65 }
        },
        6: {
          vida: 45, velocidad: 58, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.0, ligero: 4.5, pesado: 7.5, avion: 12.5, barco: 3.0, submarino: 3.0, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 6.0, ligero: 9.0, pesado: 15.0, avion: 25.0, barco: 6.0, submarino: 6.0, edificios: 2.4 },
          terreno: terrenoAntiaerea(45),
          coste: { comida: 1700, mano: 1000, metal: 1000, dinero: 1500 },
          mantenimiento: { comida: 85, mano: 50, metal: 50, dinero: 73 }
        }
      }
    }
  },
  {
    id: "sp-antiaerea", nombre: "SP Antiaérea", seccion: "artilleria", icono: "vehiculo",
    datos: {
      panasia: {
        1: {
          vida: 20, velocidad: 66, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.0, ligero: 2.3, pesado: 1.3, avion: 4.8, barco: 1.0, submarino: 1.0, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 2.0, ligero: 4.6, pesado: 2.6, avion: 9.6, barco: 2.0, submarino: 2.0, edificios: 0.8 },
          terreno: terrenoSPAntiaerea(20),
          coste: { comida: 900, mano: 1000, petroleo: 1700, dinero: 1400 },
          mantenimiento: { comida: 45, mano: 50, petroleo: 83, dinero: 70 }
        },
        2: {
          vida: 24, velocidad: 74, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.5, ligero: 3.0, pesado: 2.0, avion: 6.5, barco: 1.5, submarino: 1.5, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 3.0, ligero: 6.0, pesado: 4.0, avion: 13.0, barco: 3.0, submarino: 3.0, edificios: 1.2 },
          terreno: terrenoSPAntiaerea(24),
          coste: { comida: 1100, mano: 1000, petroleo: 1900, dinero: 1600 },
          mantenimiento: { comida: 53, mano: 50, petroleo: 95, dinero: 80 }
        },
        3: {
          vida: 29, velocidad: 83, vision: 54, alcance: 0,
          ataque: { noBlindado: 2.0, ligero: 4.0, pesado: 2.8, avion: 8.8, barco: 2.0, submarino: 2.0, edificios: 0.8, moral: 0.2 },
          defensa: { noBlindado: 4.0, ligero: 8.0, pesado: 5.6, avion: 17.6, barco: 4.0, submarino: 4.0, edificios: 1.6 },
          terreno: terrenoSPAntiaerea(29),
          coste: { comida: 1200, mano: 1100, petroleo: 2200, dinero: 1900 },
          mantenimiento: { comida: 58, mano: 53, petroleo: 108, dinero: 93 }
        },
        4: {
          vida: 38, velocidad: 91, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.0, ligero: 5.5, pesado: 3.8, avion: 11.3, barco: 3.0, submarino: 3.0, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 6.0, ligero: 11.0, pesado: 7.6, avion: 22.6, barco: 6.0, submarino: 6.0, edificios: 2.4 },
          terreno: terrenoSPAntiaerea(38),
          coste: { comida: 1300, mano: 1100, petroleo: 2400, dinero: 2100 },
          mantenimiento: { comida: 65, mano: 53, petroleo: 120, dinero: 103 }
        },
        5: {
          vida: 59, velocidad: 100, vision: 54, alcance: 0,
          ataque: { noBlindado: 4.0, ligero: 7.5, pesado: 5.3, avion: 14.0, barco: 4.0, submarino: 4.0, edificios: 1.8, moral: 0.3 },
          defensa: { noBlindado: 8.0, ligero: 15.0, pesado: 10.6, avion: 28.0, barco: 8.0, submarino: 8.0, edificios: 3.6 },
          terreno: terrenoSPAntiaerea(59),
          coste: { comida: 1500, mano: 1100, petroleo: 2700, dinero: 2300 },
          mantenimiento: { comida: 73, mano: 55, petroleo: 133, dinero: 113 }
        }
      }
    }
  },

  // ---------- TANQUES ----------
  {
    id: "coche-blindado", nombre: "Coche blindado", seccion: "tanques", icono: "vehiculo",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 66, vision: 93, alcance: 0,
          ataque: { noBlindado: 3.6, ligero: 1.0, pesado: 0.7, avion: 1.0, barco: 0.5, submarino: 0.5, edificios: 0.2, moral: 0.1 },
          defensa: { noBlindado: 5.4, ligero: 1.5, pesado: 1.0, avion: 1.5, barco: 0.8, submarino: 0.8, edificios: 0.3 },
          terreno: terrenoBlindado(18, "ligero"),
          coste: { mano: 1100, metal: 1100, petroleo: 1000, dinero: 1800 },
          mantenimiento: { mano: 53, metal: 55, petroleo: 50, dinero: 88 }
        },
        2: {
          vida: 27, velocidad: 76, vision: 93, alcance: 0,
          ataque: { noBlindado: 5.6, ligero: 2.0, pesado: 1.3, avion: 1.7, barco: 1.0, submarino: 1.0, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 8.4, ligero: 3.0, pesado: 1.9, avion: 2.6, barco: 1.5, submarino: 1.5, edificios: 0.6 },
          terreno: terrenoBlindado(27, "ligero"),
          coste: { mano: 1100, metal: 1200, petroleo: 1100, dinero: 1900 },
          mantenimiento: { mano: 53, metal: 60, petroleo: 53, dinero: 93 }
        },
        3: {
          vida: 41, velocidad: 86, vision: 93, alcance: 0,
          ataque: { noBlindado: 7.8, ligero: 3.3, pesado: 2.0, avion: 2.7, barco: 2.0, submarino: 2.0, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 11.7, ligero: 4.9, pesado: 3.0, avion: 4.1, barco: 3.0, submarino: 3.0, edificios: 0.9 },
          terreno: terrenoBlindado(41, "ligero"),
          coste: { mano: 1100, metal: 1400, petroleo: 1200, dinero: 2100 },
          mantenimiento: { mano: 55, metal: 68, petroleo: 60, dinero: 105 }
        },
        4: {
          vida: 59, velocidad: 100, vision: 93, alcance: 0,
          ataque: { noBlindado: 12.6, ligero: 5.3, pesado: 3.7, avion: 5.0, barco: 3.5, submarino: 3.5, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 18.9, ligero: 8.0, pesado: 5.5, avion: 7.5, barco: 5.2, submarino: 5.2, edificios: 1.8 },
          terreno: terrenoBlindado(59, "ligero"),
          coste: { mano: 1100, metal: 1600, petroleo: 1500, dinero: 2500 },
          mantenimiento: { mano: 55, metal: 80, petroleo: 73, dinero: 125 }
        },
        5: {
          vida: 77, velocidad: 114, vision: 93, alcance: 0,
          ataque: { noBlindado: 18.6, ligero: 8.0, pesado: 6.0, avion: 7.0, barco: 5.5, submarino: 5.5, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 27.9, ligero: 12.0, pesado: 9.0, avion: 10.5, barco: 8.2, submarino: 8.2, edificios: 2.7 },
          terreno: terrenoBlindado(77, "ligero"),
          coste: { mano: 1200, metal: 1900, petroleo: 1700, dinero: 3000 },
          mantenimiento: { mano: 58, metal: 95, petroleo: 85, dinero: 148 }
        }
      }
    }
  },
  {
    // Mismo terreno que el coche blindado
    id: "tanque-ligero", nombre: "Tanque ligero", seccion: "tanques", icono: "vehiculo",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 72, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.1, ligero: 4.6, pesado: 1.5, avion: 0.8, barco: 0.8, submarino: 0.8, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 2.1, ligero: 3.1, pesado: 1.0, avion: 0.5, barco: 0.5, submarino: 0.5, edificios: 0.3 },
          terreno: terrenoBlindado(18, "ligero"),
          coste: { mano: 900, metal: 1500, petroleo: 1400, dinero: 1100 },
          mantenimiento: { mano: 45, metal: 75, petroleo: 68, dinero: 55 }
        },
        2: {
          vida: 27, velocidad: 80, vision: 54, alcance: 0,
          ataque: { noBlindado: 4.6, ligero: 7.5, pesado: 2.5, avion: 1.5, barco: 1.5, submarino: 1.5, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 3.1, ligero: 5.0, pesado: 1.7, avion: 1.0, barco: 1.0, submarino: 1.0, edificios: 0.4 },
          terreno: terrenoBlindado(27, "ligero"),
          coste: { mano: 950, metal: 1600, petroleo: 1500, dinero: 1200 },
          mantenimiento: { mano: 48, metal: 80, petroleo: 73, dinero: 60 }
        },
        3: {
          vida: 41, velocidad: 89, vision: 54, alcance: 0,
          ataque: { noBlindado: 7.5, ligero: 11.5, pesado: 4.0, avion: 2.5, barco: 2.5, submarino: 2.5, edificios: 0.9, moral: 0.2 },
          defensa: { noBlindado: 5.0, ligero: 7.7, pesado: 2.7, avion: 1.7, barco: 1.7, submarino: 1.7, edificios: 0.6 },
          terreno: terrenoBlindado(41, "ligero"),
          coste: { mano: 950, metal: 1800, petroleo: 1700, dinero: 1400 },
          mantenimiento: { mano: 48, metal: 90, petroleo: 83, dinero: 68 }
        },
        4: {
          vida: 59, velocidad: 97, vision: 54, alcance: 0,
          ataque: { noBlindado: 12.1, ligero: 17.8, pesado: 7.5, avion: 4.0, barco: 4.0, submarino: 4.0, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 8.1, ligero: 11.9, pesado: 5.0, avion: 2.7, barco: 2.7, submarino: 2.7, edificios: 1.2 },
          terreno: terrenoBlindado(59, "ligero"),
          coste: { mano: 1000, metal: 2200, petroleo: 2000, dinero: 1600 },
          mantenimiento: { mano: 50, metal: 108, petroleo: 100, dinero: 80 }
        },
        5: {
          vida: 77, velocidad: 106, vision: 54, alcance: 0,
          ataque: { noBlindado: 17.8, ligero: 26.5, pesado: 11.0, avion: 6.0, barco: 6.0, submarino: 6.0, edificios: 2.8, moral: 0.3 },
          defensa: { noBlindado: 11.9, ligero: 17.7, pesado: 7.3, avion: 4.0, barco: 4.0, submarino: 4.0, edificios: 1.9 },
          terreno: terrenoBlindado(77, "ligero"),
          coste: { mano: 1100, metal: 2600, petroleo: 2300, dinero: 1900 },
          mantenimiento: { mano: 53, metal: 128, petroleo: 115, dinero: 95 }
        }
      }
    }
  },
  {
    id: "tanque-mediano", nombre: "Tanque mediano", seccion: "tanques", icono: "tanque",
    datos: {
      panasia: {
        1: {
          vida: 36, velocidad: 46, vision: 54, alcance: 0,
          ataque: { noBlindado: 4.5, ligero: 6.5, pesado: 3.5, avion: 0.8, barco: 1.0, submarino: 1.0, edificios: 0.6, moral: 0.2 },
          defensa: { noBlindado: 3.0, ligero: 4.3, pesado: 2.3, avion: 0.5, barco: 0.7, submarino: 0.7, edificios: 0.4 },
          terreno: terrenoBlindado(36, "pesado"),
          coste: { mano: 1400, metal: 1800, petroleo: 1900, dinero: 1800 },
          mantenimiento: { mano: 68, metal: 88, petroleo: 95, dinero: 88 }
        },
        2: {
          vida: 45, velocidad: 53, vision: 54, alcance: 0,
          ataque: { noBlindado: 6.0, ligero: 9.0, pesado: 4.8, avion: 1.5, barco: 2.0, submarino: 2.0, edificios: 1.0, moral: 0.3 },
          defensa: { noBlindado: 4.0, ligero: 6.0, pesado: 3.2, avion: 1.0, barco: 1.3, submarino: 1.3, edificios: 0.7 },
          terreno: terrenoBlindado(45, "pesado"),
          coste: { mano: 1400, metal: 2000, petroleo: 2100, dinero: 2000 },
          mantenimiento: { mano: 70, metal: 98, petroleo: 105, dinero: 98 }
        },
        3: {
          vida: 59, velocidad: 60, vision: 54, alcance: 0,
          ataque: { noBlindado: 8.0, ligero: 12.0, pesado: 6.3, avion: 2.0, barco: 3.0, submarino: 3.0, edificios: 1.6, moral: 0.5 },
          defensa: { noBlindado: 5.3, ligero: 8.0, pesado: 4.2, avion: 1.3, barco: 2.0, submarino: 2.0, edificios: 1.1 },
          terreno: terrenoBlindado(59, "pesado"),
          coste: { mano: 1500, metal: 2200, petroleo: 2400, dinero: 2200 },
          mantenimiento: { mano: 73, metal: 110, petroleo: 120, dinero: 110 }
        },
        4: {
          vida: 72, velocidad: 67, vision: 54, alcance: 0,
          ataque: { noBlindado: 10.5, ligero: 15.5, pesado: 8.0, avion: 3.0, barco: 4.0, submarino: 4.0, edificios: 2.4, moral: 0.7 },
          defensa: { noBlindado: 7.0, ligero: 10.3, pesado: 5.3, avion: 2.0, barco: 2.7, submarino: 2.7, edificios: 1.6 },
          terreno: terrenoBlindado(72, "pesado"),
          coste: { mano: 1500, metal: 2500, petroleo: 2700, dinero: 2500 },
          mantenimiento: { mano: 73, metal: 123, petroleo: 135, dinero: 123 }
        },
        5: {
          vida: 90, velocidad: 74, vision: 54, alcance: 0,
          ataque: { noBlindado: 13.8, ligero: 19.5, pesado: 10.3, avion: 4.5, barco: 5.5, submarino: 5.5, edificios: 3.5, moral: 1.0 },
          defensa: { noBlindado: 9.2, ligero: 13.0, pesado: 6.9, avion: 3.0, barco: 3.7, submarino: 3.7, edificios: 2.3 },
          terreno: terrenoBlindado(90, "pesado"),
          coste: { mano: 1500, metal: 2800, petroleo: 3000, dinero: 2800 },
          mantenimiento: { mano: 75, metal: 138, petroleo: 150, dinero: 138 }
        },
        6: {
          vida: 113, velocidad: 82, vision: 54, alcance: 0,
          ataque: { noBlindado: 17.5, ligero: 23.5, pesado: 13.0, avion: 6.0, barco: 7.0, submarino: 7.0, edificios: 5.0, moral: 1.5 },
          defensa: { noBlindado: 11.7, ligero: 15.7, pesado: 8.7, avion: 4.0, barco: 4.7, submarino: 4.7, edificios: 3.3 },
          terreno: terrenoBlindado(113, "pesado"),
          coste: { mano: 1600, metal: 3000, petroleo: 3300, dinero: 3000 },
          mantenimiento: { mano: 78, metal: 150, petroleo: 165, dinero: 150 }
        }
      }
    }
  },
  {
    id: "tanque-pesado", nombre: "Tanque pesado", seccion: "tanques", icono: "tanque",
    datos: {
      panasia: {
        1: {
          vida: 90, velocidad: 41, vision: 54, alcance: 0,
          ataque: { noBlindado: 5.5, ligero: 10.0, pesado: 8.0, avion: 2.0, barco: 2.5, submarino: 2.5, edificios: 3.0, moral: 1.0 },
          defensa: { noBlindado: 5.5, ligero: 10.0, pesado: 8.0, avion: 2.0, barco: 2.5, submarino: 2.5, edificios: 3.0 },
          terreno: terrenoBlindado(90, "pesado"),
          coste: { mano: 1300, metal: 2100, petroleo: 3100, dinero: 2600 },
          mantenimiento: { mano: 65, metal: 105, petroleo: 153, dinero: 130 }
        },
        2: {
          vida: 117, velocidad: 48, vision: 54, alcance: 0,
          ataque: { noBlindado: 7.0, ligero: 14.0, pesado: 11.0, avion: 3.0, barco: 4.0, submarino: 4.0, edificios: 4.0, moral: 1.3 },
          defensa: { noBlindado: 7.0, ligero: 14.0, pesado: 11.0, avion: 3.0, barco: 4.0, submarino: 4.0, edificios: 4.0 },
          terreno: terrenoBlindado(117, "pesado"),
          coste: { mano: 1400, metal: 2400, petroleo: 3500, dinero: 3000 },
          mantenimiento: { mano: 68, metal: 120, petroleo: 173, dinero: 148 }
        },
        3: {
          vida: 153, velocidad: 55, vision: 54, alcance: 0,
          ataque: { noBlindado: 10.0, ligero: 19.0, pesado: 15.0, avion: 4.0, barco: 5.5, submarino: 5.5, edificios: 6.0, moral: 1.8 },
          defensa: { noBlindado: 10.0, ligero: 19.0, pesado: 15.0, avion: 4.0, barco: 5.5, submarino: 5.5, edificios: 6.0 },
          terreno: terrenoBlindado(153, "pesado"),
          coste: { mano: 1400, metal: 2900, petroleo: 4100, dinero: 3500 },
          mantenimiento: { mano: 70, metal: 143, petroleo: 205, dinero: 173 }
        },
        4: {
          vida: 198, velocidad: 62, vision: 54, alcance: 0,
          ataque: { noBlindado: 14.0, ligero: 25.0, pesado: 20.0, avion: 5.0, barco: 7.0, submarino: 7.0, edificios: 9.0, moral: 2.5 },
          defensa: { noBlindado: 14.0, ligero: 25.0, pesado: 20.0, avion: 5.0, barco: 7.0, submarino: 7.0, edificios: 9.0 },
          terreno: terrenoBlindado(198, "pesado"),
          coste: { mano: 1500, metal: 3300, petroleo: 4800, dinero: 4000 },
          mantenimiento: { mano: 73, metal: 165, petroleo: 238, dinero: 200 }
        }
      }
    }
  },
  {
    id: "destructor-tanques", nombre: "Destructor de tanques", seccion: "tanques", icono: "tanque",
    datos: {
      panasia: {
        1: {
          vida: 36, velocidad: 46, vision: 54, alcance: 0,
          ataque: { noBlindado: 0.7, ligero: 4.0, pesado: 6.0, avion: 0.5, barco: 1.0, submarino: 1.0, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 1.1, ligero: 6.0, pesado: 9.0, avion: 0.8, barco: 1.5, submarino: 1.5, edificios: 0.6 },
          terreno: terrenoDestructor(36),
          coste: { mano: 1100, metal: 1900, petroleo: 1100, dinero: 2100 },
          mantenimiento: { mano: 55, metal: 95, petroleo: 55, dinero: 103 }
        },
        2: {
          vida: 45, velocidad: 53, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.0, ligero: 5.3, pesado: 8.0, avion: 1.0, barco: 1.5, submarino: 1.5, edificios: 0.6, moral: 0.2 },
          defensa: { noBlindado: 1.5, ligero: 7.9, pesado: 12.0, avion: 1.5, barco: 2.3, submarino: 2.3, edificios: 0.9 },
          terreno: terrenoDestructor(45),
          coste: { mano: 1200, metal: 2100, petroleo: 1300, dinero: 2300 },
          mantenimiento: { mano: 58, metal: 105, petroleo: 63, dinero: 115 }
        },
        3: {
          vida: 59, velocidad: 60, vision: 54, alcance: 0,
          ataque: { noBlindado: 1.5, ligero: 7.0, pesado: 11.0, avion: 1.3, barco: 2.0, submarino: 2.0, edificios: 1.0, moral: 0.3 },
          defensa: { noBlindado: 2.3, ligero: 10.5, pesado: 16.5, avion: 2.0, barco: 3.0, submarino: 3.0, edificios: 1.5 },
          terreno: terrenoDestructor(59),
          coste: { mano: 1200, metal: 2400, petroleo: 1400, dinero: 2600 },
          mantenimiento: { mano: 58, metal: 120, petroleo: 70, dinero: 130 }
        },
        4: {
          vida: 72, velocidad: 67, vision: 54, alcance: 0,
          ataque: { noBlindado: 2.3, ligero: 9.3, pesado: 15.0, avion: 2.0, barco: 3.0, submarino: 3.0, edificios: 1.6, moral: 0.5 },
          defensa: { noBlindado: 3.5, ligero: 13.9, pesado: 22.5, avion: 3.0, barco: 4.5, submarino: 4.5, edificios: 2.4 },
          terreno: terrenoDestructor(72),
          coste: { mano: 1200, metal: 2700, petroleo: 1600, dinero: 3000 },
          mantenimiento: { mano: 60, metal: 135, petroleo: 80, dinero: 148 }
        },
        5: {
          vida: 90, velocidad: 74, vision: 54, alcance: 0,
          ataque: { noBlindado: 3.5, ligero: 12.0, pesado: 20.0, avion: 3.0, barco: 4.0, submarino: 4.0, edificios: 2.4, moral: 0.7 },
          defensa: { noBlindado: 5.3, ligero: 18.0, pesado: 30.0, avion: 4.5, barco: 6.0, submarino: 6.0, edificios: 3.6 },
          terreno: terrenoDestructor(90),
          coste: { mano: 1200, metal: 3000, petroleo: 1800, dinero: 3300 },
          mantenimiento: { mano: 60, metal: 150, petroleo: 88, dinero: 163 }
        },
        6: {
          vida: 113, velocidad: 82, vision: 54, alcance: 0,
          ataque: { noBlindado: 4.7, ligero: 15.3, pesado: 26.0, avion: 4.0, barco: 5.0, submarino: 5.0, edificios: 3.5, moral: 1.0 },
          defensa: { noBlindado: 7.0, ligero: 22.9, pesado: 39.0, avion: 6.0, barco: 7.5, submarino: 7.5, edificios: 5.3 },
          terreno: terrenoDestructor(113),
          coste: { mano: 1300, metal: 3300, petroleo: 1900, dinero: 3600 },
          mantenimiento: { mano: 63, metal: 165, petroleo: 95, dinero: 178 }
        }
      }
    }
  },

  // ---------- AIRE ----------
  {
    id: "interceptor", nombre: "Interceptor", seccion: "aire", icono: "avion",
    datos: {
      panasia: {
        1: {
          vida: 14, velocidad: 576, vision: 39, alcance: 300,
          ataque: { noBlindado: 0.8, ligero: 0.5, pesado: 0.5, avion: 6.9, barco: 0.5, submarino: 0.5, edificios: 0.2, moral: 0.1 },
          defensa: { noBlindado: 0.5, ligero: 0.3, pesado: 0.3, avion: 4.6, barco: 0.3, submarino: 0.3, edificios: 0.1 },
          terreno: terrenoAvion(14),
          coste: { comida: 950, mano: 800, petroleo: 950, dinero: 1500 },
          mantenimiento: { comida: 48, mano: 40, petroleo: 48, dinero: 75 }
        },
        2: {
          vida: 18, velocidad: 660, vision: 39, alcance: 350,
          ataque: { noBlindado: 1.5, ligero: 1.0, pesado: 1.0, avion: 9.2, barco: 1.0, submarino: 1.0, edificios: 0.3, moral: 0.1 },
          defensa: { noBlindado: 1.0, ligero: 0.7, pesado: 0.7, avion: 6.1, barco: 0.7, submarino: 0.7, edificios: 0.2 },
          terreno: terrenoAvion(18),
          coste: { comida: 1000, mano: 800, petroleo: 1000, dinero: 1600 },
          mantenimiento: { comida: 50, mano: 40, petroleo: 50, dinero: 80 }
        },
        3: {
          vida: 23, velocidad: 744, vision: 39, alcance: 400,
          ataque: { noBlindado: 2.0, ligero: 1.5, pesado: 1.5, avion: 11.5, barco: 1.5, submarino: 1.5, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 1.3, ligero: 1.0, pesado: 1.0, avion: 7.7, barco: 1.0, submarino: 1.0, edificios: 0.3 },
          terreno: terrenoAvion(23),
          coste: { comida: 1100, mano: 800, petroleo: 1100, dinero: 1700 },
          mantenimiento: { comida: 55, mano: 40, petroleo: 55, dinero: 85 }
        },
        4: {
          vida: 27, velocidad: 828, vision: 39, alcance: 450,
          ataque: { noBlindado: 3.0, ligero: 2.5, pesado: 2.5, avion: 15.0, barco: 2.5, submarino: 2.5, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 2.0, ligero: 1.7, pesado: 1.7, avion: 10.0, barco: 1.7, submarino: 1.7, edificios: 0.4 },
          terreno: terrenoAvion(27),
          coste: { comida: 1300, mano: 850, petroleo: 1300, dinero: 2000 },
          mantenimiento: { comida: 63, mano: 43, petroleo: 63, dinero: 98 }
        },
        5: {
          vida: 36, velocidad: 912, vision: 39, alcance: 500,
          ataque: { noBlindado: 4.3, ligero: 3.8, pesado: 3.8, avion: 19.6, barco: 3.8, submarino: 3.8, edificios: 0.8, moral: 0.2 },
          defensa: { noBlindado: 2.9, ligero: 2.5, pesado: 2.5, avion: 13.1, barco: 2.5, submarino: 2.5, edificios: 0.5 },
          terreno: terrenoAvion(36),
          coste: { comida: 1400, mano: 850, petroleo: 1400, dinero: 2200 },
          mantenimiento: { comida: 70, mano: 43, petroleo: 70, dinero: 110 }
        },
        6: {
          vida: 45, velocidad: 996, vision: 39, alcance: 600,
          ataque: { noBlindado: 5.8, ligero: 5.0, pesado: 5.0, avion: 25.3, barco: 5.0, submarino: 5.0, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 3.9, ligero: 3.3, pesado: 3.3, avion: 16.9, barco: 3.3, submarino: 3.3, edificios: 0.8 },
          terreno: terrenoAvion(45),
          coste: { comida: 1600, mano: 900, petroleo: 1600, dinero: 2500 },
          mantenimiento: { comida: 80, mano: 45, petroleo: 80, dinero: 123 }
        },
        7: {
          vida: 59, velocidad: 1080, vision: 39, alcance: 650,
          ataque: { noBlindado: 7.5, ligero: 6.5, pesado: 6.5, avion: 32.2, barco: 6.5, submarino: 6.5, edificios: 1.8, moral: 0.3 },
          defensa: { noBlindado: 5.0, ligero: 4.3, pesado: 4.3, avion: 21.5, barco: 4.3, submarino: 4.3, edificios: 1.2 },
          terreno: terrenoAvion(59),
          coste: { comida: 1800, mano: 900, petroleo: 1800, dinero: 2700 },
          mantenimiento: { comida: 88, mano: 45, petroleo: 88, dinero: 135 }
        }
      }
    }
  },
  {
    id: "bomb-tactico", nombre: "Bombardero táctico", seccion: "aire", icono: "avion",
    datos: {
      panasia: {
        1: {
          vida: 23, velocidad: 420, vision: 39, alcance: 350,
          ataque: { noBlindado: 4.5, ligero: 3.0, pesado: 1.5, avion: 1.0, barco: 1.5, submarino: 1.0, edificios: 1.5, moral: 1.0 },
          defensa: { noBlindado: 2.3, ligero: 1.5, pesado: 0.8, avion: 0.5, barco: 0.8, submarino: 0.5, edificios: 0.8 },
          terreno: terrenoAvion(23),
          coste: { comida: 2100, mano: 1300, petroleo: 1300, dinero: 1600 },
          mantenimiento: { comida: 105, mano: 65, petroleo: 65, dinero: 80 }
        },
        2: {
          vida: 27, velocidad: 480, vision: 39, alcance: 400,
          ataque: { noBlindado: 6.0, ligero: 4.0, pesado: 2.0, avion: 1.5, barco: 2.0, submarino: 1.5, edificios: 2.0, moral: 1.2 },
          defensa: { noBlindado: 3.0, ligero: 2.0, pesado: 1.0, avion: 0.8, barco: 1.0, submarino: 0.8, edificios: 1.0 },
          terreno: terrenoAvion(27),
          coste: { comida: 2300, mano: 1300, petroleo: 1400, dinero: 1800 },
          mantenimiento: { comida: 113, mano: 65, petroleo: 70, dinero: 88 }
        },
        3: {
          vida: 36, velocidad: 552, vision: 39, alcance: 450,
          ataque: { noBlindado: 8.5, ligero: 5.5, pesado: 2.5, avion: 2.0, barco: 2.5, submarino: 2.0, edificios: 2.8, moral: 1.5 },
          defensa: { noBlindado: 4.3, ligero: 2.8, pesado: 1.3, avion: 1.0, barco: 1.3, submarino: 1.0, edificios: 1.4 },
          terreno: terrenoAvion(36),
          coste: { comida: 2400, mano: 1400, petroleo: 1500, dinero: 1900 },
          mantenimiento: { comida: 120, mano: 68, petroleo: 75, dinero: 93 }
        },
        4: {
          vida: 50, velocidad: 624, vision: 39, alcance: 500,
          ataque: { noBlindado: 11.5, ligero: 7.5, pesado: 3.5, avion: 3.0, barco: 3.5, submarino: 3.0, edificios: 4.0, moral: 1.9 },
          defensa: { noBlindado: 5.8, ligero: 3.8, pesado: 1.7, avion: 1.5, barco: 1.7, submarino: 1.5, edificios: 2.0 },
          terreno: terrenoAvion(50),
          coste: { comida: 2800, mano: 1400, petroleo: 1700, dinero: 2100 },
          mantenimiento: { comida: 138, mano: 70, petroleo: 85, dinero: 105 }
        },
        5: {
          vida: 59, velocidad: 696, vision: 39, alcance: 550,
          ataque: { noBlindado: 15.0, ligero: 10.0, pesado: 5.0, avion: 4.0, barco: 5.0, submarino: 4.0, edificios: 5.5, moral: 2.5 },
          defensa: { noBlindado: 7.5, ligero: 5.0, pesado: 2.5, avion: 2.0, barco: 2.5, submarino: 2.0, edificios: 2.8 },
          terreno: terrenoAvion(59),
          coste: { comida: 3100, mano: 1400, petroleo: 1900, dinero: 2400 },
          mantenimiento: { comida: 155, mano: 70, petroleo: 95, dinero: 118 }
        },
        6: {
          vida: 72, velocidad: 768, vision: 39, alcance: 600,
          ataque: { noBlindado: 19.0, ligero: 13.0, pesado: 7.0, avion: 5.5, barco: 7.0, submarino: 5.5, edificios: 7.5, moral: 3.2 },
          defensa: { noBlindado: 9.5, ligero: 6.5, pesado: 3.5, avion: 2.7, barco: 3.5, submarino: 2.7, edificios: 3.8 },
          terreno: terrenoAvion(72),
          coste: { comida: 3400, mano: 1500, petroleo: 2100, dinero: 2600 },
          mantenimiento: { comida: 170, mano: 73, petroleo: 105, dinero: 130 }
        },
        7: {
          vida: 90, velocidad: 840, vision: 39, alcance: 650,
          ataque: { noBlindado: 23.5, ligero: 17.0, pesado: 10.0, avion: 7.0, barco: 10.0, submarino: 7.0, edificios: 10.0, moral: 4.0 },
          defensa: { noBlindado: 11.8, ligero: 8.5, pesado: 5.0, avion: 3.5, barco: 5.0, submarino: 3.5, edificios: 5.0 },
          terreno: terrenoAvion(90),
          coste: { comida: 3800, mano: 1500, petroleo: 2300, dinero: 2900 },
          mantenimiento: { comida: 188, mano: 75, petroleo: 115, dinero: 145 }
        }
      }
    }
  },
  {
    id: "bomb-ofensivo", nombre: "Bombardero ofensivo", seccion: "aire", icono: "avion",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 552, vision: 39, alcance: 300,
          ataque: { noBlindado: 1.0, ligero: 4.3, pesado: 5.5, avion: 1.0, barco: 4.3, submarino: 1.0, edificios: 0.7, moral: 0.2 },
          defensa: { noBlindado: 0.5, ligero: 2.2, pesado: 2.8, avion: 0.5, barco: 2.2, submarino: 0.5, edificios: 0.4 },
          terreno: terrenoAvion(18),
          coste: { comida: 1100, mano: 1100, petroleo: 1600, dinero: 1500 },
          mantenimiento: { comida: 53, mano: 53, petroleo: 78, dinero: 73 }
        },
        2: {
          vida: 27, velocidad: 648, vision: 39, alcance: 350,
          ataque: { noBlindado: 2.0, ligero: 7.5, pesado: 9.0, avion: 2.0, barco: 7.5, submarino: 2.0, edificios: 1.0, moral: 0.3 },
          defensa: { noBlindado: 1.0, ligero: 3.7, pesado: 4.5, avion: 1.0, barco: 3.7, submarino: 1.0, edificios: 0.5 },
          terreno: terrenoAvion(27),
          coste: { comida: 1200, mano: 1100, petroleo: 1800, dinero: 1700 },
          mantenimiento: { comida: 60, mano: 55, petroleo: 90, dinero: 83 }
        },
        3: {
          vida: 36, velocidad: 744, vision: 39, alcance: 400,
          ataque: { noBlindado: 3.5, ligero: 11.5, pesado: 13.5, avion: 3.5, barco: 11.0, submarino: 3.5, edificios: 1.4, moral: 0.5 },
          defensa: { noBlindado: 1.7, ligero: 5.8, pesado: 6.8, avion: 1.7, barco: 5.5, submarino: 1.7, edificios: 0.7 },
          terreno: terrenoAvion(36),
          coste: { comida: 1400, mano: 1100, petroleo: 2100, dinero: 1900 },
          mantenimiento: { comida: 68, mano: 55, petroleo: 103, dinero: 95 }
        },
        4: {
          vida: 50, velocidad: 852, vision: 39, alcance: 500,
          ataque: { noBlindado: 5.0, ligero: 16.0, pesado: 20.0, avion: 5.0, barco: 15.5, submarino: 5.0, edificios: 2.0, moral: 0.7 },
          defensa: { noBlindado: 2.5, ligero: 8.0, pesado: 10.0, avion: 2.5, barco: 7.8, submarino: 2.5, edificios: 1.0 },
          terreno: terrenoAvion(50),
          coste: { comida: 1600, mano: 1200, petroleo: 2500, dinero: 2300 },
          mantenimiento: { comida: 80, mano: 58, petroleo: 123, dinero: 113 }
        },
        5: {
          vida: 68, velocidad: 960, vision: 39, alcance: 550,
          ataque: { noBlindado: 7.0, ligero: 23.0, pesado: 29.0, avion: 7.0, barco: 22.0, submarino: 7.0, edificios: 3.0, moral: 1.0 },
          defensa: { noBlindado: 3.5, ligero: 11.5, pesado: 14.5, avion: 3.5, barco: 11.0, submarino: 3.5, edificios: 1.5 },
          terreno: terrenoAvion(68),
          coste: { comida: 1800, mano: 1200, petroleo: 2700, dinero: 2500 },
          mantenimiento: { comida: 90, mano: 60, petroleo: 135, dinero: 123 }
        }
      }
    }
  },
  {
    id: "bomb-estrategico", nombre: "Bombardero estratégico", seccion: "aire", icono: "avion",
    datos: {
      panasia: {
        1: {
          vida: 27, velocidad: 420, vision: 39, alcance: 600,
          ataque: { noBlindado: 1.3, ligero: 1.3, pesado: 1.3, avion: 2.0, barco: 1.0, submarino: 0.8, edificios: 12.0, moral: 2.5 },
          defensa: { noBlindado: 0.6, ligero: 0.6, pesado: 0.6, avion: 1.0, barco: 0.5, submarino: 0.4, edificios: 6.0 },
          terreno: terrenoAvion(27),
          coste: { comida: 1600, mano: 2000, petroleo: 1600, dinero: 1800 },
          mantenimiento: { comida: 80, mano: 98, petroleo: 80, dinero: 90 }
        },
        2: {
          vida: 36, velocidad: 480, vision: 39, alcance: 800,
          ataque: { noBlindado: 1.7, ligero: 1.7, pesado: 1.7, avion: 2.5, barco: 1.3, submarino: 1.0, edificios: 16.0, moral: 3.5 },
          defensa: { noBlindado: 0.8, ligero: 0.8, pesado: 0.8, avion: 1.3, barco: 0.7, submarino: 0.5, edificios: 8.0 },
          terreno: terrenoAvion(36),
          coste: { comida: 1800, mano: 2000, petroleo: 1800, dinero: 2000 },
          mantenimiento: { comida: 88, mano: 100, petroleo: 88, dinero: 98 }
        },
        3: {
          vida: 45, velocidad: 552, vision: 39, alcance: 1000,
          ataque: { noBlindado: 2.3, ligero: 2.3, pesado: 2.3, avion: 3.5, barco: 1.7, submarino: 1.3, edificios: 22.0, moral: 5.0 },
          defensa: { noBlindado: 1.1, ligero: 1.1, pesado: 1.1, avion: 1.7, barco: 0.9, submarino: 0.7, edificios: 11.0 },
          terreno: terrenoAvion(45),
          coste: { comida: 1900, mano: 2000, petroleo: 1900, dinero: 2100 },
          mantenimiento: { comida: 95, mano: 100, petroleo: 95, dinero: 105 }
        },
        4: {
          vida: 59, velocidad: 624, vision: 39, alcance: 1200,
          ataque: { noBlindado: 3.2, ligero: 3.2, pesado: 3.2, avion: 5.0, barco: 2.3, submarino: 1.7, edificios: 30.0, moral: 6.5 },
          defensa: { noBlindado: 1.6, ligero: 1.6, pesado: 1.6, avion: 2.5, barco: 1.2, submarino: 0.9, edificios: 15.0 },
          terreno: terrenoAvion(59),
          coste: { comida: 2200, mano: 2100, petroleo: 2200, dinero: 2400 },
          mantenimiento: { comida: 108, mano: 105, petroleo: 108, dinero: 120 }
        },
        5: {
          vida: 77, velocidad: 696, vision: 39, alcance: 1400,
          ataque: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 7.0, barco: 3.2, submarino: 2.3, edificios: 40.0, moral: 9.0 },
          defensa: { noBlindado: 2.3, ligero: 2.3, pesado: 2.3, avion: 3.5, barco: 1.6, submarino: 1.1, edificios: 20.0 },
          terreno: terrenoAvion(77),
          coste: { comida: 2400, mano: 2200, petroleo: 2400, dinero: 2700 },
          mantenimiento: { comida: 120, mano: 108, petroleo: 120, dinero: 133 }
        },
        6: {
          vida: 95, velocidad: 768, vision: 39, alcance: 1600,
          ataque: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 9.5, barco: 4.5, submarino: 3.2, edificios: 52.0, moral: 12.0 },
          defensa: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 4.7, barco: 2.3, submarino: 1.6, edificios: 26.0 },
          terreno: terrenoAvion(95),
          coste: { comida: 2700, mano: 2200, petroleo: 2700, dinero: 3000 },
          mantenimiento: { comida: 133, mano: 110, petroleo: 133, dinero: 148 }
        },
        7: {
          vida: 117, velocidad: 840, vision: 39, alcance: 1800,
          ataque: { noBlindado: 8.0, ligero: 8.0, pesado: 8.0, avion: 12.5, barco: 6.0, submarino: 4.5, edificios: 66.0, moral: 16.0 },
          defensa: { noBlindado: 4.0, ligero: 4.0, pesado: 4.0, avion: 6.3, barco: 3.0, submarino: 2.3, edificios: 33.0 },
          terreno: terrenoAvion(117),
          coste: { comida: 2900, mano: 2300, petroleo: 2900, dinero: 3300 },
          mantenimiento: { comida: 145, mano: 113, petroleo: 145, dinero: 163 }
        }
      }
    }
  },
  {
    id: "bomb-naval", nombre: "Bombardero naval", seccion: "aire", icono: "avion",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 420, vision: 39, alcance: 350,
          ataque: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 1.0, barco: 8.1, submarino: 5.8, edificios: 0.2, moral: 0.1 },
          defensa: { noBlindado: 0.5, ligero: 0.5, pesado: 0.5, avion: 0.5, barco: 4.0, submarino: 2.9, edificios: 0.1 },
          terreno: terrenoAvion(18),
          coste: { comida: 1200, mano: 700, petroleo: 1300, dinero: 1100 },
          mantenimiento: { comida: 60, mano: 35, petroleo: 65, dinero: 55 }
        },
        2: {
          vida: 23, velocidad: 480, vision: 39, alcance: 400,
          ataque: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 1.5, barco: 10.9, submarino: 8.1, edificios: 0.4, moral: 0.1 },
          defensa: { noBlindado: 0.8, ligero: 0.8, pesado: 0.8, avion: 0.8, barco: 5.5, submarino: 4.1, edificios: 0.2 },
          terreno: terrenoAvion(23),
          coste: { comida: 1300, mano: 700, petroleo: 1400, dinero: 1200 },
          mantenimiento: { comida: 63, mano: 35, petroleo: 68, dinero: 58 }
        },
        3: {
          vida: 32, velocidad: 552, vision: 39, alcance: 450,
          ataque: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 2.0, barco: 14.4, submarino: 10.9, edificios: 0.6, moral: 0.1 },
          defensa: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 1.0, barco: 7.2, submarino: 5.4, edificios: 0.3 },
          terreno: terrenoAvion(32),
          coste: { comida: 1400, mano: 700, petroleo: 1500, dinero: 1200 },
          mantenimiento: { comida: 68, mano: 35, petroleo: 73, dinero: 60 }
        },
        4: {
          vida: 41, velocidad: 624, vision: 39, alcance: 500,
          ataque: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 3.0, barco: 18.4, submarino: 14.4, edificios: 1.0, moral: 0.1 },
          defensa: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 1.5, barco: 9.2, submarino: 7.2, edificios: 0.5 },
          terreno: terrenoAvion(41),
          coste: { comida: 1600, mano: 750, petroleo: 1700, dinero: 1400 },
          mantenimiento: { comida: 78, mano: 38, petroleo: 83, dinero: 70 }
        },
        5: {
          vida: 50, velocidad: 696, vision: 39, alcance: 550,
          ataque: { noBlindado: 4.0, ligero: 4.0, pesado: 4.0, avion: 4.0, barco: 24.2, submarino: 18.4, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 2.0, barco: 12.1, submarino: 9.2, edificios: 0.6 },
          terreno: terrenoAvion(50),
          coste: { comida: 1800, mano: 750, petroleo: 1900, dinero: 1600 },
          mantenimiento: { comida: 88, mano: 38, petroleo: 95, dinero: 80 }
        },
        6: {
          vida: 63, velocidad: 768, vision: 39, alcance: 600,
          ataque: { noBlindado: 5.5, ligero: 5.5, pesado: 5.5, avion: 5.5, barco: 31.1, submarino: 23.0, edificios: 1.8, moral: 0.2 },
          defensa: { noBlindado: 2.7, ligero: 2.7, pesado: 2.7, avion: 2.7, barco: 15.6, submarino: 11.5, edificios: 0.9 },
          terreno: terrenoAvion(63),
          coste: { comida: 2000, mano: 800, petroleo: 2100, dinero: 1800 },
          mantenimiento: { comida: 98, mano: 40, petroleo: 105, dinero: 88 }
        },
        7: {
          vida: 77, velocidad: 840, vision: 39, alcance: 650,
          ataque: { noBlindado: 7.0, ligero: 7.0, pesado: 7.0, avion: 7.0, barco: 39.1, submarino: 28.8, edificios: 2.8, moral: 0.3 },
          defensa: { noBlindado: 3.5, ligero: 3.5, pesado: 3.5, avion: 3.5, barco: 19.6, submarino: 14.4, edificios: 1.4 },
          terreno: terrenoAvion(77),
          coste: { comida: 2200, mano: 800, petroleo: 2300, dinero: 2000 },
          mantenimiento: { comida: 108, mano: 40, petroleo: 115, dinero: 98 }
        }
      }
    }
  },

  // ---------- NAVAL ----------
  {
    id: "destructor", nombre: "Destructor", seccion: "naval", icono: "barco",
    datos: {
      panasia: {
        1: {
          vida: 27, velocidad: 106, vision: 60, alcance: 0,
          ataque: { noBlindado: 0.5, ligero: 0.5, pesado: 0.5, avion: 2.0, barco: 2.5, submarino: 7.5 },
          defensa: { noBlindado: 0.5, ligero: 0.5, pesado: 0.5, avion: 2.0, barco: 2.5, submarino: 7.5 },
          terreno: terrenoNaval(27),
          coste: { comida: 1000, mano: 800, metal: 1200, dinero: 1300 },
          mantenimiento: { comida: 50, mano: 40, metal: 60, dinero: 65 }
        },
        2: {
          vida: 36, velocidad: 115, vision: 63, alcance: 0,
          ataque: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 2.5, barco: 3.5, submarino: 10.5 },
          defensa: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 2.5, barco: 3.5, submarino: 10.5 },
          terreno: terrenoNaval(36),
          coste: { comida: 1100, mano: 850, metal: 1300, dinero: 1500 },
          mantenimiento: { comida: 55, mano: 43, metal: 65, dinero: 73 }
        },
        3: {
          vida: 50, velocidad: 125, vision: 66, alcance: 0,
          ataque: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 3.5, barco: 5.0, submarino: 14.5 },
          defensa: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 3.5, barco: 5.0, submarino: 14.5 },
          terreno: terrenoNaval(50),
          coste: { comida: 1200, mano: 850, metal: 1500, dinero: 1600 },
          mantenimiento: { comida: 60, mano: 43, metal: 73, dinero: 80 }
        },
        4: {
          vida: 68, velocidad: 134, vision: 69, alcance: 0,
          ataque: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 5.0, barco: 6.5, submarino: 19.5 },
          defensa: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 5.0, barco: 6.5, submarino: 19.5 },
          terreno: terrenoNaval(68),
          coste: { comida: 1400, mano: 850, metal: 1700, dinero: 1800 },
          mantenimiento: { comida: 68, mano: 43, metal: 83, dinero: 90 }
        },
        5: {
          vida: 86, velocidad: 144, vision: 75, alcance: 0,
          ataque: { noBlindado: 4.0, ligero: 4.0, pesado: 4.0, avion: 7.0, barco: 8.5, submarino: 26.0 },
          defensa: { noBlindado: 4.0, ligero: 4.0, pesado: 4.0, avion: 7.0, barco: 8.5, submarino: 26.0 },
          terreno: terrenoNaval(86),
          coste: { comida: 1600, mano: 900, metal: 2000, dinero: 2200 },
          mantenimiento: { comida: 80, mano: 45, metal: 98, dinero: 108 }
        },
        6: {
          vida: 108, velocidad: 154, vision: 78, alcance: 0,
          ataque: { noBlindado: 5.0, ligero: 5.0, pesado: 5.0, avion: 9.5, barco: 11.0, submarino: 34.0 },
          defensa: { noBlindado: 5.0, ligero: 5.0, pesado: 5.0, avion: 9.5, barco: 11.0, submarino: 34.0 },
          terreno: terrenoNaval(108),
          coste: { comida: 1800, mano: 950, metal: 2200, dinero: 2400 },
          mantenimiento: { comida: 90, mano: 48, metal: 110, dinero: 118 }
        }
      }
    }
  },
  {
    id: "submarino", nombre: "Submarino", seccion: "naval", icono: "submarino",
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 78, vision: 60, alcance: 0,
          ataque: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 1.0, barco: 6.5, submarino: 3.0 },
          defensa: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 1.0, barco: 6.5, submarino: 3.0 },
          terreno: terrenoNaval(18, "submarino"),
          coste: { comida: 950, mano: 700, petroleo: 950, dinero: 1600 },
          mantenimiento: { comida: 48, mano: 35, petroleo: 48, dinero: 80 }
        },
        2: {
          vida: 27, velocidad: 85, vision: 63, alcance: 0,
          ataque: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 1.5, barco: 9.0, submarino: 4.0 },
          defensa: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 1.5, barco: 9.0, submarino: 4.0 },
          terreno: terrenoNaval(27, "submarino"),
          coste: { comida: 1100, mano: 700, petroleo: 1100, dinero: 1700 },
          mantenimiento: { comida: 53, mano: 35, petroleo: 53, dinero: 85 }
        },
        3: {
          vida: 36, velocidad: 92, vision: 66, alcance: 0,
          ataque: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 2.0, barco: 12.0, submarino: 5.5 },
          defensa: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 2.0, barco: 12.0, submarino: 5.5 },
          terreno: terrenoNaval(36, "submarino"),
          coste: { comida: 1200, mano: 700, petroleo: 1200, dinero: 1900 },
          mantenimiento: { comida: 58, mano: 35, petroleo: 58, dinero: 95 }
        },
        4: {
          vida: 50, velocidad: 100, vision: 69, alcance: 0,
          ataque: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 3.0, barco: 16.0, submarino: 7.5 },
          defensa: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 3.0, barco: 16.0, submarino: 7.5 },
          terreno: terrenoNaval(50, "submarino"),
          coste: { comida: 1300, mano: 750, petroleo: 1300, dinero: 2200 },
          mantenimiento: { comida: 65, mano: 38, petroleo: 65, dinero: 110 }
        },
        5: {
          vida: 63, velocidad: 107, vision: 75, alcance: 0,
          ataque: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 4.5, barco: 21.5, submarino: 10.0 },
          defensa: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 4.5, barco: 21.5, submarino: 10.0 },
          terreno: terrenoNaval(63, "submarino"),
          coste: { comida: 1600, mano: 750, petroleo: 1600, dinero: 2600 },
          mantenimiento: { comida: 78, mano: 38, petroleo: 78, dinero: 128 }
        },
        6: {
          vida: 81, velocidad: 114, vision: 78, alcance: 0,
          ataque: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 6.0, barco: 28.0, submarino: 13.0 },
          defensa: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 6.0, barco: 28.0, submarino: 13.0 },
          terreno: terrenoNaval(81, "submarino"),
          coste: { comida: 1700, mano: 800, petroleo: 1700, dinero: 2900 },
          mantenimiento: { comida: 85, mano: 40, petroleo: 85, dinero: 143 }
        }
      }
    }
  },
  {
    id: "crucero", nombre: "Crucero", seccion: "naval", icono: "barco",
    datos: {
      panasia: {
        1: {
          vida: 32, velocidad: 90, vision: 93, alcance: 50,
          ataque: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 6.0, barco: 4.0, submarino: 2.3, edificios: 1.5, moral: 0.5 },
          defensa: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 6.0, barco: 4.0, submarino: 2.3, edificios: 1.5 },
          terreno: terrenoNaval(32),
          coste: { comida: 1900, mano: 1000, metal: 1100, dinero: 1400 },
          mantenimiento: { comida: 95, mano: 50, metal: 55, dinero: 68 }
        },
        2: {
          vida: 45, velocidad: 97, vision: 99, alcance: 50,
          ataque: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 8.0, barco: 5.5, submarino: 3.0, edificios: 2.0, moral: 0.8 },
          defensa: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 8.0, barco: 5.5, submarino: 3.0, edificios: 2.0 },
          terreno: terrenoNaval(45),
          coste: { comida: 2100, mano: 1000, metal: 1200, dinero: 1500 },
          mantenimiento: { comida: 103, mano: 50, metal: 58, dinero: 73 }
        },
        3: {
          vida: 63, velocidad: 104, vision: 102, alcance: 50,
          ataque: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 11.0, barco: 7.5, submarino: 4.0, edificios: 2.6, moral: 1.2 },
          defensa: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 11.0, barco: 7.5, submarino: 4.0, edificios: 2.6 },
          terreno: terrenoNaval(63),
          coste: { comida: 2300, mano: 1100, metal: 1300, dinero: 1700 },
          mantenimiento: { comida: 115, mano: 53, metal: 65, dinero: 83 }
        },
        4: {
          vida: 81, velocidad: 112, vision: 105, alcance: 50,
          ataque: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 15.0, barco: 10.0, submarino: 5.5, edificios: 3.4, moral: 1.7 },
          defensa: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 15.0, barco: 10.0, submarino: 5.5, edificios: 3.4 },
          terreno: terrenoNaval(81),
          coste: { comida: 2600, mano: 1100, metal: 1500, dinero: 1900 },
          mantenimiento: { comida: 130, mano: 53, metal: 75, dinero: 93 }
        },
        5: {
          vida: 104, velocidad: 119, vision: 108, alcance: 50,
          ataque: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 20.0, barco: 13.5, submarino: 7.0, edificios: 4.5, moral: 2.3 },
          defensa: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 20.0, barco: 13.5, submarino: 7.0, edificios: 4.5 },
          terreno: terrenoNaval(104),
          coste: { comida: 3100, mano: 1100, metal: 1800, dinero: 2200 },
          mantenimiento: { comida: 153, mano: 55, metal: 88, dinero: 110 }
        },
        6: {
          vida: 126, velocidad: 126, vision: 114, alcance: 50,
          ataque: { noBlindado: 8.0, ligero: 8.0, pesado: 8.0, avion: 26.0, barco: 18.0, submarino: 9.5, edificios: 6.0, moral: 3.0 },
          defensa: { noBlindado: 8.0, ligero: 8.0, pesado: 8.0, avion: 26.0, barco: 18.0, submarino: 9.5, edificios: 6.0 },
          terreno: terrenoNaval(126),
          coste: { comida: 3400, mano: 1200, metal: 2000, dinero: 2400 },
          mantenimiento: { comida: 170, mano: 58, metal: 98, dinero: 120 }
        }
      }
    }
  },
  {
    id: "buque-guerra", nombre: "Buque de guerra", seccion: "naval", icono: "barco",
    datos: {
      panasia: {
        1: {
          vida: 50, velocidad: 66, vision: 78, alcance: 75,
          ataque: { noBlindado: 3.3, ligero: 3.3, pesado: 3.3, avion: 1.7, barco: 8.3, submarino: 1.7, edificios: 3.3, moral: 1.1 },
          defensa: { noBlindado: 3.3, ligero: 3.3, pesado: 3.3, avion: 1.7, barco: 8.3, submarino: 1.7, edificios: 3.3 },
          terreno: terrenoNaval(50),
          coste: { comida: 900, mano: 1700, metal: 2700, dinero: 1800 },
          mantenimiento: { comida: 45, mano: 83, metal: 135, dinero: 90 }
        },
        2: {
          vida: 65, velocidad: 73, vision: 78, alcance: 75,
          ataque: { noBlindado: 5.0, ligero: 5.0, pesado: 5.0, avion: 2.2, barco: 11.6, submarino: 2.2, edificios: 4.7, moral: 1.5 },
          defensa: { noBlindado: 5.0, ligero: 5.0, pesado: 5.0, avion: 2.2, barco: 11.6, submarino: 2.2, edificios: 4.7 },
          terreno: terrenoNaval(65),
          coste: { comida: 950, mano: 1700, metal: 2900, dinero: 2000 },
          mantenimiento: { comida: 48, mano: 83, metal: 145, dinero: 98 }
        },
        3: {
          vida: 85, velocidad: 80, vision: 78, alcance: 75,
          ataque: { noBlindado: 6.6, ligero: 6.6, pesado: 6.6, avion: 3.3, barco: 16.0, submarino: 3.3, edificios: 6.6, moral: 2.2 },
          defensa: { noBlindado: 6.6, ligero: 6.6, pesado: 6.6, avion: 3.3, barco: 16.0, submarino: 3.3, edificios: 6.6 },
          terreno: terrenoNaval(85),
          coste: { comida: 1100, mano: 1700, metal: 3400, dinero: 2300 },
          mantenimiento: { comida: 55, mano: 85, metal: 168, dinero: 113 }
        },
        4: {
          vida: 115, velocidad: 88, vision: 78, alcance: 75,
          ataque: { noBlindado: 8.8, ligero: 8.8, pesado: 8.8, avion: 4.4, barco: 21.5, submarino: 4.4, edificios: 8.8, moral: 3.0 },
          defensa: { noBlindado: 8.8, ligero: 8.8, pesado: 8.8, avion: 4.4, barco: 21.5, submarino: 4.4, edificios: 8.8 },
          terreno: terrenoNaval(115),
          coste: { comida: 1300, mano: 1800, metal: 3800, dinero: 2500 },
          mantenimiento: { comida: 63, mano: 88, metal: 190, dinero: 125 }
        },
        5: {
          vida: 155, velocidad: 95, vision: 78, alcance: 75,
          ataque: { noBlindado: 11.6, ligero: 11.6, pesado: 11.6, avion: 6.1, barco: 28.6, submarino: 6.1, edificios: 11.6, moral: 3.9 },
          defensa: { noBlindado: 11.6, ligero: 11.6, pesado: 11.6, avion: 6.1, barco: 28.6, submarino: 6.1, edificios: 11.6 },
          terreno: terrenoNaval(155),
          coste: { comida: 1500, mano: 1800, metal: 4500, dinero: 3000 },
          mantenimiento: { comida: 75, mano: 90, metal: 223, dinero: 148 }
        },
        6: {
          vida: 200, velocidad: 102, vision: 78, alcance: 75,
          ataque: { noBlindado: 15.4, ligero: 15.4, pesado: 15.4, avion: 7.7, barco: 37.4, submarino: 7.7, edificios: 15.4, moral: 5.0 },
          defensa: { noBlindado: 15.4, ligero: 15.4, pesado: 15.4, avion: 7.7, barco: 37.4, submarino: 7.7, edificios: 15.4 },
          terreno: terrenoNaval(200),
          coste: { comida: 1600, mano: 1900, metal: 4900, dinero: 3300 },
          mantenimiento: { comida: 80, mano: 93, metal: 243, dinero: 163 }
        }
      }
    }
  },
  {
    // capacidadAviones: cuántos aviones puede transportar
    id: "portaaviones", nombre: "Portaaviones", seccion: "naval", icono: "barco",
    datos: {
      panasia: {
        1: {
          vida: 45, velocidad: 66, vision: 60, alcance: 0, capacidadAviones: 3,
          ataque: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 2.0, barco: 2.0, submarino: 1.5 },
          defensa: { noBlindado: 1.0, ligero: 1.0, pesado: 1.0, avion: 2.0, barco: 2.0, submarino: 1.5 },
          terreno: terrenoNaval(45),
          coste: { comida: 1200, mano: 1500, metal: 1100, dinero: 2100 },
          mantenimiento: { comida: 60, mano: 75, metal: 53, dinero: 105 }
        },
        2: {
          vida: 59, velocidad: 73, vision: 63, alcance: 0, capacidadAviones: 5,
          ataque: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 3.0, barco: 3.0, submarino: 2.0 },
          defensa: { noBlindado: 1.5, ligero: 1.5, pesado: 1.5, avion: 3.0, barco: 3.0, submarino: 2.0 },
          terreno: terrenoNaval(59),
          coste: { comida: 1300, mano: 1500, metal: 1200, dinero: 2300 },
          mantenimiento: { comida: 65, mano: 75, metal: 58, dinero: 113 }
        },
        3: {
          vida: 77, velocidad: 80, vision: 66, alcance: 0, capacidadAviones: 7,
          ataque: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 4.5, barco: 4.5, submarino: 3.0 },
          defensa: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 4.5, barco: 4.5, submarino: 3.0 },
          terreno: terrenoNaval(77),
          coste: { comida: 1500, mano: 1600, metal: 1300, dinero: 2600 },
          mantenimiento: { comida: 75, mano: 78, metal: 65, dinero: 130 }
        },
        4: {
          vida: 104, velocidad: 88, vision: 69, alcance: 0, capacidadAviones: 9,
          ataque: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 6.5, barco: 6.5, submarino: 4.5 },
          defensa: { noBlindado: 3.0, ligero: 3.0, pesado: 3.0, avion: 6.5, barco: 6.5, submarino: 4.5 },
          terreno: terrenoNaval(104),
          coste: { comida: 1700, mano: 1600, metal: 1500, dinero: 3000 },
          mantenimiento: { comida: 85, mano: 80, metal: 73, dinero: 148 }
        },
        5: {
          vida: 140, velocidad: 95, vision: 75, alcance: 0, capacidadAviones: 11,
          ataque: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 9.5, barco: 9.5, submarino: 7.0 },
          defensa: { noBlindado: 4.5, ligero: 4.5, pesado: 4.5, avion: 9.5, barco: 9.5, submarino: 7.0 },
          terreno: terrenoNaval(140),
          coste: { comida: 2000, mano: 1700, metal: 1700, dinero: 3500 },
          mantenimiento: { comida: 98, mano: 83, metal: 85, dinero: 173 }
        },
        6: {
          vida: 180, velocidad: 102, vision: 78, alcance: 0, capacidadAviones: 13,
          ataque: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 13.0, barco: 13.0, submarino: 10.0 },
          defensa: { noBlindado: 6.0, ligero: 6.0, pesado: 6.0, avion: 13.0, barco: 13.0, submarino: 10.0 },
          terreno: terrenoNaval(180),
          coste: { comida: 2200, mano: 1700, metal: 1900, dinero: 3800 },
          mantenimiento: { comida: 108, mano: 85, metal: 95, dinero: 190 }
        }
      }
    }
  },
  {
    // No se construye: las unidades se convierten en él al entrar en el mar.
    // Por eso no aparece en el catálogo (construible: false).
    id: "transporte", nombre: "Barco de transporte", seccion: "naval", icono: "barco", construible: false,
    datos: {
      panasia: {
        1: {
          vida: 9, velocidad: 53, vision: 39, alcance: 0,
          ataque: { noBlindado: 0.5, ligero: 0.5, pesado: 0.5, avion: 0.5, barco: 0.8, submarino: 0.5 },
          defensa: { noBlindado: 0.5, ligero: 0.5, pesado: 0.5, avion: 0.5, barco: 0.8, submarino: 0.5 },
          terreno: terrenoTransporte(9),
          coste: {}, mantenimiento: {}
        },
        2: {
          vida: 14, velocidad: 67, vision: 39, alcance: 0,
          ataque: { noBlindado: 0.8, ligero: 0.8, pesado: 0.8, avion: 0.8, barco: 1.3, submarino: 0.8 },
          defensa: { noBlindado: 0.8, ligero: 0.8, pesado: 0.8, avion: 0.8, barco: 1.3, submarino: 0.8 },
          terreno: terrenoTransporte(14),
          coste: {}, mantenimiento: {}
        },
        3: {
          vida: 18, velocidad: 82, vision: 39, alcance: 0,
          ataque: { noBlindado: 1.3, ligero: 1.3, pesado: 1.3, avion: 1.3, barco: 2.0, submarino: 1.3 },
          defensa: { noBlindado: 1.3, ligero: 1.3, pesado: 1.3, avion: 1.3, barco: 2.0, submarino: 1.3 },
          terreno: terrenoTransporte(18),
          coste: {}, mantenimiento: {}
        },
        4: {
          vida: 23, velocidad: 96, vision: 39, alcance: 0,
          ataque: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 2.0, barco: 3.0, submarino: 2.0 },
          defensa: { noBlindado: 2.0, ligero: 2.0, pesado: 2.0, avion: 2.0, barco: 3.0, submarino: 2.0 },
          terreno: terrenoTransporte(23),
          coste: {}, mantenimiento: {}
        }
      }
    }
  },

  // ---------- SECRETO ----------
  {
    // Mismo terreno que la artillería normal
    id: "art-cohetes", nombre: "Artillería de cohetes", seccion: "secreto", icono: "soldado",
    datos: {
      panasia: {
        1: {
          vida: 14, velocidad: 42, vision: 54, alcance: 50,
          ataque: { noBlindado: 3.5, ligero: 2.2, pesado: 1.5, avion: 2.8, barco: 1.8, submarino: 1.5, edificios: 2.0, moral: 2.5 },
          defensa: { noBlindado: 0.9, ligero: 0.6, pesado: 0.4, avion: 0.7, barco: 0.4, submarino: 0.4, edificios: 0.5 },
          terreno: terrenoArtilleria(14),
          coste: { comida: 1300, mano: 1000, metal: 1800, dinero: 1400 },
          mantenimiento: { comida: 63, mano: 50, metal: 88, dinero: 68 }
        },
        2: {
          vida: 23, velocidad: 48, vision: 54, alcance: 50,
          ataque: { noBlindado: 6.0, ligero: 4.5, pesado: 2.5, avion: 5.0, barco: 2.8, submarino: 2.0, edificios: 3.3, moral: 4.0 },
          defensa: { noBlindado: 1.5, ligero: 1.1, pesado: 0.6, avion: 1.2, barco: 0.7, submarino: 0.5, edificios: 0.8 },
          terreno: terrenoArtilleria(23),
          coste: { comida: 1400, mano: 1000, metal: 2100, dinero: 1600 },
          mantenimiento: { comida: 70, mano: 50, metal: 103, dinero: 80 }
        },
        3: {
          vida: 32, velocidad: 54, vision: 54, alcance: 50,
          ataque: { noBlindado: 10.3, ligero: 7.0, pesado: 4.5, avion: 8.0, barco: 4.5, submarino: 3.5, edificios: 5.0, moral: 6.0 },
          defensa: { noBlindado: 2.6, ligero: 1.7, pesado: 1.1, avion: 2.0, barco: 1.1, submarino: 0.9, edificios: 1.3 },
          terreno: terrenoArtilleria(32),
          coste: { comida: 1800, mano: 1100, metal: 2600, dinero: 2000 },
          mantenimiento: { comida: 90, mano: 53, metal: 130, dinero: 100 }
        }
      }
    }
  },
  {
    // Mismo terreno que la artillería AP
    id: "art-cohetes-ap", nombre: "Artillería de cohetes AP", seccion: "secreto", icono: "vehiculo",
    datos: {
      panasia: {
        1: {
          vida: 23, velocidad: 66, vision: 54, alcance: 50,
          ataque: { noBlindado: 6.0, ligero: 4.5, pesado: 2.5, avion: 5.0, barco: 2.8, submarino: 2.0, edificios: 3.3, moral: 4.0 },
          defensa: { noBlindado: 1.5, ligero: 1.1, pesado: 0.6, avion: 1.2, barco: 0.7, submarino: 0.5, edificios: 0.8 },
          terreno: terrenoArtilleriaAP(23),
          coste: { mano: 1600, metal: 1900, petroleo: 1900, dinero: 1900 },
          mantenimiento: { mano: 78, metal: 95, petroleo: 95, dinero: 95 }
        },
        2: {
          vida: 41, velocidad: 80, vision: 54, alcance: 50,
          ataque: { noBlindado: 10.3, ligero: 7.0, pesado: 4.5, avion: 8.0, barco: 4.5, submarino: 3.5, edificios: 5.0, moral: 6.0 },
          defensa: { noBlindado: 2.6, ligero: 1.7, pesado: 1.1, avion: 2.0, barco: 1.1, submarino: 0.9, edificios: 1.3 },
          terreno: terrenoArtilleriaAP(41),
          coste: { mano: 1600, metal: 2500, petroleo: 2500, dinero: 2500 },
          mantenimiento: { mano: 80, metal: 123, petroleo: 123, dinero: 123 }
        }
      }
    }
  },
  {
    id: "canon-ferroviario", nombre: "Cañón ferroviario", seccion: "secreto", icono: "tanque",
    datos: {
      panasia: {
        1: {
          vida: 27, velocidad: 22, vision: 54, alcance: 100,
          ataque: { noBlindado: 4.0, ligero: 5.0, pesado: 6.0, avion: 1.5, barco: 4.0, submarino: 1.5, edificios: 6.5, moral: 2.0 },
          defensa: { noBlindado: 1.0, ligero: 1.3, pesado: 1.5, avion: 0.4, barco: 1.0, submarino: 0.4, edificios: 1.6 },
          terreno: terrenoCanon(27),
          coste: { mano: 2700, metal: 3400, petroleo: 1900, dinero: 4100 },
          mantenimiento: { mano: 133, metal: 170, petroleo: 93, dinero: 203 }
        },
        2: {
          vida: 45, velocidad: 34, vision: 54, alcance: 100,
          ataque: { noBlindado: 7.0, ligero: 8.5, pesado: 10.0, avion: 2.5, barco: 6.0, submarino: 2.5, edificios: 11.0, moral: 3.5 },
          defensa: { noBlindado: 1.7, ligero: 2.1, pesado: 2.5, avion: 0.6, barco: 1.5, submarino: 0.6, edificios: 2.8 },
          terreno: terrenoCanon(45),
          coste: { mano: 2900, metal: 4700, petroleo: 2600, dinero: 5600 },
          mantenimiento: { mano: 143, metal: 235, petroleo: 128, dinero: 278 }
        }
      }
    }
  },
  {
    // Un solo uso: se destruye al impactar. Las antiaéreas pueden derribarla.
    id: "bomba-aerea", nombre: "Bomba aérea", seccion: "secreto", icono: "avion",
    medio: "aire", unSoloUso: true, fuegoAmigo: true,
    datos: {
      panasia: {
        1: {
          vida: 14, velocidad: 660, vision: 24, alcance: 400,
          ataque: { noBlindado: 12.0, ligero: 12.0, pesado: 12.0, avion: 7.2, barco: 7.2, submarino: 3.6, edificios: 14.4, moral: 14.4 },
          defensa: {},
          terreno: terrenoAvion(14),
          coste: { mano: 200, metal: 750, petroleo: 400, dinero: 750 },
          mantenimiento: { mano: 10, metal: 38, petroleo: 20, dinero: 38 }
        }
      }
    }
  },
  {
    // Un solo uso y supersónico: no se puede interceptar antes del impacto.
    id: "cohete", nombre: "Cohete", seccion: "secreto", icono: "avion",
    medio: "aire", unSoloUso: true, fuegoAmigo: true, supersonico: true,
    datos: {
      panasia: {
        1: {
          vida: 9, velocidad: 936, vision: 15, alcance: 500,
          ataque: { noBlindado: 15.0, ligero: 15.0, pesado: 15.0, avion: 8.0, barco: 8.0, submarino: 4.0, edificios: 15.0, moral: 12.0 },
          defensa: {},
          terreno: terrenoAvion(9),
          coste: { mano: 450, metal: 800, petroleo: 1100, dinero: 2200 },
          mantenimiento: { mano: 23, metal: 40, petroleo: 53, dinero: 110 }
        },
        2: {
          vida: 14, velocidad: 1176, vision: 15, alcance: 600,
          ataque: { noBlindado: 22.0, ligero: 22.0, pesado: 22.0, avion: 11.0, barco: 11.0, submarino: 6.0, edificios: 22.0, moral: 18.0 },
          defensa: {},
          terreno: terrenoAvion(14),
          coste: { mano: 450, metal: 900, petroleo: 1200, dinero: 2500 },
          mantenimiento: { mano: 23, metal: 45, petroleo: 60, dinero: 125 }
        },
        3: {
          vida: 18, velocidad: 1416, vision: 15, alcance: 700,
          ataque: { noBlindado: 30.0, ligero: 30.0, pesado: 30.0, avion: 15.0, barco: 15.0, submarino: 9.0, edificios: 30.0, moral: 26.0 },
          defensa: {},
          terreno: terrenoAvion(18),
          coste: { mano: 500, metal: 1100, petroleo: 1400, dinero: 2800 },
          mantenimiento: { mano: 25, metal: 53, petroleo: 68, dinero: 140 }
        },
        4: {
          vida: 23, velocidad: 1656, vision: 15, alcance: 800,
          ataque: { noBlindado: 40.0, ligero: 40.0, pesado: 40.0, avion: 21.0, barco: 21.0, submarino: 13.0, edificios: 40.0, moral: 36.0 },
          defensa: {},
          terreno: terrenoAvion(23),
          coste: { mano: 500, metal: 1200, petroleo: 1500, dinero: 3100 },
          mantenimiento: { mano: 25, metal: 58, petroleo: 75, dinero: 155 }
        }
      }
    }
  },
  {
    // Avión normal (reutilizable) de la sección Secreto
    id: "caza-misiles", nombre: "Caza con misiles", seccion: "secreto", icono: "avion", medio: "aire",
    datos: {
      panasia: {
        1: {
          vida: 27, velocidad: 1080, vision: 39, alcance: 250,
          ataque: { noBlindado: 6.0, ligero: 2.0, pesado: 2.0, avion: 22.0, barco: 2.0, submarino: 2.0, edificios: 0.8, moral: 0.1 },
          defensa: { noBlindado: 3.0, ligero: 1.0, pesado: 1.0, avion: 11.0, barco: 1.0, submarino: 1.0, edificios: 0.4 },
          terreno: terrenoAvion(27),
          coste: { comida: 1100, mano: 750, petroleo: 2000, dinero: 1400 },
          mantenimiento: { comida: 55, mano: 38, petroleo: 100, dinero: 68 }
        },
        2: {
          vida: 45, velocidad: 1476, vision: 39, alcance: 350,
          ataque: { noBlindado: 8.0, ligero: 3.0, pesado: 3.0, avion: 36.0, barco: 3.0, submarino: 3.0, edificios: 1.2, moral: 0.2 },
          defensa: { noBlindado: 4.0, ligero: 1.5, pesado: 1.5, avion: 18.0, barco: 1.5, submarino: 1.5, edificios: 0.6 },
          terreno: terrenoAvion(45),
          coste: { comida: 1400, mano: 800, petroleo: 2600, dinero: 1700 },
          mantenimiento: { comida: 70, mano: 40, petroleo: 130, dinero: 85 }
        }
      }
    }
  },
  // La bomba atómica no es una unidad: solo se investiga para desbloquear el bombardero nuclear
  { id: "bomba-atomica", nombre: "Bomba atómica", seccion: "secreto", icono: "avion", construible: false, datos: {} },
  {
    // Arma nuclear de un solo uso. Las antiaéreas pueden derribarlo antes del ataque.
    id: "bomb-nuclear", nombre: "Bombardero nuclear", seccion: "secreto", icono: "avion",
    medio: "aire", unSoloUso: true, fuegoAmigo: true, nuclear: true,
    datos: {
      panasia: {
        1: {
          vida: 59, velocidad: 696, vision: 39, alcance: 1200,
          ataque: { noBlindado: 1200, ligero: 800, pesado: 750, avion: 500, barco: 750, submarino: 200, edificios: 750, moral: 75 },
          defensa: {},
          terreno: terrenoAvion(59),
          coste: { comida: 3500, mano: 5700, metal: 3500, petroleo: 9400, dinero: 21000 },
          mantenimiento: { comida: 175, mano: 285, metal: 175, petroleo: 468, dinero: 1100 }
        },
        2: {
          vida: 77, velocidad: 768, vision: 39, alcance: 1400,
          ataque: { noBlindado: 1600, ligero: 1200, pesado: 1000, avion: 700, barco: 1000, submarino: 250, edificios: 1000, moral: 85 },
          defensa: {},
          terreno: terrenoAvion(77),
          coste: { comida: 3700, mano: 5800, metal: 3700, petroleo: 9800, dinero: 22000 },
          mantenimiento: { comida: 185, mano: 290, metal: 185, petroleo: 490, dinero: 1100 }
        },
        3: {
          vida: 95, velocidad: 840, vision: 39, alcance: 1600,
          ataque: { noBlindado: 2200, ligero: 1600, pesado: 1350, avion: 1000, barco: 1350, submarino: 350, edificios: 1350, moral: 100 },
          defensa: {},
          terreno: terrenoAvion(95),
          coste: { comida: 3900, mano: 5900, metal: 3900, petroleo: 10000, dinero: 23000 },
          mantenimiento: { comida: 193, mano: 293, metal: 193, petroleo: 513, dinero: 1200 }
        }
      }
    }
  },
  {
    // Arma nuclear de un solo uso y supersónica: no se puede interceptar.
    id: "cohete-nuclear", nombre: "Cohete nuclear", seccion: "secreto", icono: "avion",
    medio: "aire", unSoloUso: true, fuegoAmigo: true, nuclear: true, supersonico: true,
    datos: {
      panasia: {
        1: {
          vida: 18, velocidad: 1656, vision: 15, alcance: 800,
          ataque: { noBlindado: 2200, ligero: 1600, pesado: 1600, avion: 1000, barco: 1600, submarino: 350, edificios: 1600, moral: 100 },
          defensa: {},
          terreno: terrenoAvion(18),
          coste: { comida: 6800, mano: 4600, metal: 6800, petroleo: 8100, dinero: 24000 },
          mantenimiento: { comida: 338, mano: 228, metal: 338, petroleo: 405, dinero: 1200 }
        }
      }
    }
  }
];