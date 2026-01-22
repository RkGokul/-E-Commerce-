import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const { products } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const recognitionRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setVoiceSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event) => {
                let voiceText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    voiceText += event.results[i][0].transcript;
                }
                setSearchQuery(voiceText.trim());
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const startVoiceSearch = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    };

    const stopVoiceSearch = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    // Live search as user types
    useEffect(() => {
        if (searchQuery.trim()) {
            dispatch(fetchProducts({ search: searchQuery }));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, dispatch]);

    useEffect(() => {
        setSearchResults(products);
    }, [products]);

    const handleSearchResultClick = (productId) => {
        navigate(`/products/${productId}`);
        setShowSearchModal(false);
        setSearchQuery('');
    };

    const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <header className="nav-clean glass-effect sticky top-0 z-50 transition-all duration-300">
            <div className="container">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/spa-jewels-logo.svg" alt="SPA Jewels" className="h-12 w-12 rounded-full" />
                        <span className="text-2xl font-serif text-gold font-bold tracking-tight">SPA Jewels</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10 md:gap-12">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/products?category=Jewelry" className="nav-link">Jewelry</Link>
                        <Link to="/products?category=Sarees" className="nav-link">Sarees</Link>
                        <Link to="/products?category=Stationery" className="nav-link">Stationery</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </nav>

                    {/* Right side - Icons */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon */}
                        <button
                            onClick={() => setShowSearchModal(true)}
                            className="text-dark hover:text-gold transition-colors"
                            title="Search Products"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* User */}
                        {user ? (
                            <div className="relative group">
                                <button className="text-dark hover:text-gold transition-colors flex items-center gap-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2D2424] rounded-lg shadow-soft py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-gray-100 dark:border-gray-700">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-medium text-dark">{user.name}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-white/5 hover:text-gold transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-dark hover:text-gold transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative text-dark hover:text-gold transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-dark"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Search */}
                {showSearchModal && (
                    <div className="md:hidden py-4 border-t border-gray-100 bg-cream">
                        <form className="px-6 flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 px-4 py-2 rounded-lg border border-gold/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                                autoFocus
                            />
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-700 bg-cream dark:bg-[#1A1A1A] absolute left-0 right-0 shadow-lg">
                        <nav className="flex flex-col space-y-4 px-6">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/products?category=Jewelry" className="nav-link">Jewelry</Link>
                            <Link to="/products?category=Sarees" className="nav-link">Sarees</Link>
                            <Link to="/products?category=Stationery" className="nav-link">Stationery</Link>
                            <Link to="/contact" className="nav-link">Contact</Link>
                            {user ? (
                                <button onClick={handleLogout} className="nav-link text-left text-red-500">Logout</button>
                            ) : (
                                <Link to="/login" className="nav-link">Login</Link>
                            )}
                        </nav>
                    </div>
                )}

                {/* Search Modal Overlay */}
                {showSearchModal && (
                    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
                        <div className="absolute inset-0 flex flex-col pt-20">
                            <div className="bg-white rounded-b-2xl shadow-2xl max-h-[80vh] flex flex-col">
                                {/* Search Input */}
                                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products by name..."
                                            className="flex-1 text-lg px-4 py-3 border border-gray-300 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                                            autoFocus
                                        />
                                        
                                        {/* Voice Search Button */}
                                        {voiceSupported && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => {
                                                        if (isListening) {
                                                            stopVoiceSearch();
                                                        } else {
                                                            startVoiceSearch();
                                                        }
                                                    }}
                                                    className={`p-3 rounded-lg transition-all ${
                                                        isListening
                                                            ? 'bg-red-500 text-white animate-pulse'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                    title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                                        <path d="M17 16.91c-1.48 1.46-3.5 2.36-5.77 2.36-2.26 0-4.29-.9-5.77-2.36l-1.1 1.1c1.86 1.86 4.41 3.01 7.07 3.01 2.66 0 5.21-1.15 7.07-3.01l-1.1-1.1zM19 12h2c0 .91-.24 1.75-.67 2.5l1.42 1.41C23.27 14.27 24 12.74 24 11h2c0 2.13-.84 4.05-2.2 5.44l1.42 1.41c1.63-1.67 2.63-3.98 2.63-6.44H24c0-1.74-.57-3.35-1.54-4.69l1.41-1.41C23.44 6.75 24 8.24 24 10h2c0-2.13-.84-4.05-2.2-5.44L22.38 3.15C23.27 4.27 24 5.68 24 7h2c0-1.74-.57-3.35-1.54-4.69l1.41-1.41zM6 19c.13 0 .26-.02.39-.07C8.88 18.26 11 15.91 11 13v-2h2v2c0 3.53-2.61 6.43-6 6.92V21h3v2H3v-2h3v-2z" />
                                                    </svg>
                                                </button>
                                                {isListening && (
                                                    <div className="absolute top-12 left-0 bg-red-500 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                                                        Listening...
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                setShowSearchModal(false);
                                                setSearchQuery('');
                                                if (isListening) {
                                                    stopVoiceSearch();
                                                }
                                            }}
                                            className="text-2xl text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* Search Results */}
                                <div className="overflow-y-auto p-6 space-y-3">
                                    {searchQuery.trim() === '' ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <p className="text-lg">Start typing to search for products...</p>
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="text-center py-12 text-red-500">
                                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-lg font-semibold">Product is not available</p>
                                            <p className="text-sm mt-1">Try searching with different keywords</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500 px-2">Found {searchResults.length} product(s)</p>
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product._id}
                                                    onClick={() => handleSearchResultClick(product._id)}
                                                    className="w-full text-left p-4 rounded-lg hover:bg-cream hover:shadow-md transition-all border border-transparent hover:border-gold/30 flex items-center gap-4"
                                                >
                                                    {product.images && product.images[0] && (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                                        <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                                        <p className="text-gold font-bold text-lg mt-1">₹{product.price}</p>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
