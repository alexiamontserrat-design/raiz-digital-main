<?php
session_start();

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$id_residente = $_SESSION['id_residente'];

$sql = "SELECT * FROM productos 
        WHERE id_residente = '$id_residente'";

$sql = "SELECT * FROM productos";
$productos = $conexion->query($sql);

include("views/inventario_view_enfermero.php");