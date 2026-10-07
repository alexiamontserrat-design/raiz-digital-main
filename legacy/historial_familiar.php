<?php
session_start();
if (!isset($_SESSION['id_residente'])) {
    die(" No hay residente seleccionado");
}

$id_residente = $_SESSION['id_residente'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : null;

if ($fecha) {

    $sql = "SELECT * FROM signos_vitales 
            WHERE id_residente = '$id_residente'
            AND fecha = '$fecha'
            ORDER BY hora DESC";

} else {

    $sql = "SELECT * FROM signos_vitales 
            WHERE id_residente = '$id_residente'
            ORDER BY fecha DESC, hora DESC";

}
$result = $conexion->query($sql);

// enviar a la vista
include("views/historial_familiar_view.php");
?>