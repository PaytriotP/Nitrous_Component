/**
 * Paytriot Hosted Payment Request Generator (Node.js Helper)
 * 
 * This file provides:
 * 1. A utility class `PaytriotSignatureHelper` to sign payloads matching the Paytriot PHP SDK.
 * 2. A native Node.js HTTP server demo demonstrating signature generation and callback verification.
 */

const crypto = require('crypto');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

class PaytriotSignatureHelper {
    /**
     * Recursively flattens nested objects/arrays to match PHP's query parameter formatting.
     * @private
     */
    static _flattenParams(key, val) {
        let result = [];
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            for (const [k, v] of Object.entries(val)) {
                result = result.concat(this._flattenParams(`${key}[${k}]`, v));
            }
        } else if (Array.isArray(val)) {
            val.forEach((v, idx) => {
                result = result.concat(this._flattenParams(`${key}[${idx}]`, v));
            });
        } else {
            result.push([key, val === null || val === undefined ? '' : String(val)]);
        }
        return result;
    }

    /**
     * URL encodes strings in compliance with PHP's http_build_query RFC 1738 format.
     * @private
     */
    static _rfc1738Encode(str) {
        return encodeURIComponent(str)
            .replace(/%20/g, '+')
            .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
            .replace(/~/g, '%7E');
    }

    /**
     * Signs transaction data using a merchant secret key.
     * Generates a secure SHA-512 signature matching the Paytriot SDK.
     * 
     * @param {Object} data Flat or nested object of parameters to send to the gateway.
     * @param {string} secret The merchant signature key.
     * @returns {string} SHA-512 signature hex string.
     */
    static sign(data, secret) {
        const signedData = { ...data };
        delete signedData.signature;

        // Sort top-level keys in alphabetical ascending order
        const sortedKeys = Object.keys(signedData).sort();

        const params = [];
        for (const key of sortedKeys) {
            const val = signedData[key];
            const flattened = this._flattenParams(key, val);
            for (const [k, v] of flattened) {
                params.push([k, v]);
            }
        }

        // Build URL encoded query string
        const queryParts = params.map(([k, v]) => {
            return `${this._rfc1738Encode(k)}=${this._rfc1738Encode(v)}`;
        });
        
        let queryString = queryParts.join('&');

        // Normalize line endings to \n (%0A)
        queryString = queryString.replace(/%0D%0A|%0A%0D|%0D/ig, '%0A');

        // Compute the SHA-512 hash of (query string + secret key)
        return crypto
            .createHash('sha512')
            .update(queryString + secret)
            .digest('hex');
    }

    /**
     * Verifies the signature of an incoming callback/redirect response.
     * 
     * @param {Object} response Key-value pairs of response parameters (from request body).
     * @param {string} secret The merchant signature key.
     * @returns {boolean} True if signature matches, throws error otherwise.
     */
    static verify(response, secret) {
        if (!response || response.responseCode === undefined) {
            throw new Error('Missing responseCode from payment gateway.');
        }

        let signatureField = response.signature;
        if (!signatureField) {
            throw new Error('Missing signature from payment gateway.');
        }

        const dataToVerify = { ...response };
        delete dataToVerify.signature;

        let fields = null;
        let signature = signatureField;
        if (signatureField.includes('|')) {
            [signature, fields] = signatureField.split('|');
        }

        // If a partial signature, restrict verified fields to the specified subset
        if (fields) {
            const fieldKeys = fields.split(',');
            for (const key of Object.keys(dataToVerify)) {
                if (!fieldKeys.includes(key)) {
                    delete dataToVerify[key];
                }
            }
        }

        const expectedSignature = this.sign(dataToVerify, secret);

        if (expectedSignature !== signature) {
            throw new Error('Signature verification failed. Potential tampering detected.');
        }

        return true;
    }
}

// Export the class for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PaytriotSignatureHelper };
}

// =========================================================================
// DEMO HTTP SERVER IMPLEMENTATION (Dependency Free Node.js Server)
// =========================================================================
// To run this: node generator.js
// It will listen on http://localhost:3000

// Dependency-free environment variables loader (.env parser)
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split(/\r?\n/).forEach(line => {
                // Ignore comments and empty lines
                if (line.trim().startsWith('#') || !line.includes('=')) return;
                const parts = line.split('=');
                const key = parts[0].trim();
                let val = parts.slice(1).join('=').trim();
                
                // Strip enclosing single/double quotes
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
                
                process.env[key] = val;
            });
        }
    } catch (e) {
        console.error('Error loading .env file:', e.message);
    }
}
loadEnv();

