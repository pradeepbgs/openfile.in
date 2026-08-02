import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { checkoutPage } from "~/service/api";
import { NBCard, nbButtonClass, nbInputClass, nbLabelClass } from "~/components/ui/neobrutal";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    street: "",
    zipcode: "",
    currency: "USD",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      customer: {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
      },
      billing: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
        street: formData.street,
        zipcode: formData.zipcode,
      },
      product_id: import.meta.env.VITE_DODO_PRODUCT_ID,
      line_items: [
        {
          name: "Pro Plan",
          amount: 500,
          currency: formData.currency,
          quantity: 1,
        },
      ],
    };

    try {
      const checkoutUrl = await checkoutPage(payload);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to initiate checkout.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <NBCard color="white" shadow="lg" className="p-8">
          <h2 className="text-2xl font-extrabold text-black text-center mb-6">
            Checkout Information
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className={nbLabelClass}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={nbInputClass}
              />
            </div>

            {/* Name */}
            <div>
              <label className={nbLabelClass}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className={nbInputClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={nbLabelClass}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
                className={nbInputClass}
              />
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={nbLabelClass}>
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  placeholder="123 Main St"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className={nbInputClass}
                />
              </div>

              <div>
                <label className={nbLabelClass}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={nbInputClass}
                />
              </div>

              <div>
                <label className={nbLabelClass}>
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="New Delhi"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={nbInputClass}
                />
              </div>

              <div>
                <label className={nbLabelClass}>
                  Country ( e.g., US or IN )
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="IN"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={nbInputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={nbLabelClass}>
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipcode"
                  placeholder="110001"
                  value={formData.zipcode}
                  onChange={handleChange}
                  required
                  className={nbInputClass}
                />
              </div>

              {/* New currency selection field */}
              <div className="sm:col-span-2">
                <label className={nbLabelClass}>
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className={nbInputClass}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={nbButtonClass({ color: "yellow", className: "w-full mt-4 py-3" })}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </motion.button>
          </form>
        </NBCard>
      </motion.div>
    </div>
  );
}
