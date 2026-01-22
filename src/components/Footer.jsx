import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-luxury">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="text-3xl font-serif text-gold font-bold mb-6 block">Elegance</Link>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Discover the finest collection of traditional and contemporary designs.
                            Each piece is crafted with passion and precision to bring you timeless beauty.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gold font-serif text-lg mb-6">Collections</h4>
                        <ul className="space-y-3 text-sm opacity-90">
                            <li><Link to="/products?category=Jewellery" className="hover:text-gold transition-colors">Jewellery</Link></li>
                            <li><Link to="/products?category=Sarees" className="hover:text-gold transition-colors">Sarees</Link></li>
                            <li><Link to="/products?category=Stationery" className="hover:text-gold transition-colors">Stationery</Link></li>
                            <li><Link to="/products" className="hover:text-gold transition-colors">All Products</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-gold font-serif text-lg mb-6">Support</h4>
                        <ul className="space-y-3 text-sm opacity-90">
                            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
                            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
                            <li><Link to="/shipping" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="hover:text-gold transition-colors">Returns & Exchange</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-gold font-serif text-lg mb-6">Stay Connected</h4>
                        <div className="flex space-x-4 mb-6">
                            <a href="#" className="w-10 h-10 border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </a>
                        </div>
                        <p className="text-sm opacity-80">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 text-center opacity-60 text-sm">
                    <p>&copy; {new Date().getFullYear()} RK ShopHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
