<?php
session_start();

if (!isset($_SESSION['id_residente'])) {
    die(" No has seleccionado un residente");
}

//echo "Residente ID: " . $_SESSION['id_residente'];

$id_residente = $_SESSION['id_residente'];
// CONEXIÓN
$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error conexión");
}

// OBTENER NOMBRE DEL RESIDENTE
$sql = "SELECT nombre FROM residentes WHERE id_residente = '$id_residente'";
$result = $conexion->query($sql);

$nombre_residente = "Desconocido";

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $nombre_residente = $row['nombre'];
}

$conexion->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Panel del Residente</title>

<style>
body {
    margin: 0;
    font-family: 'Segoe UI', Arial;
    background-color: #e9e9e9;
}



/* CONTENIDO */
.container {
    padding: 40px;
    text-align: center;
}

h1 {
    font-size: 40px;
    margin-bottom: 10px;
}

h2 {
    margin-bottom: 40px;
    color: #555;
}

/* CARDS */
.cards {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

.card {
    background-color: #d1a365;
    width: 200px;
    height: 150px;
    border-radius: 20px;
    box-shadow: 0px 8px 15px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: black;
    font-weight: bold;
    transition: 0.3s;
}

.card:hover {
    transform: scale(1.08);
}

.icon {
    font-size: 40px;
    margin-top: 10px;
}
.back-link {
    display: inline-block;
    margin-bottom: 20px;
    padding: 8px 12px;
    background-color: #d1a365;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
    transition: 0.2s;
}

.back-link:hover {
    background-color: #c89b4f;
    transform: scale(1.03);
}
.header {
    background: linear-gradient(to right, #5a4a2f, #c89b4f);
    color: white;
    padding: 15px 25px;
    font-size: 14px;
    display: flex;
    justify-content: space-between; /* título a la izquierda, botón a la derecha */
    align-items: center;
    padding: 12px 20px;
    border-radius: 8px;
}

.header-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.btn-volver {
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 6px 12px;
    border-radius: 6px;
    transition: background 0.2s;
}

.btn-volver:hover {
    background-color: rgba(255,255,255,0.2);
}
</style>

</head>

<body>

<div class="header">
    <div class="header-title">☰ RAÍZ DIGITAL &gt; Menu Residente</div>
    <a href="/raiz-digital/panel_enfermero_ingresar_residente.php" class="btn-volver">
        ← Volver al menú de Enfermero
    </a>
</div>

<?php include("views/contexto_usuario.php"); ?>

<div class="container">

   <h1>Residente seleccionado: <?php echo $nombre_residente; ?></h1>

    <h2>Opciones</h2>

    <div class="cards">

        <a href="signos_vitales.html" class="card">
            SIGNOS VITALES
            <div class="icon">❤️</div>
        </a>

        <a href="inventario_enfermero.php" class="card">
            INVENTARIO
            <div class="icon">📦</div>
        </a>

        <a href="gestion_familiar.php" class="card">
            GESTIÓN FAMILIAR
            <div class="icon">👨‍👩‍👧</div>
        </a>

    </div>

</div>

</body>
</html>