export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: string;
  image: string;
  description: string;
  isBestSeller?: boolean;
  isDiscounted?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}
