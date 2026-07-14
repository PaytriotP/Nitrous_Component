<?php
/**
 * Paytriot Hosted Payment Request Generator (PHP Helper)
 * 
 * This file provides:
 * 1. A standalone utility class `PaytriotSignatureHelper` to sign payment payloads.
 * 2. A sample endpoint script that accepts transaction data and returns signed fields for the frontend.
 */

// Enable strict error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Dependency-free environment variables loader (.env parser)
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        // Strip enclosing single/double quotes
        if (preg_match('/^["\'](.*)["\']$/', $value, $matches)) {
            $value = $matches[1];
        }
        putenv(sprintf('%s=%s', $name, $value));
        $_ENV[$name] = $value;
    }
}
loadEnv(__DIR__ . '/../.env');

class PaytriotSignatureHelper {
    /**
     * Signs transaction data using a merchant secret key.
     * Generates a secure SHA-512 signature.
     * 
     * @param array $data Asscociative array of parameters to send to the gateway.
     * @param string $secret The merchant signature key.
     * @return string SHA-512 signature hex string.
     */
    public static function sign(array $data, string $secret) {
        // Strip existing signature if present
        unset($data['signature']);

        // Sort keys in ascending alphabetical order (ASCII order)
        ksort($data);

        // Convert the array to a query string (standard HTTP query encoding)
        $queryString = http_build_query($data, '', '&');

        // Normalize carriage returns / line endings to \n (%0A)
        // Paytriot signature requires normalizing %0D%0A, %0A%0D, or %0D to %0A.
        $queryString = preg_replace('/%0D%0A|%0A%0D|%0D/i', '%0A', $queryString);

        // Compute the SHA-512 hash of (query string + secret key)
        return hash('sha512', $queryString . $secret);
    }

    /**
     * Verifies the signature of an incoming callback/redirect response.
     * 
     * @param array $response $_POST or $_GET data returned by the gateway.
     * @param string $secret The merchant signature key.
     * @return bool True if signature matches, throws exception otherwise.
     * @throws Exception if signature verification fails.
     */
    public static function verify(array $response, string $secret): bool {
        if (!isset($response['responseCode'])) {
            throw new Exception('Missing response code from payment gateway.');
        }

        if (!isset($response['signature'])) {
            throw new Exception('Missing signature field from payment gateway.');
        }

        $receivedSignature = $response['signature'];
        unset($response['signature']);

        // Deal with partial signatures (denoted by a | followed by signed field names)
        $fields = null;
        if (strpos($receivedSignature, '|') !== false) {
            list($receivedSignature, $fields) = explode('|', $receivedSignature);
        }

        // If a partial signature, restrict verified fields to the specified subset
        if ($fields) {
            $fieldKeys = explode(',', $fields);
            $response = array_intersect_key($response, array_flip($fieldKeys));
        }

        $expectedSignature = self::sign($response, $secret);

        if ($expectedSignature !== $receivedSignature) {
            throw new Exception('Signature verification failed. Potential tampering detected.');
        }

        return true;
    }
}

// =========================================================================
// DEMO ENDPOINT IMPLEMENTATION
// =========================================================================
// To use this as an API endpoint, point your frontend AJAX call to this script.
// In production, secure this script by requiring user authentication/session check!

