<?php
// catalog-api.php

// 1. Configuración de seguridad y cabeceras (CORS)
// Esto permite que tu web React se comunique con este archivo PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

// Si es una petición de verificación (preflight), terminamos aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---------------------------------------------------------
// 2. CONFIGURACIÓN DE LA BASE DE DATOS (¡EDITAR ESTO!)
// ---------------------------------------------------------
$host = "localhost";
$dbname = "u536355856_its_stones"; // PON AQUÍ EL NOMBRE COMPLETO DE TU BD
$user = "u536355856_admin";        // PON AQUÍ TU USUARIO COMPLETO
$password = "Tu_Contraseña_Aqui";  // PON AQUÍ TU CONTRASEÑA

// 3. Conexión a MySQL
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a la BD: " . $e->getMessage()]);
    exit;
}

// Carpeta donde se guardarán las imágenes
// Se creará automáticamente dentro de public_html/uploads/catalog/
$uploadDir = 'uploads/catalog/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];

// ==========================================
//  GET: OBTENER TODOS LOS MINERALES
// ==========================================
if ($method === 'GET') {
    // Leemos de la tabla 'minerals'
    $stmt = $pdo->query("SELECT * FROM minerals ORDER BY created_at DESC");
    $minerals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertimos el texto JSON de las imágenes a un Array real para React
    foreach ($minerals as &$mineral) {
        $mineral['images'] = json_decode($mineral['images']);
    }

    echo json_encode($minerals);
}

// ==========================================
//  POST: SUBIR NUEVO MINERAL
// ==========================================
elseif ($method === 'POST') {
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';

    $uploadedImages = [];
    // Esta URL base sirve para que React sepa dónde buscar la foto
    // Ajusta si tu dominio es diferente, pero esto suele funcionar:
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $baseUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/" . $uploadDir;

    // Procesar subida de imágenes
    if (isset($_FILES['images'])) {
        $files = $_FILES['images'];
        $count = count($files['name']);

        for ($i = 0; $i < $count; $i++) {
            if ($files['error'][$i] === 0) {
                $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                // Nombre único para no sobrescribir fotos con el mismo nombre
                $uniqueName = uniqid() . '_' . time() . '.' . $ext;
                $targetFile = $uploadDir . $uniqueName;

                if (move_uploaded_file($files['tmp_name'][$i], $targetFile)) {
                    $uploadedImages[] = $baseUrl . $uniqueName;
                }
            }
        }
    }

    if (empty($uploadedImages)) {
        http_response_code(400);
        echo json_encode(["error" => "No se subieron imágenes o hubo un error."]);
        exit;
    }

    // Insertar datos en la BD
    $sql = "INSERT INTO minerals (name, description, images) VALUES (:name, :desc, :imgs)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':desc' => $description,
        ':imgs' => json_encode($uploadedImages) // Guardamos el array como texto JSON
    ]);

    echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
}

// ==========================================
//  DELETE: BORRAR MINERAL
// ==========================================
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Falta el ID"]);
        exit;
    }

    // 1. Obtener las fotos para borrarlas del servidor y no ocupar espacio
    $stmt = $pdo->prepare("SELECT images FROM minerals WHERE id = ?");
    $stmt->execute([$id]);
    $mineral = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($mineral) {
        $images = json_decode($mineral['images']);
        if (is_array($images)) {
            foreach ($images as $imgUrl) {
                // Extraemos el nombre del archivo de la URL
                $filename = basename($imgUrl);
                $localPath = $uploadDir . $filename;
                if (file_exists($localPath)) {
                    unlink($localPath); // Borrado físico
                }
            }
        }

        // 2. Borrar la fila de la base de datos
        $delStmt = $pdo->prepare("DELETE FROM minerals WHERE id = ?");
        $delStmt->execute([$id]);
        echo json_encode(["status" => "deleted"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Mineral no encontrado"]);
    }
}
?>