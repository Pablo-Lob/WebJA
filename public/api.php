<?php
// api.php (Versión con carpetas separadas + Edición + Services)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- CONFIGURACIÓN BD ---
$host = "localhost";
$dbname = "u536355856_its_stones";
$user = "u536355856_admin";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error BD: " . $e->getMessage()]);
    exit;
}

// 1. DETECTAR QUÉ TABLA QUEREMOS USAR
// Esto debe ir ANTES de definir la carpeta de subida
$table = isset($_GET['table']) ? $_GET['table'] : 'minerals';

// Lista blanca de seguridad (Agregado services)
$allowedTables = ['minerals', 'branches', 'services'];
if (!in_array($table, $allowedTables)) {
    http_response_code(400);
    echo json_encode(["error" => "Tabla no permitida"]);
    exit;
}

// 2. DEFINIR CARPETA SEGÚN LA TABLA
// Si es 'branches' -> uploads/branches/
// Si es 'minerals' -> uploads/catalog/
// Si es 'services' -> uploads/services/
$uploadDir = 'uploads/';
switch ($table) {
    case 'branches':
        $uploadDir .= 'branches/';
        break;
    case 'minerals':
        $uploadDir .= 'catalog/';
        break;
    case 'services':
        $uploadDir .= 'services/';
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Tabla no permitida"]);
        exit;
}

// Crear carpeta si no existe (Importante: Crear también 'uploads' si falta)
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// URL Base para las imágenes
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$baseUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/" . $uploadDir;

$method = $_SERVER['REQUEST_METHOD'];

// ==========================================
//  GET: OBTENER TODOS
// ==========================================
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM $table ORDER BY id DESC"); // Cambiado a DESC para ver los nuevos primero
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Solo los minerales tienen las imágenes en JSON (array)
    if ($table === 'minerals') {
        foreach ($items as &$item) {
            $item['images'] = json_decode($item['images']);
        }
    }

    echo json_encode($items);
}

