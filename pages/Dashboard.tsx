
import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, AlertCircle, Sparkles, Calendar, ShieldAlert,
  ArrowRight, ClipboardCheck, TrendingUp, Users, Zap, Award, 
  BarChart3, Home, Key, DoorOpen
} from 'lucide-react';
import { getStoredProperties, getStoredOwners, getStoredSchedule } from '../data/mockData';
import { getPropertyAlerts } from '../utils/alertUtils';
import { Property, Owner, ScheduleEvent } from '../types';

const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    const loadAllData = async () => {
      const [p, o, s] = await Promise.all([
        getStoredProperties(),
        getStoredOwners(),
        getStoredSchedule()
      ]);
      setProperties(p);
      setOwners(o);
      setSchedule(s);
    };
    loadAllData();
  }, []);

  const stats = useMemo(() => {
    const rented = properties.filter(p => p.status === 'Rented').length;
    const allAlerts = properties.flatMap(p => getPropertyAlerts(p));
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = schedule.filter(s => s.date === today && !s.isCompleted);

    return {
      total: properties.length,
      owners: owners.length,
      rented: rented,
      available: properties.length - rented,
      allAlerts: allAlerts,
      todayTasks
    };
  }, [properties, owners, schedule]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-700 bg-slate-50 dark:bg-slate-900 min-h-full pb-32">
      {/* Welcome Header */}
      <section className="flex items-center justify-between mt-2 px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 italic tracking-tight">
            Chào {user?.displayName?.split(' ').pop() || 'bạn'}! <Sparkles size={20} className="text-amber-400 animate-pulse" />
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-1 ${user?.isPro ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-200 text-slate-500'}`}>
                {user?.isPro ? <><Award size={10}/> Thành viên Pro</> : <><Zap size={10}/> Gói Cơ bản</>}
             </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 border border-slate-100 dark:border-slate-700 shadow-sm transition-transform active:scale-90">
          <BarChart3 size={24} />
        </div>
      </section>

      {/* Main Property Stats Card */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-blue-200 dark:shadow-none">
        <Building2 size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Tổng số căn hộ</p>
              <h3 className="text-5xl font-black italic leading-none tracking-tighter">{stats.total}</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <Home size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/properties')}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-left active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-2 mb-1">
                <Key size={14} className="text-emerald-300" />
                <p className="text-[9px] font-black uppercase tracking-wider text-white/50">Đã thuê</p>
              </div>
              <p className="text-2xl font-black flex items-baseline gap-1">
                {stats.rented} <span className="text-[10px] font-bold opacity-60">căn</span>
              </p>
            </button>
            <button 
              onClick={() => navigate('/properties')}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-left active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-2 mb-1">
                <DoorOpen size={14} className="text-blue-300" />
                <p className="text-[9px] font-black uppercase tracking-wider text-white/50">Đang trống</p>
              </div>
              <p className="text-2xl font-black flex items-baseline gap-1">
                {stats.available} <span className="text-[10px] font-bold opacity-60">căn</span>
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label="Chủ sở hữu" 
          value={stats.owners} 
          icon={Users} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50 dark:bg-indigo-900/20" 
          onClick={() => navigate('/properties?tab=owners')} 
        />
        <StatCard 
          label="Cần thu phí" 
          value={stats.allAlerts.length} 
          icon={ShieldAlert} 
          color="text-rose-600" 
          bgColor="bg-rose-50 dark:bg-rose-900/20" 
          onClick={() => navigate('/notifications')} 
        />
      </div>

      {/* Recent Alerts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cảnh báo gần đây</h3>
          <button onClick={() => navigate('/notifications')} className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Tất cả</button>
        </div>

        <div className="space-y-3">
          {stats.allAlerts.length > 0 ? stats.allAlerts.slice(0, 3).map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => navigate(`/property/${alert.propertyId}`)}
              className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="mr-3 w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-rose-600 shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <AlertCircle size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{alert.propertyName}</h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium italic">{alert.message}</p>
              </div>
              <ArrowRight size={14} className="text-slate-300 ml-2 group-hover:text-blue-600 transition-colors" />
            </div>
          )) : (
             <div className="py-12 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-3">
                  <ClipboardCheck size={24} className="text-slate-200" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dữ liệu ổn định</p>
             </div>
          )}
        </div>
      </section>

      {/* Bottom Task Shortcut */}
      {stats.todayTasks.length > 0 && (
        <section onClick={() => navigate('/schedule')} className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Việc hôm nay</p>
            <p className="text-sm font-bold mt-0.5 text-slate-800 dark:text-white">Bạn có {stats.todayTasks.length} việc cần xử lý</p>
          </div>
          <ArrowRight size={18} className="text-slate-300" />
        </section>
      )}

      {/* Branding Footer */}
      <footer className="py-8 text-center">
        <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
          RentMaster Pro • DHsystem 2025
        </p>
      </footer>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bgColor, onClick }: any) => (
  <button onClick={onClick} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm text-left active:scale-[0.97] transition-all relative overflow-hidden group w-full">
    <div className={`${bgColor} ${color} w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shrink-0`}>
      <Icon size={20} />
    </div>
    <div className="flex flex-col">
      <div className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter italic">{value}</div>
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-2 whitespace-nowrap">{label}</div>
    </div>
  </button>
);

export default Dashboard;
