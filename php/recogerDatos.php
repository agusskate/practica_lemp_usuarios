<?php

//IMPORTANTE EN TODOS LOS PHP ->Configurar el encabezado de respuesta para JSON
header('Content-Type: application/json');

// Conectar a la base de datos
$servername = '192.168.0.105';
$username = 'agustinam';
$password = 'Q123321q.';
$dbname = 'ejercicio_usuarios';


$con = new mysqli($servername, $username, $password, $dbname);

//verificar la conexión
if ($con->connect_error) {
    //error en la conexión, devolver el error como JSON
    echo json_encode(['error' => 'Error en la conexión: ' . $con->connect_error]);
    exit();  // Salir para evitar más código después
}


$sqlSelectDatos = 'SELECT * FROM usuarios';
$resultados = $con->query($sqlSelectDatos);

//verificar si la consulta fue exitosa
if ($resultados) {
    $cuadrado = [];
    while ($file = $resultados->fetch_assoc()) {
        $cuadrado[] = $file;
    }

    //evolver los datos como JSON
    echo json_encode($cuadrado);
} else {
    //error en la consulta, devolverlo como JSON
    echo json_encode(['error' => 'Error en la consulta: ' . $con->error]);
}

?>
