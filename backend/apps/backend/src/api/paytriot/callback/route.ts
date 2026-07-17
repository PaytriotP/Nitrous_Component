import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PaytriotSignatureHelper } from "../../../utils/paytriot";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // The webhook from Paytriot is sent as form-urlencoded
    const params = req.body as any;

    const signatureKey = process.env.PAYTRIOT_SECRET_KEY || 'Media49Stone36Carrot';

    // Verify signature
    try {
      PaytriotSignatureHelper.verify(params, signatureKey);
    } catch (verifyError: any) {
      console.error('Paytriot Callback Verification Error:', verifyError.message);
      return res.status(400).send('Verification failed');
    }

    const responseCode = parseInt(params.responseCode);
    const orderRef = params.orderRef;
    const xref = params.xref;

    if (responseCode === 0) {
      console.log(`[Paytriot Webhook] Payment succeeded! Order: ${orderRef}, Transaction: ${xref}`);
      // Here you would typically locate the order and update its payment status
    } else {
      console.log(`[Paytriot Webhook] Payment failed! Order: ${orderRef}, Message: ${params.responseMessage}`);
    }

    // Acknowledge receipt of the webhook
    return res.status(200).send('OK');

  } catch (err: any) {
    console.error('Error handling Paytriot callback:', err);
    return res.status(500).send('Internal Server Error');
  }
}
