// products.ts (Shoes)

export interface ProductImage {
  url: string;
  altText: string;
}

export type Gender = "Men" | "Women" | "Unisex";

export interface Product {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  sku: string;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  collections: string;
  material: string;
  gender: Gender;
  images: ProductImage[];
  rating: number;
  numReviews: number;
}

const products: Product[] = [
  {
    name: "Classic Leather Oxford Shoes",
    description:
      "Premium leather Oxford shoes designed for formal and office wear. Features a polished finish, lace-up closure, and cushioned insole for all-day comfort.",
    price: 129.99,
    discountPrice: 119.99,
    countInStock: 20,
    sku: "SH-OXF-001",
    category: "Shoes",
    brand: "Urban Threads",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Black", "Brown"],
    collections: "Formal Collection",
    material: "Genuine Leather",
    gender: "Men",
    images: [
      {
        url: "https://picsum.photos/500/500?random=101",
        altText: "Classic Leather Oxford Shoes",
      },
    ],
    rating: 4.7,
    numReviews: 15,
  },

  {
    name: "Slim Fit Formal Loafers",
    description:
      "Stylish slip-on loafers with a sleek silhouette. Lightweight design with soft lining makes them ideal for business and evening wear.",
    price: 109.99,
    discountPrice: 99.99,
    countInStock: 25,
    sku: "SH-LOAF-002",
    category: "Shoes",
    brand: "Modern Fit",
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Black", "Navy"],
    collections: "Business Wear",
    material: "Synthetic Leather",
    gender: "Men",
    images: [
      {
        url: "https://picsum.photos/500/500?random=102",
        altText: "Formal Loafers",
      },
    ],
    rating: 4.6,
    numReviews: 18,
  },

  {
    name: "Casual Denim Sneakers",
    description:
      "Everyday casual sneakers with denim-style fabric upper and rubber outsole. Perfect for streetwear and relaxed outfits.",
    price: 89.99,
    discountPrice: 79.99,
    countInStock: 30,
    sku: "SH-SNK-003",
    category: "Shoes",
    brand: "Street Style",
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Blue", "Dark Wash"],
    collections: "Casual Wear",
    material: "Canvas & Rubber",
    gender: "Men",
    images: [
      {
        url: "https://picsum.photos/500/500?random=103",
        altText: "Casual Denim Sneakers",
      },
    ],
    rating: 4.5,
    numReviews: 20,
  },

  {
    name: "Printed Summer Sandals",
    description:
      "Lightweight summer sandals with breathable straps and cushioned sole. Ideal for vacations and warm-weather outings.",
    price: 59.99,
    discountPrice: 49.99,
    countInStock: 35,
    sku: "SH-SAND-004",
    category: "Shoes",
    brand: "Beach Breeze",
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Brown", "Tropical Print"],
    collections: "Vacation Wear",
    material: "EVA & Fabric",
    gender: "Men",
    images: [
      {
        url: "https://picsum.photos/500/500?random=104",
        altText: "Printed Summer Sandals",
      },
    ],
    rating: 4.4,
    numReviews: 12,
  },

  {
    name: "Men's Running Shoes",
    description:
      "High-performance running shoes with breathable mesh upper and shock-absorbing sole. Designed for daily workouts and long runs.",
    price: 149.99,
    discountPrice: 134.99,
    countInStock: 40,
    sku: "SH-RUN-005",
    category: "Shoes",
    brand: "ActiveWear",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Black", "Red", "Blue"],
    collections: "Sports Collection",
    material: "Mesh & Foam",
    gender: "Men",
    images: [
      {
        url: "https://picsum.photos/500/500?random=105",
        altText: "Men Running Shoes",
      },
    ],
    rating: 4.8,
    numReviews: 28,
  },

  {
    name: "Women's High Heel Pumps",
    description:
      "Elegant high heel pumps with a sleek finish and padded insole. Perfect for office, parties, and formal events.",
    price: 139.99,
    discountPrice: 129.99,
    countInStock: 20,
    sku: "SH-HEEL-W-006",
    category: "Shoes",
    brand: "ElegantStyle",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Black", "Red", "Nude"],
    collections: "Evening Collection",
    material: "PU Leather",
    gender: "Women",
    images: [
      {
        url: "https://picsum.photos/500/500?random=106",
        altText: "Women's High Heel Pumps",
      },
    ],
    rating: 4.7,
    numReviews: 22,
  },

  {
    name: "Women's Casual Sneakers",
    description:
      "Comfortable everyday sneakers with a modern design. Lightweight sole and breathable upper for all-day wear.",
    price: 99.99,
    discountPrice: 89.99,
    countInStock: 30,
    sku: "SH-SNK-W-007",
    category: "Shoes",
    brand: "ChicStyle",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["White", "Pink", "Gray"],
    collections: "Casual Collection",
    material: "Synthetic & Rubber",
    gender: "Women",
    images: [
      {
        url: "https://picsum.photos/500/500?random=107",
        altText: "Women's Casual Sneakers",
      },
    ],
    rating: 4.6,
    numReviews: 26,
  },
];

export default products;
