<?php
$id = $_GET['id'];
$tipo = $_GET['tipo'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($tipo == "sumar") {
    $sql = "UPDATE productos SET cantidad = cantidad + 1 WHERE id_producto = '$id'";
} else {
    $sql = "UPDATE productos SET cantidad = GREATEST(cantidad - 1, 0) WHERE id_producto = '$id'";
}

$conexion->query($sql);

header("Location: inventario_enfermero.php");