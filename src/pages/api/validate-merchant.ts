import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import path from 'path';
import { promises as fs } from 'fs';

interface ApiResponse {
    status: number;
    data: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // const certPath = process.env.APPLE_PAY_CERT_PATH;


            const certPath = path.resolve('./public', 'file-c', 'apple_pay.pem')
            console.log("certPath", certPath);

            if (!certPath) {
                return res.status(500).json({ error: 'Certificate path is not defined.' });
            }
            const cert = await fs.readFile(certPath, 'utf8');
            console.log("cert", cert);

            const agent = new https.Agent({
                cert: certPath,
            });

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
// BEGIN CERTIFICATE
// END CERTIFICATE
            const response = await new Promise((resolve, reject) => {
                const request = https.request(validationURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    agent
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

            const { status, data } = response as ApiResponse;

            if (status !== 200) {
                throw new Error(`HTTP error! status: ${status}`);
            }

            const merchantSession = JSON.parse(data);
            res.status(200).json(merchantSession);
        } catch (error: any) {
            console.error("Error occurred on validate-merchant:", error);
            res.status(500).json({ error: error.message });
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
