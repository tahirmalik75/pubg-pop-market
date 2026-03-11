'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    Tag,
    DollarSign,
    Layers,
    X,
    Check,
    Loader2,
    Image as ImageIcon,
    Upload,
    FileImage,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

interface Card {
    _id?: string;
    id?: string;
    title: string;
    price: number;
    stock: number;
    category: string;
    image: string;
}

const CATEGORIES = ['All', 'Popularity', 'UC', 'Outfits', 'Skins', 'Other'];

export default function CardsPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        stock: '',
        category: 'Popularity',
        image: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/cards');
            const data = await res.json();
            if (Array.isArray(data)) setCards(data);
        } catch (err) {
            console.error('Fetch cards error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCards = useMemo(() => {
        return cards.filter(card => {
            const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [cards, searchQuery, selectedCategory]);

    const handleOpenModal = (card?: any) => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setSubmitStatus('idle');
        setErrorMessage('');
        if (card) {
            setEditingCard(card);
            setFormData({
                title: card.title,
                price: card.price.toString(),
                stock: (card.stock || 0).toString(),
                category: card.category,
                image: card.image,
            });
            setPreviewUrl(card.image);
        } else {
            setEditingCard(null);
            setFormData({
                title: '',
                price: '',
                stock: '',
                category: 'Popularity',
                image: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this card?')) {
            try {
                const res = await fetch(`/api/admin/cards/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchCards();
                } else {
                    const errData = await res.json();
                    alert(`Delete failed: ${errData.error || 'Server error'}`);
                }
            } catch (err: any) {
                console.error('Delete error:', err);
                alert(`Network error: ${err.message}`);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        console.log('--- Submission Started ---');
        console.log('Initial form image:', formData.image);
        console.log('Selected file:', selectedFile?.name);

        let finalImageUrl = formData.image;

        // Upload file if selected
        if (selectedFile) {
            setIsUploading(true);
            try {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    finalImageUrl = url;
                } else {
                    const errData = await uploadRes.json();
                    setErrorMessage(`Upload failed: ${errData.error || 'Server error'}`);
                    setSubmitStatus('error');
                    setIsSubmitting(false);
                    setIsUploading(false);
                    return;
                }
            } catch (err: any) {
                console.error('Upload error:', err);
                setErrorMessage(`Network error during upload: ${err.message}`);
                setSubmitStatus('error');
                setIsSubmitting(false);
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        const cardData = {
            title: formData.title,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            image: finalImageUrl || `https://placehold.co/400x400/111/444?text=${encodeURIComponent(formData.title)}`,
        };

        console.log('Final Card Data:', cardData);

        try {
            const url = editingCard ? `/api/admin/cards/${editingCard._id || editingCard.id}` : '/api/admin/cards';
            const method = editingCard ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardData),
            });

            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setIsModalOpen(false);
                    fetchCards();
                }, 1500);
            } else {
                const errData = await res.json();
                setErrorMessage(errData.error || 'Failed to save card');
                setSubmitStatus('error');
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            setErrorMessage(`Network error: ${err.message}`);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Cards</h1>
                    <p className="text-gray-500 light:text-gray-400">Total {cards.length} items available in store</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add New Card</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search cards by name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredCards.map((card) => (
                        <motion.div
                            key={card.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl"
                        >
                            {/* Card Image */}
                            <div className="aspect-square relative overflow-hidden bg-gray-950">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md border border-white/10">
                                        {card.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                        {card.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Price</span>
                                        <span className="text-xl font-black text-blue-500">PKR {card.price}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">In Stock</span>
                                        <span className={`text-sm font-bold ${card.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>
                                            {card.stock} units
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => handleOpenModal(card)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition-all active:scale-95"
                                    >
                                        <Edit2 size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card._id || card.id || '')}
                                        className="aspect-square flex items-center justify-center bg-red-950/30 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 font-bold p-2 rounded-lg transition-all active:scale-95 group/del"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl overflow-y-auto max-h-[90vh] shadow-2xl custom-scrollbar"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                                <h2 className="text-xl font-bold">{editingCard ? 'Edit Card' : 'Add New Card'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {submitStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold text-sm"
                                    >
                                        <CheckCircle2 size={20} />
                                        <span>Product {editingCard ? 'updated' : 'added'} successfully!</span>
                                    </motion.div>
                                )}

                                {submitStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold text-sm"
                                    >
                                        <AlertCircle size={20} />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                            <Tag size={12} className="text-blue-500" /> Card Title
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                            <DollarSign size={12} className="text-blue-500" /> Price (PKR)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                            <Package size={12} className="text-blue-500" /> Stock
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                            <Layers size={12} className="text-blue-500" /> Category
                                        </label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                            <ImageIcon size={12} className="text-blue-500" /> Card Image
                                        </label>
                                        <div className="space-y-3">
                                            <div className="relative group cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full flex flex-col items-center justify-center gap-2 py-8 bg-gray-950/50 border-2 border-dashed border-gray-800 rounded-2xl group-hover:border-blue-500/50 transition-all">
                                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                                        <Upload size={24} />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-gray-300">Click or drag image to upload</p>
                                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">PNG, JPG up to 5MB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {previewUrl && (
                                                <div className="relative group rounded-2xl overflow-hidden border border-gray-800">
                                                    <img src={previewUrl} className="w-full h-48 object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                                                            className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-gray-400 font-bold border border-gray-800 rounded-xl hover:bg-gray-800 transition-all font-mono tracking-tighter"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isUploading}
                                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 tracking-tighter uppercase"
                                    >
                                        {isSubmitting || isUploading ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : editingCard ? (
                                            <>
                                                <Check size={18} /> SAVE CHANGES
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={18} /> ADD PRODUCT
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
        </div>
    );
}
