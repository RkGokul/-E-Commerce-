import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import HeroImage from '../assets/hero-jewelry.jpg';
import StationeryImg from '../assets/category-stationery.jpg';
import JewelryImg from '../assets/category-jewelry.jpg';
import SareeImg from '../assets/category-saree.jpg';

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        // Fetch new arrivals (newest first)
        dispatch(fetchNewArrivals());
    }, [dispatch]);

    const categories = [
        {
            id: 1,
            name: 'Jewelry',
            image: JewelryImg,
            link: '/products?category=Jewelry'
        },
        {
            id: 2,
            name: 'Sarees',
            image: SareeImg,
            link: '/products?category=Sarees'
        },
        {
            id: 3,
            name: 'Stationery',
            image: StationeryImg,
            link: '/products?category=Stationery'
        }
    ];

    return (
        <div className="bg-[#F9F5F0]">
            {/* Hero Section */}
            <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={HeroImage}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay */}
                    {/* Bottom fade for elegant transition */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F9F5F0] to-transparent"></div>
                </div>

                {/* Content */}
                <div className="container relative z-10 text-center px-4">
                    <div className="fade-in-up">
                        <span className="block text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-bold mb-4">
                            Discover Sp Jewels
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
                            Timeless Beauty, <br />
                            <span className="text-[#D4AF37]">Crafted for You</span>
                        </h1>
                        <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Explore our curated collection of exquisite jewelry,
                            traditional sarees, and premium stationery that celebrates
                            elegance in every detail.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="px-8 py-3.5 bg-[#D4AF37] text-white font-semibold rounded hover:bg-[#B8860B] transition-all transform hover:-translate-y-1 shadow-lg"
                            >
                                Shop Collection
                            </Link>
                            <Link
                                to="/products?category=Jewelry"
                                className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
                            >
                                View Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop By Category */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold bg-[#D4AF37]/10 px-4 py-1.5 rounded-full mb-4 inline-block">Our Collections</span>
                        <h2 className="text-4xl font-serif mt-4 text-[#2D2424] mb-4">Shop by Category</h2>
                        <p className="text-gray-500 font-light italic">
                            Discover our carefully curated collections, each piece selected for its exceptional quality and timeless appeal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((cat) => (
                            <Link to={cat.link} key={cat.id} className="group cursor-pointer">
                                <div className="h-[400px] rounded-2xl overflow-hidden relative shadow-lg">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-8 left-8">
                                        <h3 className="text-white text-3xl font-serif mb-2">{cat.name}</h3>
                                        <span className="text-gold flex items-center gap-2 text-sm uppercase tracking-wide font-bold group-hover:translate-x-2 transition-transform">
                                            Explore <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </span>
                                    </div>

                                    {/* Icon placeholder (visual flair) */}
                                    <div className="absolute top-6 left-6 text-white/50">
                                        {/* Could add icons here if available based on category */}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals & Trending */}
            <section className="py-16 md:py-24 bg-[#F9F5F0]">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm">
                                Curated Selection
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424] mt-2">
                                New Arrivals & Trending
                            </h2>
                        </div>
                        <Link to="/products" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-[#D4AF37] text-[#2D2424] hover:bg-[#D4AF37] hover:text-white h-10 px-4 py-2 self-start md:self-auto transition-colors">
                            View All Products
                        </Link>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500 font-serif italic text-lg">No products found. Add some to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.slice(0, 4).map((product, index) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
