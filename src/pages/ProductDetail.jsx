import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import WishlistButton from '../components/WishlistButton';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct: product, loading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, id]);

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

    return (
        <div className="min-h-screen bg-cream dark:bg-[#121212] py-12 transition-colors duration-300">
            <div className="container">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gold mb-8 transition-colors text-sm font-bold uppercase tracking-wider"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Gallery - Sticky on Desktop */}
                    <div className="space-y-4 lg:sticky lg:top-28">
                        <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl bg-white dark:bg-white/5">
                            <img
                                src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute top-4 right-4">
                                <span className="bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-lg block">
                                    <WishlistButton productId={product._id} />
                                </span>
                            </div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative rounded-lg overflow-hidden h-24 border-2 transition-all duration-300 ${selectedImage === index
                                                ? 'border-gold opacity-100 ring-2 ring-gold/20'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={image} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="fade-in-up">
                        <div className="mb-4">
                            <span className="inline-block text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl font-light text-dark">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.ratings?.average > 0 && (
                                    <div className="flex items-center bg-white dark:bg-white/10 px-3 py-1 rounded-full shadow-sm">
                                        <svg className="w-4 h-4 text-gold fill-current mr-1" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                        <span className="text-sm font-bold text-dark">{product.ratings.average.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500 ml-1">({product.ratings.count} reviews)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 dark:bg-white/10 w-full mb-8"></div>

                        <div className="prose prose-lg text-gray-600 dark:text-gray-400 mb-8 font-light">
                            <p>{product.description}</p>
                        </div>

                        <div className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-white/5">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-dark uppercase tracking-wider">Quantity</label>
                                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full h-12">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-dark transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-bold text-dark">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-dark transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className="flex-1 btn btn-primary h-12 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            {addingToCart ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Adding...
                                                </span>
                                            ) : 'Add to Bag'}
                                        </button>
                                    </div>
                                ) : (
                                    <button disabled className="w-full btn bg-gray-200 text-gray-400 cursor-not-allowed">
                                        Notify Me When Available
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-white/10">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Authenticity Guaranteed</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span>Premium Packaging</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
