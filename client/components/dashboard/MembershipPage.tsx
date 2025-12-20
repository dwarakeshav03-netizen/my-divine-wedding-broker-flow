
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, CheckCircle, Shield, CreditCard, ChevronDown, Award, X, FileText, Download, Printer, Clock
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import PaymentModal from '../payment/PaymentModal';
import PricingCard, { PlanProps } from '../ui/PricingCard';

const PLANS: PlanProps[] = [
  {
    id: 'gold',
    name: 'Gold',
    price: '₹3,999',
    duration: '3 Months',
    monthly: '₹1,333/mo',
    features: [
       'Send Unlimited Messages', 
       'View 50 Contact Numbers', 
       'Priority Customer Support', 
       'Standout Profile Highlighter',
       'Basic Horoscope Matching'
    ],
    recommended: false
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '₹6,999',
    duration: '6 Months',
    monthly: '₹1,166/mo',
    features: [
       'Everything in Gold Plan', 
       'View 150 Contact Numbers', 
       'Profile Booster (x5 Views)', 
       'Dedicated Relationship Manager', 
       'Detailed Horoscope Reports'
    ],
    recommended: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹10,999',
    duration: '12 Months',
    monthly: '₹916/mo',
    features: [
       'Everything in Diamond Plan', 
       'Unlimited Contact Views', 
       'Top Search Placement', 
       'Background Verification Check', 
       'Personalized Matchmaking'
    ],
    recommended: false
  }
];

const FEATURES_COMPARE = [
  { name: 'Send Messages', free: false, gold: true, diamond: true, platinum: true },
  { name: 'View Contact Numbers', free: '0', gold: '50', diamond: '150', platinum: 'Unlimited' },
  { name: 'Profile Booster', free: false, gold: false, diamond: true, platinum: true },
  { name: 'Horoscope Reports', free: false, gold: true, diamond: true, platinum: true },
  { name: 'Relationship Manager', free: false, gold: false, diamond: true, platinum: true },
  { name: 'Verified Badge', free: true, gold: true, diamond: true, platinum: true },
];

interface MembershipPageProps {
  currentPlan?: string;
  onUpgrade?: (planName: string) => void;
  currentUser?: any;
}

