import React, { useState } from 'react';
import { Layers, Search, Filter, Download, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { SampleOrder } from '../../types';

interface OrdersModuleProps {
  orders: SampleOrder[];
  onSelectOrder: (order: SampleOrder) => void;
}

export const OrdersModule: React.FC<OrdersModuleProps> = ({ orders, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('all');

  const filtered = orders.filter((o) => {
    const matchSearch = 
      o.maDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.tenCongTy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.nguoiTao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'all' || o.bpYeuCau === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
              QUẢN LÝ ĐƠN HÀNG (ORDERS.JS)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Phân hệ theo dõi đơn sản xuất & may mẫu</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Tổng Hợp Danh Sách Mã Đơn Hàng Nhà Bè Trading
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi mã đơn, công ty, bộ phận kinh doanh và trạng thái bàn giao mẫu đại trà
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
            {filtered.length} đơn hàng
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc tên công ty..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">Tất cả phòng ban</option>
              <option value="KD01">KD01</option>
              <option value="KD02">KD02</option>
              <option value="KD03">KD03</option>
              <option value="KD04">KD04</option>
              <option value="KD05">KD05</option>
              <option value="KD06">KD06</option>
              <option value="KDTM">KDTM</option>
              <option value="KDXK">KDXK</option>
              <option value="Kế hoạch">Kế hoạch (GV)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã Đơn</th>
                <th className="px-4 py-3">Tên Công Ty</th>
                <th className="px-4 py-3">Phòng Ban</th>
                <th className="px-4 py-3">Ngày Tạo</th>
                <th className="px-4 py-3">Tên Người Tạo</th>
                <th className="px-4 py-3">Số Mặt Hàng</th>
                <th className="px-4 py-3">Hạn Giao Mẫu</th>
                <th className="px-4 py-3">Trạng Thái</th>
                <th className="px-4 py-3 text-right">Xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {order.maDon}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 max-w-[200px] truncate">
                    {order.tenCongTy}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {order.bpYeuCau}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                    {order.ngayTao}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {order.nguoiTao}
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-mono font-bold">
                    {order.items.length} món
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">
                    {order.ngayGiaoMau || 'Chưa định'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      order.status === 'đã hoàn thành' || order.status === 'BGD duyệt'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'chờ BGD duyệt'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'chờ Phụ trách xác nhận'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-indigo-600 hover:text-indigo-800">
                    <ArrowUpRight className="w-4 h-4 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
