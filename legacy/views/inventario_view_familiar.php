<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Inventario</title>

<style>
body {
    margin: 0;
    font-family: 'Segoe UI';
    background: #e9e9e9;
}

/* HEADER */
.header {
    background: linear-gradient(to right, #5a4a2f, #c89b4f);
    color: white;
    padding: 15px 25px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
}

/* CONTENEDOR GENERAL */
.container {
    padding: 40px;
}

/* TARJETA PRINCIPAL (como panel familiar) */
.panel-card {
    background: #cfc5b8;
    padding: 40px;
    border-radius: 20px;
    width: 600px;
    margin: auto;
    box-shadow: 0px 10px 25px rgba(0,0,0,0.2);
}

/* LISTA */
.list {
    width: 100%;
}

/* ITEM */
.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #e6ded3;
    border-radius: 15px;
    padding: 15px 20px;
    margin-bottom: 15px;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.1);
    transition: 0.2s;
}

.item:hover {
    transform: scale(1.02);
}

/* IZQUIERDA */
.left {
    display: flex;
    align-items: center;
    gap: 15px;
}

/* IMAGEN */
img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
}

/* INFO */
.info {
    display: flex;
    flex-direction: column;
}

.nombre {
    font-weight: bold;
    font-size: 18px;
    color: #3a2e1f;
}

.stock {
    font-size: 14px;
    color: #555;
}

.esp {
    font-size: 13px;
    color: #888;
}

/* ESTADO */
.estado {
    padding: 8px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;
}

/* DISPONIBLE */
.estado.ok {
    background: #d4edda;
    color: #2e7d32;
}

/* BAJO STOCK */
.estado.bajo {
    background: #f8d7da;
    color: #c62828;
}

/* EMPTY */
.empty {
    text-align: center;
    color: #444;
}

.empty .icon {
    font-size: 70px;
    margin-bottom: 10px;
}
</style>
</head>

<body>

<div class="header">
    <div>☰ RAÍZ DIGITAL > INVENTARIO</div>
    <a href="/raiz-digital/panel_familiar.php" style="color:white;"> ⬅Volver a Selecciona Residente</a>
</div>

<div class="container">

<?php include("contexto_usuario.php"); ?>

<div class="panel-card">

    <h2 style="margin-bottom:20px;">Inventario del residente</h2>

    <div class="list">

    <?php if ($productos && $productos->num_rows > 0): ?>

        <?php while($p = $productos->fetch_assoc()): ?>

            <div class="item">

                <div class="left">
                    <img src="/raiz-digital/uploads/<?php echo $p['imagen']; ?>">

                    <div class="info">
                        <div class="nombre"><?php echo $p['nombre']; ?></div>
                        <div class="stock">
                            <?php echo $p['cantidad'] . " " . $p['tipo']; ?>
                        </div>
                        <div class="esp"><?php echo $p['especificaciones']; ?></div>
                    </div>
                </div>

                <div class="estado <?php echo ($p['cantidad'] <= 3) ? 'bajo' : 'ok'; ?>">
                    <?php echo ($p['cantidad'] <= 3) ? '⚠ Bajo stock' : '✔ Disponible'; ?>
                </div>

            </div>

        <?php endwhile; ?>

    <?php else: ?>

        <div class="empty">
            <div class="icon">📦</div>
            <h2>No hay productos</h2>
            <p>Actualmente no hay insumos registrados</p>
        </div>

    <?php endif; ?>

    </div>

</div>

</div>

</body>
</html>