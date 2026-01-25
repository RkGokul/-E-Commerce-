import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch all products with filters and pagination
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.category) queryParams.append('category', params.category);
            if (params.search) queryParams.append('search', params.search);
            if (params.minPrice) queryParams.append('minPrice', params.minPrice);
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
            if (params.sort) queryParams.append('sort', params.sort);
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);

            const response = await api.get(`/products?${queryParams.toString()}`);
            return {
                data: response.data.data,
                totalCount: response.data.totalCount,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                isAppend: params.page > 1
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Fetch new arrivals and trending products (sorted by newest first)
export const fetchNewArrivals = createAsyncThunk(
    'products/fetchNewArrivals',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/products/new-arrivals');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
        }
    }
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

const initialState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    filters: {
        category: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.currentPage = 1; // Reset to page 1 when filters change
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                search: '',
                minPrice: '',
                maxPrice: '',
                sort: 'newest',
            };
            state.currentPage = 1;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.isAppend) {
                    state.products = [...state.products, ...action.payload.data];
                } else {
                    state.products = action.payload.data;
                }
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch new arrivals
            .addCase(fetchNewArrivals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewArrivals.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchNewArrivals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
