
import React from 'react';
import { Shield, Lock, Globe, AlertTriangle, UserX, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_SECURITY_EVENTS } from '../../utils/adminData';

const SecurityMonitor: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
       
       <div className="bg-[#151621] p-6 rounded-[2rem] border border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
             <Shield className="text-green-500" /> Security Monitor
          </h2>
          
<<<<<<< HEAD
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
=======
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
             <div className="p-4 bg-[#0b0c15] rounded-xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-lg"><AlertTriangle size={24} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Failed Logins (24h)</p>
                   <p className="text-2xl font-bold text-white">12</p>
                </div>
             </div>
             <div className="p-4 bg-[#0b0c15] rounded-xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Globe size={24} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Active Regions</p>
                   <p className="text-2xl font-bold text-white">4</p>
                </div>
             </div>
             <div className="p-4 bg-[#0b0c15] rounded-xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg"><UserX size={24} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Blocked IPs</p>
                   <p className="text-2xl font-bold text-white">8</p>
                </div>
             </div>
          </div>
       </div>

<<<<<<< HEAD
       <div className="flex-1 bg-[#151621] rounded-[2rem] border border-white/5 p-6 overflow-hidden flex flex-col min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-4">Live Security Feed</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
             {MOCK_SECURITY_EVENTS.map(event => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0b0c15] rounded-xl border border-white/5 hover:border-white/10 transition-colors group gap-2">
=======
       <div className="flex-1 bg-[#151621] rounded-[2rem] border border-white/5 p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Live Security Feed</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
             {MOCK_SECURITY_EVENTS.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-[#0b0c15] rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${event.status === 'Safe' ? 'bg-green-500/10 text-green-500' : event.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                         {event.status === 'Safe' ? <CheckCircle size={16} /> : event.status === 'Critical' ? <XCircle size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-200">{event.type}</p>
                         <p className="text-xs text-gray-500">{event.user} • {event.ip}</p>
                      </div>
                   </div>
<<<<<<< HEAD
                   <div className="text-left sm:text-right pl-12 sm:pl-0">
=======
                   <div className="text-right">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
                      <p className="text-xs font-mono text-gray-400">{event.timestamp}</p>
                      <p className="text-[10px] text-gray-600">{event.location}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>

    </div>
  );
};

export default SecurityMonitor;
