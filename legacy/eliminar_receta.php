<?php
session_start();

if (!isset($_GET['id'])) {
    die("ID de receta no recibido");
}

$id_receta = $_GET['id'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión");
}

$sql = "DELETE FROM recetas_medicas WHERE id_receta = '$id_receta'";

if ($conexion->query($sql)) {
    header("Location: historial_recetas.php");
    exit();
} else {
    echo "Error eliminando receta";
}

$conexion->close();
?>