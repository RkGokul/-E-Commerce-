import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }) => {
    return (
        <div className="group relative product-card-minimal">
            <div className="product-image-container mb-4 relative">
                <Link to={`/products/${product._id}`}>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400'}
                        alt={product.name}
                        loading="lazy"
                    />
                </Link>

                {/* Overlay Tags */}
                {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-3 left-3 bg-[#411516] text-[#E7C5C6] text-[10px] px-2 py-1 uppercase tracking-wider font-bold z-10 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                )}

                {/* New Arrival Badge */}
                {product.isNewArrival && (
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-[10px] px-2 py-1 uppercase tracking-wider font-bold z-10 rounded">
                        NEW ARRIVAL
                    </span>
                )}

                {/* Wishlist Button */}
                <div className="absolute top-12 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <WishlistButton product={product} />
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-black/10 transition-colors duration-300" />

                <Link
                    to={`/products/${product._id}`}
                    className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md py-3 text-center text-dark text-xs font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-gold hover:text-dark"
                >
                    View Cart
                </Link>
            </div>

            <Link to={`/products/${product._id}`} className="block text-center">
                <p className="text-xs text-gold uppercase tracking-widest font-bold mb-1">
                    {product.category}
                </p>
                <h3 className="text-lg font-serif text-dark mb-1 group-hover:text-gold transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-dark font-bold">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">
                            ₹{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
                {product.ratings?.average > 0 && (
                    <div className="flex items-center justify-center mt-1 text-gold">
                        <span className="text-xs font-bold mr-1">{product.ratings.average.toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400">({product.ratings.count})</span>
                    </div>
                )}
            </Link>
        </div>
    );
};

export default ProductCard;
