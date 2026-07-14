# Paytriot Hosted Payment Popup Integration Kit

Welcome to the **Paytriot Hosted Payment Popup Integration Kit**. This kit is designed for developers building custom websites who want to offer a premium, seamless checkout experience while keeping PCI-DSS compliance requirements as simple as possible.

By loading Paytriot's secure payment form inside a customizable iframe popup modal overlay directly on your checkout page, you ensure customers never leave your website, reducing checkout friction and cart abandonment.


## ⚙️ How the Popup Integration Works

1.  **Order Initiation**: The customer fills in billing details and clicks "Pay".
2.  **Signature Request**: Your frontend sends order details (amount, currency) via AJAX to your secure backend.
3.  **Secure Signing**: Your backend calculates a secure **SHA-512 signature** using your private merchant **Signature Key**, ensuring the parameters cannot be tampered with.
4.  **Popup Execution**: The backend returns the signed parameters to the frontend, which calls the `PaytriotCheckout.open()` library.
5.  **Secure Processing**: The customer enters card details within the secure Paytriot iframe overlay. Sensitive card details are handled directly by Paytriot, satisfying PCI-DSS compliance.
6.  **Redirection Breakout**: Once complete, Paytriot redirects the iframe to your specified `redirectURL`. This page breaks out of the iframe to update the main browser window.
7.  **Async Callback (Webhook)**: Paytriot sends a parallel HTTP POST callback to your `callbackURL` to securely update the order status in your database.

---

## 🛠️ Step-by-Step Integration Guide

### Step 1: Add Assets to Your Frontend Page
Include the Paytriot Popup styles and Javascript helper library at the top and bottom of your custom checkout HTML file:

```html
<!-- In your <head> -->
<link rel="stylesheet" href="paytriot-popup.css">

<!-- Near the end of your <body> -->
<script src="paytriot-popup.js"></script>
```

### Step 2: Implement Secure Signature Generation on the Backend
Never expose your private signature key in client-side Javascript. It must live in your backend environment.

#### Backend Rules for Signing:
1.  Add your transaction fields to a dictionary/array (e.g. `merchantID`, `amount`, `action: "SALE"`, etc.).
2.  Sort all keys alphabetically (ASCII order).
3.  Convert the keys to a URL-encoded string (equivalent to PHP's `http_build_query` using standard `+` encoding for spaces).
4.  Replace all carriage returns (`%0D%0A`, `%0A%0D`, `%0D`) with `%0A` to normalize line breaks.
5.  Append your private **Signature Key** to the end of the query string.
6.  Generate a **SHA-512** hash of the combined string.

> [!TIP]
> Use the pre-built utility code in `backend-helpers/generator.php` (PHP) or `backend-helpers/generator.js` (NodeJS) to handle sorting and line-ending normalizations automatically.

### Step 3: Trigger the Popup Modal in JavaScript
Intercept your form submission on the checkout page, query your backend signature endpoint, and call the SDK:

```javascript
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Ask your backend to build and sign transaction details
    const response = await fetch('/api/paytriot-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: 10.01,
            currency: 'GBP',
            orderRef: 'ORDER_12345'
        })
    });
    
    const data = await response.json(); // Must return the fields block and gatewayUrl
    
    if (data.success) {
        // 2. Open the modal
        PaytriotCheckout.open({
            fields: data.fields, // Contains amount, currency, signature, merchantID, etc.
            gatewayUrl: data.gatewayUrl, // https://gateway.paytriot.co.uk/hosted/modal/
            logoUrl: 'https://yoursite.com/assets/white-logo.png', // Optional custom header logo
            onClose: () => {
                console.log('Customer cancelled payment flow');
            }
        });
    }
});
```

### Step 4: Handle the Redirection Breakout
When payment is complete, Paytriot redirects the *iframe content* to your `redirectURL`. To prevent your success page from loading inside the small popup window, the page located at your `redirectURL` must execute a quick Javascript breakout:

```html
<!-- Page located at your redirectURL -->
<!DOCTYPE html>
<html>
<head>
    <script>
        // Redirect the main top-level browser window to your receipt/confirmation page
        window.top.location.href = "https://yoursite.com/checkout/success?orderRef=ORDER_12345";
    </script>
</head>
<body>
    <p>Redirecting you to order confirmation...</p>
</body>
</html>
```

### Step 5: Verify Callback Webhooks
To verify that payments were actually completed (and prevent spoofing), ensure your backend `callbackURL` verifies the incoming signature from Paytriot. 

Use the signature verification helper methods provided in this kit:
*   **PHP**: `PaytriotSignatureHelper::verify($_POST, $signatureKey);`
*   **NodeJS**: `PaytriotSignatureHelper.verify(postParams, signatureKey);`

---

## 📝 Required Request Fields

When preparing the parameter dictionary to sign and submit, you must include:

| Field Name | Mandatory | Description |
| :--- | :--- | :--- |
| `merchantID` | **Yes** | Your unique Paytriot Merchant ID. |
| `action` | **Yes** | Use `SALE` (capture immediately), `PREAUTH` (authorization only), or `VERIFY` (verify card status). |
| `amount` | **Yes** | The charge amount represented in minor currency units (e.g., `1001` for £10.01, `100` for £1.00). |
| `currencyCode` | **Yes** | 3-letter ISO-4217 currency code (e.g. `GBP`, `USD`, `EUR`). |
| `countryCode` | **Yes** | 3-digit ISO country code (e.g. `826` for UK, `840` for US). |
| `orderRef` | **Yes** | A reference ID representing the order in your system. |
| `transactionUnique` | **Yes** | A unique random hash/ID per request to prevent double-submissions. |
| `redirectURL` | **Yes** | Absolute URL where Paytriot redirects the customer after processing. |
| `callbackURL` | No | Absolute URL of your backend webhook endpoint to receive secondary order completion notifications. |
| `formResponsive` | No | Set to `Y` to ensure Paytriot's page uses responsive mobile layouts. |
| `signature` | **Yes** | The SHA-512 signature computed using your secret key. |

---


