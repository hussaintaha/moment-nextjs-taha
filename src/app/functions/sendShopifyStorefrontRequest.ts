interface ShopifyStorefrontRequest {
  query: string;
  variables?: Record<string, any>;
}

export async function sendShopifyStorefrontRequest({
  query,
  variables,
}: ShopifyStorefrontRequest): Promise<any | false> {

  // console.log("query", query);
  // console.log("variables", variables);
  // console.log("JSON.stringify({ query, variables })", { query, variables: variables  });

  try {

    // console.log("process.env.STOREFRONT_ACCESS_TOKEN", process.env.STOREFRONT_ACCESS_TOKEN);

    const response = await fetch(
      `https://${process.env.SHOP_DOMAIN}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({ query, variables: variables }),
      }
    );


    if (!response.ok) {
      console.error('Error:', response);
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return false;
  }
}