const MembershipPage: React.FC<MembershipPageProps> = ({ currentPlan = 'Free', onUpgrade, currentUser }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanProps | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load transactions from storage on mount
  useEffect(() => {
    if (currentUser) {
      const allTxns = JSON.parse(localStorage.getItem('mdm_transactions') || '[]');
      const userTxns = allTxns.filter((t: any) => t.userId === currentUser.id);
      setTransactions(userTxns);
    }
  }, [currentUser]);

  const handleSelectPlan = (plan: PlanProps) => {
    if (plan.name === currentPlan) return; 
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handleUpgradeSuccess = (method: string) => {
    if (selectedPlan && currentUser) {
       // Create and persist transaction record
       const newTxn = {
          id: `TXN-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name || 'User',
          userAvatar: currentUser.avatar || 'https://ui-avatars.com/api/?name=User&background=random',
          amount: selectedPlan.price,
          plan: selectedPlan.name, // Gold, Diamond, Platinum
          status: 'success', // Lowercase to match Admin Interface expectations
          date: new Date().toLocaleDateString('en-GB'),
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
          method: method
       };
       
       // Save to Global Transaction History for Super Admin
       const existingTxns = JSON.parse(localStorage.getItem('mdm_transactions') || '[]');
       const updatedTxns = [newTxn, ...existingTxns];
       localStorage.setItem('mdm_transactions', JSON.stringify(updatedTxns));
       
       // Update local state to reflect change immediately
       setTransactions(prev => [newTxn, ...prev]);
    }

    if (selectedPlan && onUpgrade) {
      onUpgrade(selectedPlan.name);
    }
    setShowPayment(false);
  };

  const downloadInvoice = (txn: any) => {
      // Simulate Invoice Generation
      const invoiceContent = `
        DIVINE WEDDING - INVOICE
        ------------------------
        Transaction ID: ${txn.id}
        Date: ${txn.date}
        Plan: ${txn.plan}
        Amount: ${txn.amount}
        Payment Method: ${txn.method}
        Status: ${txn.status}
        
        Thank you for your purchase!
      `;
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${txn.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const printInvoice = (txn: any) => {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
          printWindow.document.write('<html><head><title>Invoice</title>');
          printWindow.document.write('</head><body >');
          printWindow.document.write(`<h1>Invoice #${txn.id}</h1>`);
          printWindow.document.write(`<p><strong>Date:</strong> ${txn.date}</p>`);
          printWindow.document.write(`<p><strong>Item:</strong> ${txn.plan}</p>`);
          printWindow.document.write(`<p><strong>Amount:</strong> ${txn.amount}</p>`);
          printWindow.document.write('<hr/>');
          printWindow.document.write('<p>Thank you for choosing Divine Wedding.</p>');
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
      }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Background Particles for Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
         <motion.div animate={{ y: [0, -50, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400 rounded-full opacity-20 blur-[1px]" />
         <motion.div animate={{ y: [0, 60, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-20 blur-[1px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Crown className="text-gold-500 fill-gold-500" size={32} />
            Premium Membership
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
            Unlock exclusive features and accelerate your search for the perfect partner with our tailored plans.
          </p>
        </div>
        
        {/* Current Plan Badge */}
        <div className="px-6 py-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Current Plan</p>
              <p className="text-xl font-bold text-purple-600 dark:text-white capitalize tracking-tight">{currentPlan} Member</p>
           </div>
           <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${currentPlan === 'Free' ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-gold-400 to-orange-500 text-white'}`}>
              <Shield size={24} />
           </div>
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 px-2">
         {PLANS.map((plan, idx) => (
            <PricingCard 
               key={plan.id}
               plan={plan}
               index={idx}
               onSelect={() => handleSelectPlan(plan)}
               isCurrent={plan.name === currentPlan}
            />
         ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden mt-20">
         <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-2">Detailed Comparison</h3>
            <p className="text-gray-500">See exactly what you get with each tier.</p>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
               <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10">
                     <th className="text-left py-6 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Features</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Free</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-amber-600 uppercase tracking-wider">Gold</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-cyan-600 uppercase tracking-wider">Diamond</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Platinum</th>
                  </tr>
               </thead>
               <tbody>
                  {FEATURES_COMPARE.map((row, idx) => (
                     <tr key={idx} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-5 px-6 font-medium text-gray-700 dark:text-gray-300">{row.name}</td>
                        <td className="py-5 px-6 text-center">
                           {row.free === true ? <CheckCircle size={20} className="mx-auto text-green-500" /> : row.free === false ? <X size={20} className="mx-auto text-gray-300 opacity-50" /> : <span className="text-sm font-bold text-gray-500">{row.free}</span>}
                        </td>
                        <td className="py-5 px-6 text-center bg-amber-50/30 dark:bg-amber-900/5 group-hover:bg-amber-50/50 dark:group-hover:bg-amber-900/10 transition-colors">
                           {row.gold === true ? <CheckCircle size={20} className="mx-auto text-amber-500" /> : row.gold === false ? <X size={20} className="mx-auto text-gray-300" /> : <span className="text-sm font-bold text-amber-600">{row.gold}</span>}
                        </td>
                        <td className="py-5 px-6 text-center bg-cyan-50/30 dark:bg-cyan-900/5 group-hover:bg-cyan-50/50 dark:group-hover:bg-cyan-900/10 transition-colors">
                           {row.diamond === true ? <CheckCircle size={20} className="mx-auto text-cyan-500" /> : row.diamond === false ? <X size={20} className="mx-auto text-gray-300" /> : <span className="text-sm font-bold text-cyan-600">{row.diamond}</span>}
                        </td>
                        <td className="py-5 px-6 text-center bg-gray-50/30 dark:bg-white/5 group-hover:bg-gray-100/50 dark:group-hover:bg-white/10 transition-colors">
                           {row.platinum === true ? <CheckCircle size={20} className="mx-auto text-green-500" /> : row.platinum === false ? <X size={20} className="mx-auto text-gray-300" /> : <span className="text-sm font-bold text-gray-900 dark:text-white">{row.platinum}</span>}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden">
         <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-2xl font-bold flex items-center gap-2"><FileText size={24} className="text-purple-600" /> Transaction History</h3>
                <p className="text-sm text-gray-500">Download invoices and view past payments.</p>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-left text-xs font-bold uppercase text-gray-500">
                     <th className="pb-4 pl-4">Date</th>
                     <th className="pb-4">Transaction ID</th>
                     <th className="pb-4">Plan Details</th>
                     <th className="pb-4">Amount</th>
                     <th className="pb-4">Status</th>
                     <th className="pb-4 text-right pr-4">Invoice</th>
                  </tr>
               </thead>
               <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                          <td className="py-4 pl-4 text-sm font-mono text-gray-500">{txn.date}</td>
                          <td className="py-4 text-sm font-bold text-gray-900 dark:text-white">{txn.id}</td>
                          <td className="py-4 text-sm font-medium text-purple-600 dark:text-purple-400">{txn.plan}</td>
                          <td className="py-4 text-sm font-bold">{txn.amount}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                txn.status.toLowerCase() === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                                {txn.status.toLowerCase() === 'success' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {txn.status}
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button onClick={() => printInvoice(txn)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors" title="Print">
                                  <Printer size={16} />
                                </button>
                                <button onClick={() => downloadInvoice(txn)} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold" title="Download">
                                  <Download size={16} /> <span className="hidden md:inline">PDF</span>
                                </button>
                            </div>
                          </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">
                        No transactions found.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
         {showPayment && selectedPlan && (
            <PaymentModal 
               plan={selectedPlan} 
               onClose={() => setShowPayment(false)} 
               onSuccess={handleUpgradeSuccess} 
            />
         )}
      </AnimatePresence>

    </div>
  );
};

export default MembershipPage;
