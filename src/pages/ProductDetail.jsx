import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import WishlistButton from '../components/WishlistButton';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronLeft, Minus, Plus, Star, Check } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct: product, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (product?.category) {
            const fetchRelated = async () => {
                try {
                    const response = await api.get(`/products?category=${product.category}&limit=5`);
                    // Filter out current product and take only first 4
                    const filtered = response.data.data
                        .filter(p => p._id !== product._id)
                        .slice(0, 4);
                    setRelatedProducts(filtered);
                } catch (error) {
                    console.error('Failed to fetch related products', error);
                }
            };
            fetchRelated();
        }
    }, [product]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(0);
        }
    }, [product]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        try {
            await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
            alert('Product added to cart!');
        } catch (error) {
            alert(error || 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-cream dark:bg-black/90">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-cream dark:bg-black/90">
                <p className="text-gray-500 text-lg">Product not found</p>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="min-h-screen bg-[#F9F5F0] py-8 md:py-12">
            <div className="container mx-auto px-4">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center text-gray-500 hover:text-gold mb-8 transition-colors text-sm font-medium"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Shop
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-white shadow-sm">
                            <img
                                src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="inline-block bg-[#FEF9EC] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 tracking-tight">
                                {product.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-gold">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(product.ratings?.average || 0) ? 'fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400">
                                    {product.ratings?.average || 0} ({product.ratings?.count || 0} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                        <span className="bg-[#411516] text-[#E7C5C6] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Features */}
                            {product.features?.length > 0 && (
                                <div className="mb-10">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Features</h4>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-600">
                                                <span className="text-gold mr-3">×</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center border border-gray-200 rounded-lg h-12">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-900"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-900"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.stock === 0}
                                    className="flex-1 bg-black hover:bg-gold-hover text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <ShoppingBag className="w-5 h-5 " />
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>

                                <div className=" hover:bg-gray-50 transition-colors">
                                    <WishlistButton product={product} />
                                </div>
                            </div>

                            {/* Shipping info blocks */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#FEF9EC] p-4 rounded-xl flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-gold mt-0.5" />
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-900">Free Shipping</h5>
                                        <p className="text-[10px] text-gray-500">On orders above ₹999</p>
                                    </div>
                                </div>
                                <div className="bg-[#FEF9EC] p-4 rounded-xl flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-gold mt-0.5" />
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-900">Secure Payment</h5>
                                        <p className="text-[10px] text-gray-500">100% protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-serif text-gray-900 mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(item => (
                                <ProductCard key={item._id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
