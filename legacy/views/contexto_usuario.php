<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$rol = $_SESSION['rol'] ?? '';
$id_residente = $_SESSION['id_residente'] ?? null;

$usuarioNombre = '';

/* =========================
   OBTENER NOMBRE USUARIO
========================= */
if (!empty($_SESSION['nombre'])) {
    $usuarioNombre = $_SESSION['nombre'];
}
elseif (!empty($_SESSION['id_usuario'])) {

    $conexionUser = @mysqli_connect("localhost", "root", "", "raizdigital");

    if ($conexionUser) {

        $idUser = intval($_SESSION['id_usuario']);
        $rolActual = strtolower($rol);

        if ($rolActual == 'enfermero' || $rolActual == 'admin') {
            $sqlUser = "SELECT nombre FROM usuarios WHERE id_usuario = $idUser LIMIT 1";
        }
        elseif ($rolActual == 'familiar') {
            $sqlUser = "SELECT nombre FROM familiares WHERE id_familiar = $idUser LIMIT 1";
        }
        else {
            $sqlUser = null;
        }

        if ($sqlUser) {
            $resUser = mysqli_query($conexionUser, $sqlUser);

            if ($resUser && mysqli_num_rows($resUser) > 0) {
                $rowUser = mysqli_fetch_assoc($resUser);
                $usuarioNombre = $rowUser['nombre'] ?? '';
            }
        }

        mysqli_close($conexionUser);
    }
}

/* =========================
   OBTENER NOMBRE RESIDENTE
========================= */
$residenteNombre = 'Desconocido';

if (!empty($id_residente)) {

    $conexionResidente = @mysqli_connect("localhost", "root", "", "raizdigital");

    if ($conexionResidente) {

        $id_safe = intval($id_residente);

        $sql = "SELECT nombre FROM residentes WHERE id_residente = $id_safe LIMIT 1";
        $res = mysqli_query($conexionResidente, $sql);

        if ($res && mysqli_num_rows($res) > 0) {
            $row = mysqli_fetch_assoc($res);
            $residenteNombre = $row['nombre'] ?? 'Desconocido';
        }

        mysqli_close($conexionResidente);
    }
}
?>
<style>
/* Contexto usuario - paleta dorado / beige */
:root{
	--gold:#cfa23b;
	--gold-dark:#b5862f;
	--beige:#f6efe6;
	--muted:#7a6b57;
}
.contexto-usuario{
	display:inline-flex;
	align-items:center;
	gap:12px;
	background: linear-gradient(180deg, var(--beige), #fff);
	border:1px solid rgba(201,166,110,0.25);
	box-shadow: 0 6px 18px rgba(121,92,46,0.08);
	padding:10px 16px;
	border-radius:12px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
	color:var(--muted);
}
.contexto-usuario__badge{
	display:flex;
	align-items:center;
	gap:10px;
}
.contexto-usuario__role{
	font-weight:700;
	color:var(--gold-dark);
}
.contexto-usuario__name{
	color:#4b3f2f;
}
.contexto-usuario__divider{
	margin:0 8px;
	color:#c09a48;
}
.contexto-usuario__residente{
	font-weight:600;
}
.contexto-usuario__container{
	display:flex;align-items:center;gap:8px;
}

@media (max-width:420px){
	.contexto-usuario{padding:8px;border-radius:10px;font-size:13px}
}
</style>

<div class="contexto-usuario" aria-live="polite">
	<div class="contexto-usuario__container">
		<?php if (strtolower($rol) === 'enfermero'): ?>
			<div class="contexto-usuario__badge">
				<span class="contexto-usuario__role">👨‍⚕️ ENFERMERO:</span>
				<span class="contexto-usuario__name"><?php echo htmlspecialchars($usuarioNombre, ENT_QUOTES, 'UTF-8'); ?></span>
			</div>
		<?php elseif (strtolower($rol) === 'familiar'): ?>
			<div class="contexto-usuario__badge">
				<span class="contexto-usuario__role">👨‍👩‍👧 FAMILIAR:</span>
				<span class="contexto-usuario__name"><?php echo htmlspecialchars($usuarioNombre, ENT_QUOTES, 'UTF-8'); ?></span>
			</div>
		<?php else: ?>
			<div class="contexto-usuario__badge">
				<span class="contexto-usuario__role">USUARIO:</span>
				<span class="contexto-usuario__name"><?php echo htmlspecialchars($usuarioNombre, ENT_QUOTES, 'UTF-8'); ?></span>
			</div>
		<?php endif; ?>

		<span class="contexto-usuario__divider">&nbsp;>&nbsp;</span>

		<div class="contexto-usuario__residente">
			<span>🧓 RESIDENTE:</span>
			<span style="margin-left:6px;color:#3e3326"><?php echo htmlspecialchars($residenteNombre, ENT_QUOTES, 'UTF-8'); ?></span>
		</div>
	</div>
</div>

