declare global {
  // interface Window {
  //   ApplePaySession: any;
  // }

  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    supportedNetworks: string[];
    merchantCapabilities: string[];
    total: {
      label: string;
      amount: string;
    };
  }
  
  interface ApplePaySession {
    new (version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySession;
    canMakePayments(): boolean;
    onvalidatemerchant: (event: any) => void;
    onpaymentauthorized: (event: any) => void;
    oncancel: (event: any) => void;
    begin(): void;
    completeMerchantValidation(merchantSession: any): void;
    completePayment(result: any): void;
  }
  
  interface Window {
    ApplePaySession: typeof ApplePaySession;
  }
  
}