if (require.main === module) {
    const PORT = 3000;
    
    const server = http.createServer((req, res) => {
        // Enable CORS for testing
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        const parsedUrl = url.parse(req.url, true);

        // Serve Static Files
        if (req.method === 'GET' && !parsedUrl.pathname.startsWith('/generate') && !parsedUrl.pathname.startsWith('/callback')) {
            let filePath = parsedUrl.pathname === '/' ? '/checkout.html' : parsedUrl.pathname;
            const absolutePath = path.join(__dirname, '..', filePath);

            const parentDir = path.resolve(__dirname, '..');
            const resolvedPath = path.resolve(absolutePath);

            // Security check: ensure path is within the paytriot-hosted-popup directory
            if (resolvedPath.startsWith(parentDir)) {
                fs.readFile(resolvedPath, (err, content) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('Not Found');
                        return;
                    }

                    let contentType = 'text/html';
                    const ext = path.extname(resolvedPath).toLowerCase();
                    if (ext === '.css') contentType = 'text/css';
                    else if (ext === '.js') contentType = 'application/javascript';
                    else if (ext === '.svg') contentType = 'image/svg+xml';
                    else if (ext === '.png') contentType = 'image/png';

                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                });
                return;
            }
        }

        // API Endpoint: Generate Signature
        if (req.method === 'POST' && parsedUrl.pathname === '/generate') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const inputData = JSON.parse(body);
                    
                    const merchantID = process.env.PAYTRIOT_MERCHANT_ID || '105630'; // Your Paytriot Merchant ID
                    const signatureKey = process.env.PAYTRIOT_SECRET_KEY || 'Media49Stone36Carrot'; // Your Secret Signature Key

                    const amount = parseFloat(inputData.amount) || 0;
                    const currency = inputData.currency || 'GBP';
                    const orderRef = inputData.orderRef || `ORDER_${Date.now()}`;

                    if (amount <= 0) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid amount. Must be greater than 0' }));
                        return;
                    }

                    // Convert decimal to minor currency units
                    const amountInMinor = Math.round(amount * 100);

                    const fields = {
                        merchantID: merchantID,
                        action: 'SALE',
                        amount: amountInMinor,
                        currencyCode: currency,
                        countryCode: '826',
                        orderRef: orderRef,
                        transactionUnique: `TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                        redirectURL: inputData.redirectURL || 'http://localhost:3000/checkout.html?status=success',
                        callbackURL: 'http://localhost:3000/callback',
                        formResponsive: 'Y'
                    };

                    // Inject customer info if provided
                    if (inputData.customerName) fields.customerName = inputData.customerName;
                    if (inputData.customerEmail) fields.customerEmail = inputData.customerEmail;
                    if (inputData.customerAddress) fields.customerAddress = inputData.customerAddress;
                    if (inputData.customerCity) fields.customerCity = inputData.customerCity;
                    if (inputData.customerPostCode) fields.customerPostCode = inputData.customerPostCode;
                    if (inputData.customerCountryCode) fields.customerCountryCode = inputData.customerCountryCode;
                    if (inputData.customerPhone) fields.customerPhone = inputData.customerPhone;

                    // Generate signature
                    fields.signature = PaytriotSignatureHelper.sign(fields, signatureKey);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        fields: fields,
                        gatewayUrl: 'https://gateway.paytriot.co.uk/hosted/modal/?'
                    }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON request payload' }));
                }
            });
            return;
        }

        // Redirect Breakout Page
        if ((req.method === 'POST' || req.method === 'GET') && parsedUrl.pathname === '/redirect') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const params = {};
                // First get params from query string (GET or POST URL params)
                for (const [key, value] of Object.entries(parsedUrl.query)) {
                    params[key] = value;
                }
                
                // Then get params from body if POST
                if (req.method === 'POST' && body) {
                    const searchParams = new URLSearchParams(body);
                    for (const [key, value] of searchParams.entries()) {
                        params[key] = value;
                    }
                }

                const responseCode = params.responseCode !== undefined ? String(params.responseCode) : '';
                const responseMessage = params.responseMessage || '';
                const orderRef = params.orderRef || '';
                const checkoutURL = params.checkoutURL || 'http://localhost:3000/checkout.html';

                const isSuccess = responseCode === '0';
                
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                
                let html = '';
                if (isSuccess) {
                    const successUrl = `${checkoutURL}${checkoutURL.includes('?') ? '&' : '?'}status=success&orderRef=${encodeURIComponent(orderRef)}`;
                    html = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <script>
        setTimeout(function() {
            var redirected = false;
            var targetUrl = ${JSON.stringify(successUrl)};
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
                    `;
                } else {
                    const cancelUrl = `${checkoutURL}${checkoutURL.includes('?') ? '&' : '?'}status=cancel&message=${encodeURIComponent(responseMessage)}`;
                    html = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <script>
        setTimeout(function() {
            var redirected = false;
            var targetUrl = ${JSON.stringify(cancelUrl)};
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
                    `;
                }

                res.end(html.trim());
            });
            return;
        }

        // Webhook Callback Receiver
        if (req.method === 'POST' && parsedUrl.pathname === '/callback') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    // Parse form-urlencoded parameters from gateway POST callback
                    const params = {};
                    const searchParams = new URLSearchParams(body);
                    for (const [key, value] of searchParams.entries()) {
                        params[key] = value;
                    }

                    const signatureKey = process.env.PAYTRIOT_SECRET_KEY || 'Media49Stone36Carrot';

                    // Verify signature
                    PaytriotSignatureHelper.verify(params, signatureKey);

                    const responseCode = parseInt(params.responseCode);
                    const orderRef = params.orderRef;
                    const xref = params.xref;

                    if (responseCode === 0) {
                        console.log(`Node Callback: Payment succeeded for Order: ${orderRef}, Transaction: ${xref}`);
                    } else {
                        console.log(`Node Callback: Payment failed for Order: ${orderRef}, Message: ${params.responseMessage}`);
                    }

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('OK');
                } catch (e) {
                    console.error('Node Callback Verification Error:', e.message);
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Verification failed');
                }
            });
            return;
        }

        // Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    });

    server.listen(PORT, () => {
        console.log(`Paytriot signing helper running on port ${PORT}`);
    });
}
