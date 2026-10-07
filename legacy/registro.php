<?php

$conexion = new mysqli("localhost", "root", "", "raizdigital");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$nombre = $_POST['nombre'];
$correo = $_POST['correo'];
$password = $_POST['password'];
$rol = $_POST['rol'];

// SIN HASH 
$sqlUsuario = "INSERT INTO usuarios (nombre, correo, contraseña, rol)
VALUES ('$nombre', '$correo', '$password', '$rol')";

if ($conexion->query($sqlUsuario) === TRUE) {

    $id_usuario = $conexion->insert_id;

    if ($rol == "familiar") {
        $telefono = $_POST['telefono'];

        $conexion->query("INSERT INTO familiares (id_usuario, telefono)
                          VALUES ('$id_usuario', '$telefono')");
    }

    if ($rol == "residente") {
        $edad = $_POST['edad'];
        $diagnostico = $_POST['diagnostico'];
        $habitacion = $_POST['habitacion'];

        $conexion->query("INSERT INTO residentes 
        (id_usuario, nombre, edad, diagnostico, habitacion)
        VALUES ('$id_usuario', '$nombre', '$edad', '$diagnostico', '$habitacion')");
    }

    echo "
    <h2>Registro exitoso</h2>
    <a href='login.html'>Ir al login</a>
    ";

} else {
    echo "Error: " . $conexion->error;
}

$conexion->close();
?>