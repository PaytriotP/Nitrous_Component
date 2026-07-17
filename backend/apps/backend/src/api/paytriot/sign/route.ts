import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PaytriotSignatureHelper } from "../../../utils/paytriot";

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res.sendStatus(200);
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const inputData = req.body as any;
    
    // Environment variables or test defaults
    const merchantID = process.env.PAYTRIOT_MERCHANT_ID || '105631'; // Using 3DS testing ID
    const signatureKey = process.env.PAYTRIOT_SECRET_KEY || 'Media49Stone36Carrot'; // Test secret

    const amount = parseFloat(inputData.amount) || 0;
    const currency = inputData.currency || 'GBP';
    const orderRef = inputData.orderRef || `ORDER_${Date.now()}`;

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Must be greater than 0' });
    }

    // Convert decimal to minor currency units (e.g. £10.01 -> 1001)
    const amountInMinor = Math.round(amount * 100);

    const fields: any = {
      merchantID: merchantID,
      action: 'SALE',
      type: 1, // E-commerce
      amount: amountInMinor,
      currencyCode: currency === 'GBP' ? '826' : currency,
      countryCode: '826', // UK
      orderRef: orderRef,
      transactionUnique: `TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      redirectURL: inputData.redirectURL,
      formResponsive: 'Y',
      threeDSCheckPref: 'authenticated,attempted authentication',
      threeDSRequired: 'Y'
    };

    // Inject customer info if provided
    if (inputData.customerName) fields.customerName = inputData.customerName;
    if (inputData.customerEmail) fields.customerEmail = inputData.customerEmail;
    if (inputData.customerAddress) fields.customerAddress = inputData.customerAddress;
    if (inputData.customerCity) fields.customerTown = inputData.customerCity;
    if (inputData.customerPostCode) fields.customerPostcode = inputData.customerPostCode;
    if (inputData.customerCountryCode) fields.customerCountryCode = inputData.customerCountryCode;
    if (inputData.customerPhone) fields.customerPhone = inputData.customerPhone;

    // Generate signature
    fields.signature = PaytriotSignatureHelper.sign(fields, signatureKey);

    return res.json({
      success: true,
      fields: fields,
      gatewayUrl: process.env.PAYTRIOT_GATEWAY_URL || 'https://gateway.paytriot.co.uk/Hosted/Modal/'
    });

  } catch (err: any) {
    console.error('Error generating Paytriot signature:', err);
    return res.status(500).json({ error: 'Internal server error while signing payload' });
  }
}
