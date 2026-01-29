import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { CreditCard, Wallet, Truck, MapPin, Phone, User, Globe, Mail } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        paymentMethod: 'COD',
        // cardName: '',
        // cardNumber: '',
        // expiry: '',
        // cvv: '',
        // upiId: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                shippingAddress: {
                    name: formData.name,
                    phone: formData.phone,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country,
                },
                paymentMethod: formData.paymentMethod,
            };

            await api.post('/orders', orderData);
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!items || items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F9F5F0] py-12">
            <div className="container max-w-6xl">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-1.5 bg-gold rounded-full"></div>
                    <h1 className="text-4xl font-serif font-bold text-dark">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit} className="card-elegance p-8 space-y-8">
                            {/* Shipping section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gold/10 rounded-lg">
                                        <Truck className="text-gold" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-dark">Shipping Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="label-premium">Full Name *</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <User size={16} />
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your full name"
                                                className="input-premium input-with-icon"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="label-premium">Phone Number *</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Phone size={16} />
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your phone number"
                                                className="input-premium input-with-icon"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="label-premium">Street Address *</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-400">
                                                <MapPin size={16} />
                                            </span>
                                            <textarea
                                                name="street"
                                                value={formData.street}
                                                onChange={handleChange}
                                                required
                                                rows="2"
                                                placeholder="House no, Building, Area"
                                                className="input-premium input-with-icon pt-2.5 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="label-premium">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="City"
                                            className="input-premium"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="label-premium">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            placeholder="State"
                                            className="input-premium"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="label-premium">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            placeholder="6-digit pincode"
                                            className="input-premium"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="label-premium">Country *</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Globe size={16} />
                                            </span>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                required
                                                className="input-premium input-with-icon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Payment section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gold/10 rounded-lg">
                                        <Wallet className="text-gold" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-dark">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    {[
                                        { id: 'COD', label: 'Cash on Delivery', icon: Truck },
                                        // { id: 'Card', label: 'Credit/Debit Card', icon: CreditCard },
                                        // { id: 'UPI', label: 'UPI / GPay', icon: Wallet },
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === method.id
                                                ? 'border-gold bg-gold/5 ring-1 ring-gold'
                                                : 'border-gray-100 hover:border-gold/30'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={formData.paymentMethod === method.id}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <method.icon className={formData.paymentMethod === method.id ? 'text-gold' : 'text-gray-400'} size={24} />
                                            <span className={`text-xs font-bold mt-2 text-center uppercase tracking-wider ${formData.paymentMethod === method.id ? 'text-gold' : 'text-gray-600'}`}>
                                                {method.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Dynamic Payment Fields */}
                                {/* {formData.paymentMethod === 'Card' && (
                                    <div className="space-y-4 p-6 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-1">
                                            <label className="label-premium text-[10px]">Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                placeholder="As shown on card"
                                                className="input-premium"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="label-premium text-[10px]">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                className="input-premium"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="label-premium text-[10px]">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    placeholder="MM/YY"
                                                    className="input-premium"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="label-premium text-[10px]">CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    placeholder="123"
                                                    className="input-premium"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )} */}

                                {/* {formData.paymentMethod === 'UPI' && (
                                    <div className="p-6 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-1">
                                            <label className="label-premium text-[10px]">UPI ID</label>
                                            <input
                                                type="text"
                                                name="upiId"
                                                placeholder="username@okaxis"
                                                className="input-premium"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-2 italic">
                                            * You will need to approve the payment in your UPI app.
                                        </p>
                                    </div>
                                )} */}
                            </section>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black w-full text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-hover transition-all shadow-xl shadow-gold/20 disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#2D2424]/30 border-t-[#2D2424] rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Confirm Order</span>
                                        <span>₹{calculateTotal().toLocaleString()}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card-elegance overflow-hidden sticky top-28\">
                            <div className="bg-dark p-6">
                                <h2 className="text-xl font-serif font-bold text-gold">Order Summary</h2>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar\">
                                    {items.map((item) => (
                                        <div key={item.product?._id} className="flex gap-4 group">
                                            <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                <img
                                                    src={item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/60'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-dark truncate">{item.product?.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                                                    <span className="text-sm font-bold text-dark">
                                                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-dark">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Shipping</span>
                                        <span className="font-bold text-green-600">FREE</span>
                                    </div>
                                    <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                                        <span className="text-lg font-serif font-bold text-dark">Total</span>
                                        <span className="text-2xl font-bold text-gold">
                                            ₹{calculateTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gold/5 border border-gold/10 rounded-xl p-4 flex gap-3\">
                                    <div className="text-gold mt-0.5">
                                        <svg size={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                                        Secure payment checkout. Your data is protected by industry standard encryption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
