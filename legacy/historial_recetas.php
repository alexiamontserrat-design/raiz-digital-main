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

$fecha_inicio_filtro = $_GET['fecha_inicio'] ?? '';
$fecha_fin_filtro = $_GET['fecha_fin'] ?? '';

$sqlRecetas = "SELECT * FROM recetas_medicas
               WHERE id_residente = '$id_residente'";

if (!empty($fecha_inicio_filtro) && !empty($fecha_fin_filtro)) {
    $sqlRecetas .= " AND fecha_inicio BETWEEN '$fecha_inicio_filtro' AND '$fecha_fin_filtro'";
}

$sqlRecetas .= " ORDER BY created_at DESC";

$recetas = $conexion->query($sqlRecetas);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Historial de Recetas</title>

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

.receta-card {
    background: #cfc5b8;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0px 10px 20px rgba(0,0,0,0.15);
}

.receta-header {
    border-bottom: 2px solid rgba(90,74,47,0.2);
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.receta-title {
    font-size: 24px;
    font-weight: bold;
    color: #3a2e1f;
}

.meta {
    color: #5f5141;
    margin-top: 8px;
}

.medicamento {
    background: #f5efe6;
    border-radius: 15px;
    padding: 20px;
    margin-top: 15px;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
}

.med-title {
    font-size: 20px;
    font-weight: bold;
    color: #3a2e1f;
    margin-bottom: 10px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.info-box {
    background: white;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0px 3px 8px rgba(0,0,0,0.08);
}

.status {
    padding: 10px 16px;
    border-radius: 12px;
    font-weight: bold;
    display: inline-block;
    margin-top: 15px;
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

.empty .icon {
    font-size: 90px;
}

.btn-back {
    background: #d1a365;
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 30px;
}
</style>
</head>

<body>

<div class="header">
    <div>☰ RAÍZ DIGITAL > HISTORIAL DE RECETAS</div>
    <a href="/raiz-digital/gestion_familiar.php" style="color:white;">CASA</a>
</div>

<div class="container">

<h1>💊 Historial Inteligente de Recetas</h1>
<div style="
    background:#cfc5b8;
    padding:20px;
    border-radius:16px;
    margin-bottom:30px;
    box-shadow:0px 6px 12px rgba(0,0,0,0.1);
">

    <form method="GET" style="
        display:flex;
        gap:15px;
        flex-wrap:wrap;
        align-items:end;
    ">

        <div>
            <label><strong>Desde</strong></label><br>
            <input type="date"
                   name="fecha_inicio"
                   value="<?php echo $fecha_inicio_filtro; ?>"
                   style="
                     padding:10px;
                     border:none;
                     border-radius:10px;
                   ">
        </div>

        <div>
            <label><strong>Hasta</strong></label><br>
            <input type="date"
                   name="fecha_fin"
                   value="<?php echo $fecha_fin_filtro; ?>"
                   style="
                     padding:10px;
                     border:none;
                     border-radius:10px;
                   ">
        </div>

        <button type="submit" style="
            background:#d1a365;
            color:white;
            border:none;
            padding:12px 20px;
            border-radius:10px;
            font-weight:bold;
            cursor:pointer;
        ">
            🔍 Filtrar
        </button>

        <a href="/raiz-digital/historial_recetas.php">
            <button type="button" style="
                background:#5a4a2f;
                color:white;
                border:none;
                padding:12px 20px;
                border-radius:10px;
                font-weight:bold;
                cursor:pointer;
            ">
                ♻ Limpiar
            </button>
        </a>

    </form>

</div>
<?php if ($recetas && $recetas->num_rows > 0): ?>

    <?php while($receta = $recetas->fetch_assoc()): ?>

        <div class="receta-card">

            <div class="receta-header">
                <div class="receta-title">
                    📋 Receta #<?php echo $receta['id_receta']; ?>
                </div>

                <div class="meta">
                    Inicio: <?php echo $receta['fecha_inicio']; ?> |
                    Fin: <?php echo $receta['fecha_fin']; ?> |
                    Estado: <?php echo strtoupper($receta['estado']); ?>
                    <br><br>
<div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">

    <a href="/raiz-digital/eliminar_receta.php?id=<?php echo $receta['id_receta']; ?>"
       onclick="return confirm('¿Eliminar toda la receta y sus medicamentos?')"
       style="
          background:#c62828;
          color:white;
          padding:10px 16px;
          border-radius:10px;
          text-decoration:none;
          font-weight:bold;
       ">
       🗑 Eliminar receta
    </a>

    <?php if ($receta['estado'] == 'activa'): ?>

        <a href="/raiz-digital/cambiar_estado_receta.php?id=<?php echo $receta['id_receta']; ?>&estado=finalizada"
           style="
              background:#2e7d32;
              color:white;
              padding:10px 16px;
              border-radius:10px;
              text-decoration:none;
              font-weight:bold;
           ">
           ✔ Finalizar
        </a>

        <a href="/raiz-digital/cambiar_estado_receta.php?id=<?php echo $receta['id_receta']; ?>&estado=cancelada"
           onclick="return confirm('¿Cancelar esta receta?')"
           style="
              background:#8b6b00;
              color:white;
              padding:10px 16px;
              border-radius:10px;
              text-decoration:none;
              font-weight:bold;
           ">
           ✖ Cancelar
        </a>

    <?php endif; ?>

</div>

                <?php if (!empty($receta['observaciones'])): ?>
                    <div class="meta">
                        Observaciones: <?php echo $receta['observaciones']; ?>
                    </div>
                <?php endif; ?>
            </div>

            <?php
            $id_receta = $receta['id_receta'];

            $sqlDetalle = "SELECT rd.*, p.*
                           FROM receta_detalle rd
                           INNER JOIN productos p
                           ON rd.id_producto = p.id_producto
                           WHERE rd.id_receta = '$id_receta'";

            $detalles = $conexion->query($sqlDetalle);
            ?>

            <?php while($d = $detalles->fetch_assoc()): ?>

                <?php
                $stock_real = $d['cantidad'];

                $dosis_por_dia = 24 / $d['frecuencia_horas'];

                $consumo_total = $dosis_por_dia * $d['duracion_dias'] * $d['dosis'];

                $restante = $stock_real - $consumo_total;

                if ($restante < 0) {
                    $clase = "danger";
                    $mensaje = "🔴 STOCK INSUFICIENTE";
                } elseif ($restante <= $d['stock_minimo']) {
                    $clase = "warning";
                    $mensaje = "🟡 REABASTECER PRONTO";
                } else {
                    $clase = "ok";
                    $mensaje = "🟢 STOCK SUFICIENTE";
                }
                ?>

                <div class="medicamento">

                    <div class="med-title">
                        💊 <?php echo $d['nombre']; ?>
                    </div>

                    <div class="grid">

                        <div class="info-box">
                            <strong>Dosis</strong><br>
                            <?php echo $d['dosis'] . " " . $d['unidad_dosis']; ?>
                        </div>

                        <div class="info-box">
                            <strong>Frecuencia</strong><br>
                            Cada <?php echo $d['frecuencia_horas']; ?> horas
                        </div>

                        <div class="info-box">
                            <strong>Duración</strong><br>
                            <?php echo $d['duracion_dias']; ?> días
                        </div>

                        <div class="info-box">
                            <strong>Stock real</strong><br>
                            <?php echo round($stock_real, 2); ?>
                        </div>

                        <div class="info-box">
                            <strong>Consumo estimado</strong><br>
                            <?php echo round($consumo_total, 2); ?>
                        </div>

                        <div class="info-box">
                            <strong>Restante proyectado</strong><br>
                            <?php echo round($restante, 2); ?>
                        </div>

                    </div>

                    <div class="status <?php echo $clase; ?>">
                        <?php echo $mensaje; ?>
                    </div>

                </div>

            <?php endwhile; ?>

        </div>

    <?php endwhile; ?>

<?php else: ?>

    <div class="empty">
        <div class="icon">📦</div>
        <h2>No hay recetas registradas</h2>

        <a href="/raiz-digital/views/crear_receta.php">
            <button class="btn-back">➕ Crear primera receta</button>
        </a>
    </div>

<?php endif; ?>

</div>

</body>
</html>

<?php
$conexion->close();
?>