<?php
session_start(); 

$conexion = mysqli_connect("localhost", "root", "", "raizdigital");
if (!$conexion) {
  die("Error de conexión: " . mysqli_connect_error());
}

$correo = $_POST['correo'];
$contrasena = $_POST['password'];

// Buscar usuario
$sql = "SELECT * FROM usuarios WHERE correo = '$correo'";
$resultado = mysqli_query($conexion, $sql);

if (mysqli_num_rows($resultado) > 0) {

    $usuario = mysqli_fetch_assoc($resultado);

    if ($usuario['contraseña'] == $contrasena) {

        //  GUARDAR SESIÓN
        $_SESSION['id_usuario'] = $usuario['id_usuario'];
        $_SESSION['rol'] = $usuario['rol']; //  ESTA LÍNEA ES CLAVE
        // DEBUG (opcional)
        // var_dump($_SESSION);

        if ($usuario['rol'] == "enfermero") {
            header("Location: panel_enfermero.html");
            exit();
        } else if ($usuario['rol'] == "familiar") {
            header("Location: panel_familiar.php");
            exit();
        }

    } else {
        echo "Contraseña incorrecta";
    }

} else {
    echo "Usuario no encontrado";
}

mysqli_close($conexion);
?>