// Check if request is an AJAX post to generate signature
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'generate') {
    header('Content-Type: application/json; charset=utf-8');

    // Read and parse JSON request body
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!$inputData) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }

    // Config - Replace these with your actual credentials or config variables
    $merchantID = getenv('PAYTRIOT_MERCHANT_ID') ?: '105630'; // Your Paytriot Merchant ID
    $signatureKey = getenv('PAYTRIOT_SECRET_KEY') ?: 'Media49Stone36Carrot'; // Your Secret Signature Key
    
    // Extract transaction properties from input
    $amount = isset($inputData['amount']) ? floatval($inputData['amount']) : 0.00;
    $currency = isset($inputData['currency']) ? filter_var($inputData['currency'], FILTER_SANITIZE_SPECIAL_CHARS) : 'GBP';
    $orderRef = isset($inputData['orderRef']) ? filter_var($inputData['orderRef'], FILTER_SANITIZE_SPECIAL_CHARS) : uniqid('ORDER_');

    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid amount. Amount must be greater than 0']);
        exit;
    }

    // Convert decimal amount to minor currency units (e.g. £10.01 -> 1001 minor units)
    $amountInMinor = intval(round($amount * 100));

    // Construct payloads required by Paytriot Hosted Page Modal integration
    $fields = [
        'merchantID'        => $merchantID,
        'action'            => 'SALE',
        'amount'            => $amountInMinor,
        'currencyCode'      => $currency,
        'countryCode'       => '826', // UK Code, adjust as needed
        'orderRef'          => $orderRef,
        'transactionUnique' => uniqid('TX_'), // Generate a unique ID to prevent double submissions
        'redirectURL'       => isset($inputData['redirectURL']) ? filter_var($inputData['redirectURL'], FILTER_SANITIZE_URL) : 'http://localhost/paytriot-hosted-popup/checkout.html?status=success', // Redirect after payment page completes
        'callbackURL'       => 'http://localhost/paytriot-hosted-popup/backend-helpers/generator.php?action=callback', // Backend callback url
        'formResponsive'    => 'Y',
    ];

    // Optional customization options (you can pass these to customize the hosted page)
    if (isset($inputData['customerName'])) {
        $fields['customerName'] = filter_var($inputData['customerName'], FILTER_SANITIZE_SPECIAL_CHARS);
    }
    if (isset($inputData['customerEmail'])) {
        $fields['customerEmail'] = filter_var($inputData['customerEmail'], FILTER_SANITIZE_EMAIL);
    }
    if (isset($inputData['customerAddress'])) {
        $fields['customerAddress'] = filter_var($inputData['customerAddress'], FILTER_SANITIZE_SPECIAL_CHARS);
    }
    if (isset($inputData['customerCity'])) {
        $fields['customerCity'] = filter_var($inputData['customerCity'], FILTER_SANITIZE_SPECIAL_CHARS);
    }
    if (isset($inputData['customerPostCode'])) {
        $fields['customerPostCode'] = filter_var($inputData['customerPostCode'], FILTER_SANITIZE_SPECIAL_CHARS);
    }
    if (isset($inputData['customerCountryCode'])) {
        $fields['customerCountryCode'] = filter_var($inputData['customerCountryCode'], FILTER_SANITIZE_SPECIAL_CHARS);
    }
    if (isset($inputData['customerPhone'])) {
        $fields['customerPhone'] = filter_var($inputData['customerPhone'], FILTER_SANITIZE_SPECIAL_CHARS);
    }

    // Compute the secure message signature
    $fields['signature'] = PaytriotSignatureHelper::sign($fields, $signatureKey);

    // Return the fields back to the browser
    echo json_encode([
        'success' => true,
        'fields' => $fields,
        'gatewayUrl' => 'https://gateway.paytriot.co.uk/hosted/modal/?'
    ]);
    exit;
}

