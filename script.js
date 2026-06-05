// ==================== DATOS GLOBALES ====================
let habitaciones = [];
let camionetas = [];
let reservasHotel = [];
let traslados = [];
let limpieza = [];
let nextHabitacionId = 41;
let nextReservaId = 1;
let nextTrasladoId = 1;

// ==================== INICIALIZACIÓN ====================
function inicializarDatos() {
    // Inicializar 40 habitaciones si no existen
    if (habitaciones.length === 0) {
        for (let i = 1; i <= 40; i++) {
            let tipo = i <= 25 ? "Estándar" : "Suite";
            let precio = tipo === "Estándar" ? 1200 : 2200;
            habitaciones.push({
                id: i,
                numero: 100 + i,
                tipo: tipo,
                precio: precio,
                estado: "disponible"
            });
            limpieza.push({
                habitacionId: i,
                estadoLimpieza: "Pendiente",
                ultimaLimpieza: null
            });
        }
    }
    
    // Inicializar camionetas
    if (camionetas.length === 0) {
        camionetas = [
            { id: 1, placa: "MAY-101", capacidad: 16 },
            { id: 2, placa: "MAY-102", capacidad: 16 },
            { id: 3, placa: "MAY-103", capacidad: 12 }
        ];
    }
    
    // Inicializar reservas
    if (reservasHotel.length === 0) {
        // Reserva de ejemplo
        reservasHotel.push({
            id: 1,
            cliente: "Juan Pérez",
            habitacionId: 101,
            fechaEntrada: "2026-06-10",
            fechaSalida: "2026-06-15"
        });
        
        // Actualizar estado de la habitación reservada
        let hab = habitaciones.find(h => h.numero === 101);
        if (hab) hab.estado = "ocupada";
        
        // Actualizar limpieza
        let limp = limpieza.find(l => l.habitacionId === hab?.id);
        if (limp) limp.estadoLimpieza = "Pendiente";
    }
    
    // Inicializar traslados
    if (traslados.length === 0) {
        traslados.push({
            id: 1,
            reservaId: 1,
            camionetaId: 1,
            fechaHora: "2026-06-10T10:00",
            pasajeros: 4,
            tipo: "checkin",
            precio: 1500
        });
    }
}

// ==================== PERSISTENCIA ====================
function guardarDatos() {
    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
    localStorage.setItem("camionetas", JSON.stringify(camionetas));
    localStorage.setItem("reservasHotel", JSON.stringify(reservasHotel));
    localStorage.setItem("traslados", JSON.stringify(traslados));
    localStorage.setItem("limpieza", JSON.stringify(limpieza));
    localStorage.setItem("nextHabitacionId", nextHabitacionId);
    localStorage.setItem("nextReservaId", nextReservaId);
    localStorage.setItem("nextTrasladoId", nextTrasladoId);
}

function cargarDatos() {
    // Cargar habitaciones
    if (localStorage.getItem("habitaciones")) {
        habitaciones = JSON.parse(localStorage.getItem("habitaciones"));
    }
    
    // Cargar camionetas
    if (localStorage.getItem("camionetas")) {
        camionetas = JSON.parse(localStorage.getItem("camionetas"));
    }
    
    // Cargar reservas
    if (localStorage.getItem("reservasHotel")) {
        reservasHotel = JSON.parse(localStorage.getItem("reservasHotel"));
    }
    
    // Cargar traslados
    if (localStorage.getItem("traslados")) {
        traslados = JSON.parse(localStorage.getItem("traslados"));
    }
    
    // Cargar limpieza
    if (localStorage.getItem("limpieza")) {
        limpieza = JSON.parse(localStorage.getItem("limpieza"));
    }
    
    // Cargar contadores
    if (localStorage.getItem("nextHabitacionId")) {
        nextHabitacionId = parseInt(localStorage.getItem("nextHabitacionId"));
    }
    if (localStorage.getItem("nextReservaId")) {
        nextReservaId = parseInt(localStorage.getItem("nextReservaId"));
    }
    if (localStorage.getItem("nextTrasladoId")) {
        nextTrasladoId = parseInt(localStorage.getItem("nextTrasladoId"));
    }
    
    // Si no hay datos, inicializar
    if (habitaciones.length === 0) {
        inicializarDatos();
        guardarDatos();
    }
}

