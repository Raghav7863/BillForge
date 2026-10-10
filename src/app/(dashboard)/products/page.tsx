"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Topbar from "@/components/ui/Topbar";
import {
    Activity,
    BarChart3,
    Bell,
    CircleHelp,
    CreditCard,
    FileText,
    Filter,
    Gauge,
    HelpCircle,
    Menu,
    MoreVertical,
    Package,
    Plus,
    Search,
    Settings,
    Users,
    X,
    Zap,
} from "lucide-react";
import { Geist, JetBrains_Mono } from "next/font/google";
import axios from "axios";
import LeftSidebar from "@/components/ui/LeftSidebar";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

type Product = {
    _id: number;
    name: string;
    description: string;
    price: number;
    taxRate: number;
    unit: string;
    type: string;
};

type TopbarProps = {
    avatar: string;
    onMenuClick: () => void;
    search?: string;
    onSearchChange?: (value: string) => void;
};

const secondaryNavigation = [
    { label: "Settings", icon: Settings },
    { label: "Support", icon: HelpCircle },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

export default function page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterUnit, setFilterUnit] = useState("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [tax, setTax] = useState("");
    const [unit, setUnit] = useState("Piece");
    const [type, setType] = useState("product");
    const [quantity, setQuantity] = useState<number>(1);

    const router = useRouter();

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/api/products", {
                withCredentials: true,
            });

            console.log("Products:", response.data);

            setProducts(response.data.products);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await axios.delete(`/api/products/${id}`, {
                withCredentials: true,
            });

            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== id)
            );

            fetchProducts();

            setOpenMenuId(null);

        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };



    useEffect(() => {
        fetchProducts();
    }, [])

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase());

            const matchesUnit =
                filterUnit === "All" || product.unit === filterUnit;

            return matchesSearch && matchesUnit;
        });
    }, [products, search, filterUnit]);

    const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "/api/products",
                {
                    name,
                    description,
                    type,
                    price: Number(price),
                    taxRate: Number(tax),
                    quantity,
                    unit,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Created product:", response.data);

            // Get fresh data from backend
            await fetchProducts();

            // Reset form
            setName("");
            setDescription("");
            setPrice("");
            setTax("");
            setUnit("Piece");
            setType("product");
        } catch (error) {
            console.error("Failed to add product:", error);
        }
    };



    return (
        <div
            className={`${geist.variable} ${jetBrainsMono.variable} min-h-screen bg-[#131315] font-[var(--font-geist)] text-[#e5e1e4]`}
        >

            <LeftSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeItem="Products"
            />

            {/* Main */}
            <main className="min-h-screen lg:ml-[260px]">

                <Topbar
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCRuQV-En1cHWXY5xtATcGfA50JlXHeki7p-U-k1_SeLwcV75mnJYiznWG1k1KWGflx84DTAIq4q6evJUWTNrPxDt_yrH0fUM2XllqnW5giNoJNnyMqA7f4kHmchbev6bV8ZjpiK7Unyx-iHZCPlBgNu-00Wux7fkW4QXyCCE-k_y4feyJn5thiNBIXnwzB0ND4h2ZpNC45esj1hyUOUPBED4uW-0z5A1UrAzYyWO4CIVjQbvmGXezm"
                    onMenuClick={() => setSidebarOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                />


                {/* Content */}
                <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-24 sm:px-6 lg:px-8 xl:px-10">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6"
                    >
                        <h1 className="text-2xl font-semibold tracking-tight text-[#e5e1e4] sm:text-3xl">
                            Products & Services
                        </h1>

                        <p className="mt-1 text-sm leading-6 text-[#c3c9b2] sm:text-base">
                            Manage your items and service offerings.
                        </p>
                    </motion.div>

                    {/* Add New Item */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="mb-10 rounded-lg border border-[#434938] bg-[#1c1b1d] p-4 sm:p-6"
                    >
                        <h2 className="mb-5 text-xl font-medium text-[#e5e1e4]">
                            Add New Item
                        </h2>

                        <form
                            onSubmit={handleAddProduct}
                            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6"
                        >
                            {/* Name */}
                            <FormField label="Name" className="xl:col-span-2">
                                <input
                                    value={name}
                                    onChange={(e) => { setName(e.target.value) }}
                                    placeholder="e.g., Web Design Package"
                                    className={inputClass}
                                    type="text"
                                />
                            </FormField>

                            {/* Description */}
                            <FormField label="Description" className="xl:col-span-2">
                                <input
                                    value={description}
                                    onChange={(e) => { setDescription(e.target.value) }}
                                    placeholder="e.g., Complete brand identity..."
                                    className={inputClass}
                                    type="text"
                                />
                            </FormField>

                            {/* Price */}
                            <FormField label="Price (₹)" className="xl:col-span-1">
                                <input
                                    value={price}
                                    onChange={(e) => { setPrice(e.target.value) }}
                                    placeholder="e.g., 45000"
                                    className={`${inputClass} font-mono`}
                                    type="text"
                                    inputMode="numeric"
                                />
                            </FormField>

                            <FormField label="Quantity" className="xl:col-span-1">
                                <input
                                    value={quantity}
                                    onChange={(e) => { setQuantity(Number(e.target.value)) }}
                                    placeholder="e.g., 1"
                                    className={`${inputClass} font-mono`}
                                    type="number"
                                    inputMode="numeric"
                                />
                            </FormField>

                            {/* Tax + Unit */}
                            <div className="grid grid-cols-2 gap-2 xl:col-span-1">
                                <FormField label="Tax (%)">
                                    <input
                                        value={tax}
                                        onChange={(e) => { setTax(e.target.value) }}
                                        placeholder="18"
                                        className={`${inputClass} px-2 text-center font-mono`}
                                        type="text"
                                        inputMode="numeric"
                                    />
                                </FormField>

                                <FormField label="Unit">
                                    <select
                                        value={unit}
                                        onChange={(e) => { setUnit(e.target.value) }}
                                        className={`${inputClass} appearance-none px-2`}
                                    >
                                        <option>Piece</option>
                                        <option>Month</option>
                                    </select>
                                </FormField>

                                <FormField label="Type">
                                    <select
                                        value={type}
                                        onChange={(e) => { setType(e.target.value) }}
                                        className={`${inputClass} appearance-none px-2`}
                                    >
                                        <option>service</option>
                                        <option>product</option>
                                    </select>
                                </FormField>
                            </div>

                            <div className="flex justify-end md:col-span-2 xl:col-span-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded bg-[#bef264] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#4b6e00] transition hover:bg-[#a4d64c] sm:w-auto"
                                >
                                    <Plus size={18} />
                                    Add Item
                                </motion.button>
                            </div>
                        </form>
                    </motion.section>

                    {/* Catalog Header */}
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-medium text-[#e5e1e4]">
                            Product Catalog
                        </h2>

                        <div className="relative">
                            <button
                                onClick={() => setShowFilter((current) => !current)}
                                className="flex items-center justify-center gap-2 rounded border border-[#434938] bg-transparent px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#e5e1e4] transition hover:bg-[#2a2a2c]"
                            >
                                <Filter size={16} />
                                Filter
                            </button>

                            <AnimatePresence>
                                {showFilter && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                        className="absolute right-0 top-11 z-30 w-44 rounded-lg border border-[#434938] bg-[#1c1b1d] p-2 shadow-2xl"
                                    >
                                        {["All", "Piece", "Hour", "Month"].map((unit) => (
                                            <button
                                                key={unit}
                                                onClick={() => {
                                                    setFilterUnit(unit);
                                                    setShowFilter(false);
                                                }}
                                                className={`flex w-full rounded px-3 py-2 text-left text-sm transition ${filterUnit === unit
                                                    ? "bg-[#353437] text-[#bff365]"
                                                    : "text-[#c3c9b2] hover:bg-[#2a2a2c] hover:text-white"
                                                    }`}
                                            >
                                                {unit}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Empty State */}
                    {loading ? (
                        <div className="rounded-lg border border-[#434938] bg-[#1c1b1d] py-16 text-center">
                            <p className="text-sm text-[#8d937e]">
                                Loading products...
                            </p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-lg border border-dashed border-[#434938] bg-[#1c1b1d] py-16 text-center"
                        >
                            <Package
                                className="mx-auto mb-3 text-[#8d937e]"
                                size={32}
                            />

                            <h3 className="font-medium text-[#e5e1e4]">
                                No products found
                            </h3>

                            <p className="mt-1 text-sm text-[#8d937e]">
                                Try another search or filter.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        index={index}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                        onDelete={() => { handleDeleteProduct(product._id) }}

                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}

function FormField({
    label,
    children,
    className = "",
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                {label}
            </label>

            {children}
        </div>
    );
}

const inputClass =
    "h-10 w-full rounded border border-[#434938] bg-[#131315] px-3 text-sm text-[#e5e1e4] outline-none transition placeholder:text-[#8d937e] focus:border-[#bff365] focus:ring-1 focus:ring-[#bff365]";

function ProductCard({
    product,
    index,
    openMenuId,
    setOpenMenuId,
    onDelete,
}: {
    product: Product;
    index: number;
    openMenuId: string | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
    onDelete: (id: string) => void;
}) {
    const isMenuOpen = openMenuId === product._id;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{
                duration: 0.35,
                delay: index * 0.06,
            }}
            className="group relative flex min-h-[230px] flex-col overflow-visible rounded-lg border border-[#434938] bg-[#1c1b1d] p-4 transition-colors hover:border-[#8d937e]"
        >
            <div
                className={`absolute right-2 top-2 z-20 transition-opacity ${isMenuOpen
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                    }`}
            >
                <button
                    type="button"
                    aria-label={`More options for ${product.name}`}
                    onClick={(event) => {
                        event.stopPropagation();

                        setOpenMenuId((current) =>
                            current === product._id
                                ? null
                                : product._id
                        );
                    }}
                    className="rounded p-1.5 text-[#c3c9b2] hover:bg-[#353437] hover:text-white"
                >
                    <MoreVertical size={20} />
                </button>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            className="absolute right-0 top-9 z-50 w-36 rounded-lg border border-[#434938] bg-[#1c1b1d] p-1 shadow-2xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => onDelete(product._id)}
                                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                            >
                                Delete
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1">
                <h3 className="pr-8 text-base font-semibold text-[#e5e1e4]">
                    {product.name}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#c3c9b2]">
                    {product.description}
                </p>
            </div>

            <div className="mt-6 border-t border-[#434938]/50 pt-4">
                <div className="mb-2 flex items-end justify-between gap-3">
                    <span className="font-[var(--font-mono)] text-xl font-bold leading-none tabular-nums text-[#e5e1e4]">
                        {formatCurrency(product.price)}
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c3c9b2]">
                        {product.unit}
                    </span>
                </div>

                <span className="inline-flex rounded bg-[#353437] px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#c3c9b2]">
                    Tax: {product.taxRate}%
                </span>
            </div>

            <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#bff365]"
            />
        </motion.article>
    );
}


