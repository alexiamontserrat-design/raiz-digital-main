<?php
session_start();

if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['id_residente'])) {
    die("Sesión inválida");
}

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$id_usuario = $_SESSION['id_usuario'];
$id_residente = $_SESSION['id_residente'];

$fecha_inicio = $_POST['fecha_inicio'];
$fecha_fin = $_POST['fecha_fin'];
$observaciones = $_POST['observaciones'];

$productos = $_POST['producto'];
$dosis = $_POST['dosis'];
$unidades = $_POST['unidad'];
$frecuencias = $_POST['frecuencia'];
$duraciones = $_POST['duracion'];

$conexion->begin_transaction();

try {

    // CREAR RECETA PRINCIPAL
    $sqlReceta = "INSERT INTO recetas_medicas
    (id_residente, id_usuario, fecha_inicio, fecha_fin, observaciones)
    VALUES
    ('$id_residente', '$id_usuario', '$fecha_inicio', '$fecha_fin', '$observaciones')";

    if (!$conexion->query($sqlReceta)) {
        throw new Exception("Error creando receta");
    }

    $id_receta = $conexion->insert_id;

    // DETALLES
    for ($i = 0; $i < count($productos); $i++) {

        $id_producto = $productos[$i];
        $dosis_actual = $dosis[$i];
        $unidad_actual = $unidades[$i];
        $frecuencia_actual = $frecuencias[$i];
        $duracion_actual = $duraciones[$i];

        $sqlDetalle = "INSERT INTO receta_detalle
        (id_receta, id_producto, dosis, unidad_dosis, frecuencia_horas, duracion_dias)
        VALUES
        (
            '$id_receta',
            '$id_producto',
            '$dosis_actual',
            '$unidad_actual',
            '$frecuencia_actual',
            '$duracion_actual'
        )";

        if (!$conexion->query($sqlDetalle)) {
            throw new Exception("Error guardando medicamento");
        }
    }

    $conexion->commit();

echo "
<html>
<body style='
    font-family:Segoe UI;
    background:#e9e9e9;
    text-align:center;
    padding:60px;
'>

    <div style='
        background:#cfc5b8;
        padding:40px;
        width:500px;
        margin:auto;
        border-radius:20px;
        box-shadow:0px 10px 20px rgba(0,0,0,0.2);
    '>

        <h1 style='color:#3a2e1f;'>✅ Receta guardada correctamente</h1>

        <div style='margin-top:30px; display:flex; gap:15px; justify-content:center; flex-wrap:wrap;'>

            <a href='/raiz-digital/views/crear_receta.php'>
                <button style='
                    background:#d1a365;
                    color:white;
                    border:none;
                    padding:15px 25px;
                    border-radius:12px;
                    cursor:pointer;
                    font-size:16px;
                    font-weight:bold;
                '>
                    ➕ Crear otra receta
                </button>
            </a>

            <a href='/raiz-digital/gestion_familiar.php'>
                <button style='
                    background:#5a4a2f;
                    color:white;
                    border:none;
                    padding:15px 25px;
                    border-radius:12px;
                    cursor:pointer;
                    font-size:16px;
                    font-weight:bold;
                '>
                    🏠 Volver a Gestión Familiar
                </button>
            </a>

        </div>

    </div>

</body>
</html>
";

} catch (Exception $e) {

    $conexion->rollback();
    echo "Error: " . $e->getMessage();
}

$conexion->close();
?>