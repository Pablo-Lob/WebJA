<?php
// Configuración de cabeceras para permitir peticiones desde tu web (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Verificar que es una petición POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Leer los datos JSON que envía React
    $input = file_get_contents("php://input");
    $data = json_decode($input);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit;
    }

    // Limpiar y asignar variables
    $name = strip_tags(trim($data->name));
    $email = filter_var(trim($data->email), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($data->phone));
    $message = trim($data->message);
    $subject = strip_tags(trim($data->subject));

    // --- CONFIGURACIÓN DEL CORREO ---

    // 1. Correo corporativo que recibe
    $to = "info@itsstonesfzco.com";

    // 2. Asunto del correo
    $email_subject = "Nuevo Mensaje Web de Contact Us: $name";

    // 3. Cuerpo del mensaje
    $email_body = "Has recibido un nuevo mensaje desde el formulario web:\n\n";
    $email_body .= "Nombre: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Teléfono: $phone\n\n";
    $email_body .= "Mensaje:\n$message\n";

    // 4. Cabeceras importantes (Para evitar SPAM)
    // Es vital que el 'From' sea una cuenta real de tu dominio, ej: no-reply@itsstonesfzco.com o info@...
    $headers = "From: info@itsstonesfzco.com\r\n";
    $headers .= "Reply-To: $email\r\n"; // Para que al dar 'Responder' le escribas al cliente
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Intentar enviar
    if (mail($to, $email_subject, $email_body, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Email sent"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Server failed to send email"]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>