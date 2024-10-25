import { NextApiRequest, NextApiResponse } from 'next';

import { promises as fs } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {

            // my code last time
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
