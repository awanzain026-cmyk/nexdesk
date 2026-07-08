import type { Product } from "@/types";

export const PRODUCTS: Product[] = [
  // ── Phones ──────────────────────────────────────────────────────────────────
  {
    id: "p001", sku: "APL-IP15PM-256-BLK",
    name: "iPhone 15 Pro Max", brand: "Apple", category: "phones",
    price: 1199, stock: 24, warranty_months: 12,
    description: "Apple's most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP camera system with 5x optical zoom.",
    specs: { Display: "6.7\" Super Retina XDR OLED", Chip: "A17 Pro", Storage: "256GB", Camera: "48MP Triple System", Battery: "4422mAh" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p002", sku: "SAM-S24U-512-BLK",
    name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "phones",
    price: 1299, stock: 18, warranty_months: 12,
    description: "The ultimate Galaxy with S Pen, 200MP camera, and Snapdragon 8 Gen 3 for AI-powered performance.",
    specs: { Display: "6.8\" Dynamic AMOLED 2X", Chip: "Snapdragon 8 Gen 3", Storage: "512GB", Camera: "200MP Quad System", Battery: "5000mAh" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p003", sku: "GOG-PX8P-256-OBS",
    name: "Google Pixel 8 Pro", brand: "Google", category: "phones",
    price: 999, stock: 31, warranty_months: 36,
    description: "Google's flagship with Tensor G3 chip, best-in-class AI camera, and 7 years of OS updates.",
    specs: { Display: "6.7\" LTPO OLED", Chip: "Tensor G3", Storage: "256GB", Camera: "50MP Triple System", Battery: "5050mAh" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p004", sku: "ONP-12P-512-SLV",
    name: "OnePlus 12 Pro", brand: "OnePlus", category: "phones",
    price: 799, stock: 14, warranty_months: 12,
    description: "Flagship killer with Hasselblad camera, 100W fast charging, and buttery-smooth 120Hz display.",
    specs: { Display: "6.82\" LTPO3 AMOLED", Chip: "Snapdragon 8 Gen 3", Storage: "512GB", Camera: "Hasselblad 50MP", Battery: "5400mAh" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },

  // ── Laptops ──────────────────────────────────────────────────────────────────
  {
    id: "p005", sku: "APL-MBA-M3-16-512-SLV",
    name: "MacBook Air M3 15\"", brand: "Apple", category: "laptops",
    price: 1299, stock: 11, warranty_months: 12,
    description: "Supercharged by M3 chip. Up to 18 hours battery life. The world's best consumer laptop.",
    specs: { Chip: "Apple M3", RAM: "16GB", Storage: "512GB SSD", Display: "15.3\" Liquid Retina", Battery: "18hrs" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p006", sku: "DEL-XPS15-I9-RTX-32-1T",
    name: "Dell XPS 15 OLED", brand: "Dell", category: "laptops",
    price: 1799, stock: 7, warranty_months: 12,
    description: "Professional powerhouse with Intel Core i9, RTX 4070, and a stunning 3.5K OLED display.",
    specs: { CPU: "Intel Core i9-13900H", GPU: "NVIDIA RTX 4070", RAM: "32GB", Storage: "1TB NVMe", Display: "15.6\" 3.5K OLED" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p007", sku: "LNV-X1C-I7-16-512",
    name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", category: "laptops",
    price: 1499, stock: 9, warranty_months: 36,
    description: "The legendary business laptop. Lighter than ever at 1.12kg with military-grade durability.",
    specs: { CPU: "Intel Core i7-1365U", RAM: "16GB LPDDR5", Storage: "512GB SSD", Display: "14\" 2.8K OLED", Weight: "1.12kg" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p008", sku: "ASU-ZB14-R9-RX-32-1T",
    name: "ASUS ZenBook Pro 14", brand: "ASUS", category: "laptops",
    price: 1199, stock: 13, warranty_months: 12,
    description: "Creator-focused laptop with AMD Ryzen 9, dedicated GPU, and a gorgeous OLED touchscreen.",
    specs: { CPU: "AMD Ryzen 9 7940H", GPU: "AMD RX 7600S", RAM: "32GB", Storage: "1TB SSD", Display: "14.5\" 2.8K OLED Touch" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },

  // ── Headphones ───────────────────────────────────────────────────────────────
  {
    id: "p009", sku: "SNY-WH1000XM5-BLK",
    name: "Sony WH-1000XM5", brand: "Sony", category: "headphones",
    price: 349, stock: 42, warranty_months: 12,
    description: "Industry-leading noise cancellation with 30-hour battery and premium audio tuned by Sony engineers.",
    specs: { ANC: "Industry-leading", Battery: "30 hours", Drivers: "30mm", Connectivity: "Bluetooth 5.2", Weight: "250g" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p010", sku: "APL-APP2-WHT",
    name: "AirPods Pro 2nd Gen", brand: "Apple", category: "headphones",
    price: 249, stock: 67, warranty_months: 12,
    description: "Up to 2x more ANC than ever. Adaptive Transparency. Personalized Spatial Audio.",
    specs: { ANC: "Adaptive", Battery: "6hrs (30hrs with case)", Chip: "H2", "Water Resistance": "IP54", Features: "Lossless, Spatial Audio" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p011", sku: "BSE-QC45-BLK",
    name: "Bose QuietComfort 45", brand: "Bose", category: "headphones",
    price: 279, stock: 28, warranty_months: 12,
    description: "Bose QuietComfort acoustic noise cancelling and Aware Mode with Bose's signature sound quality.",
    specs: { ANC: "QuietComfort", Battery: "24 hours", Connectivity: "Bluetooth 5.1", "Fold": "Yes", Weight: "238g" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p012", sku: "SEN-MOMENTUM4-BLK",
    name: "Sennheiser Momentum 4", brand: "Sennheiser", category: "headphones",
    price: 299, stock: 19, warranty_months: 24,
    description: "60-hour battery life, exceptional sound quality, and adaptive ANC in a premium build.",
    specs: { ANC: "Adaptive", Battery: "60 hours", Drivers: "42mm", Connectivity: "Bluetooth 5.2", Codec: "aptX Adaptive" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },

  // ── Smartwatches ──────────────────────────────────────────────────────────────
  {
    id: "p013", sku: "APL-AWS9-45-MID",
    name: "Apple Watch Series 9 45mm", brand: "Apple", category: "smartwatches",
    price: 429, stock: 33, warranty_months: 12,
    description: "The most powerful Apple Watch ever with the new S9 chip, Double Tap gesture, and Precision Finding.",
    specs: { Chip: "S9 SiP", Display: "Always-On Retina LTPO", "Water Resistance": "50m", Battery: "18hrs", GPS: "L1 + L5 dual" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p014", sku: "SAM-GW6C-47-BLK",
    name: "Samsung Galaxy Watch 6 Classic", brand: "Samsung", category: "smartwatches",
    price: 399, stock: 21, warranty_months: 12,
    description: "Iconic rotating bezel design with advanced health monitoring, BioActive Sensor, and Sapphire Crystal glass.",
    specs: { Display: "1.5\" Super AMOLED", Battery: "40hrs", "Health Sensors": "BioActive", "Body": "Stainless Steel", OS: "Wear OS 4" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p015", sku: "GAR-FENIX7P-BLK",
    name: "Garmin Fenix 7 Pro", brand: "Garmin", category: "smartwatches",
    price: 799, stock: 8, warranty_months: 24,
    description: "Multi-sport GPS watch for athletes with solar charging, LED flashlight, and up to 37-day battery.",
    specs: { Battery: "Up to 37 days", GPS: "Multi-GNSS", Display: "1.3\" MIP", Material: "Titanium", "Water Rating": "10 ATM" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },

  // ── Accessories ───────────────────────────────────────────────────────────────
  {
    id: "p016", sku: "APL-MAGSAFE-15W",
    name: "Apple MagSafe Charger 15W", brand: "Apple", category: "accessories",
    price: 39, stock: 120, warranty_months: 12,
    description: "Perfectly aligned magnetic charging at up to 15W. Works with all MagSafe-compatible devices.",
    specs: { Power: "15W", Connector: "USB-C", Length: "1m", Compatibility: "iPhone 12+" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p017", sku: "AKN-C140-100W-BLK",
    name: "Anker 140W USB-C Charger", brand: "Anker", category: "accessories",
    price: 59, stock: 88, warranty_months: 18,
    description: "Ultra-compact 140W GaN charger. Charge a MacBook Pro at full speed and a phone simultaneously.",
    specs: { Power: "140W", Ports: "2x USB-C + 1x USB-A", Technology: "GaN II", Size: "Compact", Certifications: "MFi, CE, FCC" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p018", sku: "SPG-IP15PM-CASE-CLR",
    name: "Spigen Ultra Hybrid Case", brand: "Spigen", category: "accessories",
    price: 29, stock: 200, warranty_months: 12,
    description: "Military-grade drop protection with crystal-clear back. Shows off your iPhone 15 Pro design.",
    specs: { Material: "TPU + PC", Protection: "MIL-STD-810G", Compatibility: "iPhone 15 Pro Max", "Camera Guard": "Yes" },
    image_url: null, is_active: true, created_at: "2024-01-01T00:00:00Z",
  },
];

export const STORE_NAME = "TechVault";
export const STORE_DESCRIPTION = "Premium electronics for modern living";

export const POLICIES = {
  return: "We offer a 30-day return policy on all products. Items must be in original condition with all accessories and packaging. Damaged or used items may be subject to a restocking fee.",
  warranty: "All products come with manufacturer warranty. Extended warranty can be purchased within 30 days of purchase. Warranty covers manufacturing defects but not physical damage.",
  shipping: "Free shipping on orders over $50. Standard delivery 3-5 business days. Express delivery 1-2 business days available at checkout.",
  replacement: "Defective products can be replaced within 60 days of purchase. Please initiate a support ticket with your order number and photos of the defect.",
  refund: "Approved refunds are processed within 5-7 business days to the original payment method. Digital payments may be faster.",
};

export function findProduct(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q)
  );
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsBySku(sku: string): Product | undefined {
  return PRODUCTS.find(p => p.sku === sku);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}
