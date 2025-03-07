// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("loginUsuario").value;  // Cambiado a 'username'
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })  // Cambiado a 'username'
        });

        if (!response.ok) throw new Error("Credenciales incorrectas");

        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", username);  // Puedes dejarlo así si lo usas para mostrar el nombre

        location.href = "reservas.html";
    } catch (err) {
        alert(err.message);
    }
});

// Abrir el formulario de registro
document.getElementById("openRegisterBtn").addEventListener("click", () => {
    document.getElementById("registerDialog").showModal();  // Abre el diálogo de registro
});

// Cerrar el formulario de registro
document.getElementById("closeRegisterBtn").addEventListener("click", () => {
    document.getElementById("registerDialog").close();  // Cierra el diálogo de registro
});

document.getElementById("registerBtn").addEventListener("click", async () => {
    const username = document.getElementById("regUsuario").value;
    const password = document.getElementById("regPassword").value;
    const email = document.getElementById("regEmail").value;
    const telefono = document.getElementById("regTelefono").value;
    const nombre = document.getElementById("regNombre").value; // Captura el nombre real

    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, telefono, nombre })  // Envia el nombre real
        });

        if (!response.ok) throw new Error("Error en el registro");

        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        document.getElementById("registerDialog").close();  // Cierra el diálogo después de un registro exitoso
    } catch (err) {
        alert(err.message);
    }
});


