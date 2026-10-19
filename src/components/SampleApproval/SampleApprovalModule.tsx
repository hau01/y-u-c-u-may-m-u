import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Download, 
  KeyRound, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { SampleOrder, UserProfile, ApprovalStatus } from '../../types';

interface SampleApprovalModuleProps {
  orders: SampleOrder[];
  currentUser: UserProfile;
  onSelectOrder: (order: SampleOrder) => void;
  onOpenNewOrderModal: () => void;
  onOpenDiagramModal: () => void;
  onOpenCodeGenerator: () => void;
  onQuickApprove?: (orderId: string, level: 'sales' | 'manager' | 'director') => void;
  onOpenLoginModal?: () => void;
}

export const SampleApprovalModule: React.FC<SampleApprovalModuleProps> = ({
  orders,
  currentUser,
  onSelectOrder,
  onOpenNewOrderModal,
  onOpenDiagramModal,
  onOpenCodeGenerator,
  onOpenLoginModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'my_dept' | 'pending_me' | 'completed'>('all');

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // Search query
    const matchSearch = 
      order.maDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tenCongTy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nguoiTao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bpYeuCau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(it => it.maHang.toLowerCase().includes(searchTerm.toLowerCase()));

    // Dept
    const matchDept = selectedDept === 'all' || order.bpYeuCau === selectedDept;

    // Status
    const matchStatus = selectedStatus === 'all' || order.status === selectedStatus;

    // Filter tabs
    if (activeTab === 'mine') {
      return matchSearch && matchDept && (order.nguoiTao.toLowerCase().includes(currentUser.name.toLowerCase()) || order.emailNguoiTao === currentUser.username);
    }
    if (activeTab === 'my_dept') {
      return matchSearch && order.bpYeuCau === currentUser.department;
    }
    if (activeTab === 'pending_me') {
      if (currentUser.role === 'user') {
        return matchSearch && matchDept && (order.status === 'KD gửi' || order.status === 'Phụ trách không duyệt' || order.status === 'BGD không duyệt');
      }
      if (currentUser.role === 'manager') {
        return matchSearch && (order.bpYeuCau === currentUser.department || currentUser.department === 'BGD') && order.status === 'chờ Phụ trách xác nhận';
      }
      if (currentUser.role === 'admin' || currentUser.department === 'BGD') {
        return matchSearch && matchDept && order.status === 'chờ BGD duyệt';
      }
    }
    if (activeTab === 'completed') {
      return matchSearch && matchDept && order.status === 'đã hoàn thành';
    }

    return matchSearch && matchDept && matchStatus;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('all');
    setSelectedStatus('all');
    setActiveTab('all');
  };

  const handleExportExcel = () => {
    const headers = ['Mã Đơn', 'Tên Công Ty', 'Ngày Tạo', 'Người Tạo', 'Phòng Ban', 'Trạng Thái'];
    const rows = filteredOrders.map(o => [
      `"${o.maDon}"`,
      `"${o.tenCongTy}"`,
      `"${o.ngayTao}"`,
      `"${o.nguoiTao}"`,
      `"${o.bpYeuCau}"`,
      `"${o.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DS_Yeu_Cau_May_Mau_NBT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Status Badge with 8 distinct official colors
  const renderStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'KD gửi':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            KD gửi
          </span>
        );
      case 'chờ Phụ trách xác nhận':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            chờ Phụ trách xác nhận
          </span>
        );
      case 'Phụ trách xác nhận':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#132f4c] text-white">
            Phụ trách xác nhận
          </span>
        );
      case 'Phụ trách không duyệt':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
            Phụ trách không duyệt
          </span>
        );
      case 'chờ BGD duyệt':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
            chờ BGD duyệt
          </span>
        );
      case 'BGD duyệt':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-600 text-white shadow-2xs">
            BGD duyệt
          </span>
        );
      case 'BGD không duyệt':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-red-600 text-white">
            BGD không duyệt
          </span>
        );
      case 'đã hoàn thành':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            đã hoàn thành
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Yêu cầu may mẫu
            </h1>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          
          <button
            type="button"
            onClick={onOpenCodeGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tạo mã đơn (Tool)</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất Excel</span>
          </button>

          {/* Green button matching "+ Tạo cơ hội mới" and "+ Tạo mã đơn mới" */}
          <button
            type="button"
            onClick={onOpenNewOrderModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#227938] hover:bg-[#1b622e] rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tạo phiếu YCMM mới</span>
          </button>

        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        
        {/* Filter Navigation Row (Tabs + Inline Stat Summary like Image 1 & 5) */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Segmented Filter Buttons: Tất cả, Của tôi, Phòng tôi, Chờ tôi duyệt (Matching Image 1) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-[#122b44] text-white font-bold shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'mine' 
                  ? 'bg-[#122b44] text-white font-bold shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Của tôi
            </button>
            <button
              onClick={() => setActiveTab('my_dept')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'my_dept' 
                  ? 'bg-[#122b44] text-white font-bold shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Phòng tôi ({currentUser.department})
            </button>
            <button
              onClick={() => setActiveTab('pending_me')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'pending_me' 
                  ? 'bg-[#122b44] text-white font-bold shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Chờ tôi duyệt
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'completed' 
                  ? 'bg-[#122b44] text-white font-bold shadow-xs' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Đã hoàn thành
            </button>
          </div>

        </div>

        {/* Search & Select Row (Matching Image 1) */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã đơn, tên khách hàng, người tạo, mã hàng..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
            />
          </div>

          {/* Selects & Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Phòng dropdown matching Image 2 & 3 */}
            <div className="flex items-center">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
              >
                <option value="all">Phòng: Tất cả</option>
                <option value="1TM">Phòng 1TM</option>
                <option value="2TM">Phòng 2TM</option>
                <option value="3TM">Phòng 3TM</option>
                <option value="4TM">Phòng 4TM</option>
                <option value="5TM">Phòng 5TM</option>
                <option value="6TM">Phòng 6TM</option>
                <option value="KDTM">Phòng KDTM (Thương mại)</option>
                <option value="BGD">BGD (Ban Giám đốc)</option>
                <option value="IT">IT (Kỹ thuật)</option>
              </select>
            </div>

            {/* Trạng thái dropdown with exact 8 statuses */}
            <div className="flex items-center">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
              >
                <option value="all">Trạng thái: Tất cả</option>
                <option value="KD gửi">KD gửi</option>
                <option value="chờ Phụ trách xác nhận">chờ Phụ trách xác nhận</option>
                <option value="Phụ trách xác nhận">Phụ trách xác nhận</option>
                <option value="Phụ trách không duyệt">Phụ trách không duyệt</option>
                <option value="chờ BGD duyệt">chờ BGD duyệt</option>
                <option value="BGD duyệt">BGD duyệt</option>
                <option value="BGD không duyệt">BGD không duyệt</option>
                <option value="đã hoàn thành">đã hoàn thành</option>
              </select>
            </div>

            {/* Làm mới button matching Image 1 */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2 border border-slate-300 bg-white rounded-md text-slate-700 hover:bg-slate-100 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Làm mới</span>
            </button>

          </div>

        </div>

        {/* Data Table with the exact requested columns */}
        {/* User requested: BỎ ĐI 3 CỘT KD GỬI, PHỤ TRÁCH, BGH; TRẠNG THÁI CHUYỂN THÀNH 8 TRẠNG THÁI */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-700 font-semibold text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">STT</th>
                <th className="px-4 py-3 whitespace-nowrap">Mã Đơn Hàng</th>
                <th className="px-4 py-3 whitespace-nowrap">Tên Công Ty Theo Mã Đơn</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Phòng KD</th>
                <th className="px-4 py-3 whitespace-nowrap">Ngày Tạo</th>
                <th className="px-4 py-3 whitespace-nowrap">Tên Người Tạo</th>
                <th className="px-4 py-3 whitespace-nowrap">Trạng Thái</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy phiếu yêu cầu may mẫu nào trong danh sách.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* STT */}
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>

                    {/* 1. Mã đơn */}
                    <td className="px-4 py-3 font-mono font-bold text-[#1b4b72] whitespace-nowrap">
                      {order.maDon}
                      {order.items.length > 0 && (
                        <span className="block text-[10px] font-normal text-slate-400 font-sans">
                          {order.items.length} mặt hàng may mẫu
                        </span>
                      )}
                    </td>

                    {/* 2. Tên công ty theo mã đơn */}
                    <td className="px-4 py-3 text-slate-900 font-bold max-w-xs">
                      <div className="truncate" title={order.tenCongTy}>
                        {order.tenCongTy}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block truncate">
                        {order.tenPhieu}
                      </span>
                    </td>

                    {/* Phòng KD */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {order.bpYeuCau}
                      </span>
                    </td>

                    {/* 3. Ngày tạo */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {order.ngayTao}
                    </td>

                    {/* 4. Tên người tạo */}
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      <span className="font-semibold">{order.nguoiTao}</span>
                      <span className="block text-[10px] text-slate-400">
                        {order.emailNguoiTao}
                      </span>
                    </td>

                    {/* 5. Trạng thái (8 trạng thái chuẩn theo chỉ đạo) */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(order.status)}
                      {order.chatHistory && order.chatHistory.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 ml-2 text-[10px] text-slate-400 font-normal">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span>{order.chatHistory.length}</span>
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-semibold text-xs flex items-center justify-end gap-1 ml-auto cursor-pointer"
                      >
                        <span>Chi tiết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Pagination bar */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị <span className="font-bold text-slate-900">{filteredOrders.length}</span> / {orders.length} phiếu yêu cầu may mẫu
          </div>
          <div className="flex items-center gap-2">
            <span>Hệ thống triển khai may mẫu NBT (NBT_002)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
