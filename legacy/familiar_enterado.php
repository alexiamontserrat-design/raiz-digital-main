<?php
session_start();

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión");
}

if (!isset($_GET['id'])) {
    die("ID no recibido");
}

$id = intval($_GET['id']);

$conexion->query("
    UPDATE alertas_reabastecimiento
    SET familiar_enterado = 1
    WHERE id_alerta = '$id'
");

header("Location: /raiz-digital/views/gestion_view_familiar.php");
exit();
?>