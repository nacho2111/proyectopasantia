// Pantallas
const pantallaInicio = document.getElementById("pantallaInicio");
const vistaUnidades = document.getElementById("vistaUnidades");
const vistaMonedas = document.getElementById("vistaMonedas");

// Botones de navegación
const btnIrUnidades = document.getElementById("btnIrUnidades");
const btnIrMonedas = document.getElementById("btnIrMonedas");
const btnVolverUnidades = document.getElementById("btnVolverUnidades");
const btnVolverMonedas = document.getElementById("btnVolverMonedas");

// Elementos de Unidades
const tipoUnidad = document.getElementById("tipoUnidad");
const montoUnidad = document.getElementById("montoUnidad");
const unidadOrigen = document.getElementById("unidadOrigen");
const unidadDestino = document.getElementById("unidadDestino");
const btnCambiarUnidad = document.getElementById("btnCambiarUnidad");
const btnConvertirUnidades = document.getElementById("btnConvertirUnidades");
const resultadoUnidades = document.getElementById("resultadoUnidades");

// Elementos de Monedas
const montoMoneda = document.getElementById("montoMoneda");
const monedaOrigen = document.getElementById("monedaOrigen");
const monedaDestino = document.getElementById("monedaDestino");
const btnCambiarMoneda = document.getElementById("btnCambiarMoneda");
const btnConvertirMonedas = document.getElementById("btnConvertirMonedas");
const resultadoMonedas = document.getElementById("resultadoMonedas");
const tasaMonedas = document.getElementById("tasaMonedas");

// Lista de monedas
let monedas = [];

// Unidades
// el factor es cuanto vale cada una en metros / gramos / litros
const unidades = {
  longitud: {
    nombre: "Longitud",
    lista: [
      { id: "km", nombre: "Kilómetros (km)", factor: 1000 },
      { id: "m", nombre: "Metros (m)", factor: 1 },
      { id: "cm", nombre: "Centímetros (cm)", factor: 0.01 },
      { id: "mm", nombre: "Milímetros (mm)", factor: 0.001 },
      // las de los yanquis
      { id: "mi", nombre: "Millas (mi)", factor: 1609.344 },
      { id: "yd", nombre: "Yardas (yd)", factor: 0.9144 },
      { id: "ft", nombre: "Pies (ft)", factor: 0.3048 }
    ]
  },
  peso: {
    nombre: "Peso",
    lista: [
      { id: "kg", nombre: "Kilogramos (kg)", factor: 1000 },
      { id: "g", nombre: "Gramos (g)", factor: 1 },
      { id: "mg", nombre: "Miligramos (mg)", factor: 0.001 },
      { id: "lb", nombre: "Libras (lb)", factor: 453.59237 } // 1 libra = 453 g y pico
    ]
  },
  capacidad: {
    nombre: "Capacidad",
    lista: [
      { id: "l", nombre: "Litros (l)", factor: 1 },
      { id: "ml", nombre: "Mililitros (ml)", factor: 0.001 }
    ]
  },
  // estas no tienen factor, se calculan aparte con formula
  temperatura: {
    nombre: "Temperatura",
    lista: [
      { id: "°C", nombre: "Celsius (°C)" },
      { id: "°F", nombre: "Fahrenheit (°F)" },
      { id: "K", nombre: "Kelvin (K)" }
    ]
  }
};

// Navegacion
// cada funcion muestra una pantalla y esconde las otras

function mostrarInicio() {
  document.body.className = "tema-inicio";
  pantallaInicio.classList.remove("oculto");
  vistaUnidades.classList.add("oculto");
  vistaMonedas.classList.add("oculto");
}

function mostrarUnidades() {
  document.body.className = "tema-unidades";
  pantallaInicio.classList.add("oculto");
  vistaUnidades.classList.remove("oculto");
  vistaMonedas.classList.add("oculto");
  actualizarOpcionesUnidades();
  convertirUnidades();
}

function mostrarMonedas() {
  document.body.className = "tema-monedas";
  pantallaInicio.classList.add("oculto");
  vistaUnidades.classList.add("oculto");
  vistaMonedas.classList.remove("oculto");
  convertirMonedas();
}

// Conversor unidades

// llena los dos selects segun el tipo de medida que elegiste
function actualizarOpcionesUnidades() {
  const categoria = tipoUnidad.value;
  const lista = unidades[categoria].lista;

  // borro lo que habia antes
  unidadOrigen.innerHTML = "";
  unidadDestino.innerHTML = "";

  lista.forEach(u => {
    const opc1 = document.createElement("option");
    opc1.value = u.id;
    opc1.textContent = u.nombre;

    const opc2 = document.createElement("option");
    opc2.value = u.id;
    opc2.textContent = u.nombre;

    unidadOrigen.appendChild(opc1);
    unidadDestino.appendChild(opc2);
  });

  // para que no arranquen las dos iguales
  unidadOrigen.selectedIndex = 0;
  unidadDestino.selectedIndex = 1;
}

function convertirTemperatura(cantidad, de, a) {
  if (de === a) return cantidad;
  // primero paso todo a celsius y de ahi a lo que pida
  let celsius = cantidad;
  if (de === "°F") {
    celsius = (cantidad - 32) * (5 / 9);
  } else if (de === "K") {
    celsius = cantidad - 273.15;
  }

  if (a === "°C") return celsius;
  if (a === "°F") return (celsius * 9 / 5) + 32;
  if (a === "K") return celsius + 273.15;
  return celsius;
}

