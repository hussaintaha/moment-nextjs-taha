import { useContext } from "react";
import { cartContext } from "./context";


export const useCartContext = () => {
    const context = useContext(cartContext);

    if (!context) {
        throw new Error("useCartContext must be used within a CartProvider");
    }

    return context;
};