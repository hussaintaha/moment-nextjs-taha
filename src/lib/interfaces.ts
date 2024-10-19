export interface CartItem {
    id: string;
    productID: string;
    variantID: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    purchaseOption: string;
    selectedSubscription: string;
    reviews: string;
    description: string;
    bullets: string[];
    nutritionFacts?: string;
    calories?: number;
    netCarbs?: number;
    addedSugar?: number;
    tags: string[];
    quantity: number;
}

export interface Product {
    id: string;
    productID: string;
    variantID: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    purchaseOption: string;
    selectedSubscription: string;
    discount?: string;
    reviews: string;
    description: string;
    bullets: string[];
    nutritionFacts?: string;
    calories?: number;
    netCarbs?: number;
    addedSugar?: number;
    tags: string[];
    quantity: number;
}

export interface DrawerProps {
    product: Product;
    allProducts: Product[];
    onClose: () => void;
    from:string;
    closeDrawer: () => void;
}

export interface ReasonsProps {
    id: number;
    heading: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    imageHref: string;
}

export interface ReviewsSectionProps {
    productName?: string;
}

export interface CustomButtonProps {
    text: string;
    href: string;
    className?: string;
}

export interface CartContextType {
    cartItems: CartItem[] | null;
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[] | null>>;
}
