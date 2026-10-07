<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (!isset($_SESSION['id_residente'])) {
    die("No hay residente seleccionado");
}

$id_residente = $_SESSION['id_residente'];

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión");
}

/* ACTIVIDADES */
$sql = "SELECT * FROM actividades 
        WHERE id_residente = '$id_residente'
        ORDER BY fecha ASC, hora ASC";

$result = $conexion->query($sql);
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

.left {
    display: flex;
    gap: 10px;
}

.dot {
    width: 30px;
    height: 30px;
    background-color: #d89b3c;
    border-radius: 50%;
}

.estado {
    font-size: 12px;
}

.btn {
    display: block;
    margin-top: 5px;
    text-decoration: none;
    font-size: 12px;
}

.confirmar {
    color: green;
}

.rechazar {
    color: red;
}
</style>

</head>

<body>
<div class="header">
    <div>☰ RAÍZ DIGITAL > GESTIÓN FAMILIAR</div>
    <a href="/raiz-digital/panel_familiar.php" style="color:white;">⬅Volver a Selecciona Residente</a>
</div>

<div class="container">

<?php include("contexto_usuario.php"); ?>

    <div class="title">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png">
        <h1>Actividades del Residente</h1>
    </div>

    <hr>

    <!-- 🔥 GRID ABRE AQUÍ -->
    <div class="grid">

        <!-- 📅 AGENDA -->
        <div class="agenda">
            <div class="agenda-title">📅 AGENDA</div>

            <?php if ($result && $result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                    <div class="agenda-item">
                        <div class="left">
                            <div class="dot"></div>
                            <div>
                                <div><?php echo $row['titulo']; ?></div>
                                <small>
                                    <?php echo $row['fecha']; ?> - <?php echo $row['hora']; ?>
                                </small>
                            </div>
                        </div>

                      <div class="estado">

    <?php
        $color = "gray";

        if ($row['estado'] == "confirmado") {
            $color = "green";
        }

        if ($row['estado'] == "rechazado") {
            $color = "red";
        }
    ?>

    <div style="color: <?php echo $color; ?>">
        <?php echo $row['estado']; ?>
    </div>

    <a class="btn confirmar"
       href="/raiz-digital/confirmar_actividad.php?id=<?php echo $row['id_actividad']; ?>&estado=confirmado">
        ✔ Confirmar
    </a>

    <a class="btn rechazar"
       href="/raiz-digital/confirmar_actividad.php?id=<?php echo $row['id_actividad']; ?>&estado=rechazado">
        ✖ Rechazar
    </a>

</div>
                    </div>
                <?php endwhile; ?>
            <?php else: ?>
                <p>No hay actividades</p>
            <?php endif; ?>
        </div>

        <!-- 🔔 AVISOS -->
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
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <p>No hay avisos</p>
                <?php endif; ?>
            </div>
        <?php
       $sqlAlertas = "
            SELECT ar.*, p.nombre
            FROM alertas_reabastecimiento ar
            INNER JOIN productos p ON ar.id_producto = p.id_producto
            WHERE ar.id_residente = '$id_residente'
            AND ar.alerta_activa = 1
            AND ar.id_alerta IN (
                SELECT MAX(id_alerta)
                FROM alertas_reabastecimiento
                WHERE id_residente = '$id_residente'
                AND alerta_activa = 1
                GROUP BY id_producto
            )
    ORDER BY ar.fecha_generada DESC
";

        $alertas = $conexion->query($sqlAlertas);
        ?>
        <div class="agenda">
    <div class="agenda-title">📦 ALERTAS DE MEDICAMENTOS</div>

    <?php if ($alertas && $alertas->num_rows > 0): ?>

        <?php while($al = $alertas->fetch_assoc()): ?>

            <div class="agenda-item" style="
                display:block;
                border-left: 6px solid <?php echo ($al['nivel'] == 'danger') ? '#c62828' : '#d1a365'; ?>;
                background:white;
                padding:15px;
                border-radius:12px;
                margin-bottom:12px;
            ">

                <strong><?php echo $al['nombre']; ?></strong>
                <br><br>

                <?php echo $al['mensaje']; ?>

                <br><br>

                <?php if ($al['familiar_enterado'] == 0): ?>

                    <a href="/raiz-digital/familiar_enterado.php?id=<?php echo $al['id_alerta']; ?>"
                       style="
                           color:#2e7d32;
                           font-weight:bold;
                           text-decoration:none;
                       ">
                       ✔ Enterado
                    </a>

                <?php else: ?>

                    <span style="
                        color:#2e7d32;
                        font-weight:bold;
                    ">
                        ✅ Ya marcado como enterado
                    </span>

                <?php endif; ?>

            </div>

        <?php endwhile; ?>

    <?php else: ?>

        <p>No hay alertas activas</p>

    <?php endif; ?>
</div>

        <!-- 📝 MIS NOTAS -->
        <?php
$id_usuario = $_SESSION['id_usuario'];

$sqlNotas = "SELECT * FROM notas 
             WHERE id_residente = '$id_residente'
             AND id_usuario = '$id_usuario'";

if (isset($_GET['fecha_nota']) && $_GET['fecha_nota'] != '') {
    $fechaNota = $_GET['fecha_nota'];
    $sqlNotas .= " AND DATE(fecha) = '$fechaNota'";
}

$sqlNotas .= " ORDER BY fecha DESC";

$notas = $conexion->query($sqlNotas);
?>

<div class="agenda">
    <div class="agenda-title">📝 MIS NOTAS</div>

    <a href="/raiz-digital/views/crear_nota.html">
        <button>➕ Crear Nota</button>
    </a>

    <form method="GET">
    <input type="date" name="fecha_nota" value="<?php echo $_GET['fecha_nota'] ?? ''; ?>">
    <input type="hidden" name="fecha_aviso" value="<?php echo $_GET['fecha_aviso'] ?? ''; ?>">
    <button>Filtrar</button>
</form>

    <?php if ($notas && $notas->num_rows > 0): ?>
        <?php while($n = $notas->fetch_assoc()): ?>
            <div class="agenda-item">
                <div>
                    <?php echo $n['contenido']; ?><br>
                    <small><?php echo $n['fecha']; ?></small>
                </div>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p>No hay notas</p>
    <?php endif; ?>
</div>

    </div> <!-- 🔥 GRID CIERRA AQUÍ -->

</div>
</body>
</html>