// ==================== DASHBOARD ====================
function actualizarDashboard() {
    const disponibles = habitaciones.filter(h => h.estado === "disponible").length;
    const ocupadas = habitaciones.filter(h => h.estado === "ocupada").length;
    const ocupacion = habitaciones.length > 0 ? Math.round((ocupadas / habitaciones.length) * 100) : 0;
    
    // Traslados de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const trasladosHoy = traslados.filter(t => {
        if (!t.fechaHora) return false;
        return t.fechaHora.startsWith(hoy);
    }).length;
    
    // Actualizar elementos del DOM
    const totalHabsElem = document.getElementById("totalHabs");
    const habsDisponiblesElem = document.getElementById("habsDisponibles");
    const totalTrasladosElem = document.getElementById("totalTraslados");
    const ocupacionElem = document.getElementById("ocupacion");
    
    if (totalHabsElem) totalHabsElem.innerText = habitaciones.length;
    if (habsDisponiblesElem) habsDisponiblesElem.innerText = disponibles;
    if (totalTrasladosElem) totalTrasladosElem.innerText = trasladosHoy;
    if (ocupacionElem) ocupacionElem.innerText = ocupacion;
}

// ==================== HABITACIONES ====================
function renderizarHabitaciones(filtro = "all") {
    const tbody = document.querySelector("#habitacionesTableBody");
    if (!tbody) return;
    
    let filtradas = [...habitaciones];
    
    switch(filtro) {
        case "disponible":
            filtradas = habitaciones.filter(h => h.estado === "disponible");
            break;
        case "ocupada":
            filtradas = habitaciones.filter(h => h.estado === "ocupada");
            break;
        case "Estándar":
            filtradas = habitaciones.filter(h => h.tipo === "Estándar");
            break;
        case "Suite":
            filtradas = habitaciones.filter(h => h.tipo === "Suite");
            break;
        default:
            filtradas = [...habitaciones];
    }
    
    tbody.innerHTML = filtradas.map(h => `
        <tr>
            <td>${h.id}</td>
            <td>${h.numero}</td>
            <td>${h.tipo}</td>
            <td>$${h.precio}</td>
            <td>
                <span class="status-badge ${h.estado === 'disponible' ? 'status-available' : 'status-occupied'}">
                    ${h.estado === 'disponible' ? 'Disponible' : 'Ocupada'}
                </span>
            </td>
            <td>
                <button class="btn-primary" style="padding:0.3rem 0.8rem; font-size:0.75rem;" onclick="window.toggleEstadoHabitacion(${h.id})">
                    ${h.estado === 'disponible' ? 'Ocupar' : 'Liberar'}
                </button>
            </td>
        </tr>
    `).join("");
}

function toggleEstadoHabitacion(id) {
    const habitacion = habitaciones.find(h => h.id === id);
    if (habitacion) {
        habitacion.estado = habitacion.estado === "disponible" ? "ocupada" : "disponible";
        guardarDatos();
        renderizarHabitaciones();
        actualizarDashboard();
        actualizarLimpieza();
        actualizarSelectHabitaciones();
    }
}

function agregarHabitacion() {
    const numero = nextHabitacionId;
    const tipo = numero <= 65 ? "Estándar" : "Suite";
    const precio = tipo === "Estándar" ? 1200 : 2200;
    
    habitaciones.push({
        id: numero,
        numero: numero,
        tipo: tipo,
        precio: precio,
        estado: "disponible"
    });
    
    limpieza.push({
        habitacionId: numero,
        estadoLimpieza: "Pendiente",
        ultimaLimpieza: null
    });
    
    nextHabitacionId++;
    guardarDatos();
    renderizarHabitaciones();
    actualizarDashboard();
    actualizarSelectHabitaciones();
}

// ==================== LIMPIEZA ====================
function actualizarLimpieza() {
    const tbody = document.querySelector("#limpiezaTableBody");
    if (!tbody) return;
    
    // Combinar datos de habitaciones y limpieza
    const datosLimpieza = habitaciones.map(hab => {
        const limp = limpieza.find(l => l.habitacionId === hab.id);
        return {
            numero: hab.numero,
            estadoLimpieza: limp ? limp.estadoLimpieza : "Pendiente",
            ultimaLimpieza: limp && limp.ultimaLimpieza ? limp.ultimaLimpieza : "---",
            id: hab.id
        };
    });
    
    const limpias = datosLimpieza.filter(d => d.estadoLimpieza === "Limpia").length;
    const pendientes = datosLimpieza.filter(d => d.estadoLimpieza === "Pendiente").length;
    
    const limpiasCountElem = document.getElementById("limpiasCount");
    const pendientesCountElem = document.getElementById("pendientesCount");
    
    if (limpiasCountElem) limpiasCountElem.innerText = limpias;
    if (pendientesCountElem) pendientesCountElem.innerText = pendientes;
    
    tbody.innerHTML = datosLimpieza.map(d => `
        <tr>
            <td>${d.numero}</td>
            <td>
                <span class="status-badge ${d.estadoLimpieza === 'Limpia' ? 'status-clean' : 'status-pending'}">
                    ${d.estadoLimpieza}
                </span>
            </td>
            <td>${d.ultimaLimpieza}</td>
            <td>
                ${d.estadoLimpieza === 'Pendiente' ? 
                    `<button class="btn-primary" style="padding:0.3rem 0.8rem; font-size:0.75rem;" onclick="window.marcarLimpia(${d.id})">
                        Marcar Limpia
                    </button>` : 
                    '<span style="color: #10b981;">✓ Completada</span>'}
            </td>
        </tr>
    `).join("");
}

