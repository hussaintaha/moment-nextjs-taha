import type { NextApiRequest, NextApiResponse } from 'next';

import { DataType } from '@shopify/shopify-api';

import { Shopify, session } from '@/utils/Shopify';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log("Received a POST request.");
    const data = req.body;
    console.log("data on checkout controller apple pay...............", data);

    const client = new Shopify.clients.Rest({ session });
    const orderCreateData = await client.post({
      path: 'orders',
      data: {
        order: {
          name: `external_site_order`,
          line_items: [{
            // variant_id: "45279871271075",     // "still & sparkling variety (18 pack)" product variantID
            variant_id: data.variantID,
            quantity: 1,
          }],
          customer: {
            first_name: data.billingContact.givenName,
            last_name: data.billingContact.familyName,
          },
          shipping_address: {
            first_name: data.shippingContact.givenName,
            last_name: data.shippingContact.familyName,
            address1: data.shippingContact.addressLines,
            // address2: "456 Fake Street",
            phone: data.shippingContact.phoneNumber,
            city: data.shippingContact.locality,
            province: data.shippingContact.locality,
            country: data.shippingContact.country,
            zip: data.shippingContact.countryCode,
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
