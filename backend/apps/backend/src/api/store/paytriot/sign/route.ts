import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import crypto from 'crypto';

class PaytriotSignatureHelper {
    static _flattenParams(key: string, val: any): any[] {
        let result: any[] = [];
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

    static _rfc1738Encode(str: string) {
        return encodeURIComponent(str)
            .replace(/%20/g, '+')
            .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
            .replace(/~/g, '%7E');
    }

    static sign(data: any, secret: string) {
        const signedData = { ...data };
        delete signedData.signature;

        const sortedKeys = Object.keys(signedData).sort();
        const params: any[] = [];
        for (const key of sortedKeys) {
            const val = signedData[key];
            const flattened = this._flattenParams(key, val);
            for (const [k, v] of flattened) {
                params.push([k, v]);
            }
        }

        const queryParts = params.map(([k, v]) => {
            return `${this._rfc1738Encode(k)}=${this._rfc1738Encode(v)}`;
        });
        
        let queryString = queryParts.join('&');
        queryString = queryString.replace(/%0D%0A|%0A%0D|%0D/ig, '%0A');

        return crypto
            .createHash('sha512')
            .update(queryString + secret)
            .digest('hex');
    }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const inputData = req.body as any;
  const merchantID = process.env.PAYTRIOT_MERCHANT_ID || '105630';
  const signatureKey = process.env.PAYTRIOT_SECRET_KEY || 'DontTellAnyone';

  const amount = parseFloat(inputData.amount) || 0;
  const currency = inputData.currency || '826'; // UK GBP
  const orderRef = inputData.orderRef || `ORDER_${Date.now()}`;

  if (amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. Must be greater than 0' });
  }

  const amountInMinor = Math.round(amount * 100);

  const fields: any = {
    merchantID: merchantID,
    action: 'SALE',
    amount: amountInMinor,
    currencyCode: currency,
    countryCode: '826',
    orderRef: orderRef,
    transactionUnique: `TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    redirectURL: inputData.redirectURL || 'http://localhost:5173/checkout/success',
    callbackURL: 'http://localhost:9000/store/paytriot/webhook',
    formResponsive: 'Y'
  };

  if (inputData.customerName) fields.customerName = inputData.customerName;
  if (inputData.customerEmail) fields.customerEmail = inputData.customerEmail;
  if (inputData.customerAddress) fields.customerAddress = inputData.customerAddress;
  if (inputData.customerCity) fields.customerTown = inputData.customerCity;
  if (inputData.customerPostCode) fields.customerPostcode = inputData.customerPostCode;

  fields.signature = PaytriotSignatureHelper.sign(fields, signatureKey);

  res.status(200).json({
    success: true,
    fields: fields,
    gatewayUrl: 'https://gateway.paytriot.co.uk/hosted/modal/?'
  });
};
