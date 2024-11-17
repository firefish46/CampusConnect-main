<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection details
$host = "sql304.infinityfree.com";
$user = "if0_37639801";
$password = "campusconnect3";
$database = "if0_37639801_campusconnect";

// Establish a database connection
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Extract the requested path and method
$requestUri = str_replace("/" . basename(__FILE__), "", $_SERVER["REQUEST_URI"]);
$path = explode("/", trim($requestUri, "/"));
$method = $_SERVER["REQUEST_METHOD"];

// Validate path structure
if (count($path) < 2 || $path[0] !== "api") {
    http_response_code(400);
    echo json_encode(["error" => "Invalid API path"]);
    exit;
}

// Handle API endpoints
$endpoint = $path[1];
$parameter = isset($path[2]) ? intval($path[2]) : null;

switch ($endpoint) {
    case "departments":
        if ($method === "GET") {
            $result = $conn->query("SELECT * FROM departments");
            if ($result) {
                echo json_encode($result->fetch_all(MYSQLI_ASSOC));
            } else {
                http_response_code(500);
                echo json_encode(["error" => $conn->error]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    case "intakes":
        if ($method === "GET" && $parameter) {
            $stmt = $conn->prepare("SELECT * FROM intakes WHERE department_id = ?");
            $stmt->bind_param("i", $parameter);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid or missing parameter"]);
        }
        break;

    case "sections":
        if ($method === "GET" && $parameter) {
            $stmt = $conn->prepare("SELECT * FROM sections WHERE intake_id = ?");
            $stmt->bind_param("i", $parameter);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid or missing parameter"]);
        }
        break;

    case "courses":
        if ($method === "GET" && $parameter) {
            $stmt = $conn->prepare("SELECT * FROM courses WHERE section_id = ?");
            $stmt->bind_param("i", $parameter);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid or missing parameter"]);
        }
        break;

    case "resources":
        if ($method === "GET" && $parameter) {
            $stmt = $conn->prepare("SELECT * FROM resources WHERE course_id = ?");
            $stmt->bind_param("i", $parameter);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        } elseif ($method === "POST" && isset($path[3]) && $path[3] === "upload") {
            // File Upload Logic
            $title = $_POST['title'] ?? null;
            $type = $_POST['type'] ?? null;

            if (!$parameter) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid or missing courseId"]);
                exit;
            }

            if (!$title || !$type) {
                http_response_code(400);
                echo json_encode(["error" => "Missing title or type"]);
                exit;
            }

            if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(["error" => "No valid file uploaded"]);
                exit;
            }

            // Handle File Upload
            $uploadDir = __DIR__ . '/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = time() . '-' . basename($_FILES['file']['name']);
            $filePath = '/uploads/' . $fileName;

            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $fileName)) {
                $stmt = $conn->prepare("INSERT INTO resources (course_id, title, type, file_path) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("isss", $parameter, $title, $type, $filePath);
                if ($stmt->execute()) {
                    echo json_encode(["success" => "Resource uploaded successfully"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => $conn->error]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to move uploaded file"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid or missing parameter"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Invalid API endpoint"]);
        break;
}

// Close the database connection
$conn->close();
?>
