<?php
session_start();

if (!isset($_SESSION['id_residente'])) {
    die("No hay residente seleccionado");
}

$id_residente = $_SESSION['id_residente'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión");
}

$sql = "
SELECT 
    rm.id_receta,
    rd.*,
    p.id_producto,
    p.nombre,
    p.cantidad,
    p.stock_minimo,
    p.tipo
FROM recetas_medicas rm
INNER JOIN receta_detalle rd ON rm.id_receta = rd.id_receta
INNER JOIN productos p ON rd.id_producto = p.id_producto
WHERE rm.id_residente = '$id_residente'
AND rm.estado = 'activa'
";

$resultado = $conexion->query($sql);

$alertas_generadas = [];
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reabastecimiento Inteligente</title>

<style>
body {
    margin: 0;
    font-family: 'Segoe UI';
    background: #e9e9e9;
}

.header {
    background: linear-gradient(to right, #5a4a2f, #c89b4f);
    color: white;
    padding: 15px 25px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
}

.container {
    padding: 40px;
}

h1 {
    color: #3a2e1f;
    margin-bottom: 30px;
}

.card {
    background: #f5efe6;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
}

.card h2 {
    color: #3a2e1f;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
    gap: 15px;
    margin-top: 20px;
}

.box {
    background: white;
    padding: 15px;
    border-radius: 12px;
}

.estado {
    margin-top: 20px;
    padding: 12px 18px;
    border-radius: 12px;
    font-weight: bold;
    display: inline-block;
}

.ok {
    background: #d4edda;
    color: #2e7d32;
}

.warning {
    background: #fff3cd;
    color: #856404;
}

.danger {
    background: #f8d7da;
    color: #c62828;
}

.empty {
    text-align: center;
    margin-top: 100px;
    color: #666;
}

.btn {
    background: #d1a365;
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
}
</style>
</head>
<body>

<div class="header">
    <div>☰ RAÍZ DIGITAL > REABASTECIMIENTO</div>

    <div>
        <a href="/raiz-digital/panel_residente.php" style="color:white; text-decoration:none;">
            ← MENÚ RESIDENTE
        </a>
    </div>
</div>

<div class="container">
<h1>📦 Reabastecimiento Inteligente</h1>

<?php if ($resultado && $resultado->num_rows > 0): ?>

<?php while($r = $resultado->fetch_assoc()): ?>

<?php
$dosis_por_dia = (24 / $r['frecuencia_horas']) * $r['dosis'];

$consumo_total = $dosis_por_dia * $r['duracion_dias'];

$restante = $r['cantidad'] - $consumo_total;

$dias_restantes = 0;
$fecha_agotamiento = "N/A";

if ($dosis_por_dia > 0) {
    $dias_restantes = $r['cantidad'] / $dosis_por_dia;

    $fecha = new DateTime();
    $fecha->modify("+" . floor($dias_restantes) . " days");

    $fecha_agotamiento = $fecha->format("d/m/Y");
}

$nivel = "ok";
$mensaje = "🟢 Stock suficiente";

if ($restante < 0) {
    $nivel = "danger";
    $mensaje = "🔴 No alcanzará para completar tratamiento";
}
elseif ($dias_restantes <= 3) {
    $nivel = "warning";
    $mensaje = "🟡 Se agotará en menos de 3 días";
}
elseif ($restante <= $r['stock_minimo']) {
    $nivel = "warning";
    $mensaje = "🟡 Reabastecer pronto";
}

if ($restante < 0) {
    $nivel = "danger";
    $mensaje = "🔴 Reabastecimiento urgente";
} elseif ($restante <= $r['stock_minimo']) {
    $nivel = "warning";
    $mensaje = "🟡 Reabastecer pronto";
}

$sqlExiste = "
    SELECT *
    FROM alertas_reabastecimiento
    WHERE id_residente = '$id_residente'
    AND id_producto = '{$r['id_producto']}'
    LIMIT 1
";

$existe = $conexion->query($sqlExiste);

if ($nivel != "ok") {

    if ($nivel == "danger") {
        $texto_alerta = "⚠ El medicamento {$r['nombre']} no alcanzará para completar el tratamiento. Se recomienda reabastecimiento inmediato.";
    }
    elseif ($dias_restantes <= 3) {
        $texto_alerta = "⚠ El medicamento {$r['nombre']} podría agotarse aproximadamente el {$fecha_agotamiento}. Se recomienda solicitar reposición pronto.";
    }
    else {
        $texto_alerta = "⚠ El medicamento {$r['nombre']} se encuentra cerca del nivel mínimo de stock. Se recomienda monitoreo.";
    }

    if ($existe->num_rows > 0) {

        $conexion->query("
            UPDATE alertas_reabastecimiento
            SET
                mensaje = '$texto_alerta',
                nivel = '$nivel',
                alerta_activa = 1
            WHERE id_residente = '$id_residente'
            AND id_producto = '{$r['id_producto']}'
        ");

    } else {

        $conexion->query("
            INSERT INTO alertas_reabastecimiento
            (
                id_residente,
                id_producto,
                mensaje,
                nivel,
                familiar_enterado,
                alerta_activa
            )
            VALUES
            (
                '$id_residente',
                '{$r['id_producto']}',
                '$texto_alerta',
                '$nivel',
                0,
                1
            )
        ");
    }

} else {

    if ($existe->num_rows > 0) {

        $conexion->query("
            UPDATE alertas_reabastecimiento
            SET alerta_activa = 0
            WHERE id_residente = '$id_residente'
            AND id_producto = '{$r['id_producto']}'
        ");
    }
}
?>

<div class="card">

    <h2>💊 <?php echo $r['nombre']; ?></h2>

    <div class="grid">

        <div class="box">
            <strong>Stock actual</strong><br>
            <?php echo $r['cantidad'] . " " . $r['tipo']; ?>
        </div>

        <div class="box">
            <strong>Dosis</strong><br>
            <?php echo $r['dosis'] . " " . $r['unidad_dosis']; ?>
        </div>

        <div class="box">
            <strong>Frecuencia</strong><br>
            Cada <?php echo $r['frecuencia_horas']; ?> horas
        </div>

        <div class="box">
            <strong>Duración</strong><br>
            <?php echo $r['duracion_dias']; ?> días
        </div>

        <div class="box">
            <strong>Consumo estimado</strong><br>
            <?php echo round($consumo_total, 2); ?>
        </div>

        <div class="box">
            <strong>Restante proyectado</strong><br>
            <div class="box">
                <strong>Días restantes</strong><br>
                <?php echo round($dias_restantes, 1); ?>
            </div>

            <div class="box">
                <strong>Fecha estimada de agotamiento</strong><br>
                <?php echo $fecha_agotamiento; ?>
            </div>
            <?php echo round($restante, 2); ?>
        </div>

    </div>

    <div class="estado <?php echo $nivel; ?>">
        <?php echo $mensaje; ?>
    </div>

</div>

<?php endwhile; ?>

<?php else: ?>

<div class="empty">
    <h2>No hay recetas activas</h2>
</div>

<?php endif; ?>

</div>
</body>
</html>

<?php
$conexion->close();
?>