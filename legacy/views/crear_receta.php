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

$sql = "SELECT * FROM productos WHERE id_residente = '$id_residente'";
$productos = $conexion->query($sql);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Crear Receta</title>

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
    display: flex;
    justify-content: center;
}

.card {
    width: 900px;
    background: #cfc5b8;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0px 10px 25px rgba(0,0,0,0.2);
}

h1 {
    color: #3a2e1f;
    margin-bottom: 25px;
}

.medicamento {
    background: #f5efe6;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
    box-shadow: 0px 5px 10px rgba(0,0,0,0.08);
}

.row {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

input, select, textarea {
    padding: 12px;
    border: none;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;
    font-family: 'Segoe UI';
}

.col {
    flex: 1;
    min-width: 180px;
}

textarea {
    resize: none;
    height: 100px;
}

button {
    background: #d1a365;
    color: white;
    border: none;
    padding: 14px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.2s;
}

button:hover {
    transform: scale(1.03);
}

.btn-add {
    margin-bottom: 20px;
}

.submit {
    width: 100%;
    font-size: 16px;
}
</style>
</head>

<body>

<div class="header">
    <div>☰ RAÍZ DIGITAL > RECETAS MÉDICAS</div>
    <a href="/raiz-digital/gestion_familiar.php" style="color:white;">CASA</a>
</div>

<div class="container">

<div class="card">

<h1>💊 Nueva Receta Médica</h1>

<form action="/raiz-digital/guardar_receta.php" method="POST">

    <div class="row">
        <div class="col">
            <label>Fecha inicio</label>
            <input type="date" name="fecha_inicio" required>
        </div>

        <div class="col">
            <label>Fecha fin</label>
            <input type="date" name="fecha_fin" required>
        </div>
    </div>

    <br>

    <div id="medicamentos">

        <div class="medicamento">
            <div class="row">

                <div class="col">
                    <label>Medicamento</label>
                    <select name="producto[]" required>
                        <option value="">Seleccionar</option>
                        <?php while($p = $productos->fetch_assoc()): ?>
                            <option value="<?php echo $p['id_producto']; ?>">
                                <?php echo $p['nombre']; ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>

                <div class="col">
                    <label>Dosis</label>
                    <input type="number" step="0.01" name="dosis[]" required>
                </div>

                <div class="col">
                    <label>Unidad</label>
                    <select name="unidad[]" required>
                        <option value="">Seleccionar unidad</option>
                        <option value="tableta">Tableta</option>
                        <option value="capsula">Cápsula</option>
                        <option value="ml">Mililitros (mL)</option>
                        <option value="gota">Gotas</option>
                        <option value="inyeccion">Inyección</option>
                        <option value="sobre">Sobre</option>
                        <option value="ampolleta">Ampolleta</option>
                        <option value="unidad">Unidad</option>
                    </select>
                </div>

                <div class="col">
                    <label>Frecuencia (horas)</label>
                    <input type="number" name="frecuencia[]" required>
                </div>

                <div class="col">
                    <label>Duración (días)</label>
                    <input type="number" name="duracion[]" required>
                </div>

            </div>
        </div>

    </div>

    <button type="button" class="btn-add" onclick="agregarMedicamento()">
        ➕ Agregar medicamento
    </button>

    <textarea name="observaciones" placeholder="Observaciones generales..."></textarea>

    <br><br>

    <button type="submit" class="submit">
        Guardar receta
    </button>

</form>

</div>
</div>

<script>
function agregarMedicamento() {
    const contenedor = document.getElementById('medicamentos');
    const bloque = contenedor.firstElementChild.cloneNode(true);

    bloque.querySelectorAll('input').forEach(input => input.value = '');
    bloque.querySelector('select').selectedIndex = 0;

    contenedor.appendChild(bloque);
}
</script>

</body>
</html>