function marcarLimpia(habitacionId) {
    const limp = limpieza.find(l => l.habitacionId === habitacionId);
    if (limp) {
        limp.estadoLimpieza = "Limpia";
        limp.ultimaLimpieza = new Date().toLocaleString();
        guardarDatos();
        actualizarLimpieza();
        alert("Habitación marcada como limpia");
    }
}

// ==================== RESERVAS ====================
function actualizarSelectHabitaciones() {
    const select = document.getElementById("habitacionSelect");
    if (!select) return;
    
    const disponibles = habitaciones.filter(h => h.estado === "disponible");
    select.innerHTML = '<option value="">Seleccionar habitación</option>';
    
    disponibles.forEach(hab => {
        const option = document.createElement("option");
        option.value = hab.numero;
        option.textContent = `${hab.numero} - ${hab.tipo} ($${hab.precio}/noche)`;
        select.appendChild(option);
    });
}

function renderizarReservas() {
    const tbody = document.querySelector("#reservasTableBody");
    if (!tbody) return;
    
    tbody.innerHTML = reservasHotel.map(r => {
        const hab = habitaciones.find(h => h.numero === r.habitacionId);
        return `
            <tr>
                <td>${r.id}</td>
                <td>${r.cliente}</td>
                <td>${r.habitacionId} (${hab?.tipo || 'N/A'})</td>
                <td>${r.fechaEntrada}</td>
                <td>${r.fechaSalida}</td>
            </tr>
        `;
    }).join("");
}

function crearReserva(event) {
    event.preventDefault();
    
    const cliente = document.getElementById("clienteNombre").value;
    const habitacionNumero = parseInt(document.getElementById("habitacionSelect").value);
    const fechaEntrada = document.getElementById("fechaEntrada").value;
    const fechaSalida = document.getElementById("fechaSalida").value;
    
    if (!cliente || !habitacionNumero || !fechaEntrada || !fechaSalida) {
        alert("Por favor complete todos los campos");
        return false;
    }
    
    if (fechaEntrada >= fechaSalida) {
        alert("La fecha de salida debe ser posterior a la fecha de entrada");
        return false;
    }
    
    const habitacion = habitaciones.find(h => h.numero === habitacionNumero);
    if (!habitacion) {
        alert("Habitación no encontrada");
        return false;
    }
    
    if (habitacion.estado !== "disponible") {
        alert("La habitación no está disponible");
        return false;
    }
    
    // Crear reserva
    const nuevaReserva = {
        id: nextReservaId++,
        cliente: cliente,
        habitacionId: habitacionNumero,
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida
    };
    
    reservasHotel.push(nuevaReserva);
    
    // Actualizar estado de la habitación
    habitacion.estado = "ocupada";
    
    // Actualizar limpieza
    const limp = limpieza.find(l => l.habitacionId === habitacion.id);
    if (limp) {
        limp.estadoLimpieza = "Pendiente";
    }
    
    guardarDatos();
    renderizarReservas();
    actualizarDashboard();
    actualizarSelectHabitaciones();
    actualizarLimpieza();
    
    document.getElementById("formReservaHotel").reset();
    alert(`Reserva creada exitosamente para ${cliente} en habitación ${habitacionNumero}`);
    return false;
}

// ==================== TRANSPORTE ====================
function renderizarFlotilla() {
    const container = document.getElementById("fleetCards");
    if (!container) return;
    
    container.innerHTML = camionetas.map(c => `
        <div class="stat-card" style="flex-direction: column; text-align: center;">
            <i class="fas fa-truck" style="font-size: 2rem; color: var(--secondary);"></i>
            <strong>${c.placa}</strong>
            <p>${c.capacidad} pasajeros</p>
        </div>
    `).join("");
}

