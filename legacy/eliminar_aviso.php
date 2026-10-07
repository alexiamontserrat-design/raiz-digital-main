<?php
$id = $_GET['id'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$conexion->query("DELETE FROM avisos WHERE id_aviso = '$id'");

header("Location: " . $_SERVER['HTTP_REFERER']);