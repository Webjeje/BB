<?php
// proxy.php - Script PHP sécurisé pour appeler l'API Gemini.

// Affiche les erreurs pour le débogage (à commenter en production)
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// 1. Valider la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => ['message' => 'Méthode non autorisée. Seules les requêtes POST sont acceptées.']]);
    exit;
}

// 2. Récupérer et valider la clé API (à stocker de manière sécurisée)
$apiKey = 'laziza'; // <-- REMPLACEZ PAR VOTRE VRAIE CLÉ
if (empty($apiKey) || $apiKey === 'VOTRE_CLÉ_API_PERSONNELLE_COMMENÇANT_PAR_AIza...') {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => ['message' => 'La clé API n\'est pas configurée sur le serveur.']]);
    exit;
}

// 3. Récupérer, décoder et valider les données JSON entrantes
$json_data = file_get_contents('php://input');
if ($json_data === false) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => ['message' => 'Impossible de lire les données de la requête.']]);
    exit;
}

$request_data = json_decode($json_data, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => ['message' => 'JSON malformé. Erreur: ' . json_last_error_msg()]]);
    exit;
}

// Validation simple de la structure attendue par l'API Gemini
if (!isset($request_data['contents'][0]['parts'][0]['text'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => ['message' => 'La structure des données est invalide. Le champ "prompt" est manquant.']]);
    exit;
}

// 4. Préparer et exécuter l'appel à l'API Gemini
$gemini_api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=' . $apiKey;

$ch = curl_init($gemini_api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($json_data)
]);
// Option pour le débogage SSL sur certains serveurs (à utiliser avec prudence)
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Gestion des erreurs cURL
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => ['message' => 'Erreur cURL: ' . curl_error($ch)]]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// 5. Renvoyer la réponse de l'API au client
// Important : On définit le code de statut HTTP et le type de contenu
// pour que le client (navigateur) interprète correctement la réponse.
http_response_code($http_code);
header('Content-Type: application/json');
echo $response;

?>

