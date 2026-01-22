import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, loading, filters } = useSelector((state) => state.products);

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
    });

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            dispatch(setFilters({ category }));
            dispatch(fetchProducts({ category }));
        }
    }, [searchParams, dispatch]);

    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters]);

    const handleFilterChange = (key, value) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        dispatch(setFilters(localFilters));
        dispatch(fetchProducts(localFilters));
    };

    const clearAllFilters = () => {
        const resetFilters = {
            category: '',
            search: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
        };
        setLocalFilters(resetFilters);
        dispatch(setFilters(resetFilters));
        dispatch(fetchProducts(resetFilters));
        setSearchParams({});
    };

    const categories = ['Jewelry', 'Sarees', 'Stationery'];

    return (
        <div className="min-h-screen py-8 bg-[#F9F5F0]">
            <div className="container">
                {/* Header Section */}
               

                {/* Top Controls Bar - Modern Design */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-grow">
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-[#DAA520]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={localFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Search products... (jewelry, sarees, etc.)"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520] focus:ring-opacity-20 transition-all font-sans text-sm hover:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="md:w-56">
                            <div className="relative">
                                <select
                                    value={localFilters.sort}
                                    onChange={(e) => {
                                        handleFilterChange('sort', e.target.value);
                                        setTimeout(() => {
                                            dispatch(setFilters({ sort: e.target.value }));
                                            dispatch(fetchProducts({ ...localFilters, sort: e.target.value }));
                                        }, 0);
                                    }}
                                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520] focus:ring-opacity-20 transition-all font-sans text-sm appearance-none cursor-pointer hover:border-gray-300"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23DAA520' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem' }}
                                >
                                    <option value="newest">🔥 Featured</option>
                                    <option value="newest">✨ Newest Arrivals</option>
                                    <option value="price-asc">📉 Price: Low to High</option>
                                    <option value="price-desc">📈 Price: High to Low</option>
                                    <option value="rating">⭐ Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Filters Toggle Button */}
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                                isFiltersOpen 
                                    ? 'bg-[#DAA520] text-white' 
                                    : 'bg-white text-[#DAA520] border-2 border-[#DAA520] hover:bg-[#DAA520] hover:text-white'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span>{isFiltersOpen ? 'Hide' : 'Show'} Filters</span>
                        </button>
                    </div>

                    {/* Active Filters Display */}
                    
                </div>

                {/* Collapsible Filter Section - Modern Design */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFiltersOpen ? 'max-h-[600px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-gradient-to-br from-white via-[#F9F5F0] to-white p-8 rounded-xl border border-[#DAA520] border-opacity-30 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Categories Filter */}
                            <div className="space-y-4 md:border-r md:border-gray-200 md:pr-8">
                                <div className="flex items-center gap-2 mb-5">
                                    <svg className="w-5 h-5 text-[#DAA520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <h3 className="text-lg font-serif font-bold text-gray-900">Category</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            handleFilterChange('category', '');
                                            setTimeout(() => {
                                                dispatch(setFilters({ category: '' }));
                                                dispatch(fetchProducts({ ...localFilters, category: '' }));
                                            }, 0);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${localFilters.category === '' 
                                            ? 'bg-[#DAA520] text-white shadow-md' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg className={`w-4 h-4 ${localFilters.category === '' ? '' : 'opacity-0'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            All Categories
                                        </span>
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                handleFilterChange('category', cat);
                                                setTimeout(() => {
                                                    dispatch(setFilters({ category: cat }));
                                                    dispatch(fetchProducts({ ...localFilters, category: cat }));
                                                }, 0);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${localFilters.category === cat 
                                                ? 'bg-[#DAA520] text-white shadow-md' 
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <svg className={`w-4 h-4 ${localFilters.category === cat ? '' : 'opacity-0'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {cat}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="space-y-4 md:border-r md:border-gray-200 md:pr-8">
                                <div className="flex items-center gap-2 mb-5">
                                    <svg className="w-5 h-5 text-[#DAA520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-lg font-serif font-bold text-gray-900">Price</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                                        <input
                                            type="number"
                                            value={localFilters.minPrice}
                                            onChange={(e) => {
                                                handleFilterChange('minPrice', e.target.value);
                                                setTimeout(() => {
                                                    dispatch(setFilters({ minPrice: e.target.value }));
                                                    dispatch(fetchProducts({ ...localFilters, minPrice: e.target.value }));
                                                }, 0);
                                            }}
                                            placeholder="₹0"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520] focus:ring-opacity-20 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                                        <input
                                            type="number"
                                            value={localFilters.maxPrice}
                                            onChange={(e) => {
                                                handleFilterChange('maxPrice', e.target.value);
                                                setTimeout(() => {
                                                    dispatch(setFilters({ maxPrice: e.target.value }));
                                                    dispatch(fetchProducts({ ...localFilters, maxPrice: e.target.value }));
                                                }, 0);
                                            }}
                                            placeholder="₹100,000"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520] focus:ring-opacity-20 transition-colors"
                                        />
                                    </div>
                                    {(localFilters.minPrice || localFilters.maxPrice) && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                                            <p className="font-medium">Showing: ₹{localFilters.minPrice || '0'} - ₹{localFilters.maxPrice || '100,000'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {/* <div className="flex flex-col justify-between">
                               
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={applyFilters}
                                        className="w-full px-6 py-3 bg-[#DAA520] text-white font-bold rounded-lg hover:bg-[#B8860B] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full px-6 py-3 bg-white text-gray-700 font-bold rounded-lg border-2 border-gray-300 hover:border-[#DAA520] hover:text-[#DAA520] transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear All
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Product Grid - No changes to grid logic, just removed sidebar wrapper */}
                <div className="mt-12">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-96">
                            <div className="spinner mb-4"></div>
                            <p className="text-gray-500 font-serif">Loading collection...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white shadow-sm p-12 rounded-lg">
                            <h3 className="text-2xl font-serif text-dark mb-4">No products found</h3>
                            <p className="text-gray-500 mb-8">We couldn't find any matches for your filters.</p>
                            <button onClick={clearAllFilters} className="px-8 py-3 bg-dark text-white rounded-lg hover:bg-opacity-90 transition-colors">
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
