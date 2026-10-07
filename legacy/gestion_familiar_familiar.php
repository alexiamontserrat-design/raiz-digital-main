<?php
session_start();

$id_residente = $_SESSION['id_residente'] ?? null;

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error conexión");
}

// traer actividades del residente
$sql = "SELECT * FROM actividades 
        WHERE id_residente = '$id_residente'
        ORDER BY fecha ASC, hora ASC";

$result = $conexion->query($sql);
// NOTAS
$fechaNota = $_GET['fecha_nota'] ?? null;

$sqlNotas = "SELECT n.*, u.nombre 
             FROM notas n
             INNER JOIN usuarios u ON n.id_usuario = u.id_usuario
             WHERE n.id_residente = '$id_residente'";

if ($fechaNota) {
    $sqlNotas .= " AND DATE(n.fecha) = '$fechaNota'";
}

$notas = $conexion->query($sqlNotas);


// AVISOS
$fechaAviso = $_GET['fecha_aviso'] ?? null;

$sqlAvisos = "SELECT * FROM avisos 
              WHERE id_residente = '$id_residente'";

if ($fechaAviso) {
    $sqlAvisos .= " AND DATE(fecha) = '$fechaAviso'";
}

$avisos = $conexion->query($sqlAvisos);
// enviar a vista de familiar
include("views/gestion_view_familiar.php");
?>