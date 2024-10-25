import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import https from 'https'
// import { promises as fs } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log("process.env.APPLE_PAY_CERT_PATH", process.env.APPLE_PAY_CERT_PATH);

            const agent = new https.Agent({
                cert: fs.readFileSync(process.env.APPLE_PAY_CERT_PATH || ''),
            });
            const { validationURL } = req.body;
            console.log("validationURL", validationURL);

            const merchantIdentifier = 'merchant.metammerce';
            // const certificate = await fs.readFile(process.cwd() + '/ApplePay.crt.pem', 'utf8');

            const response = await fetch(validationURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Apple-Pay-Transaction-Id': merchantIdentifier,
                },
                body: JSON.stringify({
                    merchantIdentifier,
                    displayName: 'metammerce',
                    initiative: 'web',
                    initiativeContext: 'moment-nextjs-taha.vercel.app',
                }),
                agent
            });
            const merchantSession = await response.json();
            console.log("merchantSession-------------", merchantSession);

            if (!response.ok) {
                const errorDetails = await response.text(); // Get response body for more insights
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
            }


            res.status(200).json(merchantSession);
        } catch (error) {
            console.log("error occured on validate-merchant", error);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}






// // pages/api/merchant/validate.js

// import { NextApiRequest, NextApiResponse } from 'next';
// import https from 'https';
// import axios from 'axios';
// import { promises as fs } from 'fs';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         const { appleUrl } = req.body;

//         try {
//             const [certificate, key] = await Promise.all([
//                 fs.readFile(config.keyFilePath.cert), // Adjust path for the certificate
//                 fs.readFile(config.keyFilePath.key),   // Adjust path for the key
//             ]);

//             const httpsAgent = new https.Agent({
//                 rejectUnauthorized: false,
//                 cert: certificate,
//                 key: key,
//                 passphrase: config.passphrase,
//             });

//             const response = await axios.post(
//                 appleUrl,
//                 {
//                     merchantIdentifier: config.merchantIdentifier,
//                     domainName: config.yourDomain,
//                     displayName: config.merchantName,
//                 },
//                 { httpsAgent }
//             );


//             console.info(`Successfully validated the merchant: ${response.data}`);
//             res.status(200).json(response.data);
//         } catch (error: any) {
//             console.error(`Error validating merchant: ${error.message}`);
//             res.status(500).send('Error getting validation from Apple Pay');
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
