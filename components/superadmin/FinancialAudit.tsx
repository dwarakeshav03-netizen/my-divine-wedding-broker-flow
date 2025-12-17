
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { REVENUE_DATA, MOCK_TRANSACTIONS } from '../../utils/adminData';

const FinancialAudit: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
<<<<<<< HEAD
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#151621] p-6 rounded-[2rem] border border-white/5">
=======
       <div className="flex justify-between items-center bg-[#151621] p-6 rounded-[2rem] border border-white/5">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
          <div>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="text-emerald-500" /> Financial Governance
             </h2>
             <p className="text-sm text-gray-500 mt-1">Platform revenue and transaction audit.</p>
          </div>
<<<<<<< HEAD
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold w-full md:w-auto text-center">
=======
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
             Total Revenue: ₹45.2 Lakhs
          </div>
       </div>

<<<<<<< HEAD
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#151621] p-6 rounded-[2rem] border border-white/5 min-h-[300px]">
=======
       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#151621] p-6 rounded-[2rem] border border-white/5">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
             <h3 className="text-lg font-bold text-white mb-4">Revenue Trend (Audit)</h3>
             <div className="h-48 flex items-end justify-between gap-2">
                {REVENUE_DATA.map((d, i) => (
                   <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                      <div className="w-full bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-colors relative" style={{ height: `${(d.revenue / 150) * 100}%` }}>
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100">{d.revenue}k</div>
                      </div>
                      <span className="text-[10px] text-center text-gray-500 uppercase">{d.month}</span>
                   </div>
                ))}
             </div>
          </div>

<<<<<<< HEAD
          <div className="bg-[#151621] p-6 rounded-[2rem] border border-white/5 flex flex-col min-h-[300px]">
             <h3 className="text-lg font-bold text-white mb-4">Transaction Audit Log</h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-64">
=======
          <div className="bg-[#151621] p-6 rounded-[2rem] border border-white/5 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-4">Transaction Audit Log</h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-48">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
                {MOCK_TRANSACTIONS.map(txn => (
                   <div key={txn.id} className="flex justify-between items-center p-3 bg-[#0b0c15] rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/5 rounded-lg text-gray-400"><CreditCard size={14} /></div>
                         <div>
                            <p className="text-xs font-bold text-gray-300">{txn.userName}</p>
                            <p className="text-[10px] text-gray-500">{txn.id}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-bold text-white">{txn.amount}</p>
                         <p className="text-[10px] text-gray-500">{txn.date}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default FinancialAudit;
