<?php

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
$password = ""; // ¡RECUERDA PONER TU CONTRASEÑA REAL AQUÍ!

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error BD: " . $e->getMessage()]);
    exit;
}

// 1. DETECTAR QUÉ TABLA QUEREMOS USAR
$table = isset($_GET['table']) ? $_GET['table'] : 'minerals';

// Lista blanca de seguridad (AÑADIDO: 'siteConfig')
$allowedTables = ['minerals', 'branches', 'services', 'siteConfig', 'admin_users'];

if (!in_array($table, $allowedTables)) {
    http_response_code(400);
    echo json_encode(["error" => "Tabla no permitida: $table"]);
    exit;
}

// 2. CONFIGURAR CARPETAS DE SUBIDA
$uploadDir = 'uploads/';
// Lógica de carpetas según la tabla
if ($table === 'siteConfig') {
    $uploadDir .= 'config/'; // Carpeta especial para logos y banners
} elseif ($table === 'minerals') {
    $uploadDir .= 'catalog/';
} else {
    // branches/ o services/
    $uploadDir .= $table . '/';
}

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// URL base para generar links a las imágenes
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$baseUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/" . $uploadDir;
$method = $_SERVER['REQUEST_METHOD'];

// ==========================================
//  NUEVO BLOQUE: LÓGICA PARA 'siteConfig'
// ==========================================
// Esto maneja los textos editables (títulos, footer) y subida de imágenes únicas (logo, banner)

if ($table === 'siteConfig') {

    // --- GET: Devolver toda la configuración como lista ---
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM siteConfig");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // --- POST: Guardar cambios ---
    if ($method === 'POST') {

        // A) Caso especial: Subida de imagen para una key concreta (ej: logo, hero_image)
        if (isset($_FILES['image']) && isset($_POST['key'])) {
            $key = $_POST['key'];
            if ($_FILES['image']['error'] === 0) {
                $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                // Nombre único para evitar caché: key_timestamp.jpg
                $filename = $key . '_' . time() . '.' . $ext;

                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
                    $imageUrl = $baseUrl . $filename;

                    // Guardar URL en la BD (INSERT o UPDATE si ya existe)
                    $sql = "INSERT INTO siteConfig (`key`, `value`) VALUES (?, ?)
                            ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$key, $imageUrl]);

                    echo json_encode(["status" => "success", "url" => $imageUrl]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error al mover archivo de imagen"]);
                }
            }
            exit;
        }

        // B) Caso estándar: Guardar textos (JSON o Form normal)
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input && !empty($_POST)) $input = $_POST;

        if (is_array($input)) {
            // Preparamos la sentencia para "Upsert" (Insertar o Actualizar)
            $sql = "INSERT INTO siteConfig (`key`, `value`) VALUES (:key, :value)
                    ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)";
            $stmt = $pdo->prepare($sql);

            $count = 0;
            foreach ($input as $item) {
                // Aceptamos formato array de objetos [{key:..., value:...}] o clave=>valor directo
                if (isset($item['key']) && isset($item['value'])) {
                    $stmt->execute([':key' => $item['key'], ':value' => $item['value']]);
                    $count++;
                }
            }
            echo json_encode(["status" => "success", "message" => "Guardados $count campos de configuración"]);
            exit;
        }
    }
    // Si no es GET ni POST, salimos para no ejecutar lógica de tablas normales
    exit;
}

// ==========================================
//  LÓGICA ORIGINAL (Minerals, Branches, Services)
// ==========================================
// Mantenemos esto intacto para que sigan funcionando tus otras páginas

