const products = [
  // ===== MEN'S PERFUMES =====
  {
    id: 1,
    name: "Noir Absolute",
    category: "men",
    price: 189.00,
    description: "A commanding blend of oud wood, black pepper, and leather that exudes power and sophistication. Designed for the modern gentleman who commands every room.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Black Pepper", "Bergamot", "Cardamom"],
      heart: ["Leather", "Violet Leaf", "Geranium"],
      base: ["Oud Wood", "Vetiver", "Amber"]
    },
    rating: 4.8,
    availability: "In Stock",
    featured: true,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Velvet Storm",
    category: "men",
    price: 215.00,
    description: "An intense aquatic fragrance with waves of sea salt, driftwood, and musk. A bold statement for the adventurous spirit.",
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&h=750&fit=crop",
    sizes: ["50ml", "100ml"],
    fragranceNotes: {
      top: ["Sea Salt", "Lemon", "Marine Accord"],
      heart: ["Driftwood", "Lavender", "Iris"],
      base: ["Musk", "Sandalwood", "Tonka Bean"]
    },
    rating: 4.6,
    availability: "In Stock",
    featured: true,
    badge: "New"
  },
  {
    id: 3,
    name: "Royal Oud",
    category: "men",
    price: 249.00,
    description: "A majestic composition of rare oud, saffron, and rose. Crafted for those who appreciate the finest things in life.",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Saffron", "Pink Pepper", "Neroli"],
      heart: ["Oud", "Rose", "Jasmine"],
      base: ["Sandalwood", "Patchouli", "Benzoin"]
    },
    rating: 4.9,
    availability: "In Stock",
    featured: true,
    badge: "Premium"
  },
  {
    id: 4,
    name: "Urban Legend",
    category: "men",
    price: 159.00,
    description: "A fresh citrus-woody fragrance that captures the energy of city life. Perfect for the young, dynamic professional.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Grapefruit", "Basil", "Ginger"],
      heart: ["Cedar", "Clary Sage", "Geranium"],
      base: ["Vetiver", "Musk", "Cedarwood"]
    },
    rating: 4.5,
    availability: "In Stock",
    featured: true
  },
  {
    id: 5,
    name: "Midnight Fox",
    category: "men",
    price: 175.00,
    description: "A mysterious blend of tobacco, vanilla, and dark amber. For the man who thrives after dark.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop",
    sizes: ["50ml", "100ml"],
    fragranceNotes: {
      top: ["Bergamot", "Black Currant", "Anise"],
      heart: ["Tobacco", "Plum", "Cinnamon"],
      base: ["Vanilla", "Dark Amber", "Leather"]
    },
    rating: 4.7,
    availability: "In Stock"
  },

  // ===== WOMEN'S PERFUMES =====
  {
    id: 6,
    name: "Petal Whisper",
    category: "women",
    price: 199.00,
    description: "A delicate floral bouquet of Bulgarian rose, peony, and white lily. Pure feminine elegance captured in a bottle.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop&q=80&auto=format",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Pink Pepper", "Pear", "Lychee"],
      heart: ["Bulgarian Rose", "Peony", "White Lily"],
      base: ["Musk", "Cedarwood", "Amber"]
    },
    rating: 4.9,
    availability: "In Stock",
    featured: true,
    badge: "Best Seller"
  },
  {
    id: 7,
    name: "Golden Elixir",
    category: "women",
    price: 265.00,
    description: "An opulent golden fragrance with saffron, jasmine, and sandalwood. Luxury defined in liquid gold.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Saffron", "Bitter Orange", "Mandarin"],
      heart: ["Jasmine Sambac", "Ylang Ylang", "Orange Blossom"],
      base: ["Sandalwood", "Vanilla", "White Musk"]
    },
    rating: 4.8,
    availability: "In Stock",
    featured: true,
    badge: "Premium"
  },
  {
    id: 8,
    name: "Sweet Reverie",
    category: "women",
    price: 169.00,
    description: "A dreamy gourmand fragrance with caramel, praline, and vanilla. Indulge your sweetest fantasies.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Bergamot", "Raspberry", "Cotton Candy"],
      heart: ["Caramel", "Praline", "Iris"],
      base: ["Vanilla", "Tonka Bean", "Musk"]
    },
    rating: 4.6,
    availability: "In Stock",
    featured: true
  },
  {
    id: 9,
    name: "Crimson Bloom",
    category: "women",
    price: 209.00,
    description: "A passionate fusion of red berries, tuberose, and patchouli. For the woman who leaves an unforgettable impression.",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=750&fit=crop",
    sizes: ["50ml", "100ml"],
    fragranceNotes: {
      top: ["Red Berries", "Dewy Melon", "Aldehydes"],
      heart: ["Tuberose", "Magnolia", "Violet"],
      base: ["Patchouli", "Sandalwood", "Ambroxan"]
    },
    rating: 4.7,
    availability: "In Stock",
    badge: "New"
  },
  {
    id: 10,
    name: "Crystal Dawn",
    category: "women",
    price: 185.00,
    description: "A fresh morning scent with aquatic notes, green tea, and white musk. Like the first light of dawn on a dewy garden.",
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Green Tea", "Cucumber", "Bergamot"],
      heart: ["Jasmine", "Lily of the Valley", "Peony"],
      base: ["White Musk", "Cedar", "Ambergris"]
    },
    rating: 4.5,
    availability: "In Stock"
  },

  // ===== UNISEX PERFUMES =====
  {
    id: 11,
    name: "Sandalwood Serenity",
    category: "unisex",
    price: 195.00,
    description: "A grounding woody fragrance with Mysore sandalwood, cedar, and vetiver. Transcends gender with pure zen.",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Bergamot", "Cardamom", "Grapefruit"],
      heart: ["Sandalwood", "Cedar", "Violet"],
      base: ["Vetiver", "Musk", "Amber"]
    },
    rating: 4.8,
    availability: "In Stock",
    featured: true,
    badge: "Best Seller"
  },
  {
    id: 12,
    name: "Amber Nights",
    category: "unisex",
    price: 225.00,
    description: "A rich amber composition with labdanum, benzoin, and myrrh. Warm, sensual, and utterly captivating.",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=750&fit=crop",
    sizes: ["50ml", "100ml"],
    fragranceNotes: {
      top: ["Cinnamon", "Pink Pepper", "Orange"],
      heart: ["Amber", "Labdanum", "Myrrh"],
      base: ["Benzoin", "Vanilla", "Sandalwood"]
    },
    rating: 4.7,
    availability: "In Stock",
    featured: true
  },
  {
    id: 13,
    name: "Musk Nomad",
    category: "unisex",
    price: 179.00,
    description: "A nomadic musk that travels through white musk, cashmere wood, and iris. Clean yet deep, simple yet complex.",
    image: "https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["White Musk", "Aldehydes", "Bergamot"],
      heart: ["Cashmere Wood", "Iris", "Freesia"],
      base: ["Musk", "Cedar", "Patchouli"]
    },
    rating: 4.6,
    availability: "In Stock",
    featured: true
  },
  {
    id: 14,
    name: "Citrus Decree",
    category: "unisex",
    price: 149.00,
    description: "A zesty citrus explosion of Sicilian lemon, blood orange, and neroli. Fresh, vibrant, and endlessly uplifting.",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml", "100ml"],
    fragranceNotes: {
      top: ["Sicilian Lemon", "Blood Orange", "Mandarin"],
      heart: ["Neroli", "Petitgrain", "Jasmine"],
      base: ["White Musk", "Cedar", "Ambrette"]
    },
    rating: 4.5,
    availability: "In Stock",
    badge: "New"
  },
  {
    id: 15,
    name: "Oud Royale",
    category: "unisex",
    price: 289.00,
    description: "A majestic oud composition blending rare Cambodian oud with rose, saffron, and leather. Pure opulence.",
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=750&fit=crop",
    sizes: ["30ml", "50ml"],
    fragranceNotes: {
      top: ["Saffron", "Damask Rose", "Bergamot"],
      heart: ["Cambodian Oud", "Leather", "Incense"],
      base: ["Agarwood", "Musk", "Sandalwood"]
    },
    rating: 4.9,
    availability: "In Stock",
    badge: "Premium"
  }
];

export const getProductsByCategory = (category) =>
  products.filter(p => p.category === category);

export const getFeaturedProducts = () =>
  products.filter(p => p.featured);

export const getProductById = (id) =>
  products.find(p => p.id === Number(id));

export const searchProducts = (query) => {
  const lower = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower)
  );
};

export default products;
