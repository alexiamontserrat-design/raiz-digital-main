
<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$id_residente = $_SESSION['id_residente'] ?? null;

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error conexión");
}

// 
//  FORZAMOS SIEMPRE RESULT
$result = null;

if ($id_residente) {
    $sql = "SELECT * FROM actividades 
            WHERE id_residente = '$id_residente'
            ORDER BY fecha ASC, hora ASC";

    $result = $conexion->query($sql);
    if (!$result) {
    die("Error en SQL: " . $conexion->error);
}
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Gestión Familiar</title>

<style>
body {
    margin: 0;
    font-family: 'Segoe UI', Arial;
    background-color: #e9e9e9;
}

.header {
    background: linear-gradient(to right, #5a4a2f, #c89b4f);
    color: white;
    padding: 15px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.inicio {
    font-weight: bold;
}

.container {
    padding: 40px;
}

.title {
    display: flex;
    align-items: center;
    gap: 15px;
}

.title img {
    width: 60px;
}

h1 {
    font-size: 50px;
    margin: 0;
}

hr {
    margin: 20px 0 30px 0;
    border: 1px solid #bbb;
}

.grid {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.agenda {
    background-color: #cfc5b8;
    border-radius: 15px;
    padding: 20px;
    width: 400px;
    box-shadow: 0px 8px 15px rgba(0,0,0,0.2);
}

.agenda-title {
    font-weight: bold;
    margin-bottom: 15px;
}

.agenda-item {
    border-top: 1px solid #aaa;
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
}

.agenda-item:first-of-type {
    border-top: none;
}

.left {
    display: flex;
    gap: 10px;
    align-items: center;
}

.dot {
    width: 30px;
    height: 30px;
    background-color: #d89b3c;
    border-radius: 50%;
}

.pending {
    font-size: 12px;
    text-decoration: underline;
}

.cards {
    display: flex;
    gap: 30px;
}

.card {
    background-color: #d1a365;
    width: 180px;
    height: 150px;
    border-radius: 20px;
    box-shadow: 0px 8px 15px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    font-weight: bold;
    transition: 0.3s;
}

.card:hover {
    transform: scale(1.05);
}

.badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: #b52b3a;
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}

.icon {
    font-size: 40px;
    margin-top: 10px;
}
</style>

</head>
<body>

<div class="header">
    <div>☰ RAÍZ DIGITAL > GESTIÓN FAMILIAR</div>

    <div style="display:flex; gap:15px; align-items:center;">

        <a href="/raiz-digital/panel_residente.php" style="color:white; text-decoration:none;">
             ← Volver al menu del Residente
        </a>

    </div>
</div>

<div class="container">

<?php include("contexto_usuario.php"); ?>

    <div class="title">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png">
        <h1>Residente</h1>
    </div>

    <hr>

    <div class="grid">

        <!-- 🔥 AGENDA DINÁMICA -->
        <div class="agenda">
            <div class="agenda-title">📅 AGENDA DE ACTIVIDADES</div>

            <!-- BOTÓN CREAR -->
            <a href="/raiz-digital/views/crear_actividad.html">
                <button>➕ Crear Actividad</button>
            </a>

            <?php if ($result && $result->num_rows > 0): ?>

                <?php while($row = $result->fetch_assoc()): ?>
                    <div class="agenda-item">

                        <div class="left">
                            <div class="dot"></div>
                            <div>
                                <div><?php echo $row['titulo']; ?></div>
                                <small>
                                    Fecha: <?php echo $row['fecha']; ?> 
                                    <?php echo $row['hora']; ?>
                                </small>
                            </div>
                        </div>

                        <div class="pending">
                            <?php
                            $color = "gray";
                            if ($row['estado'] == "confirmado") $color = "green";
                            if ($row['estado'] == "rechazado") $color = "red";
                            ?>

                            <div style="color: <?php echo $color; ?>">
                                <?php echo $row['estado']; ?>
                            </div>
                            <?php
                             // 🔥 GUARDAR FILTROS
                                $fecha_nota = $_GET['fecha_nota'] ?? '';
                                $fecha_aviso = $_GET['fecha_aviso'] ?? '';
                                ?>

                                <div style="color: <?php echo $color; ?>">
                                    <?php echo $row['estado']; ?>
                                </div>

                                <a class="btn confirmar"
                                href="/raiz-digital/confirmar_actividad.php?id=<?php echo $row['id_actividad']; ?>&estado=confirmado&fecha_nota=<?php echo $fecha_nota; ?>&fecha_aviso=<?php echo $fecha_aviso; ?>">
                                ✔ Confirmar
                                </a>

                                <a class="btn rechazar"
                                href="/raiz-digital/confirmar_actividad.php?id=<?php echo $row['id_actividad']; ?>&estado=rechazado&fecha_nota=<?php echo $fecha_nota; ?>&fecha_aviso=<?php echo $fecha_aviso; ?>">
                                ✖ Rechazar
                                </a>

                            <a href="/raiz-digital/eliminar_actividad.php?id=<?php echo $row['id_actividad']; ?>" 
                               onclick="return confirm('¿Eliminar esta actividad?')"
                               style="color:red;">
                               🗑 Eliminar
                            </a>
                        </div>

                    </div>
                <?php endwhile; ?>

            <?php else: ?>
                <p>No hay actividades</p>
            <?php endif; ?>

        </div>

       <?php
$sqlNotas = "SELECT n.*, u.nombre 
            FROM notas n
            INNER JOIN usuarios u ON n.id_usuario = u.id_usuario
            WHERE n.id_residente = '$id_residente'";

if (isset($_GET['fecha_nota']) && $_GET['fecha_nota'] != '') {
    $fecha = $_GET['fecha_nota'];
    $sqlNotas .= " AND DATE(n.fecha) = '$fecha'";
}

$sqlNotas .= " ORDER BY n.fecha DESC";

$notas = $conexion->query($sqlNotas);
?>

<div class="agenda">
    <div class="agenda-title">📝 NOTAS</div>

    <form method="GET">
    <input type="date" name="fecha_nota" value="<?php echo $_GET['fecha_nota'] ?? ''; ?>">

    <!-- MANTENER FILTRO DE AVISOS -->
    <input type="hidden" name="fecha_aviso" value="<?php echo $_GET['fecha_aviso'] ?? ''; ?>">

    <button>Filtrar</button>
    </form>

    <a href="/raiz-digital/views/crear_nota.html">
    <button>➕ Crear Nota</button>
    </a>
    <?php if ($notas && $notas->num_rows > 0): ?>

        <?php while($n = $notas->fetch_assoc()): ?>

            <?php $esEnfermero = $n['tipo'] == 'enfermero'; ?>

            <div style="
                display:flex;
                justify-content: <?php echo $esEnfermero ? 'flex-end' : 'flex-start'; ?>;
                margin:10px 0;
            ">

                <div style="
                    max-width:70%;
                    background: <?php echo $esEnfermero ? '#d1a365' : '#cfc5b8'; ?>;
                    padding:10px;
                    border-radius:15px;
                ">

                    <strong><?php echo $n['nombre']; ?></strong><br>
                    <?php echo $n['contenido']; ?><br>

                    <small><?php echo $n['fecha']; ?></small>

                    <br>
                    <a href="/raiz-digital/eliminar_nota.php?id=<?php echo $n['id_nota']; ?>"
                       onclick="return confirm('¿Eliminar nota?')"
                       style="color:red;">
                       🗑 Eliminar
                    </a>

                </div>
                
            </div>

        <?php endwhile; ?>

    <?php else: ?>
        <p>No hay notas</p>
    <?php endif; ?>

</div>
<div class="agenda">
    <div class="agenda-title">💊 RECETAS MÉDICAS</div>

    <a href="/raiz-digital/views/crear_receta.php">
        <button>➕ Nueva Receta</button>
    </a>

    <br><br>

    <a href="/raiz-digital/historial_recetas.php">
        <button>📋 Ver Historial</button>
    </a>

    <br><br>

    <a href="/raiz-digital/reabastecimiento.php">
        <button>📦 Evaluar Reabastecimiento</button>
    </a>
</div>

<?php
$sqlAlertas = "
    SELECT ar.*, p.nombre
    FROM alertas_reabastecimiento ar
    INNER JOIN productos p ON ar.id_producto = p.id_producto
    WHERE ar.id_residente = '$id_residente'
    AND ar.alerta_activa = 1
    ORDER BY ar.fecha_generada DESC
";

$alertas = $conexion->query($sqlAlertas);
?>

<div class="agenda">
    <div class="agenda-title">📦 ALERTAS DE REABASTECIMIENTO</div>

    <?php if ($alertas && $alertas->num_rows > 0): ?>

        <?php while($al = $alertas->fetch_assoc()): ?>

           <div class="agenda-item" style="
    border-left: 6px solid <?php echo ($al['nivel'] == 'danger') ? '#c62828' : '#d1a365'; ?>;
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 12px;
">

    <strong><?php echo $al['nombre']; ?></strong>
    <br>

    <?php echo $al['mensaje']; ?>

    <br><br>

    <?php if ($al['familiar_enterado'] == 1): ?>

        <span style="
            color:#2e7d32;
            font-weight:bold;
        ">
            ✅ Familiar enterado
        </span>

    <?php else: ?>

        <span style="
            color:#c62828;
            font-weight:bold;
        ">
            👀 Familiar pendiente de enterarse
        </span>

    <?php endif; ?>

</div>

        <?php endwhile; ?>

    <?php else: ?>

        <p>No hay alertas activas</p>

    <?php endif; ?>

</div>


<?php
$sqlAvisos = "SELECT * FROM avisos 
              WHERE id_residente = '$id_residente'";

if (isset($_GET['fecha_aviso']) && $_GET['fecha_aviso'] != '') {
    $fechaAviso = $_GET['fecha_aviso'];
    $sqlAvisos .= " AND DATE(fecha) = '$fechaAviso'";
}

$sqlAvisos .= " ORDER BY fecha DESC";

$avisos = $conexion->query($sqlAvisos);
?>

<div class="agenda">
    <div class="agenda-title">🔔 AVISOS</div>

    <a href="/raiz-digital/views/crear_aviso.html">
        <button>➕ Crear Aviso</button>
    </a>

   <form method="GET">
    <input type="date" name="fecha_aviso" value="<?php echo $_GET['fecha_aviso'] ?? ''; ?>">

    <!-- MANTENER FILTRO DE NOTAS -->
    <input type="hidden" name="fecha_nota" value="<?php echo $_GET['fecha_nota'] ?? ''; ?>">

    <button>Filtrar</button>
</form>

    <?php if ($avisos && $avisos->num_rows > 0): ?>

        <?php while($a = $avisos->fetch_assoc()): ?>

            <div class="agenda-item">
                <div>
                    <strong><?php echo $a['titulo']; ?></strong><br>
                    <?php echo $a['descripcion']; ?><br>
                    Cantidad: <?php echo $a['cantidad']; ?><br>
                    Fecha: <?php echo $a['fecha']; ?>

                    <br>
                    <a href="/raiz-digital/eliminar_aviso.php?id=<?php echo $a['id_aviso']; ?>"
                       onclick="return confirm('¿Eliminar aviso?')"
                       style="color:red;">
                       🗑 Eliminar
                    </a>
                </div>
            </div>

        <?php endwhile; ?>

    <?php else: ?>
        <p>No hay avisos</p>
    <?php endif; ?>

</div>
 </div>
 </div>
</body>
</html>