// ==========================================
//  POST: CREAR NUEVO O EDITAR EXISTING
// ==========================================
elseif ($method === 'POST') {

    // NUEVO: Detectar si viene un ID para saber si es EDICIÓN o CREACIÓN
    $id = $_POST['id'] ?? null;
    $isUpdate = !empty($id);

    if ($table === 'minerals') {
        // --- MINERALES (Guardar en uploads/catalog/) ---
        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';

        // Array para las imágenes NUEVAS que se suban ahora
        $uploadedImages = [];

        if (isset($_FILES['images'])) {
            $files = $_FILES['images'];
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($files['error'][$i] === 0) {
                    $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                    $uniqueName = uniqid() . '_' . time() . '.' . $ext;
                    if (move_uploaded_file($files['tmp_name'][$i], $uploadDir . $uniqueName)) {
                        $uploadedImages[] = $baseUrl . $uniqueName;
                    }
                }
            }
        }

        if ($isUpdate) {
            // --- MODO EDICIÓN MINERALES ---
            // Recuperamos las imágenes que ya tenía para no perderlas
            $stmt = $pdo->prepare("SELECT images FROM minerals WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);
            $currentImages = $existing ? json_decode($existing['images'], true) : [];

            // Mezclamos las viejas con las nuevas (si se subieron nuevas)
            $finalImages = array_merge($currentImages, $uploadedImages);

            $sql = "UPDATE minerals SET name=?, description=?, images=? WHERE id=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $description, json_encode($finalImages), $id]);

        } else {
            // --- MODO CREACIÓN MINERALES ---
            if (empty($uploadedImages)) {
                http_response_code(400);
                echo json_encode(["error" => "No se subieron imágenes."]);
                exit;
            }
            $sql = "INSERT INTO minerals (name, description, images) VALUES (:name, :desc, :imgs)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':name' => $name, ':desc' => $description, ':imgs' => json_encode($uploadedImages)]);
            $id = $pdo->lastInsertId();
        }

    } elseif ($table === 'branches') {
        // --- BRANCHES (Guardar en uploads/branches/) ---
        $city = $_POST['city'] ?? '';
        $desc = $_POST['description'] ?? '';
        $details = $_POST['details'] ?? '';
        $imageUrl = null; // Inicializamos a null

        // Procesar imagen solo si se ha subido una
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $uniqueName = 'branch_' . uniqid() . '.' . $ext;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $uniqueName)) {
                $imageUrl = $baseUrl . $uniqueName;
            }
        }

        if ($isUpdate) {
            // --- MODO EDICIÓN BRANCHES ---
            if ($imageUrl) {
                // Si hay imagen nueva, borramos la vieja del servidor para limpiar
                $stmt = $pdo->prepare("SELECT image FROM branches WHERE id = ?");
                $stmt->execute([$id]);
                $oldItem = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($oldItem && !empty($oldItem['image'])) {
                    $oldFile = basename($oldItem['image']);
                    if (file_exists($uploadDir . $oldFile)) unlink($uploadDir . $oldFile);
                }
                // Actualizamos TODO (incluida imagen)
                $sql = "UPDATE branches SET city=?, description=?, details=?, image=? WHERE id=?";
                $pdo->prepare($sql)->execute([$city, $desc, $details, $imageUrl, $id]);
            } else {
                // Si NO hay imagen nueva, actualizamos solo texto
                $sql = "UPDATE branches SET city=?, description=?, details=? WHERE id=?";
                $pdo->prepare($sql)->execute([$city, $desc, $details, $id]);
            }

        } else {
            // --- MODO CREACIÓN BRANCHES ---
            $sql = "INSERT INTO branches (city, description, details, image) VALUES (:city, :desc, :details, :img)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':city' => $city, ':desc' => $desc, ':details' => $details, ':img' => $imageUrl]);
            $id = $pdo->lastInsertId();
        }

    } elseif ($table === 'services') {
        // --- SERVICES (Guardar en uploads/services/) ---
        // NUEVA SECCIÓN PARA SERVICIOS
        $title = $_POST['title'] ?? '';
        $desc = $_POST['description'] ?? '';
        $imageUrl = null;

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $uniqueName = 'service_' . uniqid() . '.' . $ext;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $uniqueName)) {
                $imageUrl = $baseUrl . $uniqueName;
            }
        }

        if ($isUpdate) {
            // --- MODO EDICIÓN SERVICES ---
            if ($imageUrl) {
                // Borrar vieja
                $stmt = $pdo->prepare("SELECT image FROM services WHERE id = ?");
                $stmt->execute([$id]);
                $oldItem = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($oldItem && !empty($oldItem['image'])) {
                    $oldFile = basename($oldItem['image']);
                    if (file_exists($uploadDir . $oldFile)) unlink($uploadDir . $oldFile);
                }
                $sql = "UPDATE services SET title=?, description=?, image=? WHERE id=?";
                $pdo->prepare($sql)->execute([$title, $desc, $imageUrl, $id]);
            } else {
                $sql = "UPDATE services SET title=?, description=? WHERE id=?";
                $pdo->prepare($sql)->execute([$title, $desc, $id]);
            }
        } else {
            // --- MODO CREACIÓN SERVICES ---
            $sql = "INSERT INTO services (title, description, image) VALUES (:title, :desc, :img)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':title' => $title, ':desc' => $desc, ':img' => $imageUrl]);
            $id = $pdo->lastInsertId();
        }
    }

    echo json_encode(["status" => "success", "id" => $id, "action" => $isUpdate ? "update" : "create"]);
}

// ==========================================
//  DELETE: BORRAR
// ==========================================
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) { http_response_code(400); echo json_encode(["error" => "Falta ID"]); exit; }

    // Primero obtenemos la imagen para borrar el archivo físico
    $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
    $stmt->execute([$id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        // Borrar archivos físicos
        if ($table === 'minerals') {
            $images = json_decode($item['images']);
            // Verificamos si es array por si acaso
            if (is_array($images)) {
                foreach ($images as $imgUrl) {
                    $filename = basename($imgUrl);
                    if (file_exists($uploadDir . $filename)) unlink($uploadDir . $filename);
                }
            }
        } elseif ($table === 'branches' || $table === 'services') {
            // Lógica compartida para branches y services (una sola imagen)
            if (!empty($item['image'])) {
                $filename = basename($item['image']);
                if (file_exists($uploadDir . $filename)) unlink($uploadDir . $filename);
            }
        }

        // Borrar de BD
        $delStmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $delStmt->execute([$id]);
        echo json_encode(["status" => "deleted"]);
    } else {
        echo json_encode(["error" => "No encontrado"]);
    }
}
?>