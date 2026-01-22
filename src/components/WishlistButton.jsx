import { useState } from 'react';

const WishlistButton = ({ productId, initialLiked = false }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [animating, setAnimating] = useState(false);

    const toggleLike = (e) => {
        e.preventDefault(); // Prevent navigating to product detail if inside a link
        e.stopPropagation();

        setLiked(!liked);
        if (!liked) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), 1000);
        }

        // In a real app, dispatch to Redux/Backend here
        console.log(`Toggled wishlist for product ${productId}: ${!liked}`);
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
            <svg
                className={`w-6 h-6 transition-all duration-300 ${liked ? 'fill-current' : 'fill-none'}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
};

export default WishlistButton;
