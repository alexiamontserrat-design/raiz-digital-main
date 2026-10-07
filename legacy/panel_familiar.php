<?php
session_start();

if (!isset($_SESSION['id_usuario'])) {
    die(" No hay sesión");
}

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$id_usuario = $_SESSION['id_usuario'];

//  buscar familiar
$sql_familiar = "SELECT * FROM familiares WHERE id_usuario = '$id_usuario'";
$result = $conexion->query($sql_familiar);

if ($result->num_rows == 0) {
    die("❌ Este usuario no tiene familiar registrado");
}

$familiar = $result->fetch_assoc();
$id_familiar = $familiar['id_familiar'];

//  buscar residentes
$sql_residentes = "SELECT * FROM residentes WHERE id_familiar = '$id_familiar'";
$residentes = $conexion->query($sql_residentes);

//  enviar a vista
include("views/panel_familiar_view.php");
?>

