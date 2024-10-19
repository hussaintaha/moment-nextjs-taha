import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';

console.log("process.env.STRIPE_SECRET_KEY--------", process.env.STRIPE_SECRET_KEY, {
    typescript: true,
    apiVersion: '2024-09-02'
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

console.log("stripe   ", stripe);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const paymentData = req.body;

        console.log("paymentData=========>", paymentData);

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(paymentData.amount * 100),
                currency: paymentData.currency || 'usd',
                payment_method_data: {
                    type: 'card',
                    card: {
                        token: paymentData.token,
                    },
                },
                confirmation_method: 'manual',
                confirm: true,
            });

            console.log("paymentIntent-------------->", paymentIntent);


            res.status(200).json({ status: 'success', paymentIntent });
        } catch (error) {
            console.error('Payment error:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
