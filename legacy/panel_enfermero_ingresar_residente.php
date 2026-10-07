<?php
session_start();

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    die(" No has iniciado sesión");
}

//  CASO 1: SELECCIONAR RESIDENTE
if (isset($_POST['id_residente'])) {

    $id_residente = $_POST['id_residente'];

    $_SESSION['id_residente'] = $id_residente;

    header("Location: panel_residente.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Buscar Residente</title>

<style>
body {
    margin: 0;
    font-family: 'Segoe UI', Arial;
    background-color: #e9e9e9;
}



.container {
    padding: 40px;
}

h1 {
    font-size: 40px;
}

/* BUSCADOR */
.buscador {
    margin-bottom: 30px;
}

input {
    padding: 10px;
    width: 300px;
    border-radius: 8px;
    border: 1px solid #aaa;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    background-color: #5a4a2f;
    color: white;
    cursor: pointer;
    margin-left: 10px;
}

button:hover {
    background-color: #c89b4f;
}

/* TARJETAS */
.card {
    background-color: #cfc5b8;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 8px 15px rgba(0,0,0,0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info {
    display: flex;
    flex-direction: column;
}

.id {
    font-size: 12px;
    color: #555;
}

.nombre {
    font-size: 20px;
    font-weight: bold;
}

.select-btn {
    background-color: #d1a365;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
}

.select-btn:hover {
    transform: scale(1.05);
}
.breadcrumb-container {
    display: flex;
    justify-content: flex-end; /* Esto empuja el botón a la derecha */
    align-items: center;
    padding: 10px 20px;
    background-color: #b5862f; /* Igual que la barra de navegación */
    border-radius: 8px;
}

.breadcrumb-btn {
    text-decoration: none;
    color: white;
    font-weight: bold;
    background-color: #cfa23b;
    padding: 6px 12px;
    border-radius: 6px;
    transition: 0.2s;
}

.breadcrumb-btn:hover {
    background-color: #b5862f;
}
.header {
    background: linear-gradient(to right, #5a4a2f, #c89b4f);
    color: white;
    padding: 15px 25px;
    font-size: 14px;
    display: flex;
    justify-content: space-between; /* título a la izquierda, botón a la derecha */
    align-items: center;
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
<head>
    <div class="header">
    <div class="header-title">☰ RAÍZ DIGITAL &gt; Buscar Residente</div>

        <a href="/raiz-digital/panel_enfermero.html" class="btn-volver">
            ← Volver al menu de Enfermero
        </a>
</div>

</head>

<body>


<div class="container">

    <h1>Buscar Residente</h1>
<form method="POST" class="buscador">

    <input type="text" name="busqueda" placeholder="ID o Nombre del residente" required>

    <button type="submit">Buscar</button>

</form>
    <?php
    // CASO 2: BUSCAR
    if (isset($_POST['busqueda'])) {

        $conexion = new mysqli("localhost", "root", "", "raizdigital");

        if ($conexion->connect_error) {
            die("Error de conexión: " . $conexion->connect_error);
        }

        $busqueda = $_POST['busqueda'];

        if (is_numeric($busqueda)) {
            $sql = "SELECT * FROM residentes WHERE id_residente = '$busqueda'";
        } else {
            $sql = "SELECT * FROM residentes WHERE nombre LIKE '%$busqueda%'";
        }

        $result = $conexion->query($sql);

        if ($result && $result->num_rows > 0) {

            while ($row = $result->fetch_assoc()) {

                echo "
                <div class='card'>

                    <div class='info'>
                        <div class='id'>ID: {$row['id_residente']}</div>
                        <div class='nombre'>{$row['nombre']}</div>
                    </div>

                    <form method='POST'>
                        <input type='hidden' name='id_residente' value='{$row['id_residente']}'>
                        <button class='select-btn'>Seleccionar</button>
                    </form>

                </div>
                ";
            }

        } else {
            echo "<p>No se encontraron residentes</p>";
        }

        $conexion->close();
    }
    ?>

</div>

</body>
</html>