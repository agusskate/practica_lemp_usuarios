<?php

header('Content-Type: application/json');

$servername = '192.168.0.105';
$username = 'agustinam';
$password = 'Q123321q.';
$dbname = 'ejercicio_usuarios';


$con = new mysqli($servername, $username, $password, $dbname);

//verificar conexión
if ($con->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error en la conexión: ' . $con->connect_error]);
    exit();
}

//Verificar que se recibió el ID
if (isset($_POST['id'])) {
    $id = $_POST['id'];

    $sql = "delete from usuarios WHERE id = $id"; 

    if ($con->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al eliminar el usuario']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
}

// Cerrar la conexión
$con->close();
?>
