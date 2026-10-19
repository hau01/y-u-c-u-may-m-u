import React, { useState } from 'react';
import { Users, Search, Award, Scissors, CheckCircle, Phone, Mail } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  code: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  specialty: string;
  activeSamplesCount: number;
  completedSamplesCount: number;
  rating: number;
}

const MOCK_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Chị Trang',
    code: 'MM-01',
    role: 'Thợ May Mẫu Bậc Cao',
    department: 'Tổ May Mẫu MM',
    email: 'trang.maymau@nbtrade.com.vn',
    phone: '0903 111 222',
    specialty: 'Sơ mi cao cấp, Blouse bác sĩ, Đầm công sở',
    activeSamplesCount: 4,
    completedSamplesCount: 142,
    rating: 4.9,
  },
  {
    id: 'st-2',
    name: 'Chị Bình',
    code: 'MM-02',
    role: 'Thợ May Mẫu Bậc Cao',
    department: 'Tổ May Mẫu MM',
    email: 'binh.maymau@nbtrade.com.vn',
    phone: '0903 222 333',
    specialty: 'Chân váy, Đầm dạ hội, Tạp dề, Khăn trải bàn',
    activeSamplesCount: 3,
    completedSamplesCount: 128,
    rating: 4.8,
  },
  {
    id: 'st-3',
    name: 'Chị Khánh',
    code: 'MM-03',
    role: 'Nghệ Nhân May Vest Mẫu',
    department: 'Tổ May Mẫu MM',
    email: 'khanh.maymau@nbtrade.com.vn',
    phone: '0903 333 444',
    specialty: 'Áo Vest nam/nữ 2 lớp, Áo khoác Jacket',
    activeSamplesCount: 5,
    completedSamplesCount: 165,
    rating: 5.0,
  },
  {
    id: 'st-4',
    name: 'Chị Hà',
    code: 'MM-04',
    role: 'Thợ May Quần Mẫu',
    department: 'Tổ May Mẫu MM',
    email: 'ha.maymau@nbtrade.com.vn',
    phone: '0903 444 555',
    specialty: 'Quần tây nam/nữ, Quần phòng mổ, Quần short',
    activeSamplesCount: 2,
    completedSamplesCount: 110,
    rating: 4.7,
  },
  {
    id: 'st-5',
    name: 'Chị Tâm',
    code: 'MM-05',
    role: 'Thợ May Mẫu Chuyên Sơ Mi',
    department: 'Tổ May Mẫu MM',
    email: 'tam.maymau@nbtrade.com.vn',
    phone: '0903 555 666',
    specialty: 'Sơ mi phối kiểu, Cổ áo lạ, Áo thun Polo',
    activeSamplesCount: 3,
    completedSamplesCount: 95,
    rating: 4.8,
  },
  {
    id: 'st-6',
    name: 'Mr. Quách Ngoan',
    code: 'KH-01',
    role: 'Phó Phòng Kế Hoạch',
    department: 'Phòng Kế Hoạch',
    email: 'ngoanquach@nbtrade.com.vn',
    phone: '0908 777 888',
    specialty: 'Điều phối NPL, Kế hoạch mẫu GV, Đồng bộ vải',
    activeSamplesCount: 8,
    completedSamplesCount: 280,
    rating: 4.9,
  },
  {
    id: 'st-7',
    name: 'Mr. Trần Văn Bình',
    code: 'KT-01',
    role: 'Trưởng Phòng Kỹ Thuật',
    department: 'Phòng Kỹ Thuật',
    email: 'binhtran@nbtrade.com.vn',
    phone: '0918 888 999',
    specialty: 'Làm rập vi tính Gerber, Khảo sát thông số may đo',
    activeSamplesCount: 12,
    completedSamplesCount: 420,
    rating: 5.0,
  },
];

export const HRMModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('all');

  const filtered = MOCK_STAFF.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'all' || s.department.includes(filterDept);
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
              QUẢN TRỊ NHÂN SỰ & TỔ MAY MẪU (HRM.JS)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Phân công thợ may mẫu & đội ngũ kỹ thuật</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Danh Sách Nhân Sự & Phân Công May Mẫu NBT
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi năng lực thợ may, tải công việc đang xử lý và phân công may mẫu cho từng đơn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg">
            {MOCK_STAFF.length} nhân sự kỹ thuật & may mẫu
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thợ may, mã nhân sự, tay nghề..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tất cả tổ nhóm</option>
            <option value="May Mẫu">Tổ May Mẫu MM</option>
            <option value="Kỹ Thuật">Phòng Kỹ Thuật</option>
            <option value="Kế Hoạch">Phòng Kế Hoạch</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((staff) => (
          <div key={staff.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-teal-400 transition-colors space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {staff.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {staff.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {staff.role} · {staff.department}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-600">★ {staff.rating}</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Sở trường tay nghề:</span>
              <p className="text-slate-800 font-medium">
                {staff.specialty}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 border border-slate-200 rounded-md bg-white">
                <span className="text-[10px] text-slate-400 block">Mẫu đang may:</span>
                <strong className="text-blue-700 font-mono text-sm">{staff.activeSamplesCount}</strong> đơn
              </div>
              <div className="p-2 border border-slate-200 rounded-md bg-white">
                <span className="text-[10px] text-slate-400 block">Đã hoàn thành:</span>
                <strong className="text-emerald-700 font-mono text-sm">{staff.completedSamplesCount}</strong> đơn
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="font-mono text-[11px]">{staff.phone}</span>
              </span>
              <button
                onClick={() => alert(`Phân công phiếu YCMM cho thợ may: ${staff.name}`)}
                className="text-teal-700 hover:text-teal-900 font-semibold text-[11px] cursor-pointer"
              >
                Giao việc may mẫu &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
