"use client"
import React, { useState, KeyboardEvent } from 'react';

import Image from 'next/image';

import Drawer from '@/components/Drawer';

import { Products } from '@/lib/bin/ProductsData';

import { Product } from '@/lib/interfaces';


const ProductGrid: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openDrawer = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeDrawer = () => {
    setSelectedProduct(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, product: Product) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openDrawer(product);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl pt-16 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {Products.map((product) => (
          <button
            key={product.id}
            className="flex flex-col justify-between bg-white rounded-lg shadow-md overflow-hidden cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => openDrawer(product)}
            onKeyDown={(e) => handleKeyDown(e, product)}
          >
            <Image src={product.image} alt={product.name} height={300} width={300} className="w-full h-auto" />
            <div className="p-4">
              <h3 className="font-bold md:text-md sm:text-base text-sm mb-2">{product.name}</h3>
              <div className="my-2">
                <span className="text-black text-sm">{product.reviews}</span>
              </div>
              <div className="flex text-sm gap-3 items-center">
                <span className="font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-[#f4ff73] font-normal py-1 px-2 rounded-lg text-xs">
                    {product.discount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <Drawer
          product={selectedProduct}
          allProducts={Products}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
};

export default ProductGrid;