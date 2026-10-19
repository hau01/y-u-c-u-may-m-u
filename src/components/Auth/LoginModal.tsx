import React, { useState } from 'react';
import { X, UserPlus, Check, User, Shield } from 'lucide-react';
import { UserProfile, DepartmentCode, UserRole } from '../../types';
import { MOCK_USERS } from '../../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onAddUser?: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onAddUser,
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Add user form state matching Image 2 & 3
  const [tenDangNhap, setTenDangNhap] = useState<string>('');
  const [matKhau, setMatKhau] = useState<string>('123456');
  const [hoVaTen, setHoVaTen] = useState<string>('');
  const [phongBan, setPhongBan] = useState<DepartmentCode>('1TM');
  const [vaiTro, setVaiTro] = useState<UserRole>('user');

  if (!isOpen) return null;

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenDangNhap || !hoVaTen) {
      alert('Vui lòng nhập đầy đủ tên đăng nhập và họ tên');
      return;
    }

    const deptLabels: Record<DepartmentCode, string> = {
      '1TM': '1TM (Kinh doanh 01)',
      '2TM': '2TM (Kinh doanh 02)',
      '3TM': '3TM (Kinh doanh 03)',
      '4TM': '4TM (Kinh doanh 04)',
      '5TM': '5TM (Kinh doanh 05)',
      '6TM': '6TM (Kinh doanh 06)',
      'KDTM': 'KDTM (Thương mại)',
      'BGD': 'BGD (Ban Giám đốc)',
      'IT': 'IT (Kỹ thuật)',
    };

    const roleLabels: Record<UserRole, string> = {
      'user': 'Kinh doanh (user)',
      'manager': 'Trưởng phòng (manager)',
      'admin': 'Quản trị viên (admin)',
    };

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: tenDangNhap.trim(),
      name: hoVaTen.trim(),
      department: phongBan,
      departmentLabel: deptLabels[phongBan],
      role: vaiTro,
      roleLabel: roleLabels[vaiTro],
    };

    if (onAddUser) {
      onAddUser(newUser);
    }
    onSelectUser(newUser);
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              {showAddForm ? 'Thêm tài khoản người dùng mới' : 'Đăng xuất / Chuyển đổi vai trò người dùng'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {!showAddForm ? (
            <>
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Chọn người dùng để kiểm thử quyền duyệt:
                </span>
                <p className="text-[11px] text-slate-500 mb-3">
                  Hệ thống phân quyền theo phòng ban (1TM - 6TM, KDTM, BGD, IT) và vai trò (User, Manager, Admin).
                </p>

                <div className="space-y-2">
                  {MOCK_USERS.map((user) => {
                    const isCurrent = currentUser.id === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          onClose();
                        }}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#122b44] text-white flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">
                                {user.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {user.department}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block">
                              {user.roleLabel}
                            </span>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Đang dùng</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Thêm tài khoản mới (Hình 2 & 3)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100"
                >
                  Đóng
                </button>
              </div>
            </>
          ) : (
            /* Modal matching Image 2 & 3: "Thêm tài khoản người dùng mới" */
            <form onSubmit={handleSaveNewUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  required
                  value={tenDangNhap}
                  onChange={(e) => setTenDangNhap(e.target.value)}
                  placeholder="lan_kd1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Mật khẩu ban đầu *
                </label>
                <input
                  type="password"
                  required
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={hoVaTen}
                  onChange={(e) => setHoVaTen(e.target.value)}
                  placeholder="Nguyễn Thị Lan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Phòng ban *
                  </label>
                  <select
                    value={phongBan}
                    onChange={(e) => setPhongBan(e.target.value as DepartmentCode)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                  >
                    <option value="1TM">1TM</option>
                    <option value="2TM">2TM</option>
                    <option value="3TM">3TM</option>
                    <option value="4TM">4TM</option>
                    <option value="5TM">5TM</option>
                    <option value="6TM">6TM</option>
                    <option value="KDTM">KDTM (Thương mại)</option>
                    <option value="BGD">BGD (Ban Giám đốc)</option>
                    <option value="IT">IT (Kỹ thuật)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Vai trò phân quyền *
                  </label>
                  <select
                    value={vaiTro}
                    onChange={(e) => setVaiTro(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                  >
                    <option value="user">Kinh doanh (user)</option>
                    <option value="manager">Trưởng phòng (manager)</option>
                    <option value="admin">Quản trị viên (admin)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1b365d] text-white rounded-lg hover:bg-[#152a48] transition-colors font-bold"
                >
                  Lưu tài khoản
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
