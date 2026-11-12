import React from 'react';
import { User } from '../types';
import { ShieldCheck, LogOut, UserCheck, HelpCircle } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenPublicCheck: () => void;
  onOpenGuide: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenPublicCheck,
  onOpenGuide,
  onOpenLogin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-blue-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              SIM-BANSOS DESA
            </div>
            <div className="text-[11px] text-slate-500 leading-none whitespace-nowrap hidden sm:block">
              Desa Sukamaju · Kec. Kepanjen · Kab. Malang
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation / public links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <button 
            type="button"
            onClick={onOpenPublicCheck}
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Cek NIK Publik</span>
          </button>
          <button 
            type="button"
            onClick={onOpenGuide}
            className="hover:text-blue-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-blue-700 font-semibold cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Skema DB & Panduan</span>
          </button>
        </nav>

        {/* Zone 3: Primary action / Active User profile */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">{user.nama}</div>
                <div className="text-[10px] text-blue-700 font-mono font-semibold tracking-wide">
                  {user.role === 'ADMIN_DESA' ? 'ADMIN / KAUR KESRA' : user.role === 'KEPALA_DESA' ? 'KEPALA DESA' : 'PETUGAS RT/RW'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 text-xs font-bold">
                {user.nama.charAt(0)}
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Keluar dari sistem"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenPublicCheck}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Cek Bantuan Warga
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Masuk Petugas</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
