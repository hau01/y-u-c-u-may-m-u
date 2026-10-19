import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  ChevronDown, 
  Bell, 
  User, 
  Sparkles,
  FileCheck2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenLoginModal,
}) => {
  return (
    <header className="bg-[#122b44] text-white shadow-md sticky top-0 z-40 border-b border-[#1c3d5d]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Left: Logo & Main Navigation */}
          <div className="flex items-center gap-6 shrink-0">
            
            {/* Logo NBT Nha Be Trading */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('sample_approval')}>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline font-black tracking-tighter text-xl leading-none">
                  <span className="text-[#2072b8]">N</span>
                  <span className="text-[#e02020] -ml-0.5">B</span>
                  <span className="text-[#2072b8] -ml-0.5">T</span>
                </div>
                <span className="text-[7px] font-bold text-slate-300 tracking-wider -mt-0.5 uppercase">
                  NHA BE TRADING
                </span>
              </div>
            </div>

            {/* Nav Items matching screenshots */}
            <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
              
              {/* Tổng quan */}
              <button
                type="button"
                onClick={() => setCurrentTab('tong_quan')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === 'tong_quan'
                    ? 'bg-white text-[#122b44] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Tổng quan
              </button>

              {/* Commercial & CRM (Dropdown) */}
              <button
                type="button"
                onClick={() => setCurrentTab('crm')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === 'crm'
                    ? 'bg-white text-[#122b44] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Commercial & CRM</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Mã đơn hàng */}
              <button
                type="button"
                onClick={() => setCurrentTab('ma_don_hang')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === 'ma_don_hang'
                    ? 'bg-white text-[#122b44] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Mã đơn hàng
              </button>

              {/* Nhân sự (Dropdown) */}
              <button
                type="button"
                onClick={() => setCurrentTab('nhan_su')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === 'nhan_su'
                    ? 'bg-white text-[#122b44] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Nhân sự</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Cài đặt */}
              <button
                type="button"
                onClick={() => setCurrentTab('cai_dat')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === 'cai_dat'
                    ? 'bg-white text-[#122b44] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Cài đặt
              </button>

              {/* Sản xuất (Dropdown) */}
              <button
                type="button"
                onClick={() => setCurrentTab('san_xuat')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentTab === 'san_xuat'
                    ? 'bg-white text-[#122b44] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Sản xuất</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* [THE RED BOX ITEM]: Yêu cầu may mẫu */}
              <div className="relative pl-1">
                <button
                  type="button"
                  onClick={() => setCurrentTab('sample_approval')}
                  title="Module phiếu yêu cầu may mẫu (Vị trí ô đỏ bạn yêu cầu)"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ring-2 ring-red-500/80 ${
                    currentTab === 'sample_approval'
                      ? 'bg-white text-[#122b44] font-bold shadow-md'
                      : 'bg-red-950/40 text-white font-medium hover:bg-red-900/60'
                  }`}
                >
                  <FileCheck2 className={`w-3.5 h-3.5 ${currentTab === 'sample_approval' ? 'text-red-600' : 'text-red-400'}`} />
                  <span>Yêu cầu may mẫu</span>
                </button>
              </div>

            </nav>
          </div>

          {/* Right: Notifications, Current User & Logout */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            
            {/* Bell notification */}
            <button 
              type="button"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-1 right-1"></span>
            </button>

            <span className="text-slate-600 font-light hidden sm:inline">|</span>

            {/* User profile matching screenshot: (User icon) Nguyen Le Nhuan Phat [IT] */}
            <div 
              onClick={onOpenLoginModal}
              title="Nhấn để đổi vai trò / xem phân quyền người dùng"
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-200" />
              </div>
              <span className="font-semibold text-slate-100 hidden sm:inline">
                {currentUser.name}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-700/80 text-[10px] font-bold text-slate-300 border border-slate-600">
                {currentUser.department}
              </span>
            </div>

            {/* Đăng xuất / Đổi vai trò */}
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="text-slate-300 hover:text-white hover:underline cursor-pointer font-medium"
            >
              Đăng xuất
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
