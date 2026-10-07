<?php
$conexion = new mysqli("localhost", "root", "", "raizdigital");

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$cantidad = $_POST['cantidad'];
$tipo = $_POST['tipo'];
$esp = $_POST['especificaciones'];

// manejar imagen opcional
if ($_FILES['imagen']['name'] != "") {
    $imagen = $_FILES['imagen']['name'];
    move_uploaded_file($_FILES['imagen']['tmp_name'], "uploads/" . $imagen);

    $sql = "UPDATE productos 
            SET nombre='$nombre', cantidad='$cantidad', tipo='$tipo', especificaciones='$esp', imagen='$imagen'
            WHERE id_producto='$id'";
} else {
    $sql = "UPDATE productos 
            SET nombre='$nombre', cantidad='$cantidad', tipo='$tipo', especificaciones='$esp'
            WHERE id_producto='$id'";
}

$conexion->query($sql);

header("Location: inventario_enfermero.php");