<?php
$conexion = new mysqli("localhost", "root", "", "raizdigital");

$id = $_GET['id'];

$sql = "SELECT * FROM productos WHERE id_producto = '$id'";
$result = $conexion->query($sql);
$p = $result->fetch_assoc();

include("views/editar_producto.html");