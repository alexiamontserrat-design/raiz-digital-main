<?php
session_start();

// Verificamos que exista sesión
if (!isset($_SESSION['id_usuario'])) {
    die("Error: no hay sesión iniciada");
}

$id_usuario = $_SESSION['id_usuario'];

// Conexión
$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Datos del form
$nombre = $_POST['nombre'];
$edad = $_POST['edad'];
$diagnostico = $_POST['diagnostico'];
$habitacion = $_POST['habitacion'];
$familiar_id = $_POST['id_familiar'];

// Verificar familiar
$sql_check = "SELECT * FROM familiares WHERE id_familiar = '$familiar_id'";
$result = $conexion->query($sql_check);

if ($result->num_rows > 0) {

    // Insertar residente
    $sql_insert = "INSERT INTO residentes 
    (id_usuario, nombre, edad, diagnostico, habitacion, id_familiar) 
    VALUES 
    ('$id_usuario', '$nombre', '$edad', '$diagnostico', '$habitacion', '$familiar_id')";

    if ($conexion->query($sql_insert) === TRUE) {
        echo "
        <h2> Residente registrado correctamente</h2>
        <a href='panel_enfermero.html'>
        <button>Registrar otro residente</button>
        </a>
       ";
    } else {
        echo " Error: " . $conexion->error;
    }

} else {
    echo " El familiar NO existe";
}

$conexion->close();
?>