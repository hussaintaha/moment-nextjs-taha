import "@shopify/shopify-api/adapters/node";

import { shopifyApi, ApiVersion, LATEST_API_VERSION } from '@shopify/shopify-api';

import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";

import '@shopify/shopify-api/adapters/node';


const {
    API_SECRET,
    ADMIN_ACCESS_TOKEN,
    STOREFRONT_ACCESS_TOKEN,
    SHOP_DOMAIN, SCOPES
} = process.env;

if (!API_SECRET || !ADMIN_ACCESS_TOKEN || !SHOP_DOMAIN || !SCOPES) {
    throw new Error("missing required environment variables.");
}

export const Shopify = shopifyApi({
    apiSecretKey: API_SECRET,
    apiVersion: ApiVersion.October24,
    isCustomStoreApp: true,
    adminApiAccessToken: ADMIN_ACCESS_TOKEN,
    privateAppStorefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
    isEmbeddedApp: false,
    hostName: SHOP_DOMAIN,
    scopes: SCOPES.split(","),
    restResources,
});

// console.log("SCOPES", SCOPES.split(","));
// console.log("Shopify", Shopify);


export const session = Shopify.session.customAppSession(SHOP_DOMAIN);