// Check for the redirection breakout handler
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'redirect') {
        header('Content-Type: text/html; charset=utf-8');

        // Combine GET and POST params
        $params = array_merge($_GET, $_POST);

        $responseCode = isset($params['responseCode']) ? strval($params['responseCode']) : '';
        $responseMessage = isset($params['responseMessage']) ? $params['responseMessage'] : '';
        $orderRef = isset($params['orderRef']) ? $params['orderRef'] : '';
        $checkoutURL = isset($params['checkoutURL']) ? $params['checkoutURL'] : 'http://localhost/paytriot-hosted-popup/checkout.html';

        $isSuccess = ($responseCode === '0');

        if ($isSuccess) {
            $separator = (strpos($checkoutURL, '?') !== false) ? '&' : '?';
            $successUrl = $checkoutURL . $separator . 'status=success&orderRef=' . urlencode($orderRef);
            ?>
            <!DOCTYPE html>
            <html>
            <head>
                <title>Redirecting...</title>
                <script>
                    setTimeout(function() {
                        var redirected = false;
                        var targetUrl = <?php echo json_encode($successUrl); ?>;
                        if (window.opener) {
                            try {
                                window.opener.postMessage({ action: "paytriot_redirect", url: targetUrl }, window.location.origin);
                                redirected = true;
                            } catch (e) {}
                            try {
                                if (!window.opener.closed) {
                                    window.opener.location.href = targetUrl;
                                    redirected = true;
                                }
                            } catch (e) {}
                            if (redirected) {
                                window.close();
                                return;
                            }
                        }
                        if (window.parent && window.parent !== window && window.parent.PaytriotCheckout) {
                            try {
                                window.parent.postMessage({ action: "paytriot_redirect", url: targetUrl }, window.location.origin);
                                redirected = true;
                            } catch (e) {}
                        }
                        window.top.location.href = targetUrl;
                    }, 1500);
                </script>
            </head>
            <body>
                <p>Payment successful. Redirecting you to checkout confirmation...</p>
            </body>
            </html>
            <?php
        } else {
            $separator = (strpos($checkoutURL, '?') !== false) ? '&' : '?';
            $cancelUrl = $checkoutURL . $separator . 'status=cancel&message=' . urlencode($responseMessage);
            ?>
            <!DOCTYPE html>
            <html>
            <head>
                <title>Redirecting...</title>
                <script>
                    setTimeout(function() {
                        var redirected = false;
                        var targetUrl = <?php echo json_encode($cancelUrl); ?>;
                        if (window.opener) {
                            try {
                                window.opener.postMessage({ action: "paytriot_redirect", url: targetUrl }, window.location.origin);
                                redirected = true;
                            } catch (e) {}
                            try {
                                if (!window.opener.closed) {
                                    window.opener.location.href = targetUrl;
                                    redirected = true;
                                }
                            } catch (e) {}
                            if (redirected) {
                                window.close();
                                return;
                            }
                        }
                        if (window.parent && window.parent !== window && window.parent.PaytriotCheckout) {
                            try {
                                window.parent.PaytriotCheckout.close(true);
                                redirected = true;
                            } catch (e) {}
                        }
                        if (!redirected) {
                            window.top.location.href = targetUrl;
                        }
                    }, 1500);
                </script>
            </head>
            <body>
                <p>Payment cancelled or failed. Returning to checkout...</p>
            </body>
            </html>
            <?php
        }
        exit;
    }
}

// Check for the backend webhook callback
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'callback') {
    // Config - Replace with your actual signature key
    $signatureKey = getenv('PAYTRIOT_SECRET_KEY') ?: 'Media49Stone36Carrot';

    try {
        // Verify that the payload from Paytriot was signed with our secret
        PaytriotSignatureHelper::verify($_POST, $signatureKey);

        $responseCode = intval($_POST['responseCode']);
        $orderRef = $_POST['orderRef'];
        $xref = $_POST['xref']; // Transaction reference
        
        if ($responseCode === 0) {
            // Payment Succeeded!
            // TODO: Update order status in database, send confirmation emails, etc.
            error_log("Paytriot Callback: Payment succeeded for Order: " . $orderRef . " with transaction ID: " . $xref);
        } else {
            // Payment Failed
            error_log("Paytriot Callback: Payment failed for Order: " . $orderRef . ". Code: " . $responseCode . ", Message: " . $_POST['responseMessage']);
        }

        // Always reply with a successful HTTP status code to acknowledge receipt
        http_response_code(200);
        echo "OK";
    } catch (Exception $e) {
        error_log("Paytriot Callback Verification Error: " . $e->getMessage());
        http_response_code(400);
        echo "Callback verification failed.";
    }
    exit;
}
