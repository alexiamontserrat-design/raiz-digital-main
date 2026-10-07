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

    <!--  REGRESAR CORRECTO -->
    <a href="/raiz-digital/panel_familiar.php" class="inicio" style="color:white;">
        CASA
    </a>
</div>

<div class="container">

<?php include("contexto_usuario.php"); ?>

    <div class="title">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png">
        <h1>Residente</h1>
    </div>

    <hr>

    <div class="grid">

        <!--  AGENDA DINÁMICA -->
        <div class="agenda">
            <div class="agenda-title">📅 AGENDA DE ACTIVIDADES</div>
            <?php if ($result->num_rows == 0): ?>
                <p>No hay actividades</p>
            <?php else: ?>

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
                <?php endwhile; ?>

            <?php endif; ?>

        </div>

        <!-- BOTONES -->
        <div class="cards">
                    <a href="confirmar_actividad.php?id=<?php echo $row['id_actividad']; ?>&estado=confirmado">
                         Confirmar
                    </a>

                    <a href="confirmar_actividad.php?id=<?php echo $row['id_actividad']; ?>&estado=rechazado">
                         Rechazar
                    </a>
            <!--  AHORA SON LINKS REALES -->
            <a href="#" class="card" style="text-decoration:none; color:black;">
                <div class="badge"><?php echo $result->num_rows; ?></div>
                RECORDATORIOS
                <div class="icon">🔔</div>
            </a>

            <a href="#" class="card" style="text-decoration:none; color:black;">
                NOTAS
                <div class="icon">📝</div>
            </a>

        </div>

    </div>

</div>

</body>
</html>