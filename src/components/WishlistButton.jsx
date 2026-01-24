import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart } from 'lucide-react';

const WishlistButton = ({ product }) => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.wishlist.items);
    const liked = items.some(item => item._id === product._id);
    const [animating, setAnimating] = useState(false);

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(toggleWishlist(product));

        if (!liked) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), 1000);
        }
    };

    return (
        <button
            onClick={toggleLike}
            className={`
                w-10 h-10 rounded-full flex items-center justify-center 
                transition-all duration-300 shadow-sm
                ${liked ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}
                ${animating ? 'heart-pulse' : ''}
            `}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`w-5 h-5 transition-all duration-300 ${liked ? 'fill-current' : ''}`}
                strokeWidth={liked ? 0 : 2}
            />
        </button>
    );
};

export default WishlistButton;
