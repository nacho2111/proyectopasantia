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
const unidades = {
  longitud: {
    nombre: "Longitud",
    lista: [
      { id: "km", nombre: "Kilómetros (km)", factor: 1000 },
      { id: "m", nombre: "Metros (m)", factor: 1 },
      { id: "cm", nombre: "Centímetros (cm)", factor: 0.01 },
      { id: "mm", nombre: "Milímetros (mm)", factor: 0.001 }
    ]
  },
  peso: {
    nombre: "Peso",
    lista: [
      { id: "kg", nombre: "Kilogramos (kg)", factor: 1000 },
      { id: "g", nombre: "Gramos (g)", factor: 1 },
      { id: "mg", nombre: "Miligramos (mg)", factor: 0.001 },
      { id: "lb", nombre: "Libras (lb)", factor: 453.592 }
    ]
  },
  capacidad: {
    nombre: "Capacidad",
    lista: [
      { id: "l", nombre: "Litros (l)", factor: 1 },
      { id: "ml", nombre: "Mililitros (ml)", factor: 0.001 }
    ]
  },
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

function actualizarOpcionesUnidades() {
  const categoria = tipoUnidad.value;
  const lista = unidades[categoria].lista;

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

  unidadOrigen.selectedIndex = 0;
  unidadDestino.selectedIndex = 1;
}

function convertirTemperatura(cantidad, de, a) {
  if (de === a) return cantidad;
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
    const valorBase = cantidad * uOrigen.factor;
    total = valorBase / uDestino.factor;
  }

  const totalFormateado = total % 1 === 0 ? total.toString() : parseFloat(total.toFixed(4)).toString();

  resultadoUnidades.textContent = `${cantidad} ${uOrigen.id} = ${totalFormateado} ${uDestino.id}`;
}

function intercambiarUnidades() {
  const temporal = unidadOrigen.value;
  unidadOrigen.value = unidadDestino.value;
  unidadDestino.value = temporal;
  convertirUnidades();
}

// Conversor de Monedas

// Monedas predeterminada
const monedasFallback = [
  { code: "USD", name: "Dólar Estadounidense", symbol: "$", flag: "🇺🇸", rate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.92 },
  { code: "ARS", name: "Peso Argentino", symbol: "$", flag: "🇦🇷", rate: 1285.50 },
  { code: "BRL", name: "Real Brasileño", symbol: "R$", flag: "🇧🇷", rate: 5.65 },
  { code: "GBP", name: "Libra Esterlina", symbol: "£", flag: "🇬🇧", rate: 0.78 },
  { code: "JPY", name: "Yen Japonés", symbol: "¥", flag: "🇯🇵", rate: 154.20 },
  { code: "MXN", name: "Peso Mexicano", symbol: "$", flag: "🇲🇽", rate: 18.90 },
  { code: "CLP", name: "Peso Chileno", symbol: "$", flag: "🇨🇱", rate: 935.00 },
  { code: "COP", name: "Peso Colombiano", symbol: "$", flag: "🇨🇴", rate: 4050.00 },
  { code: "PEN", name: "Sol Peruano", symbol: "S/", "flag": "🇵🇪", rate: 3.75 },
  { code: "UYU", name: "Peso Uruguayo", symbol: "$U", flag: "🇺🇾", rate: 40.20 },
  { code: "CAD", name: "Dólar Canadiense", symbol: "CA$", flag: "🇨🇦", rate: 1.37 },
  { code: "AUD", name: "Dólar Australiano", symbol: "AU$", flag: "🇦🇺", rate: 1.52 },
  { code: "CHF", name: "Franco Suizo", symbol: "CHF", flag: "🇨🇭", rate: 0.88 },
  { code: "CNY", name: "Yuan Chino", symbol: "¥", flag: "🇨🇳", rate: 7.23 },
  { code: "INR", name: "Rupia India", symbol: "₹", flag: "🇮🇳", rate: 83.90 },
  { code: "KRW", name: "Won Surcoreano", symbol: "₩", flag: "🇰🇷", rate: 1380.00 }
];

async function cargarMonedas() {
  // Cargar json
  try {
    const respuestaLocal = await fetch("jason.json");
    const datosLocales = await respuestaLocal.json();
    if (datosLocales && datosLocales.currencies) {
      monedas = datosLocales.currencies;
    } else {
      monedas = [...monedasFallback];
    }
  } catch (error) {
    console.warn("No se pudo cargar jason.json local:", error);
    monedas = [...monedasFallback];
  }

  // Llenar selects
  llenarSelectsMonedas();

  // Obtener valores
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

cargarMonedas();
