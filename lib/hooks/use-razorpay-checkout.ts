/**
 * Razorpay Checkout Hook
 * Handles Razorpay payment initialization and checkout flow
 */

'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutOptions {
  key_id: string;
  order_id: string;
  amount: number;
  currency?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: Record<string, string>;
  onSuccess: (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onError: (error: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export function useRazorpayCheckout() {
  // Load Razorpay script if not already loaded
  const loadRazorpayScript = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        toast.error('Failed to load Razorpay payment gateway');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }, []);

  // Open Razorpay checkout
  const openCheckout = useCallback(
    async (options: RazorpayCheckoutOptions) => {
      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Razorpay script failed to load');
        }

        if (!window.Razorpay) {
          throw new Error('Razorpay is not available');
        }

        const razorpay = new window.Razorpay({
          key: options.key_id,
          order_id: options.order_id,
          amount: options.amount,
          currency: options.currency || 'INR',
          name: 'CounselMate',
          description: options.notes?.description || 'Service Booking',
          image: '/logo.png',
          prefill: options.prefill || {
            email: options.customer_email,
            contact: options.customer_phone,
          },
          notes: options.notes,
          theme: {
            color: options.theme?.color || '#1f2937',
          },
          handler: (response: any) => {
            options.onSuccess({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              options.onError(new Error('Payment cancelled by user'));
            },
          },
        });

        razorpay.open();
      } catch (error) {
        console.error('Razorpay checkout error:', error);
        options.onError(error);
        toast.error(
          error instanceof Error ? error.message : 'Payment gateway error'
        );
      }
    },
    [loadRazorpayScript]
  );

  return {
    loadRazorpayScript,
    openCheckout,
  };
}
