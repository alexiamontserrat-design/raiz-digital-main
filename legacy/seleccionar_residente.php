<?php
session_start();

if (!isset($_GET['id_residente']) || !isset($_GET['destino'])) {
    die("Datos incompletos");
}

$_SESSION['id_residente'] = $_GET['id_residente'];
$destino = $_GET['destino'];

//  DETECTAR ROL
$rol = $_SESSION['rol'] ?? null;

if ($rol == "enfermero") {

    switch ($destino) {
        case "historial":
            header("Location: /raiz-digital/inventario.php");
            break;

     case "gestion":
            header("Location: /raiz-digital/gestion_familiar.php");
             break;

        case "signos":
            header("Location: /raiz-digital/signos_vitales.php");
            break;

        default:
            header("Location: /raiz-digital/panel_residente.php");
            break;
    }

} else if ($rol == "familiar") {

    switch ($destino) {
        case "historial":
            header("Location: /raiz-digital/historial_familiar.php");
            break;

        case "inventario":
            header("Location: /raiz-digital/inventario_familiar.php");
            break;

         case "gestion":
            header("Location: /raiz-digital/gestion_familiar_familiar.php");
             break;

        default:
            header("Location: /raiz-digital/panel_familiar.php");
            break;
    }

} else {
    echo "Rol no válido";
}

exit();