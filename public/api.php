<?php

// Cargar variables de entorno (.env)
function loadEnv($path) {
    if (!file_exists($path)) {
        http_response_code(500);
        echo json_encode(["error" => "Falta configuración .env"]);
        exit;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}
try {
    loadEnv(__DIR__ . '/.env');
} catch (Exception $e) {
    exit; // Silencioso en producción
}

// 1. SEGURIDAD CORS: Solo permitir dominio
$allowed_origins = [
    "https://itsstonesfzco.com",
    "https://www.itsstonesfzco.com",
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. CONEXIÓN BD
try {
    $pdo = new PDO(
        "mysql:host=" . $_ENV['DB_HOST'] . ";dbname=" . $_ENV['DB_NAME'] . ";charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASSWORD']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error BD"]);
    exit;
}

// 3. ENRUTAMIENTO
$table = isset($_GET['table']) ? $_GET['table'] : 'minerals';
// Agregamos 'blog' a tu lista original
$allowedTables = ['minerals', 'branches', 'services', 'siteConfig', 'admin_users', 'blog'];

if (!in_array($table, $allowedTables)) {
    http_response_code(400);
    echo json_encode(["error" => "Tabla no permitida"]);
    exit;
}

// Configuración de Directorios
$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$baseUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/" . $uploadDir;
$method = $_SERVER['REQUEST_METHOD'];

//  LÓGICA SITE CONFIG (Tu bloque original)
if ($table === 'siteConfig') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM siteConfig");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }
    if ($method === 'POST') {
        // 1. Guardar Textos
        foreach ($_POST as $key => $value) {
            $sql = "INSERT INTO siteConfig (`key`, `value`) VALUES (:key, :value) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':key' => $key, ':value' => $value]);
        }
        // 2. Guardar Archivos
        if (!empty($_FILES)) {
            foreach ($_FILES as $key => $file) {
                if ($file['error'] === 0) {
                    $finfo = new finfo(FILEINFO_MIME_TYPE);
                    $mime = $finfo->file($file['tmp_name']);
                    if (in_array($mime, ['image/jpeg', 'image/png', 'image/webp'])) {
                        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                        $filename = $key . '_' . time() . '.' . $ext;
                        if (move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
                            $imageUrl = $baseUrl . $filename;
                            $sql = "INSERT INTO siteConfig (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)";
                            $stmt = $pdo->prepare($sql);
                            $stmt->execute([$key, $imageUrl]);
                        }
                    }
                }
            }
        }
        echo json_encode(["status" => "success"]);
        exit;
    }
}

//  LÓGICA BLOG
if ($table === 'blog') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM blog ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }
    elseif ($method === 'POST') {
        $title = $_POST['title'];
        $slug = $_POST['slug'];
        $excerpt = $_POST['excerpt'];
        $content = $_POST['content'];
        $category = $_POST['category'];
        $metaTitle = $_POST['metaTitle'] ?? '';
        $metaDesc = $_POST['metaDesc'] ?? '';

        $imgUrl = '';
        // Lógica de subida idéntica a tu estilo original
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            if (in_array($finfo->file($_FILES['image']['tmp_name']), ['image/jpeg', 'image/png', 'image/webp'])) {
                $fname = 'blog_' . time() . '_' . basename($_FILES['image']['name']);
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fname)) {
                    $imgUrl = $baseUrl . $fname;
                }
            }
        }

        $id = $_POST['id'] ?? null;
        if ($id) {
            $sql = "UPDATE blog SET title=?, slug=?, excerpt=?, content=?, category=?, meta_title=?, meta_desc=?";
            $params = [$title, $slug, $excerpt, $content, $category, $metaTitle, $metaDesc];
            if ($imgUrl) { $sql .= ", image=?"; $params[] = $imgUrl; }
            $sql .= " WHERE id=?"; $params[] = $id;
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        } else {
            $stmt = $pdo->prepare("INSERT INTO blog (title, slug, excerpt, content, category, meta_title, meta_desc, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $excerpt, $content, $category, $metaTitle, $metaDesc, $imgUrl]);
        }
        echo json_encode(["status" => "success"]);
        exit;
    }
}

//  LÓGICA ESTÁNDAR (Minerales, Services, Branches)

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM $table ORDER BY id DESC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($table === 'minerals') {
        foreach ($items as &$item) $item['images'] = json_decode($item['images']);
    }
    echo json_encode($items);
}

