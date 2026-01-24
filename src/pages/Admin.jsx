import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Jewellery');
  const [products, setProducts] = useState({ Jewellery: [], Sarees: [], Stationery: [] });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Jewellery',
    stock: '',
    newArrival: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is logged in and is admin - redirect if not
  useEffect(() => {
    if (!token || !user.isAdmin) {
      navigate('/admin');
    }
  }, [token, user.isAdmin, navigate]);

  // Fetch products by category
  useEffect(() => {
    if (token && user.isAdmin) {
      fetchProducts();
    }
  }, [token, user.isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categories = ['Jewellery', 'Sarees', 'Stationery'];
      const allProducts = {};

      for (const cat of categories) {
        const response = await api.get(`/products?category=${cat}`);
        allProducts[cat] = response.data.data || [];
      }

      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login as admin');
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.name || !formData.price || !formData.stock || !formData.description || !formData.image) {
      alert('Please fill all fields including image');
      return;
    }

    // Validate numbers
    const stock = parseInt(formData.stock);
    const price = parseFloat(formData.price);

    if (isNaN(stock) || stock < 0) {
      alert('Stock must be a valid positive number');
      return;
    }

    if (isNaN(price) || price < 0) {
      alert('Price must be a valid positive number');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: activeTab,
      };

      // Set newArrivalDate if newArrival is checked
      if (productData.newArrival) {
        productData.newArrivalDate = new Date();
      } else {
        productData.newArrivalDate = null;
      }

      console.log('Sending product data:', {
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        imageSize: productData.image.length
      });
      console.log('Raw stock value:', formData.stock, 'Type:', typeof formData.stock);

      if (editingId) {
        // Update product
        await api.put(
          `/products/${editingId}`,
          productData
        );
        alert('Product updated successfully!');
      } else {
        // Add new product
        await api.post(
          `/products`,
          productData
        );
        alert('Product added successfully!');
      }

      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Jewellery',
        stock: '',
        newArrival: false,
      });
      setEditingId(null);
      setShowForm(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || error.response?.data?.error || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock,
      newArrival: product.newArrival || false,
    });
    setEditingId(product._id);
    setShowForm(true);
    setActiveTab(product.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      await api.delete(`/products/${productId}`);
      alert('Product deleted successfully!');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: 'Jewellery',
      stock: '',
      newArrival: false,
    });
  };

  const categoryIcons = {
    Jewellery: '💎',
    Sarees: '👗',
    Stationery: '📝',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage products across all categories</p>
          </div>
        </div>

        {/* Category Tabs & Add Button */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          {['Jewellery', 'Sarees', 'Stationery'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === cat
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border-2 border-yellow-200 hover:border-yellow-400'
                }`}
            >
              {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}

          {/* Add Product Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              + Add New Product
            </button>
          )}
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-l-4 border-yellow-500">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="0"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Jewellery">Jewellery</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Stationery">Stationery</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image *</label>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!formData.image}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-image"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 rounded-lg text-slate-700 font-semibold hover:border-yellow-500 hover:text-yellow-600 transition-all shadow-sm"
                    >
                      <span className="text-xl"></span>
                      Choose File
                    </label>
                  </div>

                  {formData.image && (
                    <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
                      <span>✓ Image Selected</span>
                    </div>
                  )}

                  {formData.image && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-600 mb-2">Preview:</p>
                      <img src={formData.image} alt="Preview" className="h-32 w-32 object-cover rounded-lg border-2 border-slate-200" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter product description"
                />
              </div>

              {/* New Arrival Checkbox */}
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-green-500"
                />
                <label className="ml-2 text-sm font-semibold text-slate-700">Mark as New Arrival</label>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Products ({products[activeTab]?.length || 0})
          </h2>

          {loading && <p className="text-center text-slate-600">Loading...</p>}

          {!loading && products[activeTab]?.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No products in this category yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products[activeTab]?.map((product) => (
                <div
                  key={product._id}
                  className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Product')}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-2 truncate">{product.name}</h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-yellow-600">₹{product.price}</span>
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">Stock: {product.stock}</span>
                    </div>
                    {product.isNewArrival && (
                      <p className="text-xs font-semibold text-green-600 mb-3">🆕 New Arrival</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-all text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Admin;
