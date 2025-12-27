
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Zap, CheckCircle2, Mail, 
  Users, Award, ChevronRight, RefreshCw, LogOut, ShieldCheck
} from 'lucide-react';
import { getAllUsers, setProStatus, logout } from '../services/FirebaseService';

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    return {
      total: users.length,
      pro: users.filter(u => u.isPro).length,
      free: users.filter(u => !u.isPro).length
    };
  }, [users]);

  const handleTogglePro = async (uid: string, currentStatus: boolean) => {
    try {
      await setProStatus(uid, !currentStatus);
      setUsers(users.map(u => u.uid === uid ? { ...u, isPro: !currentStatus } : u));
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái Pro.");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'pro' && u.isPro) || 
                          (filter === 'free' && !u.isPro);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 pb-24 animate-in fade-in duration-500">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <ShieldCheck size={120} className="absolute -right-10 -bottom-10 opacity-5 rotate-12" />
        
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-xl active:scale-90 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Admin Console</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">Hệ thống quản trị tập trung</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="p-2 bg-rose-500/20 text-rose-400 rounded-xl active:scale-90 transition-transform">
            <LogOut size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 relative z-10">
          <StatBox label="User" value={stats.total} icon={Users} color="bg-blue-500" />
          <StatBox label="Pro" value={stats.pro} icon={Award} color="bg-amber-500" />
          <StatBox label="Free" value={stats.free} icon={Zap} color="bg-slate-500" />
        </div>
      </div>

      <div className="p-5 space-y-6 -mt-6">
        {/* Search & Filter */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Tìm user theo tên/email..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold shadow-inner outline-none dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <FilterChip active={filter === 'all'} label="Tất cả" onClick={() => setFilter('all')} />
            <FilterChip active={filter === 'pro'} label="Pro" onClick={() => setFilter('pro')} />
            <FilterChip active={filter === 'free'} label="Chờ Active" onClick={() => setFilter('free')} />
            <button onClick={fetchUsers} className="ml-auto p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl active:rotate-180 transition-transform duration-500">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-20 text-center"><RefreshCw size={32} className="animate-spin text-slate-300 mx-auto" /></div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user: any) => (
              <div key={user.uid} className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative">
                    <img src={user.photoURL || 'https://i.pravatar.cc/150'} className="w-12 h-12 rounded-2xl object-cover shadow-md" />
                    {user.isPro && <div className="absolute -top-1 -right-1 bg-amber-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center"><Zap size={8} className="text-white fill-white" /></div>}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase truncate">{user.displayName}</h4>
                    <p className="text-[9px] text-slate-400 font-bold truncate flex items-center gap-1"><Mail size={8}/> {user.email}</p>
                    <p className="text-[8px] text-slate-300 font-medium mt-0.5">ID: {user.uid.slice(0, 8)}...</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${user.isPro ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {user.isPro ? 'Pro Active' : 'Free User'}
                    </span>
                    <button 
                      onClick={() => handleTogglePro(user.uid, user.isPro)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                        user.isPro ? 'bg-rose-50 text-rose-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                      }`}
                    >
                      {user.isPro ? 'Hủy gói' : 'Kích hoạt'}
                    </button>
                  </div>
                  <ChevronRight size={14} className="text-slate-200" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center opacity-30 font-black uppercase text-xs tracking-widest">Không có dữ liệu</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-white/10">
    <Icon size={16} className="text-blue-400 mb-2" />
    <span className="text-lg font-black">{value}</span>
    <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{label}</span>
  </div>
);

const FilterChip = ({ active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border ${
      active 
        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
        : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-700'
    }`}
  >
    {label}
  </button>
);

export default AdminManagement;
