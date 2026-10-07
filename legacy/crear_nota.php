<?php
session_start();

if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['id_residente'])) {
    die("Sesión no válida");
}

$id_usuario = $_SESSION['id_usuario'];
$id_residente = $_SESSION['id_residente'];
$contenido = $_POST['contenido'];
$rol = $_SESSION['rol'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$sql = "INSERT INTO notas (id_residente, id_usuario, contenido, tipo, fecha)
        VALUES ('$id_residente', '$id_usuario', '$contenido', '$rol', NOW())";

$conexion->query($sql);

// REDIRECCIÓN INTELIGENTE
if ($rol == "enfermero") {
    header("Location: /raiz-digital/gestion_familiar.php");
} else {
    header("Location: /raiz-digital/gestion_familiar_familiar.php");
}