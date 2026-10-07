<?php
session_start();

$id = $_GET['id'];
$estado = $_GET['estado'];

$fecha_nota = $_GET['fecha_nota'] ?? '';
$fecha_aviso = $_GET['fecha_aviso'] ?? '';

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$sql = "UPDATE actividades SET estado='$estado' WHERE id_actividad='$id'";
$conexion->query($sql);

// 🔥 REDIRECCIÓN CON FILTROS
if ($_SESSION['rol'] == "enfermero") {
    header("Location: /raiz-digital/gestion_familiar.php?fecha_nota=$fecha_nota&fecha_aviso=$fecha_aviso");
} else {
    header("Location: /raiz-digital/gestion_familiar_familiar.php?fecha_nota=$fecha_nota&fecha_aviso=$fecha_aviso");
}