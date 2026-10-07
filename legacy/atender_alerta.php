<?php
$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión");
}

$id = $_GET['id'];

$conexion->query("
    UPDATE alertas_reabastecimiento
    SET atendida = 1
    WHERE id_alerta = '$id'
");

header("Location: gestion_familiar.php");
exit();
?>