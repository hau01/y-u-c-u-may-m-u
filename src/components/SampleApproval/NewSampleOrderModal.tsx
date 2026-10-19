import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, FileSpreadsheet, KeyRound, Link2, Unlink, CheckCircle2 } from 'lucide-react';
import { SampleOrder, SampleGarmentItem, UserProfile, DepartmentCode } from '../../types';

interface NewSampleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAddOrder: (newOrder: SampleOrder) => void;
  prefilledCode?: string;
  prefilledCompany?: string;
  prefilledDept?: DepartmentCode;
  orders?: SampleOrder[];
}

export const NewSampleOrderModal: React.FC<NewSampleOrderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddOrder,
  prefilledCode,
  prefilledCompany,
  prefilledDept,
  orders,
}) => {
  const [tenCongTy, setTenCongTy] = useState<string>(prefilledCompany || '');
  const [bpYeuCau, setBpYeuCau] = useState<DepartmentCode>(prefilledDept || currentUser.department || '1TM');
  const [nguoiTao, setNguoiTao] = useState<string>(currentUser.name);
  const [emailNguoiTao, setEmailNguoiTao] = useState<string>(currentUser.email || `${currentUser.username}@nbtrade.com.vn`);
  const [ngayGiaoMau, setNgayGiaoMau] = useState<string>('30/10/2026');
  
  // Custom code or auto code
  const [maDon, setMaDon] = useState<string>(
    prefilledCode || `NBT-2026-${bpYeuCau}-0${Math.floor(Math.random() * 900 + 100)}`
  );

  // Linked Order state from Module Đơn Hàng
  const [selectedLinkedOrderId, setSelectedLinkedOrderId] = useState<string>('');

  useEffect(() => {
    if (prefilledCode) {
      setMaDon(prefilledCode);
      const match = orders?.find(o => o.maDon.trim().toLowerCase() === prefilledCode.trim().toLowerCase());
      if (match) {
        setSelectedLinkedOrderId(match.id);
        if (!tenCongTy && match.tenCongTy) setTenCongTy(match.tenCongTy);
        if (match.bpYeuCau) setBpYeuCau(match.bpYeuCau);
      }
    }
    if (prefilledCompany) {
      setTenCongTy(prefilledCompany);
    }
    if (prefilledDept) {
      setBpYeuCau(prefilledDept);
    }
  }, [prefilledCode, prefilledCompany, prefilledDept, orders]);

  const selectedLinkedOrder = orders?.find(o => o.id === selectedLinkedOrderId || o.maDon.trim().toLowerCase() === maDon.trim().toLowerCase());

  const handleSelectOrderFromModule = (orderId: string) => {
    if (!orderId) {
      setSelectedLinkedOrderId('');
      return;
    }
    const matched = orders?.find(o => o.id === orderId);
    if (matched) {
      setSelectedLinkedOrderId(matched.id);
      setMaDon(matched.maDon);
      setTenCongTy(matched.tenCongTy);
      setBpYeuCau(matched.bpYeuCau);
      if (matched.ngayGiaoMau) setNgayGiaoMau(matched.ngayGiaoMau);
      if (matched.items && matched.items.length > 0) {
        setItems(matched.items.map(it => ({
          ...it,
          id: `it-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          maHang: it.maHang || `${matched.maDon}-MM`,
        })));
      }
    }
  };

  const handleMaDonChange = (val: string) => {
    setMaDon(val);
    const match = orders?.find(o => o.maDon.trim().toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setSelectedLinkedOrderId(match.id);
      setTenCongTy(match.tenCongTy);
      setBpYeuCau(match.bpYeuCau);
    } else {
      if (selectedLinkedOrderId) setSelectedLinkedOrderId('');
    }
  };

  const handleTenCongTyChange = (val: string) => {
    setTenCongTy(val);
    const match = orders?.find(o => o.tenCongTy.trim().toLowerCase() === val.trim().toLowerCase());
    if (match && !selectedLinkedOrderId) {
      setSelectedLinkedOrderId(match.id);
      setMaDon(match.maDon);
      setBpYeuCau(match.bpYeuCau);
    }
  };

  const handleUnlinkOrder = () => {
    setSelectedLinkedOrderId('');
  };

  const handleCopyItemsFromLinkedOrder = (o: SampleOrder) => {
    if (o.items && o.items.length > 0) {
      setItems(o.items.map(it => ({
        ...it,
        id: `it-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        maHang: it.maHang || `${o.maDon}-MM`,
      })));
      alert(`Đã nhập ${o.items.length} mặt hàng từ đơn hàng [${o.maDon}]!`);
    }
  };

  // Items in this order
  const [items, setItems] = useState<Array<Partial<SampleGarmentItem>>>([
    {
      id: 'it-1',
      maHang: `${prefilledCode || '5TM018826SD'}-MM`,
      chungLoai: 'Áo sơ mi nam dài tay',
      kieuDang: 'Cổ bẻ tiêu chuẩn, nẹp khuy, măng sét vát góc',
      taiLieuThongSo: 'Theo BTS chuẩn NBT',
      soLuong: 1,
      sizeYeuCau: 'Size 39',
      nplDung: 'Vải chính kinh doanh cung cấp',
      thieuInTheu: 'Thêu logo ngực',
      kdGhiChu: 'May kỹ ngoại quan đẹp để khách ký duyệt',
    },
  ]);

  if (!isOpen) return null;

  const handleAddItemRow = (presetChungLoai?: string) => {
    const nextIdx = items.length + 1;
    setItems([
      ...items,
      {
        id: `it-${Date.now()}-${nextIdx}`,
        maHang: `${maDon}-${nextIdx}`,
        khachHang: tenCongTy.trim().toUpperCase(),
        chungLoai: presetChungLoai || (nextIdx % 2 === 0 ? 'Quần tây nam' : 'Áo sơ mi nam dài tay'),
        kieuDang: presetChungLoai?.includes('Quần') ? 'Quần tây 1 ly, cạp đệm keo 4 lớp' : 'Cổ bẻ tiêu chuẩn, nẹp khuy',
        taiLieuThongSo: 'Theo BTS chuẩn NBT',
        soLuong: 1,
        sizeYeuCau: presetChungLoai?.includes('Quần') ? 'Size 32' : 'Size 39',
        nplDung: 'Vải chính kinh doanh cung cấp',
        thieuInTheu: 'Không',
        kdGhiChu: 'May đúng thông số',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, field: keyof SampleGarmentItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenCongTy.trim()) {
      alert('Vui lòng nhập tên công ty theo mã đơn');
      return;
    }

    const newId = String(Date.now());
    const completeItems: SampleGarmentItem[] = items.map((item, idx) => ({
      id: item.id || `item-${Date.now()}-${idx}`,
      sampleOrderId: newId,
      maHang: item.maHang || `${maDon}-${idx + 1}`,
      khachHang: tenCongTy.trim().toUpperCase(),
      chungLoai: item.chungLoai || 'Áo sơ mi',
      kieuDang: item.kieuDang || 'Theo mẫu chuẩn',
      taiLieuThongSo: item.taiLieuThongSo || 'BTS NBT 2026',
      soLuong: Number(item.soLuong) || 1,
      ngayNhanPYC: new Date().toLocaleDateString('vi-VN'),
      ngayYeuCauHoanTat: ngayGiaoMau,
      nplDung: item.nplDung || 'Vải KD cung cấp',
      thieuInTheu: item.thieuInTheu || 'Không',
      sizeYeuCau: item.sizeYeuCau || 'M',
      kdGhiChu: item.kdGhiChu || '',
      tinhTrangDonHang: 'Chờ duyệt',
      donViMay: 'May Mẫu MM',
      nhanVienMayMau: 'C Trang',
    }));

    const newOrder: SampleOrder = {
      id: newId,
      maDon: maDon.trim(),
      tenCongTy: tenCongTy.trim().toUpperCase(),
      tenPhieu: `Form- PYCMM ${tenCongTy.trim().toUpperCase()} ${new Date().toLocaleDateString('vi-VN').replace(/\//g, '.')}`,
      bpYeuCau: bpYeuCau,
      nguoiTao: nguoiTao,
      emailNguoiTao: emailNguoiTao,
      ngayTao: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      linkFile: `/sites/NBT_002/Shared Documents/Form- PYCMM ${tenCongTy.trim().toUpperCase()}.xlsx`,
      status: 'KD gửi',
      sendKD: true,
      sendTh: false,
      sendBGD: false,
      gvApply: false,
      ngayGiaoMau: ngayGiaoMau,
      items: completeItems,
      chatHistory: [
        {
          id: `chat-init-${Date.now()}`,
          sampleOrderId: newId,
          senderName: nguoiTao,
          senderEmail: emailNguoiTao,
          senderRole: currentUser.roleLabel,
          timestamp: new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          content: `Đã khởi tạo phiếu yêu cầu may mẫu cho ${tenCongTy.trim().toUpperCase()} [${maDon.trim()}].`,
          isSystemEvent: true,
        }
      ],
    };

    onAddOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Lập Phiếu Yêu Cầu May Mẫu Mới (PYCMM)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Section 1: Order General Meta */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
            <span className="text-xs font-bold text-slate-900 uppercase flex flex-wrap items-center justify-between gap-2 tracking-wider">
              <span>1. Thông Tin Mã Đơn & Khách Hàng</span>
              {orders && orders.length > 0 && (
                <span className="normal-case text-[11px] font-normal text-slate-600 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Chọn nhanh từ Đơn Hàng:</span>
                  <select
                    value={selectedLinkedOrderId}
                    onChange={(e) => handleSelectOrderFromModule(e.target.value)}
                    className="px-2 py-1 bg-white border border-blue-300 rounded text-blue-900 font-medium text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">-- Chọn đơn hàng từ Module Đơn hàng ({orders.length}) --</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        [{o.maDon}] {o.tenCongTy} ({o.bpYeuCau} - {o.nguoiTao})
                      </option>
                    ))}
                  </select>
                </span>
              )}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã Đơn Hàng / Mã Phiếu:</label>
                <input
                  type="text"
                  required
                  list="module-don-hang-codes"
                  value={maDon}
                  onChange={(e) => handleMaDonChange(e.target.value)}
                  placeholder="Nhập hoặc chọn mã từ đơn hàng..."
                  className={`w-full px-3 py-2 border rounded-md font-mono font-bold text-blue-700 bg-white focus:outline-blue-500 ${
                    selectedLinkedOrder ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-300'
                  }`}
                />
                <datalist id="module-don-hang-codes">
                  {orders?.map((o) => (
                    <option key={o.id} value={o.maDon}>
                      {o.tenCongTy} ({o.bpYeuCau} - {o.nguoiTao})
                    </option>
                  ))}
                </datalist>
                {selectedLinkedOrder && (
                  <div className="mt-1 text-[11px] text-right">
                    <button
                      type="button"
                      onClick={handleUnlinkOrder}
                      className="text-red-600 hover:underline cursor-pointer font-medium"
                    >
                      Bỏ liên kết
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Tên Công Ty Theo Mã Đơn:</label>
                <input
                  type="text"
                  required
                  list="module-don-hang-companies"
                  value={tenCongTy}
                  onChange={(e) => handleTenCongTyChange(e.target.value)}
                  placeholder="Ví dụ: BỆNH VIỆN THỦ ĐỨC, KING STYLE... hoặc chọn từ đơn hàng"
                  className={`w-full px-3 py-2 border rounded-md uppercase font-bold text-slate-900 focus:outline-blue-500 ${
                    selectedLinkedOrder 
                      ? 'border-emerald-500 bg-emerald-50/20' 
                      : 'border-blue-400 bg-blue-50/30'
                  }`}
                />
                <datalist id="module-don-hang-companies">
                  {orders?.map((o) => (
                    <option key={o.id} value={o.tenCongTy}>
                      Mã đơn: {o.maDon} ({o.bpYeuCau} - {o.nguoiTao})
                    </option>
                  ))}
                </datalist>
                {selectedLinkedOrder && selectedLinkedOrder.items.length > 0 && (
                  <div className="mt-1 text-[11px] text-right">
                    <button
                      type="button"
                      onClick={() => handleCopyItemsFromLinkedOrder(selectedLinkedOrder)}
                      className="text-blue-700 hover:underline font-semibold cursor-pointer"
                    >
                      Lấy {selectedLinkedOrder.items.length} mặt hàng của đơn này
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Bộ phận yêu cầu:</label>
                <select
                  value={bpYeuCau}
                  onChange={(e) => setBpYeuCau(e.target.value as DepartmentCode)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium focus:outline-blue-500"
                >
                  <option value="1TM">1TM (Kinh Doanh 01)</option>
                  <option value="2TM">2TM (Kinh Doanh 02)</option>
                  <option value="3TM">3TM (Kinh Doanh 03)</option>
                  <option value="4TM">4TM (Kinh Doanh 04)</option>
                  <option value="5TM">5TM (Kinh Doanh 05)</option>
                  <option value="6TM">6TM (Kinh Doanh 06)</option>
                  <option value="KDTM">KDTM (Thương Mại)</option>
                  <option value="BGD">BGD (Ban Giám Đốc)</option>
                  <option value="IT">IT (Kỹ Thuật)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tên người lập phiếu:</label>
                <input
                  type="text"
                  value={nguoiTao}
                  onChange={(e) => setNguoiTao(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Ngày yêu cầu giao mẫu:</label>
                <input
                  type="text"
                  value={ngayGiaoMau}
                  onChange={(e) => setNgayGiaoMau(e.target.value)}
                  placeholder="30/10/2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-mono focus:outline-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items in Form YCMM - EXCEL SPREADSHEET TABLE */}
          <div className="space-y-3">
            
            {/* Excel Toolbar */}
            <div className="bg-[#107c41] text-white px-4 py-2 rounded-t-lg flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span className="font-bold text-xs tracking-wide">
                  Bảng Tính Chi Tiết Các Mặt Hàng (Excel Sheet)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleAddItemRow()}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded font-medium text-[11px] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm dòng</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItemRow('Áo sơ mi nam')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-emerald-50 rounded text-[11px] cursor-pointer"
                >
                  + Mẫu Sơ mi
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItemRow('Quần tây nam')}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-emerald-50 rounded text-[11px] cursor-pointer"
                >
                  + Mẫu Quần tây
                </button>
              </div>
            </div>

            {/* In-Cell Editable Excel Grid */}
            <div className="border border-slate-300 border-t-0 rounded-b-lg overflow-x-auto bg-white shadow-2xs">
              <table className="w-full text-xs text-left border-collapse font-sans min-w-[1100px]">
                
                {/* Excel Column Letters Row (A, B, C...) */}
                <thead className="bg-[#f3f4f6] text-slate-500 text-[10px] font-mono border-b border-slate-300 select-none">
                  <tr>
                    <th className="w-10 px-2 py-1 text-center bg-slate-200/80 border-r border-slate-300 font-bold">#</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center w-36">A</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center w-36">B</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center min-w-[180px]">C</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center w-32">D</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center w-16">E</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center w-24">F</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center min-w-[140px]">G</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center w-28">H</th>
                    <th className="px-2 py-1 border-r border-slate-300 text-center min-w-[160px]">I</th>
                    <th className="w-12 px-2 py-1 text-center">Xóa</th>
                  </tr>
                </thead>

                {/* Table Column Headers */}
                <thead className="bg-[#e2e8f0] text-slate-800 text-[11px] font-bold border-b border-slate-300">
                  <tr>
                    <th className="px-2 py-2 text-center bg-slate-300/80 border-r border-slate-300">STT</th>
                    <th className="px-2 py-2 border-r border-slate-300">Mã Hàng (Unique)</th>
                    <th className="px-2 py-2 border-r border-slate-300">Chủng Loại</th>
                    <th className="px-2 py-2 border-r border-slate-300">Kiểu Dáng Chi Tiết</th>
                    <th className="px-2 py-2 border-r border-slate-300">Bảng Thông Số</th>
                    <th className="px-2 py-2 border-r border-slate-300 text-center">SL</th>
                    <th className="px-2 py-2 border-r border-slate-300">Size Yêu Cầu</th>
                    <th className="px-2 py-2 border-r border-slate-300">NPL Dùng</th>
                    <th className="px-2 py-2 border-r border-slate-300">In / Thêu</th>
                    <th className="px-2 py-2 border-r border-slate-300">Ghi Chú KD</th>
                    <th className="px-2 py-2 text-center">Hành động</th>
                  </tr>
                </thead>

                {/* Editable Spreadsheet Body */}
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors group">
                      
                      {/* Row Index */}
                      <td className="px-2 py-1.5 text-center font-mono font-bold bg-[#f8fafc] text-slate-500 border-r border-slate-300 select-none">
                        {idx + 1}
                      </td>

                      {/* Col A: Mã Hàng */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          required
                          value={item.maHang || ''}
                          onChange={(e) => handleUpdateItem(idx, 'maHang', e.target.value)}
                          placeholder="Mã hàng..."
                          className="w-full px-2 py-1.5 font-mono font-semibold text-blue-700 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col B: Chủng Loại */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          list="preset-chungloai-list"
                          value={item.chungLoai || ''}
                          onChange={(e) => handleUpdateItem(idx, 'chungLoai', e.target.value)}
                          placeholder="Sơ mi, Quần tây..."
                          className="w-full px-2 py-1.5 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col C: Kiểu Dáng Chi Tiết */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          value={item.kieuDang || ''}
                          onChange={(e) => handleUpdateItem(idx, 'kieuDang', e.target.value)}
                          placeholder="Chi tiết cổ, tay, nẹp..."
                          className="w-full px-2 py-1.5 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col D: Bảng Thông Số */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          value={item.taiLieuThongSo || ''}
                          onChange={(e) => handleUpdateItem(idx, 'taiLieuThongSo', e.target.value)}
                          placeholder="Theo BTS NBT..."
                          className="w-full px-2 py-1.5 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col E: Số Lượng */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.soLuong || 1}
                          onChange={(e) => handleUpdateItem(idx, 'soLuong', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 font-mono font-bold text-center bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col F: Size Yêu Cầu */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          value={item.sizeYeuCau || ''}
                          onChange={(e) => handleUpdateItem(idx, 'sizeYeuCau', e.target.value)}
                          placeholder="Size 39, L, M..."
                          className="w-full px-2 py-1.5 font-mono bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col G: NPL Dùng */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          value={item.nplDung || ''}
                          onChange={(e) => handleUpdateItem(idx, 'nplDung', e.target.value)}
                          placeholder="Vải KD cung cấp..."
                          className="w-full px-2 py-1.5 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col H: In / Thêu */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          value={item.thieuInTheu || ''}
                          onChange={(e) => handleUpdateItem(idx, 'thieuInTheu', e.target.value)}
                          placeholder="Thêu, In, Không..."
                          className="w-full px-2 py-1.5 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col I: Ghi Chú KD */}
                      <td className="p-0 border-r border-slate-300">
                        <input
                          type="text"
                          value={item.kdGhiChu || ''}
                          onChange={(e) => handleUpdateItem(idx, 'kdGhiChu', e.target.value)}
                          placeholder="Ghi chú kinh doanh..."
                          className="w-full px-2 py-1.5 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs outline-none"
                        />
                      </td>

                      {/* Col J: Xóa dòng */}
                      <td className="px-2 py-1.5 text-center">
                        {items.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            title="Xóa dòng tính này"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Excel Summary Row */}
                <tfoot className="bg-[#f8fafc] font-bold text-slate-800 border-t-2 border-slate-300 text-[11px]">
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-right border-r border-slate-300 uppercase tracking-wider text-slate-600 font-mono">
                      SUM (Tổng cộng {items.length} mặt hàng):
                    </td>
                    <td className="px-2 py-2 text-center font-mono text-emerald-800 border-r border-slate-300 font-black text-xs">
                      {items.reduce((s, it) => s + (Number(it.soLuong) || 0), 0)}
                    </td>
                    <td colSpan={5} className="px-3 py-2" />
                  </tr>
                </tfoot>

              </table>

              {/* Datalist for preset garment types */}
              <datalist id="preset-chungloai-list">
                <option value="Áo sơ mi nam dài tay" />
                <option value="Áo sơ mi nam ngắn tay" />
                <option value="Quần tây nam" />
                <option value="Quần kaki nam" />
                <option value="Áo veston nam" />
                <option value="Áo veston nữ" />
                <option value="Đầm công sở nữ" />
                <option value="Chân váy công sở" />
                <option value="Áo polo đồng phục" />
                <option value="Áo khoác gió" />
              </datalist>

              {/* Bottom Excel Sheet Tabs Bar */}
              <div className="bg-[#f1f5f9] border-t border-slate-300 px-3 py-1.5 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1">
                  <div className="px-3 py-1 bg-white border border-slate-300 border-b-2 border-b-emerald-600 font-bold text-slate-800 flex items-center gap-1.5 rounded-t text-[11px] shadow-2xs">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sheet1: Chi Tiết Mặt Hàng (YCMM)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItemRow()}
                    title="Thêm trang tính / thêm dòng"
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Tạo & Lưu Phiếu YCMM</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
