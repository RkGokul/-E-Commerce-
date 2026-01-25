import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.wishlist);
    const { user } = useSelector((state) => state.auth);

    const handleRemove = (product) => {
        dispatch(toggleWishlist(product));
        toast.success('Removed from wishlist');
    };

    const handleAddToCart = (product) => {
        if (!user) {
            toast.error('Please login to add to cart');
            return;
        }
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
        toast.success('Added to cart');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8 text-center max-w-md">
                    Explore our collection and save your favorite pieces to find them easily later.
                </p>
                <Link
                    to="/products"
                    className="bg-gold text-white px-8 py-3 rounded-full font-bold hover:bg-gold-hover transition-colors shadow-lg"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="flex items-center gap-4 mb-10">
                <h1 className="text-3xl font-serif font-bold text-gray-900">My Wishlist</h1>
                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-bold">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item._id} className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 hover:shadow-xl transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <Link to={`/products/${item._id}`}>
                                <img
                                    src={item.images?.[0] || item.image || 'https://via.placeholder.com/400x500'}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </Link>
                            <button
                                onClick={() => handleRemove(item)}
                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-md transition-colors"
                                title="Remove from wishlist"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="mb-4">
                                <Link to={`/products/${item._id}`}>
                                    <h3 className="font-bold text-gray-900 hover:text-gold transition-colors line-clamp-1 mb-1">
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-500 line-clamp-1">{item.category}</p>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-lg font-bold text-gold">₹{item.price?.toLocaleString()}</span>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="flex items-center gap-2 bg-dark text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
