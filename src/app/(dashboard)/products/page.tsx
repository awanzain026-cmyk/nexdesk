"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Package, TrendingUp, AlertTriangle, Smartphone, Laptop, Headphones, Watch } from "lucide-react";
import { Badge, Card, Input } from "@/components/ui";
import { PRODUCTS } from "@/lib/data/products";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductCategory } from "@/types";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" }, { label: "Phones", value: "phones" },
  { label: "Laptops", value: "laptops" }, { label: "Headphones", value: "headphones" },
  { label: "Smartwatches", value: "smartwatches" }, { label: "Accessories", value: "accessories" },
];

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  phones: "badge-cyan", laptops: "badge-violet", headphones: "badge-green",
  smartwatches: "badge-amber", accessories: "badge-gray",
};

const CATEGORY_ICONS: Record<ProductCategory, React.ElementType> = {
  phones: Smartphone, laptops: Laptop, headphones: Headphones,
  smartwatches: Watch, accessories: Package,
};

const CATEGORY_TILE_BG: Record<ProductCategory, string> = {
  phones: "bg-cyan/10 border-cyan/20", laptops: "bg-violet/10 border-violet/20",
  headphones: "bg-emerald/10 border-emerald/20", smartwatches: "bg-amber/10 border-amber/20",
  accessories: "bg-raised border-border",
};

const CATEGORY_ICON_COLOR: Record<ProductCategory, string> = {
  phones: "text-cyan", laptops: "text-violet", headphones: "text-emerald",
  smartwatches: "text-amber", accessories: "text-text-disabled",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  const totalValue = PRODUCTS.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = PRODUCTS.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Products</h1>
          <p className="text-sm text-text-muted mt-0.5">TechVault electronics catalog — {PRODUCTS.length} items</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: PRODUCTS.length, icon: <Package className="h-4 w-4" />, color: "text-cyan", bg: "bg-cyan/10 border-cyan/20" },
          { label: "Inventory Value", value: formatCurrency(totalValue), icon: <TrendingUp className="h-4 w-4" />, color: "text-violet", bg: "bg-violet/10 border-violet/20" },
          { label: "Low Stock", value: lowStock, icon: <AlertTriangle className="h-4 w-4" />, color: "text-amber", bg: "bg-amber/10 border-amber/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("flex items-center gap-3 p-4 rounded-xl border", s.bg)}>
            <div className={s.color}>{s.icon}</div>
            <div>
              <p className="text-lg font-bold font-mono text-text-primary">{s.value}</p>
              <p className="text-[11px] text-text-muted">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search products..." icon={<Search className="h-4 w-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
                category === c.value ? "bg-cyan/10 text-cyan border border-cyan/20" : "text-text-muted hover:text-text-primary hover:bg-raised")}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="card p-5 cursor-pointer">
            {/* Product visual: real image if available, otherwise a distinct per-category tile */}
            {product.image_url ? (
              <div className="relative h-32 rounded-xl overflow-hidden border border-border mb-4 bg-raised">
                <Image src={product.image_url} alt={product.name} fill className="object-contain p-4" />
              </div>
            ) : (
              <div className={cn("h-32 rounded-xl border flex items-center justify-center mb-4", CATEGORY_TILE_BG[product.category])}>
                {(() => {
                  const Icon = CATEGORY_ICONS[product.category];
                  return <Icon className={cn("h-10 w-10", CATEGORY_ICON_COLOR[product.category])} />;
                })()}
              </div>
            )}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <span className={cn("badge text-[10px] mb-1.5", CATEGORY_COLORS[product.category])}>{product.category}</span>
                <h3 className="text-sm font-semibold text-text-primary leading-tight">{product.name}</h3>
                <p className="text-xs text-text-muted">{product.brand}</p>
              </div>
            </div>
            <p className="text-xs text-text-muted line-clamp-2 mb-3">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-text-primary">{formatCurrency(product.price)}</span>
              <div className="flex items-center gap-2">
                <span className={cn("text-[11px] font-medium", product.stock < 10 ? "text-amber" : product.stock < 20 ? "text-cyan" : "text-emerald")}>
                  {product.stock < 10 ? "⚠" : "●"} {product.stock} left
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-disabled">{product.sku}</span>
              <span className="text-[10px] text-text-muted">{product.warranty_months}mo warranty</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
