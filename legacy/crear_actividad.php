<?php
session_start();

if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['id_residente'])) {
    die("❌ Sesión no válida");
}

$id_enfermero = $_SESSION['id_usuario'];
$id_residente = $_SESSION['id_residente'];

// conexión
$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error conexión");
}

// datos del form
$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];
$fecha = $_POST['fecha'];
$hora = $_POST['hora'];

// INSERT
$sql = "INSERT INTO actividades 
(id_residente, id_enfermero, titulo, descripcion, fecha, hora, estado)
VALUES 
('$id_residente', '$id_enfermero', '$titulo', '$descripcion', '$fecha', '$hora', 'pendiente')";

if ($conexion->query($sql) === TRUE) {
  //  echo " Actividad creada";
  // redirigir a gestión
   header("Location: views/gestion_view_enfermero.php");
    exit();

} else {
    echo "❌ Error: " . $conexion->error;
}

$conexion->close();
?>