if ($method === 'GET') {
    // Obtener lista de elementos
    $stmt = $pdo->query("SELECT * FROM $table ORDER BY id DESC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decodificar JSON de imágenes solo para minerals (que tiene array de fotos)
    if ($table === 'minerals') {
        foreach ($items as &$item) {
            $item['images'] = json_decode($item['images']);
        }
    }
    echo json_encode($items);
}

elseif ($method === 'POST') {
    // Crear o Editar Mineral/Branch/Service
    $id = $_POST['id'] ?? null;
    $isUpdate = !empty($id);

    // 1. Manejo de Imágenes (Files)
    // ----------------------------
    $imagePaths = [];

    if ($table === 'minerals') {
        // Minerales: múltiples imágenes
        if (isset($_FILES['images'])) {
            $files = $_FILES['images'];
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($files['error'][$i] === 0) {
                    $fileName = time() . '_' . basename($files['name'][$i]);
                    if (move_uploaded_file($files['tmp_name'][$i], $uploadDir . $fileName)) {
                        $imagePaths[] = $baseUrl . $fileName;
                    }
                }
            }
        }
    } else {
        // Branches y Services: una sola imagen
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $fileName = time() . '_' . basename($_FILES['image']['name']);
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
                $imagePaths[] = $baseUrl . $fileName; // Guardamos solo la URL nueva
            }
        }
    }

    // 2. Insertar / Actualizar en BD
    // -----------------------------
    if ($table === 'minerals') {
        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';

        if ($isUpdate) {
            // Lógica para NO borrar fotos antiguas si no se suben nuevas, o añadir (según tu lógica)
            // Aquí asumimos una lógica simple: si subes nuevas, se añaden a las existentes o reemplazan.
            // Para simplificar y no romper tu lógica anterior, recuperamos las viejas si hace falta.

            // NOTA: En tu código original hacías un manejo específico de imágenes existentes.
            // Si suben nuevas imágenes, las añadimos al array.
            $existingImagesJson = $_POST['existing_images'] ?? '[]';
            $existingImages = json_decode($existingImagesJson, true) ?: [];
            $finalImages = array_merge($existingImages, $imagePaths);

            $stmt = $pdo->prepare("UPDATE minerals SET name=?, description=?, images=? WHERE id=?");
            $stmt->execute([$name, $description, json_encode($finalImages), $id]);
            echo json_encode(["status" => "success", "message" => "Mineral actualizado"]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO minerals (name, description, images) VALUES (?, ?, ?)");
            $stmt->execute([$name, $description, json_encode($imagePaths)]);
            echo json_encode(["status" => "success", "message" => "Mineral creado"]);
        }

    } elseif ($table === 'branches') {
        $city = $_POST['city'] ?? '';
        $description = $_POST['description'] ?? '';
        $details = $_POST['details'] ?? '';
        // Usamos la nueva imagen si hay, si no la que ya estaba (se debe enviar por post o ignorar)
        // En branches/services normalmente se reemplaza la imagen si envías una nueva.

        if ($isUpdate) {
            $sql = "UPDATE branches SET city=?, description=?, details=?";
            $params = [$city, $description, $details];

            if (!empty($imagePaths)) {
                $sql .= ", image=?";
                $params[] = $imagePaths[0];
            }
            $sql .= " WHERE id=?";
            $params[] = $id;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        } else {
            $img = !empty($imagePaths) ? $imagePaths[0] : '';
            $stmt = $pdo->prepare("INSERT INTO branches (city, description, details, image) VALUES (?, ?, ?, ?)");
            $stmt->execute([$city, $description, $details, $img]);
        }
        echo json_encode(["status" => "success"]);

    } elseif ($table === 'services') {
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';

        if ($isUpdate) {
            $sql = "UPDATE services SET title=?, description=?";
            $params = [$title, $description];

            if (!empty($imagePaths)) {
                $sql .= ", image=?";
                $params[] = $imagePaths[0];
            }
            $sql .= " WHERE id=?";
            $params[] = $id;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        } else {
            $img = !empty($imagePaths) ? $imagePaths[0] : '';
            $stmt = $pdo->prepare("INSERT INTO services (title, description, image) VALUES (?, ?, ?)");
            $stmt->execute([$title, $description, $img]);
        }
        echo json_encode(["status" => "success"]);
    }
}

elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Falta ID"]);
        exit;
    }

    // 1. Obtener datos para borrar imagen física
    $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
    $stmt->execute([$id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        // Borrado físico de archivos
        if ($table === 'minerals') {
            $images = json_decode($item['images']);
            if (is_array($images)) {
                foreach ($images as $imgUrl) {
                    // Extraemos solo el nombre del archivo de la URL completa
                    $filename = basename($imgUrl);
                    if (file_exists($uploadDir . $filename)) {
                        unlink($uploadDir . $filename);
                    }
                }
            }
        } elseif ($table === 'branches' || $table === 'services') {
            if (!empty($item['image'])) {
                $filename = basename($item['image']);
                if (file_exists($uploadDir . $filename)) {
                    unlink($uploadDir . $filename);
                }
            }
        }

        // 2. Borrar de BD
        $delStmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $delStmt->execute([$id]);
        echo json_encode(["status" => "deleted"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Elemento no encontrado"]);
    }
}
?>