function actualizarSelectCamionetas() {
    const select = document.getElementById("camionetaSelect");
    if (!select) return;
    
    select.innerHTML = camionetas.map(c => 
        `<option value="${c.id}">${c.placa} (${c.capacidad} pasajeros)</option>`
    ).join("");
}

function renderizarTraslados() {
    const tbody = document.querySelector("#trasladosTableBody");
    if (!tbody) return;
    
    tbody.innerHTML = traslados.map(t => {
        const camioneta = camionetas.find(c => c.id === t.camionetaId);
        return `
            <tr>
                <td>${t.id}</td>
                <td>${t.reservaId}</td>
                <td>${camioneta?.placa || 'N/A'}</td>
                <td>${t.fechaHora ? t.fechaHora.replace('T', ' ') : 'N/A'}</td>
                <td>${t.pasajeros}</td>
                <td>${t.tipo === 'checkin' ? 'Llegada' : 'Salida'}</td>
                <td>$${t.precio}</td>
            </tr>
        `;
    }).join("");
}

function registrarTraslado(event) {
    event.preventDefault();
    
    const reservaId = parseInt(document.getElementById("reservaId").value);
    const camionetaId = parseInt(document.getElementById("camionetaSelect").value);
    const fechaHora = document.getElementById("fechaHora").value;
    const pasajeros = parseInt(document.getElementById("pasajeros").value);
    const tipo = document.getElementById("tipoTraslado").value;
    
    if (!reservaId || !camionetaId || !fechaHora || !pasajeros) {
        alert("Complete todos los campos");
        return false;
    }
    
    const camioneta = camionetas.find(c => c.id === camionetaId);
    if (pasajeros > camioneta.capacidad) {
        alert(`La camioneta solo tiene capacidad para ${camioneta.capacidad} pasajeros`);
        return false;
    }
    
    const reservaExiste = reservasHotel.find(r => r.id === reservaId);
    if (!reservaExiste) {
        alert("ID de reserva no válido");
        return false;
    }
    
    const nuevoTraslado = {
        id: nextTrasladoId++,
        reservaId: reservaId,
        camionetaId: camionetaId,
        fechaHora: fechaHora,
        pasajeros: pasajeros,
        tipo: tipo,
        precio: 1500
    };
    
    traslados.push(nuevoTraslado);
    guardarDatos();
    renderizarTraslados();
    actualizarDashboard();
    
    document.getElementById("formTraslado").reset();
    alert("Traslado registrado exitosamente");
    return false;
}

// ==================== INICIALIZACIÓN POR PÁGINA ====================
document.addEventListener("DOMContentLoaded", function() {
    // Cargar datos desde localStorage
    cargarDatos();
    
    // Detectar en qué página estamos y ejecutar la función correspondiente
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    // Página de Dashboard (index.html)
    if (page === "index.html" || page === "" || page === "/") {
        actualizarDashboard();
    }
    
    // Página de Habitaciones
    if (page === "habitaciones.html") {
        renderizarHabitaciones();
        actualizarDashboard();
        
        // Configurar filtros
        const filtros = document.querySelectorAll(".filter-btn");
        filtros.forEach(btn => {
            btn.addEventListener("click", function() {
                filtros.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                renderizarHabitaciones(this.dataset.filter);
            });
        });
        
        // Botón agregar habitación
        const btnAgregar = document.getElementById("btnAgregarHabitacion");
        if (btnAgregar) {
            btnAgregar.addEventListener("click", agregarHabitacion);
        }
    }
    
    // Página de Limpieza
    if (page === "limpieza.html") {
        actualizarLimpieza();
        actualizarDashboard();
    }
    
    // Página de Reservas
    if (page === "reservas.html") {
        actualizarSelectHabitaciones();
        renderizarReservas();
        actualizarDashboard();
        
        const formReserva = document.getElementById("formReservaHotel");
        if (formReserva) {
            formReserva.addEventListener("submit", crearReserva);
        }
    }
    
    // Página de Transporte
    if (page === "transporte.html") {
        renderizarFlotilla();
        actualizarSelectCamionetas();
        renderizarTraslados();
        actualizarDashboard();
        
        const formTraslado = document.getElementById("formTraslado");
        if (formTraslado) {
            formTraslado.addEventListener("submit", registrarTraslado);
        }
    }
});

// ==================== FUNCIONES GLOBALES ====================
window.toggleEstadoHabitacion = toggleEstadoHabitacion;
window.marcarLimpia = marcarLimpia;
window.agregarHabitacion = agregarHabitacion;
window.crearReserva = crearReserva;
window.registrarTraslado = registrarTraslado;