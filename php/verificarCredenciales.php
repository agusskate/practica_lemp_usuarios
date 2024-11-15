<?php
header('Content-Type: application/json');

$servername = '192.168.0.105';
$username = 'agustinam';
$password = 'Q123321q.';
$dbname = 'ejercicio_usuarios';

//conexión
$con = new mysqli($servername, $username, $password, $dbname);

//comprobar  conexión
if ($con->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error en la conexión: ' . $con->connect_error]);
    exit();
}

//verificar si la tabla existe y sino crearla
$createTableSQL = "CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
)";
if (!$con->query($createTableSQL)) {
    echo json_encode(['success' => false, 'error' => 'Error al crear la tabla: ' . $con->error]);
    exit();
}

//obtener datos enviados por POST
$nombre = $_POST['nombre'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';

// Validar entrada
if (empty($nombre) || empty($contrasena)) {
    echo json_encode(['success' => false, 'message' => 'El nombre y la contraseña son obligatorios.']);
    exit();
}

//verificar si el usuario ya existe
$checkUserSQL = "SELECT * FROM administradores WHERE nombre = '$nombre'";
$result = $con->query($checkUserSQL);

if ($result->num_rows === 0) {
    //si el usuario no existe, agregarlo
    $insertUserSQL = "INSERT INTO administradores (nombre, contrasena) VALUES ('$nombre', '$contrasena')";
    if ($con->query($insertUserSQL)) {
        echo json_encode(['success' => true, 'message' => 'Usuario creado exitosamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear el usuario: ' . $con->error]);
    }
} else {
    //si el usuario ya existe, verificar la contraseña
    $user = $result->fetch_assoc();
    if ($user['contrasena'] === $contrasena) {
        echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
    }
}

//cerrar conexión
$con->close();
?>