elseif ($method === 'POST') {
    // ADMIN USERS
    if ($table === 'admin_users') {
        $action = $_POST['action'] ?? '';
        if ($action === 'create') {
            $email = $_POST['email'];
            $pass = $_POST['password'];
            $role = $_POST['role'] ?? 'editor';
            $hash = password_hash($pass, PASSWORD_DEFAULT);
            try {
                $stmt = $pdo->prepare("INSERT INTO admin_users (email, password, role) VALUES (?, ?, ?)");
                $stmt->execute([$email, $hash, $role]);
                echo json_encode(["status" => "success"]);
            } catch (Exception $e) { echo json_encode(["error" => "Error"]); }
            exit;
        }
        if ($action === 'change_password') {
            $id = $_POST['id'];
            $newPass = $_POST['new_password'];
            $hash = password_hash($newPass, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE admin_users SET password=?, must_change_password=0 WHERE id=?");
            $stmt->execute([$hash, $id]);
            echo json_encode(["status" => "success"]);
            exit;
        }
    }

    $id = $_POST['id'] ?? null;
    $isUpdate = !empty($id);
    $imagePaths = [];

    // Subida de archivos estándar
    if ($table === 'minerals' && isset($_FILES['images'])) {
        $files = $_FILES['images'];
        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] === 0) {
                // Validación básica seguridad
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                if (in_array($finfo->file($files['tmp_name'][$i]), ['image/jpeg', 'image/png', 'image/webp'])) {
                    $fname = time() . '_' . basename($files['name'][$i]);
                    if (move_uploaded_file($files['tmp_name'][$i], $uploadDir . $fname)) $imagePaths[] = $baseUrl . $fname;
                }
            }
        }
    } elseif (($table === 'branches' || $table === 'services') && isset($_FILES['image'])) {
        if ($_FILES['image']['error'] === 0) {
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            if (in_array($finfo->file($_FILES['image']['tmp_name']), ['image/jpeg', 'image/png', 'image/webp'])) {
                $fname = time() . '_' . basename($_FILES['image']['name']);
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fname)) $imagePaths[] = $baseUrl . $fname;
            }
        }
    }

    // Insertar/Actualizar BD
    if ($table === 'minerals') {
        $name = $_POST['name']; $desc = $_POST['description'];
        if ($isUpdate) {
            $oldImgs = json_decode($_POST['existing_images'] ?? '[]', true) ?: [];
            $finalImgs = array_merge($oldImgs, $imagePaths);
            $stmt = $pdo->prepare("UPDATE minerals SET name=?, description=?, images=? WHERE id=?");
            $stmt->execute([$name, $desc, json_encode($finalImgs), $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO minerals (name, description, images) VALUES (?, ?, ?)");
            $stmt->execute([$name, $desc, json_encode($imagePaths)]);
        }
    } elseif ($table === 'branches') {
        $city = $_POST['city']; $desc = $_POST['description']; $det = $_POST['details'];
        if ($isUpdate) {
            $sql = "UPDATE branches SET city=?, description=?, details=?";
            $params = [$city, $desc, $det];
            if (!empty($imagePaths)) { $sql .= ", image=?"; $params[] = $imagePaths[0]; }
            $sql .= " WHERE id=?"; $params[] = $id;
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        } else {
            $img = $imagePaths[0] ?? '';
            $stmt = $pdo->prepare("INSERT INTO branches (city, description, details, image) VALUES (?, ?, ?, ?)");
            $stmt->execute([$city, $desc, $det, $img]);
        }
    } elseif ($table === 'services') {
        $title = $_POST['title']; $desc = $_POST['description'];
        if ($isUpdate) {
            $sql = "UPDATE services SET title=?, description=?";
            $params = [$title, $desc];
            if (!empty($imagePaths)) { $sql .= ", image=?"; $params[] = $imagePaths[0]; }
            $sql .= " WHERE id=?"; $params[] = $id;
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        } else {
            $img = $imagePaths[0] ?? '';
            $stmt = $pdo->prepare("INSERT INTO services (title, description, image) VALUES (?, ?, ?)");
            $stmt->execute([$title, $desc, $img]);
        }
    }
    echo json_encode(["status" => "success"]);
}

elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) exit;
    $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "deleted"]);
}
?>