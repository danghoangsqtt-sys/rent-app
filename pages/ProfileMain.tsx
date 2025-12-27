
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings, ChevronRight, 
  ShieldCheck, HelpCircle, Sparkles, Zap, Award, CreditCard
} from 'lucide-react';
import { getStoredProfile } from '../data/mockData';

const ProfileMain: React.FC<{ user?: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const prof = await getStoredProfile();
      setProfile(prof);
    };
    load();
  }, []);

  const menuItems = [
    { 
      label: 'Thông tin cá nhân', 
      icon: User, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      path: '/profile/info'
    },
    { 
      label: 'Cài đặt ứng dụng', 
      icon: Settings, 
      color: 'text-slate-600 dark:text-slate-300', 
      bg: 'bg-slate-50 dark:bg-slate-700',
      path: '/profile/settings'
    }
  ];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 pb-24 animate-in fade-in duration-500 pt-safe">
      <div className="bg-white dark:bg-slate-800 px-6 pt-12 pb-10 rounded-b-[3.5rem] shadow-sm border-b border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
        <div className="relative group">
          <div className={`w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 shadow-xl group-active:scale-95 transition-transform bg-slate-100 dark:bg-slate-700 ${user?.isPro ? 'border-amber-400' : 'border-white dark:border-slate-600'}`}>
            <img 
              src={user?.photoURL || profile?.photo || 'https://i.pravatar.cc/150?u=manager'} 
              alt={user?.displayName || profile?.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full border-4 shadow-lg flex items-center justify-center text-white ${user?.isPro ? 'bg-amber-500 border-white dark:border-slate-800' : 'bg-slate-400 border-white dark:border-slate-800'}`}>
            {user?.isPro ? <Award size={16} /> : <Zap size={16} />}
          </div>
        </div>
        
        <div className="mt-5 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">{user?.displayName || profile?.name || 'Quản lý viên'}</h2>
            {user?.isPro && <Sparkles size={16} className="text-amber-500" />}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{user?.email || 'Cloud Protected'}</p>
        </div>
        
        <div className="mt-6 flex gap-2">
          {user?.isPro ? (
            <div className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-amber-200 dark:shadow-none flex items-center gap-2">
              <Award size={12} className="fill-white" /> Thành viên PRO
            </div>
          ) : (
            <div className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              <Zap size={12} /> Gói FREE
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Subscription Promotion for Free Users */}
        {!user?.isPro && (
          <button 
            onClick={() => navigate('/profile/pro')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-200 dark:shadow-none flex items-center justify-between group overflow-hidden relative"
          >
            <Sparkles className="absolute -right-2 -top-2 opacity-10 group-hover:scale-150 transition-transform" size={80} />
            <div className="relative z-10 text-left">
              <h4 className="font-black text-sm uppercase italic tracking-tight flex items-center gap-2">
                Nâng cấp RentMaster Pro <Award size={14} className="text-amber-400" />
              </h4>
              <p className="text-[10px] font-bold opacity-80 mt-1">Mở khóa tính năng quản lý không giới hạn & VIP support</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md">
              <ChevronRight size={20} />
            </div>
          </button>
        )}

        <div className="grid grid-cols-1 gap-4">
          {user?.isPro && (
            <button 
              onClick={() => navigate('/profile/pro')}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900/30 rounded-[1.75rem] shadow-sm hover:bg-amber-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
                  <CreditCard size={20} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Thông tin gói PRO</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.75rem] shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all group relative"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 ${item.bg} ${item.color} rounded-2xl`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{item.label}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 italic">Hỗ trợ & Thông tin</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[1.75rem] border border-slate-100 dark:border-slate-700 shadow-sm divide-y divide-slate-50 dark:divide-slate-700 overflow-hidden">
            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <ShieldCheck size={20} />
                <span className="font-bold text-sm">Bảo mật dữ liệu Cloud</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <HelpCircle size={20} />
                <span className="font-bold text-sm">Hướng dẫn sử dụng</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </div>

        <div className="text-center pt-6 pb-4">
          <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
            RentMaster Pro • @2025 DHsystem
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileMain;
