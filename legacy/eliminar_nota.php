<?php
session_start();

$id = $_GET['id'];
$rol = $_SESSION['rol'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($rol != "enfermero") {
    die("No autorizado");
}
// eliminar
$conexion->query("DELETE FROM notas WHERE id_nota = '$id'");

// redirigir según rol
if ($rol == "enfermero") {
    header("Location: /raiz-digital/gestion_familiar.php");
} else {
    header("Location: /raiz-digital/gestion_familiar_familiar.php");
}