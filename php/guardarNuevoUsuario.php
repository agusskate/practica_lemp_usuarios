<?php
header('Content-Type: application/json');

// Configuración de conexión a la base de datos
$servername = '192.168.0.105';
$username = 'agustinam';
$password = 'Q123321q.';
$dbname = 'ejercicio_usuarios';

$con = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión a la base de datos
if ($con->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error en la conexión: ' . $con->connect_error]);
    exit();
}

// Verificar si la tabla 'usuarios' existe, si no, crearla
$tableCheck = "SHOW TABLES LIKE 'usuarios'";
$result = $con->query($tableCheck);

if ($result->num_rows == 0) {
    // Crear la tabla 'usuarios' si no existe
    $createTableSql = "
        CREATE TABLE usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            apellido1 VARCHAR(255) NOT NULL,
            apellido2 VARCHAR(255) NOT NULL,
            direccion VARCHAR(255) NOT NULL,
            telefono VARCHAR(255) NOT NULL,
            dni VARCHAR(255) NOT NULL,
            urlFotos VARCHAR(255) DEFAULT NULL
        )
    ";
    if ($con->query($createTableSql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Tabla usuarios creada correctamente.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al crear la tabla: ' . $con->error]);
        exit();
    }
}

// Verificar si la columna 'urlFotos' existe, si no, añadirla
$columnCheck = "SHOW COLUMNS FROM usuarios LIKE 'urlFotos'";
$columnResult = $con->query($columnCheck);

if ($columnResult->num_rows == 0) {
    // Añadir la columna 'urlFotos' si no existe
    $addColumnSql = "ALTER TABLE usuarios ADD COLUMN urlFotos VARCHAR(255) DEFAULT NULL";
    if ($con->query($addColumnSql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Columna urlFotos añadida correctamente.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al añadir la columna urlFotos: ' . $con->error]);
        exit();
    }
}

// Obtener los datos del formulario
$nombre = $_POST['nombre'];
$apellido1 = $_POST['apellido1'];
$apellido2 = $_POST['apellido2'];
$direccion = $_POST['direccion'];
$telefono = $_POST['telefono'];
$dni = $_POST['dni'];

// Manejar la imagen (si se ha subido una)
$urlFotos = NULL;  // Inicializar la variable de la URL de la foto

if (isset($_FILES['fotoPerfil']) && $_FILES['fotoPerfil']['error'] === UPLOAD_ERR_OK) {
    // Ruta donde se guardarán las fotos
    $directorio = '../multimedia/fotosPerfil/';

    // Obtener la extensión del archivo
    $ext = pathinfo($_FILES['fotoPerfil']['name'], PATHINFO_EXTENSION);

    // Crear un nombre único para la imagen
    $nombreImagen = uniqid('foto_', true) . '.' . $ext;

    // Ruta completa donde se guardará la foto
    $rutaImagen = $directorio . $nombreImagen;

    // Mover la imagen a la carpeta de destino
    if (move_uploaded_file($_FILES['fotoPerfil']['tmp_name'], $rutaImagen)) {
        // Asignar la URL de la imagen al campo urlFotos
        $urlFotos = $rutaImagen;
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al subir la imagen']);
        exit();
    }
}

// Insertar el nuevo usuario en la base de datos, incluyendo la URL de la foto
$sql = "INSERT INTO usuarios (nombre, apellido1, apellido2, direccion, telefono, dni, urlFotos) 
        VALUES ('$nombre', '$apellido1', '$apellido2', '$direccion', '$telefono', '$dni', '$urlFotos')";

if ($con->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al insertar: ' . $con->error]);
}

$con->close();
