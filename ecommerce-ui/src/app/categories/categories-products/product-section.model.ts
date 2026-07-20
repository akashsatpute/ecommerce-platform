export type Product = {
  name: string;
  description: string;
  price: string;
  mrp: string;
  discount: string;
  rating: string;
  bought: string;
  offer: string;
  delivery: string;
  image: string;
};

export type ProductType = {
  key: string;
  label: string;
  file: string;
};

export type ProductSection = {
  key: string;
  label: string;
  products: Product[];
};

export type CategoryConfig = {
  title: string;
  types: ProductType[];
};
