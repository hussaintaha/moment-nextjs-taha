'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ApplePayButton } from '@/components/ApplePayButton';
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
import { Products } from '@/lib/bin/ProductsData';

import { useCartContext } from '@/context/useCartContext';

const PurchaseSection = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPurchaseOption, setSelectedPurchaseOption] = useState('subscribe');
  const [selectedSubscription, setSelectedSubscription] = useState('')
  const [isNoFrequency, setNoFrequency] = useState(false)
  const images = [
    '/images/carrousel_img_1.svg',
    '/images/carrousel_img_2.svg',
    '/images/carrousel_img_3.svg',
    '/images/carrousel_img_4.svg',
  ];
  const context = useCartContext()
  const { cartItems, setCartItems } = context;
  const router = useRouter()

  const handleAddToBag = () => {
    if (selectedPurchaseOption === "subscribe" && !selectedSubscription) {
      setNoFrequency(true)
      return
    }
    const product = Products.find(el => el.id === "f35bd066-9377-4d33-b3e9-b6ff4dcd1ba0")
    if (!product) return console.warn("product not found on PurchaseDection");
    const randomID = window.crypto.randomUUID()

    let newCartArray = cartItems || [];

    if (newCartArray.length === 0) {
      // console.log("not previtems");
      newCartArray.push({ ...product, quantity: product.quantity + 1, purchaseOption: selectedPurchaseOption, selectedSubscription });
    } else {
      let found = false;

      newCartArray = newCartArray.map((ite) => {
        // console.log("id .............", product.id, "==========", ite.id);
        // console.log("purchaseOption...............", ite.purchaseOption, "========", selectedPurchaseOption);
        // console.log("selectedSubscription............", ite.selectedSubscription, "===========", selectedSubscription);

        if (ite.productID === product.productID && ite.purchaseOption === selectedPurchaseOption && ite.selectedSubscription === selectedSubscription) {
          // console.log("not if previtems");
          found = true;
          return { ...ite, quantity: ite.quantity + 1 };
        }
        return ite;
      });

      if (!found) {
        // console.log("not else if previtems");
        newCartArray.push({ ...product, id: randomID, quantity: 1, purchaseOption: selectedPurchaseOption, selectedSubscription });
      }
    }

    setCartItems(newCartArray);
    // setCartItems((prevItems) => {
    //   if (!prevItems) return null
    //   return prevItems?.map((ite) =>
    //     ite.id === ID ? { ...ite, quantity: ite.quantity + 1, purchaseOption: selectedPurchaseOption, selectedSubscription } : ite
    //   )
    // })
    router.push('/cart')
  }

  useEffect(() => {
    isNoFrequency && setNoFrequency(false)
    selectedPurchaseOption === "onetime" && setSelectedSubscription('')
  }, [selectedSubscription, selectedPurchaseOption, isNoFrequency])

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      {/* Left side - Image carousel */}
      <div className="col-span-1">
        <Image
          src={images[selectedImageIndex]}
          alt="Selected product image"
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
        />
        <div className="flex mt-3">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              onClick={() => setSelectedImageIndex(index)}
              className={`cursor-pointer mr-2 rounded-md ${selectedImageIndex === index ? 'border-2 border-black' : ''
                }`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Purchase options */}
      <div className="col-span-1">
        <Card>
          <CardContent className="pt-6 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                still & sparkling variety (18 pack)
              </h2>
              <p className="text-lg">
                $49 <span className="line-through text-gray-500">$54</span>
                <span className="bg-[#f4ff73] rounded-lg px-2 py-1 ml-2 text-sm">
                  9% OFF
                </span>
              </p>
              <p className="text-lg">★ ★ ★ ★ ★ (1,884 Reviews)</p>
            </div>

            <div className="mt-6">
              <p className='text-sm'>Purchase options</p>
              <RadioGroup
                value={selectedPurchaseOption}
                onValueChange={setSelectedPurchaseOption}
                className="mt-2 space-y-3"
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
                          <SelectItem value="30">Every 30 Days</SelectItem>
                          <SelectItem value="60">Every 60 Days</SelectItem>
                          <SelectItem value="90">Every 90 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-[#fff8ee]">
                  <RadioGroupItem value="onetime" id="onetime" />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span className="font-semibold">One-Time Purchase</span>
                      <span>$54</span>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          {isNoFrequency && <p className="text-base mx-auto text-center font-medium" style={{ color: "#ff4545" }}>Please select frequency!</p>}
          {/* <CardFooter> */}
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

          {/* </CardFooter> */}
        </Card>
      </div>
    </div>
  );
};

export default PurchaseSection;
