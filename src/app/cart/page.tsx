'use client';

import React, { useState, useEffect } from 'react';

import { Minus, Plus, Trash2, LayoutGrid, Truck } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/interfaces';
import { Products } from '../../lib/bin/ProductsData';
import { useCartContext } from '@/context/useCartContext';
import './cart.css'


const ShoppingCart: React.FC = () => {
  // const [cartItems, setCartItems] = useState<CartItem[]>(() =>
  //   Products.map((product) => ({ ...product, quantity: 0 }))
  // );
  const context = useCartContext()
  const { cartItems, setCartItems } = context;

  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const newTotal = cartItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (!newTotal) return
    setTotal(newTotal);
  }, [cartItems]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prevItems) => {
      if (!prevItems) {
        return []
      }
      return prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    });
  };

  const openDrawer = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeDrawer = () => {
    setSelectedProduct(null);
  };

  const removeItem = (id: string) => {
    const storedData = localStorage.getItem('drinkmoment-cart');
    if (storedData?.length) {
      const parsedData = JSON.parse(storedData)
      // console.log("parsedData..................", parsedData);
      const filteredDataToSet = parsedData.filter((ite: Product) => ite.id !== id)
      if (filteredDataToSet.length) {
        console.log("hit if");
        setCartItems(filteredDataToSet);
      } else {
        console.log("hit else");
        setCartItems(null);
        localStorage.removeItem('drinkmoment-cart');
      }
    }
  };

  const hasOneOrMoreItems = cartItems?.some((item) => item.quantity > 0);

  const addToBag = (product: Product) => {
    openDrawer(product)
    // setCartItems((prevItems) => {
    //   if (!prevItems) {
    //     return []
    //   }
    //   return prevItems.map((item) =>
    //     item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    //   )
    // });
  };



  const handleCheckout = async () => {
    try {
      setLoading(true)
      const checkOutItems = cartItems?.filter(i => i.quantity !== 0)
      console.log("checkOutItems on handleCheckout...... ", checkOutItems);

      const response = await fetch("/api/checkoutController", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(checkOutItems)
      })

      if (response.ok) {
        const { checkoutURL, message } = await response.json()
        console.log("handleCheckout response data.................", checkoutURL, "    ", message)
        window.location.href = checkoutURL
      }

    } catch (error) {
      console.log("error on handleCheckout", error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8">
      <div className="border-b mb-4">
        <div className="flex justify-between xl:mx-48 md:mx-36 sm:mx-16 mx-6">
          <Link href="#">
            <button className="flex gap-2">
              <LayoutGrid size={20} color="black" />
              <span className="text-sm">Shop All Products</span>
            </button>
          </Link>
          <Link href="/">
            <button aria-label="Close drawer">Close</button>
          </Link>
        </div>
      </div>

      <div className="mx-4 sm:mx-8 md:mx-12 xl:mx-16">
        {hasOneOrMoreItems ? (
          <div className="flex gap-3 bg-yellow py-2 px-4 mb-4 rounded-md">
            <span>
              <Truck size={20} color="black" />
            </span>
            <span>You&apos;ve got free shipping!</span>
          </div>
        ) : (
          <div className="bg-yellow py-2 px-4 mb-4 rounded-md">
            Please select one item and get free shipping
          </div>
        )}

        <div className="space-y-4 mb-8">
          {cartItems
            ?.filter((item) => item.quantity > 0)
            ?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-gray-600">${item.price}</p>
                    {item.originalPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        ${item.originalPrice}
                      </p>
                    )}
                    {item.discount && (
                      <span className="bg-yellow-200 text-xs  rounded">
                        {item.discount}
                      </span>
                    )}
                    {item.purchaseOption === "subscribe" && <p className="text-neutral-600 text-xs mt-1">
                      {`Delivery Every ${item.selectedSubscription} Days`}
                    </p>}
                  </div>

                </div>
                <div className="flex items-center space-x-2">
                  {item.quantity === 1 ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>

        <div className="mb-8">
          <h2 className="text-md font-medium mb-4">
            We think you&apos;ll love these too...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Products.map((product) => (
              <div
                key={product.id}
                className="flex border gap-3 rounded-lg p-2 bg-[#fff8ee]"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={120}
                  className="self-center w-32 h-32"
                />
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                  <p className="text-gray-600 mb-2">${product.price}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {product.reviews}
                  </p>
                  <button
                    onClick={() => addToBag(product)}
                    className="w-full bg-[#3e3e3e] text-white text-xs py-1 px-4 rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 w-full">
          <div className="flex justify-between">
            <div>
              <p className="text-md font-bold">Total:</p>
              <p className="text-sm text-gray-600">
                Shipping calculated at checkout
              </p>
            </div>
            <div>
              <p className="text-md font-bold">${total?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full">
          {/* <Link href="/checkout" passHref> */}
          <button disabled={isLoading} onClick={handleCheckout} className="bg-[#3e3e3e] w-full rounded-lg py-2 text-white hover:bg-gray-800" style={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading ? <div className="loader"></div> : "Checkout"}
          </button>
          {/* </Link> */}
          <div className='flex justify-center mt-3 items-center'>
            <Image
              src="/images/credit-cards.svg"
              alt="American Express"
              width={50}
              height={30}
              className="h-6 w-auto"
            />
          </div>

        </div>
      </div>
      {selectedProduct && (
        <Drawer
          product={selectedProduct}
          allProducts={Products}
          onClose={closeDrawer}
          from={"cart"}
          closeDrawer={closeDrawer}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
