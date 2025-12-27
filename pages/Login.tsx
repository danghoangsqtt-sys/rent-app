
import React, { useState } from 'react';
import { Building2, ShieldCheck, LogIn, Globe, Sparkles } from 'lucide-react';
import { loginWithGoogle } from '../services/FirebaseService';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi hàm loginWithGoogle đã được export từ service
      await loginWithGoogle();
      // App.tsx sẽ tự động nhận diện thay đổi auth state và điều hướng
    } catch (err: any) {
      console.error("Login component error:", err);
      setError("Không thể đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 py-12 relative z-10">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-12 transition-transform hover:rotate-0 duration-500">
            <Building2 size={56} className="text-white -rotate-12" />
          </div>
        </div>
        
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight italic">
            RentMaster <span className="text-blue-500">Pro</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">
              Real Estate Management
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-white font-bold text-lg">Chào mừng bạn</h2>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">Đăng nhập để quản lý</p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative w-full bg-white text-slate-900 rounded-2xl py-4.5 font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin relative z-10"></div>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5 relative z-10" alt="Google" />
                  <span className="relative z-10">Tiếp tục với Google</span>
                </>
              )}
            </button>

            {error && (
              <p className="mt-4 text-rose-500 text-[10px] font-bold text-center animate-bounce">{error}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="flex items-center gap-4 text-slate-700">
               <div className="h-px w-8 bg-slate-800"></div>
               <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Dữ liệu bảo mật</span>
               <div className="h-px w-8 bg-slate-800"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full">
               <div className="bg-white/5 p-3.5 rounded-2xl flex flex-col items-center gap-2 border border-white/5 backdrop-blur-sm">
                  <ShieldCheck size={18} className="text-blue-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase">Hồ sơ Local</span>
               </div>
               <div className="bg-white/5 p-3.5 rounded-2xl flex flex-col items-center gap-2 border border-white/5 backdrop-blur-sm">
                  <Globe size={18} className="text-indigo-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase">Cloud Auth</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 text-center mt-auto">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">RentMaster Pro • @2025</p>
      </div>
    </div>
  );
};

export default Login;
