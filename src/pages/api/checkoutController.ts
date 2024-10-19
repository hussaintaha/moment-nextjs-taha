import type { NextApiRequest, NextApiResponse } from 'next';

import { DataType } from '@shopify/shopify-api';
import { Shopify, session } from '@/utils/Shopify';
import { sendShopifyStorefrontRequest } from '@/app/functions/sendShopifyStorefrontRequest';
import { Product } from '@/lib/interfaces';

interface sellingPlans {
  node: {
    id: string;
    name: string;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log("Received a POST request.", req.body);

    const filteredDataArray = await Promise.all(req.body.map(async (d: Product) => {
      let sellingPlanId
      //  = "gid://shopify/SellingPlan/2137325731";
      if (d.purchaseOption === "subscribe") {
        console.log("d.productID", d.productID);

        const sellingPlanData = await sendShopifyStorefrontRequest({
          query: ` 
            query MyQuery {
              product(id: "${d.productID}") {
                sellingPlanGroups(first: 250) {
                  edges {
                    node {
                      sellingPlans(first: 250) {
                        edges {
                          node {
                            id
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {},
        });

        console.log("sellingPlanData", sellingPlanData);
        const sellingPlansEdges = sellingPlanData?.data?.product?.sellingPlanGroups?.edges?.[0]?.node?.sellingPlans?.edges;
        console.log("sellingPlanData?.data?.product?.sellingPlanGroups?.edges?.[0]", sellingPlanData?.data?.product?.sellingPlanGroups?.edges[0].node.sellingPlans);

        if (sellingPlansEdges) {
          const sellingPlanFilteredID = sellingPlansEdges.map((element: sellingPlans) => {
            console.log("element.node.name", element.node.name, "    d.selectedSubscription", d.selectedSubscription);
            console.log("element.node.name.includes(d.selectedSubscription)", element.node.name.includes(d.selectedSubscription));
            if (element.node.name.includes(d.selectedSubscription)) {
              return element.node.id
            } else {
              return null
            }
          }
          ).filter((e: string | null) => e !== null)[0];

          sellingPlanId = sellingPlanFilteredID;
        }
      }

      return {
        quantity: Number(d.quantity),
        merchandiseId: d.variantID,
        ...(d.purchaseOption === "subscribe" ? { sellingPlanId } : {})
      };
    }));

    console.log("filteredDataArray", filteredDataArray);

    const cartCreatedata = await sendShopifyStorefrontRequest({
      query: ` 
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
            warnings {
              target
            }
          }
        }`
      ,
      variables: {
        input: {
          lines: filteredDataArray
        }
      },
    });

    console.log("cartCreatedata", cartCreatedata);


    if (!cartCreatedata.data.cartCreate.cart.checkoutUrl) {
      return res.status(500).end('There was a problem creating a cart.');
    }

    console.log("cartCreatedata.data.cartCreate.cart.checkoutUrl", cartCreatedata.data.cartCreate.cart.checkoutUrl);

    // const checkoutURLData = await sendShopifyStorefrontRequest({
    //   query: `
    //     query checkoutURL {
    //         cart(id: ${JSON.stringify(cartCreatedata.data.cartCreate.cart.id)}) {
    //           checkoutUrl
    //         }
    //     }`,
    //   variables: {},
    // });

    // console.log("checkoutURLData", checkoutURLData);

    // if (!checkoutURLData) {
    //   return res.status(500).end('There was a problem while getting a checkout url.');
    // }

    return res.status(200).json({ checkoutURL: cartCreatedata.data.cartCreate.cart.checkoutUrl, message: "URL retrieved successfully!" })



    // const client = new Shopify.clients.Rest({ session });
    // const orderCreateData = await client.post({
    //   path: 'orders',
    //   data: {
    //     order: {
    //       name: `external_site_order`,
    //       line_items: [{
    //         variant_id: "45279871271075",     // "still & sparkling variety (18 pack)" product variant id 
    //         quantity: 1,
    //       }],
    //       customer: {
    //         first_name: "John",
    //         last_name: "Wick",
    //       },
    //       shipping_address: {
    //         first_name: "John",
    //         last_name: "Wick",
    //         address1: "123 Fake Street",
    //         address2: "456 Fake Street",
    //         phone: "99999999",
    //         city: "Fakecity",
    //         province: "Fakeprovince",
    //         country: "Fakecountry",
    //         zip: "K2P 1L4",
    //       }
    //     }
    //   },
    //   type: DataType.JSON,
    // });

    // console.log("orderCreateData", orderCreateData);


  } else {
    console.log("Received a non-POST request.");
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
