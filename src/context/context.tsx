'use client';
import { createContext } from "react";

import { CartItem, CartContextType } from "@/lib/interfaces";


export const cartContext = createContext<CartContextType | null>(null);