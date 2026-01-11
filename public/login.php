<?php

// Helper .env
function loadEnv($path) {
    if (!file_exists($path)) { throw new Exception("Env file not found"); }
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
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server Config Error"]);
    exit;
}

// CORS y Headers
$allowed_origins = ["https://itsstonesfzco.com", "https://www.itsstonesfzco.com"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// CONFIGURACIÓN BD
try {
    $pdo = new PDO(
        "mysql:host=" . $_ENV['DB_HOST'] . ";dbname=" . $_ENV['DB_NAME'] . ";charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASSWORD']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error BD"]);
    exit;
}

// Lógica de Login original
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = $_POST['email'] ?? $input['email'] ?? '';
$pass = $_POST['password'] ?? $input['password'] ?? '';

if (empty($email) || empty($pass)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = :email LIMIT 1");
$stmt->execute([':email' => $email]);
$userFound = $stmt->fetch(PDO::FETCH_ASSOC);

if ($userFound && password_verify($pass, $userFound['password'])) {
    $token = bin2hex(random_bytes(32));

    echo json_encode([
        "status" => "success",
        "token" => $token,
        "user" => [
            "id" => $userFound['id'],
            "email" => $userFound['email'],
            "role" => $userFound['role'],
            "must_change_password" => $userFound['must_change_password'] == 1
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
}
?>