'use client';
import React, { useEffect, useState } from 'react';

import { LayoutGrid } from 'lucide-react';

import Image from 'next/image';

import Link from 'next/link';

import { ApplePayButton } from './ApplePayButton';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import ReviewsSection from '../app/Homepage/ReviewsSection';

import { useCartContext } from '@/context/useCartContext';

import { Product, DrawerProps } from '@/lib/interfaces';

const Drawer: React.FC<DrawerProps> = ({ product, allProducts, onClose, from, closeDrawer }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(
    allProducts.findIndex((p) => p.id === product.id)
  );
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition'>(
    'description'
  );
  const [selectedPurchaseOption, setSelectedPurchaseOption] = useState('subscribe');
  const context = useCartContext()
  const { cartItems, setCartItems } = context;
  const [selectedSubscription, setSelectedSubscription] = useState('')
  const [isNoFrequency, setNoFrequency] = useState(false)

  useEffect(() => {
    isNoFrequency && setNoFrequency(false)
    selectedPurchaseOption === "onetime" && setSelectedSubscription('')
  }, [selectedSubscription, selectedPurchaseOption, isNoFrequency])

  const handleAddToBag = () => {
    const randomID = window.crypto.randomUUID()
    if (selectedPurchaseOption === "subscribe" && !selectedSubscription) {
      setNoFrequency(true)
      return
    }
    console.log("product", product);
    let newCartArray = cartItems || [];
    if (newCartArray.length === 0) {
      console.log("not previtems");
      newCartArray.push({ ...product, quantity: product.quantity + 1, purchaseOption: selectedPurchaseOption, selectedSubscription });
    } else {
      let found = false;
      newCartArray = newCartArray.map((ite) => {
        console.log("id .............", product.id, "==========", ite.id);
        console.log("purchaseOption...............", ite.purchaseOption, "========", selectedPurchaseOption);
        console.log("selectedSubscription............", ite.selectedSubscription, "===========", selectedSubscription);
        if (ite.productID === product.productID && ite.purchaseOption === selectedPurchaseOption && ite.selectedSubscription === selectedSubscription) {
          console.log("not if previtems");
          found = true;
          return { ...ite, quantity: ite.quantity + 1 };
        }
        return ite;
      });

      if (!found) {
        console.log("not else if previtems");
        newCartArray.push({ ...product, id: randomID, quantity: 1, purchaseOption: selectedPurchaseOption, selectedSubscription });
      }
    }
    console.log("newCartArray", newCartArray);
    setCartItems(newCartArray);
    if (from === "cart") {
      closeDrawer()
    } else {
      window.location.href = `${location.href}/cart`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-screen flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between">
            <Link href="#">
              <button className="flex gap-2">
                <LayoutGrid size={20} color="black" />
                <span className="text-sm">Shop All Products</span>
              </button>
            </Link>
            <button onClick={onClose} aria-label="Close drawer">
              Close
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-4">
            <div className="mb-4">
              <Image
                src={allProducts[selectedImageIndex].image}
                alt={allProducts[selectedImageIndex].name}
                width={400}
                height={320}
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="flex mt-3 overflow-x-auto">
                {allProducts.map((p, index) => (
                  <Image
                    key={p.id}
                    src={p.image}
                    alt={p.name}
                    width={80}
                    height={80}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`cursor-pointer mr-2 rounded-md ${selectedImageIndex === index
                      ? 'border-2 border-black'
                      : ''
                      }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-10 justify-between">
              <h2 className="text-md font-bold mb-2">{product.name}</h2>
              <p className="text-md font-bold mb-4">${product.price}</p>
            </div>
            {product.originalPrice && (
              <p className="text-gray-500 line-through mb-2">
                ${product.originalPrice}
              </p>
            )}
            {product.discount && (
              <p className="bg-[#f4ff73] inline-block font-normal py-1 px-2 rounded-lg text-xs mb-2">
                {product.discount}
              </p>
            )}
            <div className="flex items-center mb-4">
              <span className="text-black text-sm">{product.reviews}</span>
            </div>
            <div className="mb-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#f4ff73] text-xs font-light px-3 py-2 rounded-lg mr-3"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div>
              <Card className="border-none">
                <CardContent className="py-2">
                  <div>
                    <p className="text-sm">Purchase options</p>
                    <RadioGroup
                      value={selectedPurchaseOption}
                      onValueChange={setSelectedPurchaseOption}
                      className="mt-2 space-y-1"
                    >
                      <div className="items-center border p-3 rounded-md hover:bg-[#fff8ee]">
                        <div className="flex space-x-2 ">
                          <div>
                            <RadioGroupItem value="subscribe" id="subscribe" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-semibold">
                                Subscribe + Save $6
                              </span>
                              <span>$48</span>
                            </div>
                          </div>
                        </div>
                        {selectedPurchaseOption === 'subscribe' && (
                          <div className="ml-6">
                            <p className="text-sm">Delivery schedule</p>
                            <Select onValueChange={setSelectedSubscription}>
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">
                                  Every 30 Days
                                </SelectItem>
                                <SelectItem value="60">
                                  Every 60 Days
                                </SelectItem>
                                <SelectItem value="90">
                                  Every 90 Days
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-[#fff8ee]">
                        <RadioGroupItem value="onetime" id="onetime" />
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <span className="font-semibold">
                              One-Time Purchase
                            </span>
                            <span>$0.01</span>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-4 text-sm">
              <div className="flex border-b">
                <button
                  className={`py-2 px-4 ${activeTab === 'description'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-400'
                    }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'nutrition'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-400'
                    }`}
                  onClick={() => setActiveTab('nutrition')}
                >
                  Nutrition Facts
                </button>
              </div>
              {activeTab === 'description' && (
                <div className="mt-4">
                  <p className="mb-2 text-base font-semibold">
                    {product.description}
                  </p>
                  <ul className="list-disc pl-5">
                    {product.bullets.map((bullet, index) => (
                      <li key={index} className="mb-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Image
                    src="/images/company-list.svg"
                    alt="company list"
                    width={400}
                    height={320}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              )}
              {activeTab === 'nutrition' && (
                <div className="mt-4">
                  <p>{product.nutritionFacts}</p>
                  <p>Calories: {product.calories}</p>
                  <p>Net Carbs: {product.netCarbs}g</p>
                  <p>Added Sugar: {product.addedSugar}g</p>
                </div>
              )}
            </div>
            <ReviewsSection productName={product.name} />
          </div>
        </div>
        <div className="p-4 border-t">
          {/* <Link href="/cart" > */}
          {isNoFrequency && <p className="text-base mx-auto text-center font-medium" style={{ color: "#ff4545" }}>Please select frequency!</p>}

          <div style={{
            display: "flex",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: "20px",
            gap: "10px"
          }}>
            <Button
              onClick={handleAddToBag}
              className="w-full bg-[#515151] text-lg hover:bg-[#414141] transition duration-200"
              style={{ padding: "10px 20px", borderRadius: "5px" }}
            >
              Add to Bag
            </Button>
            {selectedPurchaseOption === 'onetime' && <ApplePayButton />}
          </div>
          {/* <button className="w-full bg-[#515151] text-white py-2 px-4 rounded-lg" onClick={handleAddToBag}>
              Add to Bag
            </button> */}
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
