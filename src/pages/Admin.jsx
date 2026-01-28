import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('products');
  const [activeCategory, setActiveCategory] = useState('Jewellery');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({ Jewellery: [], Sarees: [], Stationery: [] });
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);

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

  // Authentication Guard
  useEffect(() => {
    if (!token || !user.isAdmin) {
      navigate('/admin');
    }
  }, [token, user.isAdmin, navigate]);

  // Initial Data Fetch based on active section
  useEffect(() => {
    if (token && user.isAdmin) {
      fetchSectionData();
    }
  }, [activeSection, activeCategory, token, user.isAdmin]);

  const fetchSectionData = async () => {
    setLoading(true);
    try {
      switch (activeSection) {
        case 'products':
          await fetchProducts();
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'carts':
          await fetchCarts();
          break;
        case 'orders':
          await fetchOrders();
          break;
        case 'contacts':
          await fetchContacts();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeSection}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const response = await api.get(`/products?category=${activeCategory}`);
    setProducts(prev => ({
      ...prev,
      [activeCategory]: response.data.data || []
    }));
  };

  const fetchUsers = async () => {
    const response = await api.get('/auth/users');
    console.log('Admin fetchUsers Response:', response.data);
    setUsers(response.data.data || []);
  };

  const fetchCarts = async () => {
    const response = await api.get('/cart/all');
    console.log('Admin fetchCarts Response:', response.data);
    setCarts(response.data.data || []);
  };

  const fetchOrders = async () => {
    const response = await api.get('/orders/all');
    console.log('Admin fetchOrders Response:', response.data);
    setOrders(response.data.data || []);
  };

  const fetchContacts = async () => {
    const response = await api.get('/contact');
    console.log('Admin fetchContacts Response:', response.data);
    setContacts(response.data.data || []);
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
        await api.put(`/products/${editingId}`, productData);
        alert('Product updated successfully!');
      } else {
        await api.post('/products', productData);
        alert('Product added successfully!');
      }

      setEditingId(null);
      setShowForm(false);
      setFormData({ name: '', price: '', description: '', image: '', category: activeCategory, stock: '', newArrival: false });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const sidebarItems = [
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'carts', label: 'Carts', icon: '🛒' },
    { id: 'orders', label: 'Orders', icon: '📜' },
    { id: 'contacts', label: 'Contacts', icon: '📧' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-red-100 text-black  fixed h-full shadow-2xl transition-all duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-yellow-500">Admin Pro</h1>
          <p className="text-gray-600 text-xs mt-1 uppercase tracking-widest font-semibold">Management Console</p>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setShowForm(false);
              }}
              className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-all group ${activeSection === item.id
                ? 'bg-yellow-600 text-white border-r-4 border-yellow-300'
                : 'text-black hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span className="text-xl mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-slate-800 capitalize">
            {activeSection} Management
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full uppercase tracking-tighter">
              Admin: {user.name}
            </span>
            <button
              onClick={() => { localStorage.clear(); navigate('/admin'); }}
              className="text-sm text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Section Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Products View */}
          {activeSection === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['Jewellery', 'Sarees', 'Stationery'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-white text-yellow-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  {showForm ? 'Cancel' : '+ New Product'}
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleAddProduct} className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-400 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-400 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-400 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Product Image</label>
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="admin-image-upload"
                        />
                        <label
                          htmlFor="admin-image-upload"
                          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all cursor-pointer group"
                        >
                          <span className="text-slate-500 group-hover:text-yellow-600 font-medium">
                            {formData.image ? 'Change Image' : 'Click to upload image'}
                          </span>
                        </label>
                      </div>
                      {formData.image && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-400 outline-none" />
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <input type="checkbox" name="newArrival" checked={formData.newArrival} onChange={handleInputChange} className="w-4 h-4 accent-yellow-600" />
                    <label className="text-sm font-semibold text-slate-700">Mark as New Arrival</label>
                  </div>
                  <button type="submit" className="col-span-2 bg-yellow-600 text-white py-4 rounded-xl font-bold hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-600/20">
                    {editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products[activeCategory]?.map(product => (
                  <div key={product._id} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200 transition-all">
                    <img src={product.image} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                    <div className="p-5">
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{product.name}</h4>
                      <p className="text-yellow-600 font-bold mb-4">₹{product.price}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingId(product._id); setFormData(product); setShowForm(true); }}
                          className="flex-1 py-2 text-sm font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 py-2 text-sm font-bold text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users View */}
          {activeSection === 'users' && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Phone</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4 text-slate-600">{u.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {u.isAdmin ? 'ADMIN' : 'USER'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Carts View as folders */}
          {activeSection === 'carts' && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {carts.map(cart => (
                  <div key={cart._id} className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl hover:shadow-md transition-all group">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📁</div>
                    <h4 className="font-bold text-emerald-900 truncate">{cart.user?.name || 'Guest'}</h4>
                    <p className="text-xs text-emerald-700 font-semibold mb-3">{cart.items.length} Items in cart</p>
                    <div className="text-xs text-emerald-600">
                      {cart.items.slice(0, 2).map((item, i) => (
                        <p key={i} className="truncate">• {item.product?.name || 'Product'}</p>
                      ))}
                      {cart.items.length > 2 && <p>+ {cart.items.length - 2} more</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeSection === 'orders' && (
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">#{o._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{o.user?.name}</td>
                      <td className="px-6 py-4 font-bold text-yellow-700">₹{o.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Contacts View */}
          {activeSection === 'contacts' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {contacts.map(c => (
                <div key={c._id} className="p-6 border border-slate-200 rounded-2xl relative group bg-white hover:border-yellow-400 transition-all">
                  <div className="absolute top-6 right-6 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[10px] font-black uppercase">NEW</div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                      {c.name ? c.name[0].toUpperCase() : '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-none">{c.name || 'Anonymous'}</h4>
                      <span className="text-xs text-slate-500">{c.email}</span>
                    </div>
                  </div>
                  <h5 className="font-bold text-sm text-slate-700 mb-2">{c.subject}</h5>
                  <p className="text-sm text-slate-600 italic">"{c.message}"</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(c.createdAt).toLocaleString()}</span>
                    <button className="text-xs font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-widest">Reply →</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="p-20 text-center">
              <div className="animate-spin text-4xl mb-4">🌀</div>
              <p className="font-serif italic text-slate-500">Retrieving secure data...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
