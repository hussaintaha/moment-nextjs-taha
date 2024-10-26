import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import path from 'path';
// import { promises as fs } from 'fs';
import * as fs from 'fs';

interface ApiResponse {
    status: number;
    data: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // const certPath = process.env.APPLE_PAY_CERT_PATH;
            // const certPath = path.resolve('./public', 'file-c', 'ApplePay.crt.pem')
            // const keyPath = path.resolve('./public', 'file-c', 'ApplePay.key.pem')
            // console.log("certPath", certPath);
            // console.log("keyPath", keyPath);
            // if (!certPath || !keyPath) {
            //     return res.status(500).json({ error: 'Certificate path or Key path is not defined.' });
            // }

            const cert = process.env.APPLE_PAY_CERT
            const key = process.env.APPLE_PAY_KEY
            const passphrase = process.env.PASS_PHRASE

            // console.log("cert", cert);
            // console.log("key", key);
            // console.log("passphrase", passphrase);

            // const agent = new https.Agent({
            //     cert: cert,
            //     key: key,
            //     passphrase: passphrase
            // });

            // console.log("agent", agent.options.cert);

            const { validationURL } = req.body;

            console.log("validationURL", validationURL);

            if (!validationURL) {
                return res.status(400).json({ error: 'Validation URL is required.' });
            }

            const merchantIdentifier = 'merchant.metammerce';
            const requestData = JSON.stringify({
                merchantIdentifier,
                displayName: 'metammerce',
                initiative: 'web',
                initiativeContext: 'moment-nextjs-taha.vercel.app',
            });

            const response = await new Promise((resolve, reject) => {
                const request = https.request(validationURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cert: cert,
                    key: key,
                    passphrase: passphrase
                }, (response) => {
                    let data = '';
                    response.on('data', (chunk) => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        resolve({ status: response.statusCode, data });
                    });
                });

                request.on('error', reject);
                request.write(requestData);
                request.end();
            });

            const { status, data } = await response as ApiResponse;
            console.log("status, data", status, data);

            if (status !== 200) {
                throw new Error(`HTTP error! status: ${status}`);
            }

            const merchantSession = JSON.parse(data);

            console.log("merchantSession", merchantSession);

            return res.status(200).json({ data: merchantSession });
        } catch (error: any) {
            console.error("Error occurred on validate-merchant:", error);
            return res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
