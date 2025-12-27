
import React, { useState } from 'react';
import { Building2, ShieldCheck, ArrowRight, LogIn, Globe } from 'lucide-react';
import { loginWithGoogle } from '../services/FirebaseService';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      // App.tsx sẽ tự động nhận diện user qua onAuthStateChanged
    } catch (err: any) {
      setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 transition-colors duration-300 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 py-12 space-y-12 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-12">
            <Building2 size={48} className="text-white -rotate-12" />
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight italic">
            RentMaster <span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium px-4 leading-relaxed uppercase tracking-widest">
            Quản lý bất động sản chuyên nghiệp
          </p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-white font-bold text-lg">Chào mừng quay trở lại</h2>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Đăng nhập để tiếp tục</p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-slate-900 rounded-2xl py-4 font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                  Tiếp tục với Google
                </>
              )}
            </button>

            {error && (
              <p className="text-rose-500 text-[10px] font-bold text-center animate-pulse">{error}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 text-slate-500">
               <div className="h-px w-8 bg-slate-800"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Cam kết bảo mật</span>
               <div className="h-px w-8 bg-slate-800"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
               <div className="bg-slate-800/40 p-3 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                  <ShieldCheck size={16} className="text-blue-500" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">Dữ liệu Local</span>
               </div>
               <div className="bg-slate-800/40 p-3 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                  <Globe size={16} className="text-indigo-500" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">Cloud Sync Auth</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">RentMaster Ecosystem • @2025</p>
      </div>
    </div>
  );
};

export default Login;
