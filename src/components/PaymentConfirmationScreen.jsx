import React, { useState } from 'react';
import { CreditCard, CheckCircle, Lock, DollarSign } from 'lucide-react';

const PaymentConfirmationScreen = ({ playerName, onProceed, stepLabel }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Get a default name if none is provided
  const displayName = playerName?.trim() || 'User';
  
  // Generate a fake last-4 digits for credit card
  const lastFourDigits = "****";
  
  // Generate a fake verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
  // Generate a fake amount
  const amount = (19.99 + Math.random() * 30).toFixed(2);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="text-green-500 mb-4">
        <CheckCircle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-green-400">Payment Confirmed</h2>
      <p className="text-gray-300 mb-6 text-center">Thank you for your subscription, {displayName}!</p>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 w-full">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <div className="flex items-center">
            <CreditCard size={20} className="text-blue-400 flex-shrink-0" style={{ marginRight: "12px" }} />
            <span className="text-gray-300">Payment Details</span>
          </div>
          <div className="flex items-center">
            <Lock size={16} className="text-green-400 flex-shrink-0" style={{ marginRight: "8px" }} />
            <span className="text-green-400 text-xs">SECURE</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Card Type:</span>
            <span className="text-white">Visa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Card Number:</span>
            <span className="text-white">**** **** **** {lastFourDigits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cardholder:</span>
            <span className="text-white">{displayName.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Amount:</span>
            <span className="text-white font-medium">${amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Transaction ID:</span>
            <span className="text-white font-mono">{verificationCode}</span>
          </div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded text-xs text-gray-400 border-l-2 border-yellow-500">
          <p>Your payment information has been processed and securely stored for your convenience. Future charges may apply based on your subscription status and game progress.</p>
        </div>
      </div>
      
      <div className="flex flex-col w-full max-w-md">
        <button 
          onClick={onProceed}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mb-3 flex items-center justify-center transition-colors"
        >
          <DollarSign size={20} className="flex-shrink-0" style={{ marginRight: "12px" }} />
          {isHovering ? "Confirm & Continue" : "Continue to Game"}
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-4 max-w-sm text-center">
        <p className="mb-2">By proceeding, you agree to our <span className="text-blue-400 cursor-pointer">Terms & Conditions</span>.</p>
        <p className="opacity-60">*Subscription will auto-renew. Cancel anytime. No refunds.</p>
      </div>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default PaymentConfirmationScreen; 