function convertirUnidades() {
  const cantidad = parseFloat(montoUnidad.value);

  // si no pusieron un numero no sigo
  if (isNaN(cantidad)) {
    resultadoUnidades.textContent = "Ingresa una cantidad válida";
    return;
  }

  const categoria = tipoUnidad.value;
  const lista = unidades[categoria].lista;

  const uOrigen = lista.find(u => u.id === unidadOrigen.value);
  const uDestino = lista.find(u => u.id === unidadDestino.value);

  if (!uOrigen || !uDestino) return;

  let total;
  if (categoria === "temperatura") {
    total = convertirTemperatura(cantidad, uOrigen.id, uDestino.id);
  } else {
    // lo paso a la unidad base (m, g o l) y despues a la de destino
    const valorBase = cantidad * uOrigen.factor;
    total = valorBase / uDestino.factor;
  }

  // si tiene decimales lo corto en 4 asi no queda un numero larguisimo
  const totalFormateado = total % 1 === 0 ? total.toString() : parseFloat(total.toFixed(4)).toString();

  resultadoUnidades.textContent = `${cantidad} ${uOrigen.id} = ${totalFormateado} ${uDestino.id}`;
}

// da vuelta el "de" y el "a"
function intercambiarUnidades() {
  const temporal = unidadOrigen.value;
  unidadOrigen.value = unidadDestino.value;
  unidadDestino.value = temporal;
  convertirUnidades();
}

// Conversor de Monedas

async function cargarMonedas() {
  // Cargar json
  try {
    const respuestaLocal = await fetch("jason.json");
    const datosLocales = await respuestaLocal.json();
    if (datosLocales && datosLocales.currencies) {
      monedas = datosLocales.currencies;
    }
  } catch (error) {
    console.warn("No se pudo cargar jason.json local:", error);
  }

  // si no hay monedas no tiene sentido seguir
  if (monedas.length === 0) {
    resultadoMonedas.textContent = "No se pudieron cargar las monedas";
    return;
  }

  // Llenar selects
  llenarSelectsMonedas();

  // Obtener valores
  // si anda la api piso los valores con los de hoy
  try {
    const respuestaApi = await fetch("https://open.er-api.com/v6/latest/USD");
    const datosApi = await respuestaApi.json();

    if (datosApi && datosApi.result === "success" && datosApi.rates) {
      monedas = monedas.map(m => {
        if (datosApi.rates[m.code] !== undefined) {
          return { ...m, rate: datosApi.rates[m.code] };
        }
        return m;
      });
      console.log("Cotizaciones actualizadas en vivo.");
      // Recalcular si la vista está visible
      if (!vistaMonedas.classList.contains("oculto")) {
        convertirMonedas();
      }
    }
  } catch (error) {
    console.warn("Error al obtener tasas web:", error);
  }
}

function llenarSelectsMonedas() {
  monedaOrigen.innerHTML = "";
  monedaDestino.innerHTML = "";

  monedas.forEach(m => {
    const opc1 = document.createElement("option");
    opc1.value = m.code;
    opc1.textContent = `${m.flag} ${m.code} - ${m.name}`;

    const opc2 = document.createElement("option");
    opc2.value = m.code;
    opc2.textContent = `${m.flag} ${m.code} - ${m.name}`;

    monedaOrigen.appendChild(opc1);
    monedaDestino.appendChild(opc2);
  });

  // arranca en dolar a euro
  monedaOrigen.value = "USD";
  monedaDestino.value = "EUR";
}

function convertirMonedas() {
  const cantidad = parseFloat(montoMoneda.value);

  if (isNaN(cantidad) || cantidad <= 0) {
    resultadoMonedas.textContent = "Ingresa un monto válido";
    tasaMonedas.textContent = "";
    return;
  }

  const origen = monedas.find(m => m.code === monedaOrigen.value);
  const destino = monedas.find(m => m.code === monedaDestino.value);

  if (!origen || !destino) return;

  // todas las tasas estan en dolares, asi que paso a dolar y de ahi a la otra
  const montoEnDolares = cantidad / origen.rate;
  const total = montoEnDolares * destino.rate;
  const tasa = destino.rate / origen.rate;

  resultadoMonedas.textContent = `${cantidad.toLocaleString()} ${origen.code} = ${total.toFixed(2)} ${destino.code}`;
  tasaMonedas.textContent = `1 ${origen.code} = ${tasa.toFixed(4)} ${destino.code}`;
}

function intercambiarMonedas() {
  const temporal = monedaOrigen.value;
  monedaOrigen.value = monedaDestino.value;
  monedaDestino.value = temporal;
  convertirMonedas();
}

// ACCIONES

// Navegacion
btnIrUnidades.addEventListener("click", mostrarUnidades);
btnIrMonedas.addEventListener("click", mostrarMonedas);
btnVolverUnidades.addEventListener("click", mostrarInicio);
btnVolverMonedas.addEventListener("click", mostrarInicio);

//unidades
tipoUnidad.addEventListener("change", () => {
  actualizarOpcionesUnidades();
  convertirUnidades();
});
btnConvertirUnidades.addEventListener("click", convertirUnidades);
btnCambiarUnidad.addEventListener("click", intercambiarUnidades);
montoUnidad.addEventListener("input", convertirUnidades);
unidadOrigen.addEventListener("change", convertirUnidades);
unidadDestino.addEventListener("change", convertirUnidades);

//monedas
btnConvertirMonedas.addEventListener("click", convertirMonedas);
btnCambiarMoneda.addEventListener("click", intercambiarMonedas);
montoMoneda.addEventListener("input", convertirMonedas);
monedaOrigen.addEventListener("change", convertirMonedas);
monedaDestino.addEventListener("change", convertirMonedas);

// apenas abre la pagina ya carga las monedas
cargarMonedas();
