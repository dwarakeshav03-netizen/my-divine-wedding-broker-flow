
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, Users, Activity, ArrowUpRight, Lock, 
  Server, Database, Globe 
} from 'lucide-react';
import { ADMIN_STATS } from '../../utils/adminData';

interface SuperAdminOverviewProps {
    onChangeView: (view: string) => void;
}

const SuperAdminOverview: React.FC<SuperAdminOverviewProps> = ({ onChangeView }) => {
  return (
    <div className="space-y-8">
       {/* Status Banner */}
       <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-emerald-500/20 rounded-[2rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <ShieldCheck className="text-emerald-500" />
                   <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">System Status: Optimal</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Platform Governance Active</h2>
                <p className="text-gray-400 max-w-xl">
                   All systems are operational. Audit logs are being recorded. No critical security threats detected in the last 24 hours.
                </p>
             </div>
             <div className="flex gap-4">
                <div className="text-center px-6 py-3 bg-[#0b0c15]/50 rounded-2xl border border-white/5 backdrop-blur-md">
                   <p className="text-xs text-gray-500 uppercase font-bold mb-1">Server Uptime</p>
                   <p className="text-xl font-mono text-white font-bold">{ADMIN_STATS.serverHealth}</p>
                </div>
                <div className="text-center px-6 py-3 bg-[#0b0c15]/50 rounded-2xl border border-white/5 backdrop-blur-md">
                   <p className="text-xs text-gray-500 uppercase font-bold mb-1">Active Sessions</p>
                   <p className="text-xl font-mono text-white font-bold">142</p>
                </div>
             </div>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Admins" value="12" subtext="3 Currently Online" icon={<Users size={24} />} color="blue" onClick={() => onChangeView('admins')} />
          <StatCard title="Security Alerts" value="2" subtext="Low Priority" icon={<AlertTriangle size={24} />} color="amber" onClick={() => {}} />
          <StatCard title="Total Users" value={ADMIN_STATS.totalUsers.toLocaleString()} subtext="+45 Today" icon={<Database size={24} />} color="purple" onClick={() => onChangeView('users')} />
          <StatCard title="Audit Events" value="1.2k" subtext="Last 24 Hours" icon={<Activity size={24} />} color="green" onClick={() => onChangeView('audit')} />
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Activity / System Health */}
          <div className="lg:col-span-2 bg-[#151621] border border-white/5 rounded-[2rem] p-6 shadow-xl">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Server size={18} className="text-purple-500" /> Infrastructure Health
             </h3>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                      <span>Database Load</span>
                      <span>45%</span>
                   </div>
                   <div className="w-full h-1.5 bg-[#0b0c15] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 w-[45%]" />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                      <span>API Latency</span>
                      <span className="text-green-500">42ms</span>
                   </div>
                   <div className="w-full h-1.5 bg-[#0b0c15] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[20%]" />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                      <span>Storage</span>
                      <span>78%</span>
                   </div>
                   <div className="w-full h-1.5 bg-[#0b0c15] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[78%]" />
                   </div>
                </div>
             </div>
             
             <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl flex items-start gap-3">
                <Globe size={20} className="text-blue-400 mt-0.5" />
                <div>
                   <p className="text-xs font-bold text-blue-200">Global Traffic</p>
                   <p className="text-[10px] text-blue-300/70 mt-1">High traffic detected from US region. CDN scaling active.</p>
                </div>
             </div>
          </div>

          {/* Quick Actions (Replacing removed panels) */}
          <div className="bg-[#151621] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between">
             <div>
                <h3 className="text-lg font-bold text-white mb-4">Quick Shortcuts</h3>
                <div className="space-y-3">
                   <button onClick={() => onChangeView('approvals')} className="w-full text-left p-3 rounded-xl bg-[#0b0c15] hover:bg-white/5 transition-colors border border-white/5 text-sm font-bold text-gray-300 flex items-center justify-between group">
                      Review Pending Accounts
                      <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                   <button onClick={() => onChangeView('transactions')} className="w-full text-left p-3 rounded-xl bg-[#0b0c15] hover:bg-white/5 transition-colors border border-white/5 text-sm font-bold text-gray-300 flex items-center justify-between group">
                      Check Transactions
                      <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                   <button onClick={() => onChangeView('audit')} className="w-full text-left p-3 rounded-xl bg-[#0b0c15] hover:bg-white/5 transition-colors border border-white/5 text-sm font-bold text-gray-300 flex items-center justify-between group">
                      View Audit Logs
                      <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
             </div>
             
             <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/5">
                <p className="text-xs text-purple-200 font-bold mb-1">System Version</p>
                <p className="text-[10px] text-gray-400">v2.4.0 (Stable)</p>
             </div>
          </div>

       </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, subtext: string, icon: React.ReactNode, color: string, onClick: () => void }> = ({ title, value, subtext, icon, color, onClick }) => {
   const colors = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
   };

   return (
      <div 
         onClick={onClick}
         className={`p-6 rounded-[2rem] border bg-[#151621] border-white/5 hover:border-white/10 transition-all cursor-pointer group`}
      >
         <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${colors[color as keyof typeof colors]}`}>
               {icon}
            </div>
            <ArrowUpRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
         </div>
         <h3 className="text-3xl font-display font-bold text-white mb-1">{value}</h3>
         <div className="flex justify-between items-end">
            <p className="text-sm text-gray-500">{title}</p>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{subtext}</span>
         </div>
      </div>
   );
};

export default SuperAdminOverview;
