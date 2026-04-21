import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Loader2 } from 'lucide-react';
import { auth } from '../../lib/firebase.ts';

interface PaystackButtonProps {
  amount: number;
  onSuccess?: (reference: string) => void;
  className?: string;
}

export const PaystackButton: React.FC<PaystackButtonProps> = ({ amount, onSuccess, className }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to make a purchase.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: auth.currentUser.email,
          amount,
        }),
      });

      const data = await response.json();
      
      if (data.status && data.data.authorization_url) {
        // Redirect to Paystack's hosted payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while initializing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePayment}
      disabled={loading}
      className={`bg-gold text-white p-6 rounded-2xl flex items-center justify-between shadow-2xl hover:bg-gold/90 transition-all disabled:opacity-50 group border border-white/20 ${className}`}
    >
      <div className="flex flex-col items-start gap-1">
        <span className="text-[10px] uppercase font-black tracking-widest text-forest/40">Powered by Paystack</span>
        <span className="text-xl font-serif tracking-tight font-semibold">
          {loading ? "Preparing Receipt..." : `Unlock Premium Access (₦${amount})`}
        </span>
      </div>
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
      </div>
    </motion.button>
  );
};
