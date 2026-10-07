<?php
session_start();

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$id_residente = $_SESSION['id_residente'];
$id_usuario = $_SESSION['id_usuario'];

$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];
$cantidad = $_POST['cantidad'];
$fecha = $_POST['fecha'];

$sql = "INSERT INTO avisos 
(id_residente, id_usuario, titulo, descripcion, cantidad, fecha)
VALUES 
('$id_residente', '$id_usuario', '$titulo', '$descripcion', '$cantidad', '$fecha')";

$conexion->query($sql);

// regresar
header("Location: gestion_familiar.php");
exit();
?>