import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Download, 
  Copy, 
  Check, 
  Search, 
  FileCode, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  Play, 
  Sparkles, 
  Star, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ChevronLeft, 
  User, 
  Code2, 
  Info, 
  X, 
  Heart, 
  Percent, 
  HelpCircle,
  Clock,
  Wifi,
  Battery,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { flutterSourceCode, FlutterFile } from './data/flutterSourceCode';
import { 
  mockProducts, 
  mockCategories, 
  mockBrands, 
  mockOffers, 
  Product, 
  Category, 
  Brand, 
  Offer 
} from './data/mockProducts';

interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: string;
}

export default function App() {
  // --- Workspace States ---
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'both'>('both');
  const [activeFile, setActiveFile] = useState<string>('lib/main.dart');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [searchCodeQuery, setSearchCodeQuery] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'lib': true,
    'lib/models': true,
    'lib/theme': true,
    'lib/services': true,
    'lib/screens': true,
    'lib/widgets': true,
  });

  // --- Emulator Simulated States ---
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  
  const [selectedMobileTab, setSelectedMobileTab] = useState<number>(0); // 0: Home, 1: Categories, 2: Brands, 3: Offers, 4: Cart
  const [mobileSearch, setMobileSearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  
  // Cart State (React replication)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);
  const [checkoutCompleted, setCheckoutCompleted] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState<number>(0);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 59, seconds: 59 }; // loop
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Helpers for Code Workspace ---
  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // Build files hierarchy dynamically
  const filteredFiles = flutterSourceCode.filter(file => 
    file.path.toLowerCase().includes(searchCodeQuery.toLowerCase()) ||
    file.content.toLowerCase().includes(searchCodeQuery.toLowerCase())
  );

  const getSelectedFileContent = (): string => {
    const file = flutterSourceCode.find(f => f.path === activeFile);
    return file ? file.content : '// Select a file from the explorer tree';
  };

  // --- Emulator Functions ---
  const handleMobileLogin = () => {
    const errors: { email?: string; password?: string } = {};
    if (!loginEmail) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = 'Enter a valid email address';
    }

    if (!loginPassword) {
      errors.password = 'Password is required';
    } else if (loginPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoggingIn(true);
      setTimeout(() => {
        setIsLoggingIn(false);
        setIsLogged(true);
        setSelectedMobileTab(0);
      }, 1500);
    }
  };

  const handleAddToCart = (product: Product, shade?: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && item.selectedShade === shade
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedShade: shade }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number, shade?: string) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedShade === shade)));
    } else {
      setCartItems(prev => prev.map(item => 
        (item.product.id === productId && item.selectedShade === shade) 
          ? { ...item, quantity } 
          : item
      ));
    }
  };

  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const offer = mockOffers.find(o => o.code === cleanCode);
    if (!offer) {
      alert('Coupon code invalid or expired!');
      return;
    }
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
    if (subtotal < offer.minPurchaseAmount) {
      alert(`This coupon requires a minimum purchase of ₹${offer.minPurchaseAmount}!`);
      return;
    }
    setAppliedCoupon(offer);
    setCouponInput('');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shippingCharge = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal - discountAmount + shippingCharge;
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* Dynamic Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
                Purplle Flutter DevStudio
              </h1>
              <span className="bg-purple-900/60 border border-purple-700/50 text-purple-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Material 3
              </span>
            </div>
            <p className="text-xs text-slate-400">Interactive smartphone simulation & complete Dart codebase explorer</p>
          </div>
        </div>

        {/* Workspace Display Filter Modes */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button 
            type="button"
            onClick={() => setActiveTab('emulator')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'emulator' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Live Emulator Only
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('both')}
            className={`hidden md:block px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'both' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Side By Side
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'code' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Flutter Code Explorer
          </button>
        </div>

        {/* Exporter Block */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              // Simulating full directory export trigger
              handleCopyCode(`// Flutter Command Set for Purplle
flutter clean
flutter pub get
flutter run`);
              alert("Flutter project initialization scripts copied to clipboard! You can download the complete workspace as a ZIP using the top-right Settings menu inside the real Google AI Studio build window.");
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-900/10 hover:shadow-purple-500/10 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate Local Script</span>
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: The Smartphone Emulator */}
        {(activeTab === 'emulator' || activeTab === 'both') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-4 xl:col-span-5' : 'lg:col-span-12'} flex flex-col items-center justify-center p-2 rounded-2xl`}>
            
            {/* Phone Emulator Case Wrapper */}
            <div className="relative bg-slate-950 p-4 rounded-[48px] shadow-2xl border-4 border-slate-800 w-[380px] max-w-full aspect-[9/19.5] flex flex-col text-slate-900">
              
              {/* Speaker & Sensor Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-b-2xl z-40 flex items-center justify-center space-x-1.5">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
              </div>

              {/* Real Phone Screen Content Body */}
              <div className="flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative pt-5">
                
                {/* Simulated Phone Status Bar top */}
                <div className="h-6 bg-white px-5 flex items-center justify-between text-[11px] font-bold text-slate-800 select-none z-30 relative shrink-0">
                  <div className="flex items-center space-x-1 text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-900" />
                    <span>09:41 AM</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[9px]">5G</span>
                    <Battery className="w-4 h-4 text-slate-900" />
                  </div>
                </div>

                {/* Smartphone Navigation Router Container */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    
                    {/* PAGE 1: Login Screen */}
                    {!isLogged ? (
                      <motion.div 
                        key="login"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="absolute inset-0 bg-gradient-to-b from-[#6200EE] to-white flex flex-col overflow-y-auto px-6 py-8"
                      >
                        <div className="flex-1 flex flex-col justify-center py-4">
                          {/* Purplle Logo */}
                          <div className="flex flex-col items-center mb-8">
                            <div className="bg-white p-4 rounded-full shadow-lg text-[#6200EE] mb-3">
                              <Sparkles className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white tracking-wide">Purplle</h2>
                            <p className="text-[10px] tracking-widest text-purple-200 uppercase font-semibold">Har Corner Mein Beauty</p>
                          </div>

                          {/* Login Credentials Box */}
                          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-[#2C2438] mb-1">Welcome Back!</h3>
                            <p className="text-xs text-slate-400 mb-6">Sign in to find custom beauty selections</p>

                            <div className="space-y-4">
                              {/* Email */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email ID</label>
                                <input 
                                  type="email" 
                                  placeholder="e.g. user@gmail.com"
                                  value={loginEmail}
                                  onChange={(e) => {
                                    setLoginEmail(e.target.value);
                                    setLoginErrors(prev => ({ ...prev, email: undefined }));
                                  }}
                                  className={`w-full bg-slate-50 border px-4 py-2.5 rounded-xl text-xs placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                                    loginErrors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                                  }`}
                                />
                                {loginErrors.email && (
                                  <p className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {loginErrors.email}
                                  </p>
                                )}
                              </div>

                              {/* Password */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                                <div className="relative">
                                  <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter your password"
                                    value={loginPassword}
                                    onChange={(e) => {
                                      setLoginPassword(e.target.value);
                                      setLoginErrors(prev => ({ ...prev, password: undefined }));
                                    }}
                                    className={`w-full bg-slate-50 border px-4 py-2.5 rounded-xl text-xs placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-600 transition-all pr-10 ${
                                      loginErrors.password ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                                {loginErrors.password && (
                                  <p className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {loginErrors.password}
                                  </p>
                                )}
                              </div>

                              <div className="text-right">
                                <span 
                                  onClick={() => alert("Simulated verify email link fired!")} 
                                  className="text-[11px] font-bold text-[#6200EE] hover:underline cursor-pointer"
                                >
                                  Forgot Password?
                                </span>
                              </div>

                              {/* Submit */}
                              <button
                                type="button"
                                onClick={handleMobileLogin}
                                disabled={isLoggingIn}
                                className="w-full bg-[#6200EE] hover:bg-[#5000C8] text-white py-3 rounded-xl text-xs font-bold tracking-wider hover:shadow-lg hover:shadow-purple-700/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
                              >
                                {isLoggingIn ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <span>LOG IN SECURELY</span>
                                )}
                              </button>
                            </div>

                            <div className="mt-4 text-center">
                              <p className="text-[11px] text-slate-500">
                                Don't have an account?{' '}
                                <span className="font-bold text-[#6200EE] cursor-pointer hover:underline">Sign Up</span>
                              </p>
                            </div>
                          </div>

                          {/* Social login elements */}
                          <div className="mt-8 flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-widest text-[#6200EE]/80 font-bold mb-3">Or Login With</span>
                            <div className="flex space-x-4">
                              <button 
                                type="button"
                                onClick={() => { setLoginEmail('karen@beauty.com'); setLoginPassword('karen123'); }}
                                className="bg-white p-2.5 rounded-full shadow-md text-red-600 border border-slate-100 text-xs font-bold hover:scale-105 transition-all"
                              >
                                Google
                              </button>
                              <button 
                                type="button"
                                onClick={() => { setLoginEmail('sophie@glam.com'); setLoginPassword('sophie123'); }}
                                className="bg-white p-2.5 rounded-full shadow-md text-blue-600 border border-slate-100 text-xs font-bold hover:scale-105 transition-all"
                              >
                                Facebook
                              </button>
                            </div>
                            <span className="text-[9px] text-[#6200EE]/60 mt-4 text-center">Tip: Click social icons to auto-fill mock test details!</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      
                      // LOGGED IN DASHBOARD SHELL
                      <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-50 flex flex-col overflow-hidden"
                      >
                        {/* Nested Screen Header Top */}
                        <header className="h-12 bg-white px-4 border-b border-slate-100 flex items-center justify-between shadow-sm shrink-0">
                          <div className="flex items-center space-x-2 text-[#6200EE]">
                            <Sparkles className="w-5 h-5 text-[#6200EE]" />
                            <span className="font-extrabold text-base tracking-wide text-[#2C2438]">Purplle</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsLogged(false);
                                setLoginEmail('');
                                setLoginPassword('');
                                setCartItems([]);
                                setAppliedCoupon(null);
                              }}
                              className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg"
                            >
                              Logout
                            </button>
                            <div className="relative">
                              <div className="w-7 h-7 bg-[#6200EE] rounded-full text-white font-bold text-xs flex items-center justify-center">
                                U
                              </div>
                            </div>
                          </div>
                        </header>

                        {/* Interactive Screen Scrollable Feed */}
                        <div className="flex-1 overflow-y-auto pb-4">
                          
                          {/* TAB 0: HOME SCREEN */}
                          {selectedMobileTab === 0 && (
                            <div className="space-y-4">
                              {/* Search */}
                              <div className="p-3 bg-white border-b border-slate-100">
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    placeholder="Search cosmetics, primers, lipsticks..."
                                    value={mobileSearch}
                                    onChange={(e) => setMobileSearch(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-8 py-1.5 text-xs outline-none focus:ring-1 focus:ring-purple-600 text-slate-800"
                                  />
                                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                  {mobileSearch && (
                                    <button 
                                      type="button"
                                      onClick={() => setMobileSearch('')} 
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Banners Sweep slider */}
                              <div className="px-3">
                                <div className="bg-gradient-to-r from-purple-800 via-pink-700 to-purple-800 rounded-2xl p-4 text-white relative overflow-hidden shadow-md">
                                  <div className="absolute right-2 bottom-0 w-24 h-24 opacity-25">
                                    <Sparkles className="w-full h-full text-white" />
                                  </div>
                                  <span className="bg-pink-600 text-[8px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full">
                                    GRAND FESTIVAL
                                  </span>
                                  <h4 className="text-sm font-black tracking-normal mt-1 max-w-[200px]">
                                    Monsoon Glow Makeup Mania
                                  </h4>
                                  <p className="text-[10px] text-purple-100 mt-1">UP TO 50% FLAT OFF</p>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMobileTab(3)}
                                    className="mt-3 bg-white text-[#6200EE] text-[9px] font-bold px-3 py-1 rounded-full shadow-sm"
                                  >
                                    Claim Coupon
                                  </button>
                                </div>
                              </div>

                              {/* Quick selection circles concerns */}
                              <div>
                                <h3 className="text-xs font-bold text-[#2C2438] px-3 mb-2 uppercase tracking-wide">
                                  Shop by Concerns
                                </h3>
                                <div className="flex overflow-x-auto px-3 space-x-3 scrollbar-none py-1">
                                  {mockCategories.map((cat) => (
                                    <div 
                                      key={cat.id} 
                                      onClick={() => {
                                        setSelectedCategoryFilter(cat.id);
                                        setSelectedMobileTab(1); // switch to categories tab prefilled
                                      }}
                                      className="flex flex-col items-center space-y-1 cursor-pointer group shrink-0"
                                    >
                                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#EDE7F6] group-hover:border-[#6200EE] transition-all">
                                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                      </div>
                                      <span className="text-[9px] font-medium text-[#2C2438] tracking-tight">{cat.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Best Sellers Grid horizontal */}
                              <div>
                                <div className="px-3 flex items-center justify-between mb-2">
                                  <h3 className="text-xs font-black text-[#2C2438] uppercase tracking-wide">Featured BestSellers</h3>
                                  <span onClick={() => { setSelectedCategoryFilter(null); setSelectedMobileTab(1); }} className="text-[10px] font-bold text-[#6200EE] cursor-pointer hover:underline">See All</span>
                                </div>
                                <div className="flex overflow-x-auto px-3 space-x-3 scrollbar-none py-0.5">
                                  {mockProducts
                                    .filter(p => p.isBestSeller && p.name.toLowerCase().includes(mobileSearch.toLowerCase()))
                                    .map(p => (
                                      <div key={p.id} className="w-[125px] flex-shrink-0 bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                                        <div className="relative cursor-pointer" onClick={() => { setSelectedProduct(p); setSelectedShadeIndex(0); }}>
                                          <img src={p.imageUrl} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
                                          <span className="absolute top-1 left-1 bg-[#FF5722] text-white text-[7px] font-extrabold px-1 py-0.2 rounded">
                                            {(((p.originalPrice - p.discountPrice)/p.originalPrice)*100).toFixed(0)}% OFF
                                          </span>
                                        </div>
                                        <div className="mt-2 flex-grow flex flex-col justify-between">
                                          <div>
                                            <span className="text-[7px] uppercase tracking-wider text-[#6200EE] font-black">{p.brand}</span>
                                            <h4 className="text-[9.5px] font-semibold text-slate-800 line-clamp-2 mt-0.5" onClick={() => { setSelectedProduct(p); setSelectedShadeIndex(0); }}>{p.name}</h4>
                                          </div>
                                          <div className="mt-1">
                                            <div className="flex items-center space-x-0.5 mb-1 text-green-600 text-[8px] font-bold">
                                              <span>{p.rating}</span>
                                              <Star className="w-2.5 h-2.5 fill-current text-green-500" />
                                              <span className="text-slate-400 font-normal">({p.reviewCount})</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <span className="text-[9px] text-slate-400 line-through">₹{p.originalPrice.toFixed(0)}</span>
                                                <p className="text-[11px] font-extrabold text-slate-800 leading-none">₹{p.discountPrice.toFixed(0)}</p>
                                              </div>
                                              <button 
                                                type="button"
                                                onClick={() => handleAddToCart(p)}
                                                className="bg-[#EDE7F6] hover:bg-[#6200EE] text-[#6200EE] hover:text-white p-1 rounded-md transition-all cursor-pointer"
                                              >
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              {/* Recommended Cosmetics */}
                              <div className="px-3">
                                <h3 className="text-xs font-black text-[#2C2438] uppercase tracking-wide mb-3">Recommended For You</h3>
                                <div className="grid grid-cols-2 gap-3 pb-6">
                                  {mockProducts
                                    .slice(6, 12)
                                    .filter(p => p.name.toLowerCase().includes(mobileSearch.toLowerCase()))
                                    .map(p => (
                                      <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                                        <div className="relative cursor-pointer" onClick={() => { setSelectedProduct(p); setSelectedShadeIndex(0); }}>
                                          <img src={p.imageUrl} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
                                        </div>
                                        <div className="mt-2 flex-grow flex flex-col justify-between">
                                          <div>
                                            <span className="text-[7.5px] uppercase tracking-wider text-[#6200EE] font-black">{p.brand}</span>
                                            <h4 className="text-[10px] font-bold text-slate-800 line-clamp-2 mt-0.5">{p.name}</h4>
                                          </div>
                                          <div className="mt-2">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <span className="text-[8.5px] text-slate-400 line-through">₹{p.originalPrice.toFixed(0)}</span>
                                                <p className="text-xs font-extrabold text-slate-800 leading-none">₹{p.discountPrice.toFixed(0)}</p>
                                              </div>
                                              <button 
                                                type="button"
                                                onClick={() => handleAddToCart(p)}
                                                className="bg-[#EDE7F6] hover:bg-[#6200EE] text-[#6200EE] hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                                              >
                                                + Add
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TAB 1: CATEGORIES SCREEN */}
                          {selectedMobileTab === 1 && (
                            <div className="p-3 space-y-3">
                              {/* Category Header */}
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-[#2C2438]">Shop by Categories</h3>
                                {selectedCategoryFilter && (
                                  <button 
                                    type="button"
                                    onClick={() => setSelectedCategoryFilter(null)} 
                                    className="text-[10px] text-red-500 font-bold hover:underline"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {mockCategories.map((cat) => {
                                  const isSelected = selectedCategoryFilter === cat.id;
                                  return (
                                    <div 
                                      key={cat.id}
                                      onClick={() => setSelectedCategoryFilter(prev => prev === cat.id ? null : cat.id)}
                                      className={`border rounded-2xl overflow-hidden cursor-pointer relative group transition-all text-white ${
                                        isSelected ? 'ring-2 ring-purple-600 shadow-md scale-102' : 'border-slate-100 hover:border-purple-300'
                                      }`}
                                    >
                                      <div className="aspect-[4/3] relative">
                                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-all" />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/20 ${isSelected ? 'from-purple-950/90' : ''}`} />
                                      </div>
                                      <div className="absolute bottom-2.5 left-2.5 right-2 text-left">
                                        <h4 className="text-[11.5px] font-extrabold tracking-wide drop-shadow-md uppercase text-white leading-tight">
                                          {cat.name}
                                        </h4>
                                        <span className="text-[8px] text-slate-200 block mt-0.5">Explore deals</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Filtered category results lists */}
                              <div className="pt-3">
                                <h4 className="text-xs font-bold text-slate-800 mb-2.5 border-b pb-1">
                                  {selectedCategoryFilter 
                                    ? `Beauty Products inside ${mockCategories.find(c => c.id === selectedCategoryFilter)?.name}` 
                                    : 'All Category Essentials'}
                                </h4>
                                <div className="space-y-2.5">
                                  {mockProducts
                                    .filter(p => !selectedCategoryFilter || p.categoryId === selectedCategoryFilter)
                                    .map(p => (
                                      <div key={p.id} className="bg-white rounded-xl p-2.5 border border-slate-100 flex items-center space-x-3 hover:shadow-sm transition-all">
                                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                                        <div className="flex-1 min-w-0" onClick={() => { setSelectedProduct(p); setSelectedShadeIndex(0); }}>
                                          <span className="text-[7px] uppercase tracking-wider text-[#6200EE] font-black">{p.brand}</span>
                                          <h5 className="text-[10px] font-bold text-[#2C2438] truncate leading-tight">{p.name}</h5>
                                          <div className="flex items-center space-x-1 mt-0.5 text-[9px]">
                                            <span className="text-slate-400 line-through">₹{p.originalPrice}</span>
                                            <span className="font-extrabold text-slate-800">₹{p.discountPrice}</span>
                                          </div>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => handleAddToCart(p)}
                                          className="bg-[#6200EE] hover:bg-[#5000C8] text-white p-1.5 rounded-lg shrink-0 cursor-pointer"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TAB 2: BRANDS SCREEN */}
                          {selectedMobileTab === 2 && (
                            <div className="p-3 space-y-3">
                              <h3 className="text-sm font-bold text-[#2C2438] mb-2">Shop Premium Beauty Brands</h3>
                              
                              <div className="grid grid-cols-2 gap-3">
                                {mockBrands.map((brand) => {
                                  const isSelected = selectedBrandFilter === brand.id;
                                  return (
                                    <div 
                                      key={brand.id}
                                      onClick={() => setSelectedBrandFilter(prev => prev === brand.id ? null : brand.id)}
                                      className={`border rounded-2xl p-3 bg-white flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                        isSelected ? 'ring-2 ring-purple-600 scale-102 shadow-sm' : 'border-slate-100 hover:border-purple-300'
                                      }`}
                                    >
                                      <div className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-slate-50 border">
                                        <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                                      </div>
                                      <h4 className="text-xs font-bold text-slate-800">{brand.name}</h4>
                                      <p className="text-[8px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                                        {brand.description}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Brand specific catalog */}
                              <div className="pt-3">
                                <h4 className="text-xs font-bold text-slate-800 mb-2 border-b pb-1">
                                  {selectedBrandFilter 
                                    ? `Official Shop: ${mockBrands.find(b => b.id === selectedBrandFilter)?.name}` 
                                    : 'Trending Brand Products'}
                                </h4>
                                <div className="space-y-2.5">
                                  {mockProducts
                                    .filter(p => !selectedBrandFilter || p.brand.toLowerCase() === mockBrands.find(b => b.id === selectedBrandFilter)?.name.toLowerCase())
                                    .map(p => (
                                      <div key={p.id} className="bg-white rounded-xl p-2.5 border border-slate-100 flex items-center space-x-3">
                                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                                        <div className="flex-1 min-w-0" onClick={() => { setSelectedProduct(p); setSelectedShadeIndex(0); }}>
                                          <h5 className="text-[10px] font-bold text-slate-800 truncate leading-none">{p.name}</h5>
                                          <span className="text-[8.5px] font-bold text-green-600 inline-block mt-1">₹{p.discountPrice}</span>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => handleAddToCart(p)}
                                          className="bg-[#6200EE]/10 hover:bg-[#6200EE] text-[#6200EE] hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-black cursor-pointer"
                                        >
                                          + Add
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TAB 3: OFFERS SCREEN */}
                          {selectedMobileTab === 3 && (
                            <div className="p-3 space-y-4">
                              {/* Simulated Countdown */}
                              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 text-center">
                                <span className="text-[8.5px] uppercase font-black tracking-widest text-[#E91E63] text-center block mb-1">
                                  ⚡ Midnight Flash Sale Countdown ⚡
                                </span>
                                <div className="flex justify-center items-center space-x-1.5 text-slate-800 font-extrabold text-lg my-1.5">
                                  <div className="bg-[#E91E63] text-white px-2 py-1 rounded-lg text-xs font-black shadow-sm">
                                    {timeLeft.hours.toString().padStart(2, '0')}
                                  </div>
                                  <span className="text-pink-500 font-black">:</span>
                                  <div className="bg-[#E91E63] text-white px-2 py-1 rounded-lg text-xs font-black shadow-sm">
                                    {timeLeft.minutes.toString().padStart(2, '0')}
                                  </div>
                                  <span className="text-pink-500 font-black">:</span>
                                  <div className="bg-[#E91E63] text-white px-2 py-1 rounded-lg text-xs font-black shadow-sm text-center">
                                    {timeLeft.seconds.toString().padStart(2, '0')}
                                  </div>
                                </div>
                                <p className="text-[9.5px] text-pink-700 font-medium">Extra 15% cashback applied automatically above ₹499!</p>
                              </div>

                              <div className="flex items-center space-x-1">
                                <Percent className="w-4 h-4 text-[#6200EE]" />
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Beauty Coupons</h3>
                              </div>

                              <div className="space-y-3.5">
                                {mockOffers.map((offer) => {
                                  const isCopied = copiedCouponCode === offer.code;
                                  return (
                                    <div key={offer.id} className="bg-white border select-none border-slate-100 hover:border-purple-200 transition-all rounded-2xl p-3 flex items-start space-x-3.5 shadow-sm">
                                      <img src={offer.imageUrl} alt={offer.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                                      <div className="flex-1 min-w-0 text-left">
                                        <h4 className="text-xs font-extrabold text-slate-800 max-w-[170px] truncate leading-tight">{offer.title}</h4>
                                        <p className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-normal">
                                          {offer.description}
                                        </p>
                                        
                                        <div className="mt-3 flex items-center justify-between">
                                          {/* Code tag */}
                                          <div className="bg-purple-50 text-[9px] font-black border border-purple-200/50 text-[#6200EE] px-2 py-0.5 rounded uppercase">
                                            {offer.code}
                                          </div>
                                          
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCopiedCouponCode(offer.code);
                                              navigator.clipboard.writeText(offer.code);
                                              // set a dynamic tip toast
                                              setTimeout(() => setCopiedCouponCode(null), 2000);
                                              // Auto-fill in cart
                                              setCouponInput(offer.code);
                                            }}
                                            className="bg-[#6200EE] hover:bg-[#5000C8] text-white px-3 py-1 rounded text-[8.5px] uppercase font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                                          >
                                            {isCopied ? 'COPIED!' : 'COPY CODE'}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* TAB 4: CART SCREEN */}
                          {selectedMobileTab === 4 && (
                            <div className="p-3 space-y-4">
                              <h3 className="text-sm font-bold text-[#2C2438]">Your Cosmetics Bag</h3>

                              {cartItems.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                  <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
                                  <h4 className="text-xs font-bold text-slate-700">Your bag is empty</h4>
                                  <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Add items from the Home catalog tab to see checkout details!</p>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMobileTab(0)}
                                    className="mt-4 bg-[#6200EE] text-white text-[10px] font-bold px-4 py-1.5 rounded-full"
                                  >
                                    Go Shopping
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {/* List of elements */}
                                  <div className="space-y-2">
                                    {cartItems.map((item) => (
                                      <div key={`${item.product.id}-${item.selectedShade || ''}`} className="bg-white border rounded-xl p-2.5 flex items-center space-x-3 shadow-xs">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                                        <div className="flex-1 min-w-0 text-left">
                                          <span className="text-[7px] uppercase tracking-wider text-[#6200EE] font-black">{item.product.brand}</span>
                                          <h5 className="text-[10.5px] font-bold text-slate-800 truncate leading-none">{item.product.name}</h5>
                                          {item.selectedShade && (
                                            <span className="text-[8px] text-purple-600 font-semibold block mt-0.5">Shade: {item.selectedShade}</span>
                                          )}
                                          <span className="text-[11px] font-extrabold text-slate-800 inline-block mt-1">₹{item.product.discountPrice.toFixed(0)}</span>
                                        </div>
                                        
                                        {/* Row of increments */}
                                        <div className="flex items-center space-x-2 shrink-0">
                                          <button 
                                            type="button"
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedShade)}
                                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-xs"
                                          >
                                            -
                                          </button>
                                          <span className="text-xs font-black text-slate-800">{item.quantity}</span>
                                          <button 
                                            type="button"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedShade)}
                                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-xs"
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Coupon area code */}
                                  <div className="bg-white rounded-xl p-3 border border-slate-150 space-y-2">
                                    <h4 className="text-[10px] font-bold text-slate-600 uppercase">Apply Promo Coupon</h4>
                                    
                                    {appliedCoupon ? (
                                      <div className="bg-green-50 border border-green-150 p-2 rounded-lg flex items-center justify-between text-left">
                                        <div>
                                          <span className="text-[10px] font-bold text-green-700 block">Coupon Code: {appliedCoupon.code}</span>
                                          <span className="text-[8.5px] text-green-600">Saved ₹{discountAmount.toFixed(0)} ({appliedCoupon.discountPercent}% OFF)</span>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => setAppliedCoupon(null)} 
                                          className="text-[9px] font-bold text-red-500 hover:underline hover:scale-105 transition-all text-right uppercase shrink-0"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex space-x-2">
                                        <input 
                                          type="text" 
                                          placeholder="e.g. BEAUTY50"
                                          value={couponInput}
                                          onChange={(e) => setCouponInput(e.target.value)}
                                          className="flex-1 bg-slate-50 border rounded-lg px-2.5 py-1 text-xs outline-none text-slate-800 font-mono uppercase"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleApplyCoupon(couponInput)}
                                          className="bg-[#6200EE] hover:bg-[#5000C8] text-white font-bold text-[9px] px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer"
                                        >
                                          APPLY
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Total Calculations */}
                                  <div className="bg-white rounded-xl p-3 border space-y-2 text-slate-800">
                                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                                      <span>Subtotal</span>
                                      <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                      <div className="flex justify-between items-center text-[11px] text-green-600 font-medium">
                                        <span>Discount Savings ({appliedCoupon?.code})</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                                      <span>Delivery Fee</span>
                                      <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}</span>
                                    </div>
                                    <hr className="border-slate-100" />
                                    <div className="flex justify-between items-center text-xs font-black">
                                      <span>Grand Total</span>
                                      <span className="text-indigo-600">₹{grandTotal.toFixed(2)}</span>
                                    </div>
                                  </div>

                                  {/* Submit button checkout */}
                                  <button
                                    type="button"
                                    onClick={() => setCheckoutCompleted(true)}
                                    className="w-full bg-[#6200EE] hover:bg-[#5000C8] py-3 text-white text-xs font-bold tracking-wider rounded-xl shadow-lg shadow-purple-900/10 active:scale-95 transition-all text-center cursor-pointer"
                                  >
                                    PROCEED TO CHECKOUT
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bottom Navigation bar */}
                        <footer className="h-14 bg-white border-t border-slate-100 flex items-center justify-around text-[10px] text-slate-400 select-none shrink-0 relative">
                          <button
                            type="button"
                            onClick={() => { setSelectedMobileTab(0); }}
                            className={`flex flex-col items-center space-y-0.5 ${selectedMobileTab === 0 ? 'text-[#6200EE] font-black' : 'hover:text-[#6200EE]'}`}
                          >
                            <Smartphone className="w-4 h-4 shrink-0" />
                            <span>Home</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setSelectedMobileTab(1); }}
                            className={`flex flex-col items-center space-y-0.5 ${selectedMobileTab === 1 ? 'text-[#6200EE] font-black' : 'hover:text-[#6200EE]'}`}
                          >
                            <FileCode className="w-4 h-4 shrink-0" />
                            <span>Categories</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => { setSelectedMobileTab(2); }}
                            className={`flex flex-col items-center space-y-0.5 ${selectedMobileTab === 2 ? 'text-[#6200EE] font-black' : 'hover:text-[#6200EE]'}`}
                          >
                            <Info className="w-4 h-4 shrink-0" />
                            <span>Brands</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => { setSelectedMobileTab(3); }}
                            className={`flex flex-col items-center space-y-0.5 ${selectedMobileTab === 3 ? 'text-[#6200EE] font-black' : 'hover:text-[#6200EE]'}`}
                          >
                            <Tag className="w-4 h-4 shrink-0" />
                            <span>Offers</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => { setSelectedMobileTab(4); }}
                            className={`relative flex flex-col items-center space-y-0.5 ${selectedMobileTab === 4 ? 'text-[#6200EE] font-black' : 'hover:text-[#6200EE]'}`}
                          >
                            <ShoppingBag className="w-4 h-4 shrink-0" />
                            {totalCartCount > 0 && (
                              <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white rounded-full text-[7px] font-black w-4 h-4 flex items-center justify-center border border-white">
                                {totalCartCount}
                              </span>
                            )}
                            <span>Cart</span>
                          </button>
                        </footer>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* HIGH-FIDELITY PRODUCT SHEET MODAL DRAWER OVERLAY INSIDE PHONE */}
                  <AnimatePresence>
                    {selectedProduct && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end text-slate-800"
                        onClick={() => setSelectedProduct(null)}
                      >
                        <motion.div
                          initial={{ y: 200 }}
                          animate={{ y: 0 }}
                          exit={{ y: 200 }}
                          className="bg-white rounded-t-3xl max-h-[85%] overflow-y-auto flex flex-col p-5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close bar */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[7.5px] tracking-widest font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                              {selectedProduct.brand}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(null)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-44 object-cover rounded-2xl mb-4" />
                          
                          <h4 className="text-sm font-extrabold text-slate-800 leading-tight mb-1">{selectedProduct.name}</h4>
                          
                          <div className="flex items-center space-x-1 text-[9.5px] font-bold text-green-600 mb-3">
                            <span>{selectedProduct.rating}</span>
                            <Star className="w-3 h-3 fill-current text-green-500 shrink-0" />
                            <span className="text-slate-400 font-normal">({selectedProduct.reviewCount} customer reviews)</span>
                          </div>

                          <div className="flex items-baseline space-x-1.5 mb-4">
                            <span className="text-indigo-600 text-lg font-black">₹{selectedProduct.discountPrice}</span>
                            <span className="text-[10px] text-slate-400 line-through">₹{selectedProduct.originalPrice}</span>
                            <span className="text-[9.5px] text-red-500 font-bold">({(((selectedProduct.originalPrice - selectedProduct.discountPrice)/selectedProduct.originalPrice)*100).toFixed(0)}% OFF)</span>
                          </div>

                          <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Authentic Formula Specs</h5>
                          <p className="text-[10px] text-slate-500 leading-normal mb-5">
                            {selectedProduct.description}
                          </p>

                          {/* Shades Selection list if applicable */}
                          {selectedProduct.shades && selectedProduct.shades.length > 0 && (
                            <div className="mb-5">
                              <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Select Shade Variant</h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.shades.map((shade, idx) => (
                                  <button
                                    type="button"
                                    key={shade}
                                    onClick={() => setSelectedShadeIndex(idx)}
                                    className={`px-3 py-1 text-[9px] font-bold rounded-full border transition-all ${
                                      selectedShadeIndex === idx 
                                        ? 'border-purple-600 bg-purple-50 text-purple-700' 
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                                    }`}
                                  >
                                    {shade}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick delivery terms */}
                          <div className="border-t border-slate-100 pt-3.5 my-4 flex justify-between text-[8px] text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Check className="w-3 h-3 text-green-500" />
                              <span>100% Original</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Check className="w-3 h-3 text-green-500" />
                              <span>Easy 15-day Returns</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Check className="w-3 h-3 text-green-500" />
                              <span>Free Delivery above ₹499</span>
                            </div>
                          </div>

                          {/* Add to Cart button widget */}
                          <button
                            type="button"
                            onClick={() => {
                              handleAddToCart(
                                selectedProduct, 
                                selectedProduct.shades ? selectedProduct.shades[selectedShadeIndex] : undefined
                              );
                              setSelectedProduct(null);
                            }}
                            className="bg-[#6200EE] hover:bg-[#5000C8] text-white py-3 rounded-xl text-xs font-bold leading-none uppercase tracking-wide shadow-md shadow-purple-300 transition-all text-center cursor-pointer"
                          >
                            Add To Bag
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CHECKOUT SUCCESS SHEET OVERLAY */}
                  <AnimatePresence>
                    {checkoutCompleted && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end text-slate-800"
                      >
                        <motion.div
                          initial={{ y: 200 }}
                          animate={{ y: 0 }}
                          exit={{ y: 200 }}
                          className="bg-white rounded-t-3xl p-6 text-center space-y-4"
                        >
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                            ✔
                          </div>
                          <h4 className="text-base font-extrabold text-[#2C2438]">Simulation Complete!</h4>
                          <p className="text-[10px] text-slate-500 leading-normal max-w-[260px] mx-auto">
                            The Flutter e-commerce application successfully processes checkout states, aggregates billing lines, verifies active coupon requirements, and displays Material success overlays.
                          </p>

                          <div className="bg-slate-50 rounded-xl p-3 text-left space-y-1">
                            <h5 className="text-[9.5px] font-bold text-slate-400 uppercase">Order Invoice Summary</h5>
                            <hr className="border-slate-100 my-1" />
                            <div className="flex justify-between items-center text-[10px]">
                              <span>Items count</span>
                              <span className="font-bold text-slate-700">{totalCartCount} products</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span>Total Paid</span>
                              <span className="font-extrabold text-indigo-600">₹{grandTotal.toFixed(2)}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setCartItems([]);
                              setAppliedCoupon(null);
                              setCheckoutCompleted(false);
                              setSelectedMobileTab(0);
                            }}
                            className="w-full bg-[#6200EE] hover:bg-[#5000C8] text-white py-3 rounded-xl text-xs font-bold leading-none uppercase select-none transition-all cursor-pointer"
                          >
                            Close & restart Shop
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Simulated Smartphone Home Indicator Bar bottom */}
                <div className="h-4 bg-white flex items-center justify-center shrink-0">
                  <div className="w-28 h-1 bg-slate-300 rounded-full" />
                </div>

              </div>
            </div>

            {/* Simulated Frame status line */}
            <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Devserver: localhost:3000 • Hot Module Replacement active
            </p>
          </div>
        )}

        {/* RIGHT COMPONENT: Interactive VS Code-like Dart IDE File Explorer */}
        {(activeTab === 'code' || activeTab === 'both') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-8 xl:col-span-7' : 'lg:col-span-12'} bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl h-[700px]`}>
            
            {/* Folder Header ribbon */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2 text-slate-300">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Flutter Workspace (pubspec.yaml + lib/)</span>
              </div>

              {/* Dynamic Code search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search file code..."
                  value={searchCodeQuery}
                  onChange={(e) => setSearchCodeQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[11px] rounded-lg pl-8 pr-3 py-1 outline-none text-slate-300 focus:border-purple-600 w-44"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* File Explorer Tree view Sidebar */}
              <aside className="w-[200px] border-r border-slate-800 bg-slate-950 overflow-y-auto shrink-0 select-none hidden sm:block p-2 text-slate-400 font-mono text-[11px]">
                <div className="mb-2 text-[10px] font-bold text-slate-500 px-2">PROJECT EXPLORER</div>
                
                {/* pubspec.yaml file */}
                <div 
                  onClick={() => setActiveFile('pubspec.yaml')}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                    activeFile === 'pubspec.yaml' ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>pubspec.yaml</span>
                </div>

                {/* lib/ expander */}
                <div className="space-y-0.5 mt-2">
                  <div 
                    onClick={() => toggleFolder('lib')}
                    className="flex items-center space-x-1.5 px-2 py-1.5 hover:bg-slate-900 rounded-lg cursor-pointer text-slate-300"
                  >
                    <ChevronRight className={`w-3 h-3 transition-transform ${expandedFolders['lib'] ? 'rotate-90' : ''}`} />
                    {expandedFolders['lib'] ? <FolderOpen className="w-3.5 h-3.5 text-purple-400" /> : <Folder className="w-3.5 h-3.5 text-purple-400" />}
                    <span className="font-extrabold text-xs">lib</span>
                  </div>

                  {expandedFolders['lib'] && (
                    <div className="pl-4 space-y-0.5">
                      
                      {/* main.dart */}
                      <div 
                        onClick={() => setActiveFile('lib/main.dart')}
                        className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                          activeFile === 'lib/main.dart' ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5 text-pink-400" />
                        <span>main.dart</span>
                      </div>

                      {/* lib/models/ */}
                      <div onClick={() => toggleFolder('lib/models')} className="flex items-center space-x-1 py-1 px-1.5 cursor-pointer text-slate-300">
                        <ChevronRight className={`w-2.5 h-2.5 transition-transform ${expandedFolders['lib/models'] ? 'rotate-90' : ''}`} />
                        <Folder className="w-3.5 h-3.5 text-indigo-400" />
                        <span>models</span>
                      </div>
                      {expandedFolders['lib/models'] && (
                        <div className="pl-5 space-y-0.5">
                          {['brand.dart', 'cart.dart', 'category.dart', 'offer.dart', 'product.dart'].map((file) => {
                            const path = `lib/models/${file}`;
                            return (
                              <div 
                                key={path}
                                onClick={() => setActiveFile(path)}
                                className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg cursor-pointer ${
                                  activeFile === path ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <FileCode className="w-3 h-3 text-cyan-400" />
                                <span>{file}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* lib/theme/ */}
                      <div onClick={() => toggleFolder('lib/theme')} className="flex items-center space-x-1 py-1 px-1.5 cursor-pointer text-slate-300">
                        <ChevronRight className={`w-2.5 h-2.5 transition-transform ${expandedFolders['lib/theme'] ? 'rotate-90' : ''}`} />
                        <Folder className="w-3.5 h-3.5 text-lime-400" />
                        <span>theme</span>
                      </div>
                      {expandedFolders['lib/theme'] && (
                        <div className="pl-5 space-y-0.5">
                          <div 
                            onClick={() => setActiveFile('lib/theme/app_theme.dart')}
                            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg cursor-pointer ${
                              activeFile === 'lib/theme/app_theme.dart' ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <FileCode className="w-3 h-3 text-cyan-400" />
                            <span>app_theme.dart</span>
                          </div>
                        </div>
                      )}

                      {/* lib/services/ */}
                      <div onClick={() => toggleFolder('lib/services')} className="flex items-center space-x-1 py-1 px-1.5 cursor-pointer text-slate-300">
                        <ChevronRight className={`w-2.5 h-2.5 transition-transform ${expandedFolders['lib/services'] ? 'rotate-90' : ''}`} />
                        <Folder className="w-3.5 h-3.5 text-teal-400" />
                        <span>services</span>
                      </div>
                      {expandedFolders['lib/services'] && (
                        <div className="pl-5 space-y-0.5">
                          <div 
                            onClick={() => setActiveFile('lib/services/cart_service.dart')}
                            className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg cursor-pointer ${
                              activeFile === 'lib/services/cart_service.dart' ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <FileCode className="w-3 h-3 text-cyan-400" />
                            <span>cart_service.dart</span>
                          </div>
                        </div>
                      )}

                      {/* lib/widgets/ */}
                      <div onClick={() => toggleFolder('lib/widgets')} className="flex items-center space-x-1 py-1 px-1.5 cursor-pointer text-slate-300">
                        <ChevronRight className={`w-2.5 h-2.5 transition-transform ${expandedFolders['lib/widgets'] ? 'rotate-90' : ''}`} />
                        <Folder className="w-3.5 h-3.5 text-sky-400" />
                        <span>widgets</span>
                      </div>
                      {expandedFolders['lib/widgets'] && (
                        <div className="pl-5 space-y-0.5">
                          {['custom_button.dart', 'custom_textfield.dart', 'product_card.dart'].map((file) => {
                            const path = `lib/widgets/${file}`;
                            return (
                              <div 
                                key={path}
                                onClick={() => setActiveFile(path)}
                                className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg cursor-pointer ${
                                  activeFile === path ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <FileCode className="w-3 h-3 text-cyan-400" />
                                <span>{file}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* lib/screens/ */}
                      <div onClick={() => toggleFolder('lib/screens')} className="flex items-center space-x-1 py-1 px-1.5 cursor-pointer text-slate-300">
                        <ChevronRight className={`w-2.5 h-2.5 transition-transform ${expandedFolders['lib/screens'] ? 'rotate-90' : ''}`} />
                        <Folder className="w-3.5 h-3.5 text-yellow-500" />
                        <span>screens</span>
                      </div>
                      {expandedFolders['lib/screens'] && (
                        <div className="pl-5 space-y-0.5 animate-none">
                          {['login_screen.dart', 'dashboard_screen.dart'].map((file) => {
                            const path = `lib/screens/${file}`;
                            return (
                              <div 
                                key={path}
                                onClick={() => setActiveFile(path)}
                                className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg cursor-pointer ${
                                  activeFile === path ? 'bg-slate-850 text-white font-bold' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <FileCode className="w-3 h-3 text-yellow-400" />
                                <span>{file}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </aside>

              {/* Main IDE editor screen on select panel */}
              <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
                
                {/* Active file breadcrumb line */}
                <div className="bg-slate-950 px-4 py-2 text-slate-500 border-b border-slate-900 flex items-center justify-between text-[11px] font-mono shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400">lib</span>
                    <span>&gt;</span>
                    <span className="text-slate-300">{activeFile}</span>
                  </div>
                  
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyCode(getSelectedFileContent())}
                    className="flex justify-center items-center space-x-1 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-1 rounded-lg cursor-pointer transition-all active:scale-95 text-[11px]"
                  >
                    {copiedFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Actual syntax file viewer line numbers block */}
                <div className="flex-1 overflow-auto p-4 font-mono text-[12px] bg-slate-950 text-slate-300 leading-relaxed flex">
                  
                  {/* Line Numbers column static */}
                  <div className="text-slate-600 select-none text-right pr-4 border-r border-slate-900 h-fit">
                    {getSelectedFileContent().split('\n').map((_, idx) => (
                      <div key={idx} className="w-6 h-5">{idx + 1}</div>
                    ))}
                  </div>

                  {/* Dart highlighted source block representation */}
                  <pre className="flex-1 pl-4 h-fit text-left overflow-x-auto whitespace-pre">
                    {getSelectedFileContent().split('\n').map((line, idx) => {
                      // Basic aesthetic highlight coloring (regex is hard in inline style, we color keywords)
                      const coloredLine = line
                        .replace(/\b(import|class|extends|final|required|this|const|return|void|main|runApp|super|override|static|get|with|ChangeNotifier)\b/g, '<span class="text-pink-400">$1</span>')
                        .replace(/\b(MaterialApp|ThemeData|Theme|GoogleFonts|Colors|BuildContext|WidgetsFlutterBinding|Widget|StatelessWidget|StatefulWidget|State|Container|Text|Icon|AppBar|BottomNavigationBar|ElevatedButton|MaterialPageRoute|Navigator)\b/g, '<span class="text-sky-400">$1</span>')
                        .replace(/('(.*?)'|"(.*?)")/g, '<span class="text-emerald-400">$1</span>')
                        .replace(/(\/\/.*)$/g, '<span class="text-slate-500 font-normal">$1</span>');

                      return (
                        <div 
                          key={idx} 
                          className="h-5" 
                          dangerouslySetInnerHTML={{ __html: coloredLine || '&nbsp;' }} 
                        />
                      );
                    })}
                  </pre>
                </div>
              </div>

            </div>

            {/* Footer Manual Dev Info tabs console */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 text-[11px] font-mono flex items-center justify-between text-slate-400 shrink-0">
              <span className="flex items-center space-x-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Compiler Status: Ready</span>
              </span>
              <span>Dart SDK: v3.2.0 stable • Null safety enabled</span>
            </div>

          </div>
        )}

      </main>

      {/* Manual details footer panel for setting up */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-500 text-xs py-8 px-6 mt-12 bg-cover">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-slate-300 text-sm mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Project Structure</span>
            </h4>
            <p className="leading-relaxed">
              This complete Purplle app conforms strictly to <strong>Flutter Clean Architecture</strong>. State resides securely in native ChangeNotifiers bound asynchronously through standard provider protocols. All colors are declared dynamic matching the Purplle corporate core palette.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 text-sm mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>How To Run Locally</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Install the official Flutter SDK on your host system</li>
              <li>Clone/write these Dart files locally inside a blank directory</li>
              <li>Launch <code className="bg-slate-900 px-1 py-0.5 rounded text-pink-400 text-[10.5px]">flutter pub get</code></li>
              <li>Run the debugger or target standard iOS/Android devices</li>
            </ol>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 text-sm mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Developer notes</span>
            </h4>
            <p className="leading-relaxed">
              The dummy datasets have been custom loaded in memory with 21 cosmetics products, 8 categories, 8 cosmetic brand logs, and 10 coupons. If you need SQLite local storage, add the <strong className="text-[#6200EE]">sqflite</strong> package on pubspec.yaml and map standard model serializers.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-slate-900 text-[11px]">
          <p>© 2026 Purplle Flutter DevStudio Applet – Built in senior Flutter development environment preview</p>
        </div>
      </footer>

    </div>
  );
}
