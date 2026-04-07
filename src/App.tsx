import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Star,
  MessageCircle,
  ArrowRight,
  Filter,
  MapPin,
  CreditCard,
  Wallet,
  CheckCircle2,
  Bean,
  Wheat,
  CookingPot,
  Flame,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, CartItem } from './types';
import { PRODUCTS, CATEGORIES } from './constants';

// --- Components ---

const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  onSearch, 
  searchQuery 
}: { 
  cartCount: number; 
  onOpenCart: () => void;
  onSearch: (q: string) => void;
  searchQuery: string;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Menu className="md:hidden w-6 h-6 text-primary cursor-pointer" />
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary hidden sm:block">Green Basket</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl relative">
          <input 
            type="text" 
            placeholder="Search groceries..." 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Login</span>
          </button>
          <button className="relative p-2 text-gray-600 hover:text-primary transition-colors" onClick={onOpenCart}>
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist,
  isWishlisted 
}: { 
  product: Product; 
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative h-full">
      <button 
        onClick={() => onToggleWishlist(product.id)}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {product.isDiscounted && (
        <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          SAVE {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
        </span>
      )}

      <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{product.unit}</span>
        </div>
        <p className="text-[10px] text-gray-500 font-medium">{product.nameUrdu}</p>
        
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-primary">Rs. {product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>
          )}
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          className="w-full mt-3 bg-primary text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onRemove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 2000 ? 0 : 150;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Your Basket ({items.length})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your basket is empty</p>
                    <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">Rs. {item.price * item.quantity}</span>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="p-1 hover:bg-white rounded shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-[10px] text-primary font-medium">Add Rs. {2000 - subtotal} more for FREE delivery!</p>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>Rs. {subtotal + deliveryFee}</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  Checkout Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.nameUrdu?.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Now Delivering in Lahore, Karachi & Islamabad</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">
                Fresh Groceries <br />
                <span className="text-primary">Delivered to Your</span> <br />
                Doorstep.
              </h1>
              <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                Premium quality staples, fresh produce, and daily essentials at the best prices in Pakistan.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 group">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all">
                  Browse Categories
                </button>
              </div>
              <div className="flex items-center gap-6 justify-center md:justify-start pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-gray-900">4.9</span>
                  </div>
                  <p className="text-gray-500">10k+ Happy Customers</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden md:block"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                  alt="Fresh Produce" 
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -left-6 z-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Quality Check</p>
                  <p className="text-sm font-bold">100% Fresh</p>
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 z-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Fast Delivery</p>
                  <p className="text-sm font-bold">Under 60 Mins</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">Shop by Category</h2>
                <p className="text-gray-500">Everything you need, organized for you.</p>
              </div>
              <button className="text-primary font-bold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
                  className={`group flex flex-col items-center p-4 rounded-3xl transition-all duration-300 ${selectedCategory === cat.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100'}`}
                >
                  <div className={`w-16 h-16 rounded-2xl overflow-hidden mb-4 transition-transform group-hover:scale-110 ${selectedCategory === cat.id ? 'ring-4 ring-white/20' : ''}`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-sm font-bold text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-white transition-all"><Filter className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard 
                      product={product} 
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                      isWishlisted={wishlist.includes(product.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No products found matching your search.</p>
                <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="text-primary font-bold">Clear all filters</button>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-black">Why Pakistan Trusts Green Basket</h2>
              <p className="text-primary-foreground/80">We are committed to providing the best grocery experience in the country.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Truck, title: 'Express Delivery', desc: 'Get your groceries in under 60 minutes in major cities.' },
                { icon: ShieldCheck, title: 'Quality Guaranteed', desc: 'Hand-picked fresh produce and authentic branded products.' },
                { icon: Wallet, title: 'Best Prices', desc: 'Direct from farms and wholesalers to save you more.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all">
                  <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-900">Safe & Easy Payments</h2>
                <p className="text-gray-500">We support all major payment methods in Pakistan.</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-gray-400">Cash on Delivery</div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-[#f7941d]">JazzCash</div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-[#37b34a]">Easypaisa</div>
                  <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-blue-600">Visa / Mastercard</div>
                </div>
              </div>
              <div className="shrink-0">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-16">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Ahmed Khan', city: 'Lahore', text: 'The quality of pulses and rice is exceptional. Delivery was right on time!' },
                { name: 'Sana Malik', city: 'Islamabad', text: 'Finally a reliable grocery app in Pakistan. The app is so easy to use.' },
                { name: 'Zainab Bibi', city: 'Karachi', text: 'Love the discounts on monthly bundles. Saves me a lot of money.' }
              ].map((review, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative">
                  <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">Green Basket</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted partner for fresh groceries and daily essentials in Pakistan. Quality you can trust, prices you'll love.
              </p>
              <div className="flex items-center gap-4">
                {['facebook', 'instagram', 'twitter'].map(s => (
                  <div key={s} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                    <span className="capitalize text-xs font-bold">{s[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Shop All</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Special Offers</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Track Order</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Customer Service</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-primary cursor-pointer transition-colors">Shipping Policy</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Refund Policy</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Terms & Conditions</li>
                <li className="hover:text-primary cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>DHA Phase 5, Lahore, Pakistan</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Mon - Sun: 8:00 AM - 10:00 PM</span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>+92 300 1234567</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 Green Basket Pakistan. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group">
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">Order on WhatsApp</span>
      </button>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
      />
    </div>
  );
}
