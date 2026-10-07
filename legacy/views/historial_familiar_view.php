<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Historial Médico</title>

<style>
body {
    font-family: Arial;
    background: #f4f4f4;
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}

th {
    background: #c89b4f;
    color: white;
}
.header-btns {
    display: flex;
    justify-content: flex-start; /* botón a la izquierda */
    margin-bottom: 20px; /* espacio con el resto de la página */
}

.btn-regresar {
    display: inline-block;
    background-color: #b08b4f; /* dorado consistente con header */
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 8px 16px;
    border-radius: 8px;
    transition: background 0.2s;
}

.btn-regresar:hover {
    background-color: #a07a3e; /* dorado más oscuro al pasar el mouse */
}
</style>
</head>

<body>

<?php include("contexto_usuario.php"); ?>

<h1>Historial Médico</h1>

<div class="header-btns">
    <a href="/raiz-digital/panel_familiar.php" class="btn-regresar"> ⬅ Volver a Selecciona Residente</a>
</div>
<form method="GET" action="/raiz-digital/historial_familiar.php">

    <label>Selecciona fecha:</label>

    <input 
        type="date" 
        name="fecha" 
        value="<?php echo isset($fecha) ? $fecha : ''; ?>"
        required
    >

    <button type="submit">Ver</button>

</form>
<table>
<tr>
    <th>Hora</th>
    <th>Presión</th>
    <th>Temp</th>
    <th>FC</th>
    <th>FR</th>
    <th>O2</th>
    <th>Glucosa</th>
    <th>Observaciones</th>
</tr>

<?php if ($result->num_rows == 0): ?>
<tr>
    <td colspan="8">Sin registros</td>
</tr>
<?php else: ?>

<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?php echo $row['hora']; ?></td>
    <td><?php echo $row['presion']; ?></td>
    <td><?php echo $row['temperatura']; ?></td>
    <td><?php echo $row['frecuencia_cardiaca']; ?></td>
    <td><?php echo $row['frecuencia_respiratoria']; ?></td>
    <td><?php echo $row['oxigeno']; ?></td>
    <td><?php echo $row['glucosa']; ?></td>
    <td><?php echo $row['observaciones']; ?></td>
</tr>
<?php endwhile; ?>

<?php endif; ?>

</table>

</body>
</html>