<?php
header('Content-Type: application/json'); // tipo de respuesta será JSON


$servername = '192.168.0.105';
$username = 'agustinam';
$password = 'Q123321q.';
$dbname = 'ejercicio_usuarios';

$con = new mysqli($servername, $username, $password, $dbname);

//verificar conexión
if ($con->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error en la conexión: ' . $con->connect_error]);
    exit(); //
}


$id = $_POST['id'];
$nombre = $_POST['nombre'];
$apellido1 = $_POST['apellido1'];
$apellido2 = $_POST['apellido2'];
$direccion = $_POST['direccion'];
$telefono = $_POST['telefono'];
$dni = $_POST['dni'];

$sql = "UPDATE usuarios SET nombre='$nombre', apellido1='$apellido1', apellido2='$apellido2', direccion='$direccion', telefono='$telefono', dni='$dni' WHERE id='$id'";


if ($con->query($sql) === TRUE) {
    //exito = "success: true"
    echo json_encode(['success' => true]);
} else {
    //error = devolver un mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error al actualizar el usuario: ' . $con->error]);
}

$con->close();
