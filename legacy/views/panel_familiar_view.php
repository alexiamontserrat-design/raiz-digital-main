<?php
// Aquí asumes que ya tienes $residentes desde tu consulta
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Panel Familiar</title>

<style>
    body {
        margin: 0;
        font-family: 'Segoe UI', Arial;
        background-color: #e9e9e9;
    }

    /* HEADER */
    .header {
        background: linear-gradient(to right, #5a4a2f, #c89b4f);
        color: white;
        padding: 17px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .inicio {
        cursor: pointer;
        font-weight: bold;
    }

    /* CONTENEDOR */
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 90vh;
    }

    /* CARD PRINCIPAL */
    .card {
        background-color: #cfc5b8;
        padding: 30px;
        border-radius: 20px;
        width: 400px;
        box-shadow: 0px 8px 20px rgba(0,0,0,0.2);
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    /* TARJETAS DE RESIDENTE */
    .residente {
        background: white;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
    }

    .residente p {
        margin: 0 0 10px 0;
        font-weight: bold;
    }

    /* BOTONES */
    button {
        width: 100%;
        padding: 10px;
        margin-bottom: 8px;
        background-color: #c89b4f;
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
    }

    button:hover {
        background-color: #a87e3c;
    }

    a {
        text-decoration: none;
    }
</style>

<script>
function irInicio() {
    window.location.href = "index.php";
}
</script>

</head>

<body>

<!-- HEADER -->
<div class="header">
    <div>☰ RAÍZ DIGITAL > PANEL FAMILIAR</div>
</div>

<!-- CONTENIDO -->
<?php include("contexto_usuario.php"); ?>
<div class="container">
    <div class="card">

        <h1>Selecciona un residente</h1>

        <?php if ($residentes->num_rows == 0): ?>

            <p>No tienes residentes asignados</p>

        <?php else: ?>

            <?php while ($r = $residentes->fetch_assoc()): ?>

                <div class="residente">
                    
                    <p><?php echo $r['nombre']; ?></p>

                <a
          href="/raiz-digital/seleccionar_residente.php?id_residente=<?php echo $r['id_residente']; ?>&destino=historial"
        >
          <button>Ver historial</button>
        </a>

        <!-- INVENTARIO -->
        <a
          href="/raiz-digital/seleccionar_residente.php?id_residente=<?php echo $r['id_residente']; ?>&destino=inventario"
        >
          <button>Ver inventario</button>
        </a>

        <!-- GESTION -->
        <a
          href="/raiz-digital/seleccionar_residente.php?id_residente=<?php echo $r['id_residente']; ?>&destino=gestion"
        >
          <button>Gestión familiar</button>
        </a>

                </div>

            <?php endwhile; ?>

        <?php endif; ?>

    </div>
</div>

</body>
</html>