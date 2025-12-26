<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// CONFIGURACIÓN BD
$host = "localhost";
$dbname = "u536355856_its_stones";
$user = "u536355856_admin";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error BD"]);
    exit;
}

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
            "must_change_password" => $userFound['must_change_password'] == 1 // Enviamos este flag
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
}
?>