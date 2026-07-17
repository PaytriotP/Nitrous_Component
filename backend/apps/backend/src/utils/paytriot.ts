import crypto from 'crypto';

export class PaytriotSignatureHelper {
    /**
     * Recursively flattens nested objects/arrays to match PHP's query parameter formatting.
     */
    private static _flattenParams(key: string, val: any): [string, string][] {
        let result: [string, string][] = [];
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
     */
    private static _rfc1738Encode(str: string): string {
        return encodeURIComponent(str)
            .replace(/%20/g, '+')
            .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
            .replace(/~/g, '%7E');
    }

    /**
     * Signs transaction data using a merchant secret key.
     * Generates a secure SHA-512 signature matching the Paytriot SDK.
     * 
     * @param data Flat or nested object of parameters to send to the gateway.
     * @param secret The merchant signature key.
     * @returns SHA-512 signature hex string.
     */
    public static sign(data: Record<string, any>, secret: string): string {
        const signedData = { ...data };
        delete signedData.signature;

        // Sort top-level keys in alphabetical ascending order
        const sortedKeys = Object.keys(signedData).sort();

        const params: [string, string][] = [];
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
     * @param response Key-value pairs of response parameters (from request body).
     * @param secret The merchant signature key.
     * @returns True if signature matches, throws error otherwise.
     */
    public static verify(response: Record<string, any>, secret: string): boolean {
        if (!response || response.responseCode === undefined) {
            throw new Error('Missing responseCode from payment gateway.');
        }

        let signatureField = response.signature;
        if (!signatureField) {
            throw new Error('Missing signature from payment gateway.');
        }

        const dataToVerify = { ...response };
        delete dataToVerify.signature;

        let fields: string | null = null;
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
