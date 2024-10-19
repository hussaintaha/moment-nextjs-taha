'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Inter } from "next/font/google";

import "./globals.css";

import { cartContext } from "./../context/context"

import { Products } from "@/lib/bin/ProductsData";

import { CartItem } from "@/lib/interfaces";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [cartData, setCartData] = useState<CartItem[] | null>(null);
  const isFirstRender = useRef(true);


  // const [cartItems, setCartItems] = useState<CartItem[]>(() =>
  //   Products.map((product) => ({ ...product, quantity: 0 }))
  // );

  useEffect(() => {
    const storedData = localStorage.getItem('drinkmoment-cart');

    if (storedData) {
      // console.log("storedData", JSON.parse(storedData));
      setCartData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // console.log("cartData", cartData);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (cartData) {
      localStorage.setItem('drinkmoment-cart', JSON.stringify(cartData));
      const storedData = localStorage.getItem('drinkmoment-cart');
      if (storedData) {
        console.log("storedData 000000", JSON.parse(storedData));
      }
    }
  }, [cartData]);

  return (
    <cartContext.Provider value={{ cartItems: cartData, setCartItems: setCartData }}>
      <html lang="en">
        <head>
          <script crossOrigin="anonymous"
            src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"
          ></script>
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </cartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(cartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
};

