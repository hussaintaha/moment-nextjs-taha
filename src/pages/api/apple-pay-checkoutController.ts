import type { NextApiRequest, NextApiResponse } from 'next';

import { DataType } from '@shopify/shopify-api';

import { Shopify, session } from '@/utils/Shopify';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log("Received a POST request.");

    const client = new Shopify.clients.Rest({ session });
    const orderCreateData = await client.post({
      path: 'orders',
      data: {
        order: {
          name: `external_site_order`,
          line_items: [{
            variant_id: "45279871271075",     // "still & sparkling variety (18 pack)" product variant id 
            quantity: 1,
          }],
          customer: {
            first_name: "John",
            last_name: "Wick",
          },
          shipping_address: {
            first_name: "John",
            last_name: "Wick",
            address1: "123 Fake Street",
            address2: "456 Fake Street",
            phone: "99999999",
            city: "Fakecity",
            province: "Fakeprovince",
            country: "Fakecountry",
            zip: "K2P 1L4",
          }
        }
      },
      type: DataType.JSON,
    });

    console.log("orderCreateData", orderCreateData);

    return res.status(200).json({ message: "An order created successfully!" })

  } else {
    console.log("Received a non-POST request.");
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
