<?php
session_start();
$id_residente = $_SESSION['id_residente'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$nombre = $_POST['nombre'];
$cantidad = $_POST['cantidad'];
$tipo = $_POST['tipo'];
$imagen = $_FILES['imagen']['name'];
$esp = $_POST['especificaciones'];
move_uploaded_file($_FILES['imagen']['tmp_name'], "uploads/" . $imagen);

$sql = "INSERT INTO productos 
(nombre, cantidad, tipo, imagen, especificaciones, id_residente)
VALUES 
('$nombre', '$cantidad', '$tipo', '$imagen', '$esp', '$id_residente')";

$conexion->query($sql);

header("Location: inventario_enfermero.php");