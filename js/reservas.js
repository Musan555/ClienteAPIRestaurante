////////////// EJECUCIÓN AL INICIO /////////////////
obtenerReservas();
cargarMesas();

////////////// MANEJADORES DE EVENTOS //////////////

// Cargar reservas
document.getElementById("cargarReservasBtn").addEventListener("click", obtenerReservas);

// Crear nueva reserva
document.getElementById("guardarReservaBtn").addEventListener("click", nuevaReserva);


// Abrir la ventana modal de creación de reserva
const addReservaDialog = document.getElementById("reservaDialog");
document.getElementById("openDialogAddReservaBtn").addEventListener("click", () => {
    addReservaDialog.showModal();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    location.href = "index.html";  // Redirigir al login
});

// Cerrar la ventana modal de creación de reserva
document.getElementById('cancelReservaBtn').addEventListener("click", () => {
    addReservaDialog.close();
});

/////////////// MÉTODOS ASINCRONOS. CONEXIÓN CON EL SERVIDOR (AJAX) //////////////

// Obtener reservas
async function obtenerReservas() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token, inicia sesión.");
        }
        const response = await fetch("http://localhost:8080/reservas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Error al obtener las reservas");
        }
        const reservas = await response.json();
        console.log(reservas);

        // Limpiar la tabla antes de cargar nuevas reservas
        document.getElementById("tableBody").innerHTML = "";

        // Cargar las reservas en la tabla
        reservas.forEach(reserva => {
            const fila = document.createElement("tr");
            fila.id = "filaReserva_" + reserva.id;
            fila.innerHTML = `
                <td>${reserva.cliente ? reserva.cliente.nombre : "Sin nombre"}</td>
                <td>${reserva.cliente ? reserva.cliente.email : "Sin email"}</td>
                <td>${reserva.cliente ? reserva.cliente.telefono : "Sin teléfono"}</td>
                <td>${reserva.fecha}</td>
                <td>${reserva.hora}</td>
                <td>${reserva.numeroPersonas}</td>
                <td>${reserva.mesa ? reserva.mesa.numeroMesa : "Sin mesa"}</td>
                <td>${reserva.mesa ? reserva.mesa.descripcion : "Sin descripción"}</td>
                <td><button class="btn btn-danger btn-sm" onclick="borrarReserva(${reserva.id}, this)">Eliminar</button></td>
            `;
            document.getElementById("tableBody").appendChild(fila);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Cargar mesas en el desplegable
async function cargarMesas() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token, inicia sesión.");
        }
        const response = await fetch("http://localhost:8080/mesas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Error al obtener las mesas");
        }
        const mesas = await response.json();

        // Cargar las mesas en el desplegable
        const selectMesa = document.getElementById("numeroMesa");
        mesas.forEach(mesa => {
            const option = document.createElement("option");
            option.value = mesa.id; // ID de la mesa
            option.textContent = mesa.numeroMesa; // Mostrar número de la mesa
            selectMesa.appendChild(option);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Crear nueva reserva
async function nuevaReserva() {
    console.log("Se ha hecho clic en Guardar");
    const nombre = document.getElementById("nombreCliente").value;
    const email = document.getElementById("emailCliente").value;
    const telefono = document.getElementById("telefonoCliente").value;
    const fecha = document.getElementById("fechaReserva").value;
    const hora = document.getElementById("horaReserva").value;
    const numeroPersonas = document.getElementById("numeroPersonas").value;
    const numeroMesa = document.getElementById("numeroMesa").value;  // ID de la mesa seleccionada

    const reserva = {
        cliente: { nombre, email, telefono },
        fecha,
        hora,
        numeroPersonas,
        mesa: { id: numeroMesa }  // Enviar el ID de la mesa
    };

    try {
        const response = await fetch("http://localhost:8080/reservas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            throw new Error("Error al crear la reserva");
        }

        // Capturamos la respuesta con los datos de la nueva reserva
        const reservaInsertada = await response.json();
        console.log(reservaInsertada);

        // Insertamos la nueva reserva en la tabla
        const fila = document.createElement("tr");
        fila.id = "filaReserva_" + reservaInsertada.id;
        fila.innerHTML = `
            <td>${reservaInsertada.cliente.nombre}</td>
            <td>${reservaInsertada.cliente.email}</td>
            <td>${reservaInsertada.cliente.telefono}</td>
            <td>${reservaInsertada.fecha}</td>
            <td>${reservaInsertada.hora}</td>
            <td>${reservaInsertada.numeroPersonas}</td>
            <td>${reservaInsertada.mesa.numeroMesa}</td>
            <td>${reservaInsertada.mesa.descripcion}</td> <!-- Descripción de la mesa -->
            <td><button class="btn btn-danger btn-sm" onclick="borrarReserva(${reservaInsertada.id}, this)">Eliminar</button></td>
        `;
        document.getElementById("tableBody").appendChild(fila);

        // Limpiar los campos del formulario
        document.getElementById('nombreCliente').value = '';
        document.getElementById('emailCliente').value = '';
        document.getElementById('telefonoCliente').value = '';
        document.getElementById('fechaReserva').value = '';
        document.getElementById('horaReserva').value = '';
        document.getElementById('numeroPersonas').value = '';
        document.getElementById('numeroMesa').value = '';

        // Cerrar el modal
        addReservaDialog.close();
    } catch (error) {
        console.error("Error:", error);
    }
}
