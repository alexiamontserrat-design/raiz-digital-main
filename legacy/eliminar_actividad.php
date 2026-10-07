<?php
session_start();

if (!isset($_GET['id'])) {
    die("❌ No se recibió ID");
}

$id = $_GET['id'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error conexión");
}

// eliminar
$sql = "DELETE FROM actividades WHERE id_actividad = '$id'";

$conexion->query($sql);

// 🔥 regresar
header("Location: views/gestion_view_enfermero.php");
exit();
?>