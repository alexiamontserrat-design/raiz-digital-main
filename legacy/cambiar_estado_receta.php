<?php
session_start();

if (!isset($_GET['id']) || !isset($_GET['estado'])) {
    die("Datos incompletos");
}

$id_receta = $_GET['id'];
$estado = $_GET['estado'];

$permitidos = ['activa', 'finalizada', 'cancelada'];

if (!in_array($estado, $permitidos)) {
    die("Estado inválido");
}

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión");
}

$sql = "UPDATE recetas_medicas
        SET estado = '$estado'
        WHERE id_receta = '$id_receta'";

if ($conexion->query($sql)) {
    header("Location: historial_recetas.php");
    exit();
} else {
    echo "Error actualizando receta";
}

$conexion->close();
?>