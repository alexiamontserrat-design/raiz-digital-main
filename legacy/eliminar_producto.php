<?php
$id = $_GET['id'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$conexion->query("DELETE FROM productos WHERE id_producto = '$id'");

header("Location: inventario_enfermero.php");