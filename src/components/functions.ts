export interface LineItem {
  label: string;
  amount: string;
}

export interface DateComponents {
  years: number;
  months: number;
  days: number;
  hours: number;
}

export interface DateRange {
  startDateComponents: DateComponents;
  endDateComponents: DateComponents;
}


export interface ShippingMethod {
  label: string;
  amount: string;
  detail: string;
  identifier: string;
  dateComponentsRange: DateRange
}

export interface CouponCalculationResult {
  total: string;
  lineItems: LineItem[];
  label: string;
  amount: string;
}


const productPrices: { [key: string]: number } = {
  item1: 10.00,
  item2: 20.00,
  item3: 30.00,
};

interface ApplePayError {
  code: string;
  message: string;
  contactField:string
}

export const calculateNewTotal = (couponCode: string, amount: string): CouponCalculationResult => {
  let discount = 0;


  if (couponCode === 'SAVE10') {
    discount = 10; // $10 off
  } else if (couponCode === 'SAVE20') {
    discount = 20; // $20 off
  } else if (couponCode === 'FREESHIP') {
    return {
      total: getCurrentTotal().toFixed(2),
      lineItems: [],
      label: "metammerce",
      amount
    };
  }

  const currentTotal = getCurrentTotal();
  const newTotal = Math.max(currentTotal - discount, 0);

  return {
    total: newTotal.toFixed(2),
    lineItems: [],
    label: "metammerce",
    amount
  };
};


export const calculateNewLineItems = (couponCode: string): LineItem[] => {
  const lineItems: LineItem[] = [];

  if (couponCode === 'SAVE10') {
    lineItems.push({ label: 'Discount', amount: '-10.00' });
  } else if (couponCode === 'SAVE20') {
    lineItems.push({ label: 'Discount', amount: '-20.00' });
  }

  return lineItems;
};

export const calculateNewShippingMethods = (couponCode: string): ShippingMethod[] => {
  const shippingMethods: ShippingMethod[] = [
    {
      label: 'Standard Shipping', amount: '5.00', detail: "need to add detail", identifier: "need to add identifier",
      dateComponentsRange: {
        startDateComponents: { years: 0, months: 0, days: 0, hours: 0 },
        endDateComponents: { years: 0, months: 0, days: 0, hours: 0 }
      }
    },
    {
      label: 'Express Shipping', amount: '15.00', detail: "need to add detail", identifier: "need to add identifier",
      dateComponentsRange: {
        startDateComponents: { years: 0, months: 0, days: 0, hours: 0 },
        endDateComponents: { years: 0, months: 0, days: 0, hours: 0 }
      }
    },
  ];

  if (couponCode === 'FREESHIP') {
    shippingMethods.push({
      label: 'Free Shipping', amount: '0.00', detail: "need to add detail", identifier: "need to add identifier",
      dateComponentsRange: {
        startDateComponents: { years: 0, months: 0, days: 0, hours: 0 },
        endDateComponents: { years: 0, months: 0, days: 0, hours: 0 }
      }
    });
  }

  return shippingMethods;
};

export const calculateErrors = (couponCode: string): ApplePayError[] => {
  const errors: ApplePayError[] = [];

  const validCoupons = ['SAVE10', 'SAVE20', 'FREESHIP'];
  if (couponCode && !validCoupons.includes(couponCode)) {
    errors.push({
      code: 'INVALID_COUPON',
      message: 'Invalid coupon code.',
      contactField:''
    });
  }

  return errors;
};

const getCurrentTotal = (): number => {
  return Object.values(productPrices).reduce((acc, price) => acc + price, 0);
};
