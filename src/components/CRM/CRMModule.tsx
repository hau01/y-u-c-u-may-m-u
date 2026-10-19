import React, { useState } from 'react';
import { Briefcase, Search, Building2, Phone, Mail, MapPin, Plus, ExternalLink } from 'lucide-react';
import { CRMClient } from '../../types';

interface CRMModuleProps {
  clients: CRMClient[];
  onSelectClient?: (client: CRMClient) => void;
}

export const CRMModule: React.FC<CRMModuleProps> = ({ clients }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterKD, setFilterKD] = useState<string>('all');

  const filtered = clients.filter((c) => {
    const matchSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKD = filterKD === 'all' || c.assignedKD === filterKD;
    return matchSearch && matchKD;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              QUẢN TRỊ KHÁCH HÀNG (CRM.JS)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Hồ sơ đối tác đặt may mẫu & hợp đồng NBT</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Danh Mục Khách Hàng Doanh Nghiệp
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin đầu mối, lịch sử yêu cầu may mẫu và phân bổ phụ trách kinh doanh
          </p>
        </div>

        <button 
          onClick={() => alert('Mở form tạo hồ sơ khách hàng mới')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khách Hàng Mới</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên công ty hoặc người liên hệ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={filterKD}
            onChange={(e) => setFilterKD(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tất cả phụ trách KD</option>
            <option value="KD01">Phụ trách KD01</option>
            <option value="KD02">Phụ trách KD02</option>
            <option value="KD03">Phụ trách KD03</option>
            <option value="KD04">Phụ trách KD04</option>
            <option value="KD05">Phụ trách KD05</option>
            <option value="KD06">Phụ trách KD06</option>
          </select>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div key={client.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-amber-400 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {client.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                  {client.name}
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 shrink-0">
                {client.assignedKD}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Ngành: <strong>{client.industry}</strong>
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">Đại diện:</span>
                <span>{client.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2 text-[11px]">{client.address}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Tổng đơn: <strong className="text-slate-900 font-mono">{client.totalOrders}</strong>
              </span>
              <button 
                onClick={() => alert(`Xem lịch sử may mẫu của: ${client.name}`)}
                className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>Hồ sơ may mẫu</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
