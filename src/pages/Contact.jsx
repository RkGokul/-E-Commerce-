import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Headphones,
  MessageSquareDot,
} from "lucide-react";
import api from "../utils/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.post("/api/contact", formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
      console.error("Contact form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Header Section */}
      <div className="bg-[#DAA520] py-16 text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-gray-100 max-w-2xl mx-auto px-4 text-lg">
          We'd love to hear from you. Whether you have a question about our products, need assistance with an order, or just want to say hello.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">

          {/* LEFT FORM */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquareDot className="text-[#C9891E]" size={22} />
            <h2 className="text-lg font-semibold font-serif">Send us a Message</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="How can we help?"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold block mb-2">Message *</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full rounded-lg font-bold text-white text-sm py-3 mt-6 bg-[#DAA520] hover:bg-[#C49420] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Sending..." : "Send Message ✈"}
            </button>

            {success && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-4 mt-4">
                <p className="text-green-700 font-medium text-sm">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4 mt-4">
                <p className="text-red-700 font-medium text-sm">✗ {error}</p>
              </div>
            )}
          </form>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* TOP INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={<MapPin className="text-[#C9891E]" size={18} />}
              title="Visit Us"
              lines={["123 Elegance Street", "Mumbai, Maharashtra 400001", "India"]}
            />
            <InfoCard
              icon={<Phone className="text-[#C9891E]" size={18} />}
              title="Call Us"
              lines={["+91 98765 43210", "+91 22 1234 5678"]}
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Mail className="text-[#C9891E]" size={18} />}
                title="Email Us"
                lines={["spajewels.co.@gmail.com"]}
              />
              <InfoCard
                icon={<Clock className="text-[#C9891E]" size={18} />}
                title="Store Hours"
                lines={["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: 11:00 AM - 6:00 PM"]}
              />
            </div>

            {/* SUPPORT CARD */}
            <div className="rounded-xl p-6 text-white bg-gradient-to-r from-[#C18A1C] to-[#9A6311] shadow-lg mt-2\">
            <div className="flex gap-3 mb-2">
              <Headphones size={20} className="mt-1" />
              <div>
                <h3 className="font-serif font-semibold">Need Immediate Help?</h3>
                <p className="text-sm opacity-95">
                  Our support team is ready to assist
                </p>
              </div>
            </div>

            <p className="text-sm opacity-95 mb-3">
              For urgent queries regarding orders, returns, or any assistance, our
              customer support team is available during business hours.
            </p>

            <button className="rounded-md bg-white text-[13px] text-gray-700 px-3 py-1.5 flex gap-1 items-center font-medium">
              <Phone size={14} /> Call: +91 98765 43210
            </button>
            </div>

            {/* MAP BOX */}
            {/* <div className="rounded-xl bg-[#EDE8E4] flex flex-col items-center justify-center py-12 shadow-md border border-gray-300\">
            <MapPin className="text-gray-500 mb-1" size={26} />
            <p className="font-medium text-gray-700 text-sm">Map Location</p>
            <p className="text-xs text-gray-600 mt-1">
              123 Elegance Street, Mumbai
            </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, lines }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-0.5">
    <div className="flex gap-3 items-start">
      <div className="bg-[#C9891E]/10 rounded-md w-10 h-10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-serif font-semibold text-sm mb-1">{title}</h4>
        {lines.map((l, i) => (
          <p key={i} className="text-xs text-gray-600 leading-relaxed">
            {l}
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default Contact;
