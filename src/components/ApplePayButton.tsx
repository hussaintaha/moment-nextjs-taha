'use client'
import { buttonVariants } from "@/components/ui/button";
import { PaymentRequest } from "@/lib/interfaces";

import { cn, hasApplePay } from "@/lib/utils";

const Icons = {
  apple: (props: any) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        fill="currentColor"
      />
    </svg>
  ),
}




// async function onApplePayButtonClicked1() {
//     if (!ApplePaySession) {
//         return;
//     }

//     // Define ApplePayPaymentRequest
//     const request = {
//         "countryCode": "US",
//         "currencyCode": "USD",
//         "merchantCapabilities": [
//             "supports3DS"
//         ],
//         "supportedNetworks": [
//             "visa",
//             "masterCard",
//             "amex",
//             "discover"
//         ],
//         "total": {
//             "label": "Demo (Card is not charged)",
//             "type": "final",
//             "amount": "1.99"
//         }
//     };

//     // Create ApplePaySession
//     const session = new ApplePaySession(3, request);

//     session.onvalidatemerchant = async event => {
//         // Call your own server to request a new merchant session.
//         const merchantSession = await validateMerchant();
//         session.completeMerchantValidation(merchantSession);
//     };

//     session.onpaymentmethodselected = event => {
//         // Define ApplePayPaymentMethodUpdate based on the selected payment method.
//         // No updates or errors are needed, pass an empty object.
//         const update = {};
//         session.completePaymentMethodSelection(update);
//     };

//     session.onshippingmethodselected = event => {
//         // Define ApplePayShippingMethodUpdate based on the selected shipping method.
//         // No updates or errors are needed, pass an empty object. 
//         const update = {};
//         session.completeShippingMethodSelection(update);
//     };

//     session.onshippingcontactselected = event => {
//         // Define ApplePayShippingContactUpdate based on the selected shipping contact.
//         const update = {};
//         session.completeShippingContactSelection(update);
//     };

//     session.onpaymentauthorized = event => {
//         // Define ApplePayPaymentAuthorizationResult
//         const result = {
//             "status": ApplePaySession.STATUS_SUCCESS
//         };
//         session.completePayment(result);
//     };

//     session.oncouponcodechanged = event => {
//         // Define ApplePayCouponCodeUpdate
//         const newTotal = calculateNewTotal(event.couponCode);
//         const newLineItems = calculateNewLineItems(event.couponCode);
//         const newShippingMethods = calculateNewShippingMethods(event.couponCode);
//         const errors = calculateErrors(event.couponCode);

//         session.completeCouponCodeChange({
//             newTotal: newTotal,
//             newLineItems: newLineItems,
//             newShippingMethods: newShippingMethods,
//             errors: errors,
//         });
//     };

//     session.oncancel = event => {
//         // Payment canceled by WebKit
//     };

//     session.begin();
// }

const onApplePayButtonClicked = async (id: string, price: any) => {
  const slicedVariantID = id.slice(29)
  console.log("id of variant on apple pay click1234", slicedVariantID);

  try {
    if (!ApplePaySession) {
      return;
    }
    // if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
    console.log("trigger onApplePayButtonClicked function");
    const paymentRequest: PaymentRequest = {
      countryCode: 'US',
      currencyCode: 'USD',
      total: {
        label: 'metammerce',
        amount: '1', // Total amount to charge
      },
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      merchantCapabilities: ['supports3DS'],
    };

    const session = new ApplePaySession(1, paymentRequest);
    console.log("session==================>", session);

    session.onvalidatemerchant = async (event: any) => {

      console.log("onvalidatemerchant event------------>", event);

      const merchantSession = await fetch('/api/validate-merchant', {
        method: 'POST',
        body: JSON.stringify({ validationURL: event.validationURL }),  // from here https://developer.apple.com/documentation/apple_pay_on_the_web/applepayvalidatemerchantevent/1778026-validationurl
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!merchantSession.ok) {
        console.error("Error from API:", merchantSession.status, await merchantSession.text());
        return;
      }

      const sessionData = await merchantSession.json();
      console.log("sessionData ==============", sessionData.data);
      session.completeMerchantValidation(sessionData.data);
    };

    session.onpaymentauthorized = async (event: any) => {
      console.log("onpaymentauthorized event------------>", event);
      const paymentData = event.payment;

      const paymentDetails = {
        amount: parseFloat(paymentData.transaction.amount),
        currency: paymentData.transaction.currency || 'USD',
        token: paymentData.token,
      };

      const response = await fetch('/api/process-payment', {
        method: 'POST',
        body: JSON.stringify(paymentDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const paymentResponse = await response.json();
      console.log("paymentResponse ============", paymentResponse);

      session.completePayment(paymentResponse.status);
      console.log("oncomplete  payment");

      if (paymentResponse.status === "success") {

        const response = await fetch("/api/apple-pay-checkoutController", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            variantID: slicedVariantID
          })
        })

        if (response.ok) {
          console.log("handle apple-pay-checkoutController response data.................", response.json())
        }

      }
    };

    // session.oncancel = (event: any) => {
    //   console.log("oncancel event------------>", event);
    //   // Payment canceled by WebKit
    // };

    session.begin();
    // } else {
    //   console.error('Apple Pay is not available.');
    // }
  } catch (error) {
    console.log("error occured on onApplePayButtonClicked ", error);

  }
};



export const ApplePayButton = ({ id, price }: any) =>
// hasApplePay() && 
(
  <button
    onClick={() => onApplePayButtonClicked(id, price)}
    className={cn(
      buttonVariants({ variant: "default", size: "md" }),
      "w-full gap-1 text-xl",
    )}
  >
    <Icons.apple className="ml-2 h-5 w-5" />
    <p>Pay</p>
  </button>
  // <apple-pay-button buttonstyle="black" onClick={onApplePayButtonClicked} type="plain" locale="en-US"></apple-pay-button>
);