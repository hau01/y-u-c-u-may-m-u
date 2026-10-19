import React, { useState, useId } from 'react';
import { Copy, Check, Save, Plus, HelpCircle, ArrowRight, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { SampleOrder, DepartmentCode } from '../../types';

interface OrderCodeToolProps {
  onSaveCode?: (order: Partial<SampleOrder>) => void;
  onOpenNewOrderModal?: (prefilledCode: string, companyName: string, dept: DepartmentCode, creator: string) => void;
  existingOrders: SampleOrder[];
}

export const OrderCodeTool: React.FC<OrderCodeToolProps> = ({
  onSaveCode,
  onOpenNewOrderModal,
  existingOrders,
}) => {
  const [maPhong, setMaPhong] = useState<DepartmentCode>('5TM');
  const [tenNguoiTao, setTenNguoiTao] = useState<string>('Phan Thùy');
  const [nam] = useState<string>('26');
  const [isMayMau, setIsMayMau] = useState<boolean>(false);
  const [chungLoai, setChungLoai] = useState<string>('SD');
  const [tenCongTy, setTenCongTy] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const maPhongId = useId();
  const tenNguoiTaoId = useId();
  const chungLoaiId = useId();
  const mayMauId = useId();
  const tenCongTyId = useId();

  // Tự động tính số thứ tự (STT) tăng dần dựa theo phòng ban và đơn hàng hiện có
  const computeNextStt = (dept: DepartmentCode, orders: SampleOrder[]): string => {
    const deptOrders = (orders || []).filter(
      (o) => o.bpYeuCau === dept || (o.maDon && o.maDon.startsWith(dept))
    );

    let maxNum = 0;
    deptOrders.forEach((o) => {
      const cleanDept = dept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`^${cleanDept}(\\d+)`);
      const match = o.maDon?.match(regex);
      if (match && match[1]) {
        let digits = match[1];
        if (digits.length > 2 && digits.endsWith(nam)) {
          digits = digits.slice(0, -nam.length);
        }
        const val = parseInt(digits, 10);
        if (!isNaN(val) && val > maxNum) {
          maxNum = val;
        }
      }
    });

    const nextNum = maxNum > 0 ? maxNum + 1 : (deptOrders.length + 1);
    return String(nextNum).padStart(3, '0');
  };

  const sttTuDong = computeNextStt(maPhong, existingOrders);

  // Formula from Image 5 & Image 1: [Mã phòng][STT tự động][Năm 2 số][Chủng loại] + - MM nếu là may mẫu
  const computeMaKetQua = () => {
    if (!maPhong) return 'Vui lòng chọn mã phòng...';
    const suffixMM = isMayMau ? '-MM' : '';
    return `${maPhong}${sttTuDong}${nam}${chungLoai ? chungLoai : ''}${suffixMM}`;
  };

  const maKetQua = computeMaKetQua();

  const handleCopy = () => {
    navigator.clipboard.writeText(maKetQua);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenCongTy.trim()) {
      alert('Vui lòng nhập tên công ty theo mã đơn');
      return;
    }

    if (onSaveCode) {
      onSaveCode({
        maDon: maKetQua,
        tenCongTy: tenCongTy.trim().toUpperCase(),
        tenPhieu: `YCMM ${tenCongTy.trim().toUpperCase()} ${nam}`,
        bpYeuCau: maPhong,
        nguoiTao: tenNguoiTao,
        ngayTao: new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'KD gửi',
        sendKD: false,
        sendTh: false,
        sendBGD: false,
        items: [],
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateOrderDirectly = () => {
    if (onOpenNewOrderModal) {
      onOpenNewOrderModal(maKetQua, tenCongTy.trim().toUpperCase(), maPhong, tenNguoiTao);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Tool Instructions (Matching Image 1) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-base tracking-tighter shadow-xs">
            NBT
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              CÔNG CỤ TỰ ĐỘNG TẠO MÃ ĐƠN HÀNG
            </h2>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSave} className="mt-6 border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left Header label */}
            <div className="lg:col-span-3 bg-slate-50/70 p-4 font-semibold text-xs text-slate-700 space-y-4">
              <div className="h-9 flex items-center">
                <label htmlFor={maPhongId} className="block text-slate-900 cursor-pointer">Mã phòng ban:</label>
              </div>
              <div className="h-9 flex items-center">
                <label htmlFor={tenNguoiTaoId} className="block text-slate-900 cursor-pointer">Tên người tạo:</label>
              </div>
              <div className="h-9 flex items-center">
                <label htmlFor={chungLoaiId} className="block text-slate-900 cursor-pointer">Chủng loại sản phẩm:</label>
              </div>
              <div className="h-9 flex items-center">
                <label htmlFor={mayMauId} className="block text-slate-900 cursor-pointer">Xác nhận may mẫu:</label>
              </div>
              <div className="h-9 flex items-center">
                <label htmlFor={tenCongTyId} className="block text-slate-900 cursor-pointer">Nhập tên công ty / KH:</label>
              </div>
            </div>

            {/* Middle: Inputs */}
            <div className="lg:col-span-6 p-4 space-y-4">
              
              <div className="h-9">
                <select
                  id={maPhongId}
                  value={maPhong}
                  onChange={(e) => setMaPhong(e.target.value as DepartmentCode)}
                  className="w-full h-9 text-xs px-3 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
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

              <div className="h-9">
                <input
                  id={tenNguoiTaoId}
                  type="text"
                  value={tenNguoiTao}
                  onChange={(e) => setTenNguoiTao(e.target.value)}
                  placeholder="Nhập tên người tạo (ví dụ: Ny, Sương, Quân...)"
                  className="w-full h-9 text-xs px-3 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="h-9">
                <select
                  id={chungLoaiId}
                  value={chungLoai}
                  onChange={(e) => setChungLoai(e.target.value)}
                  className="w-full h-9 text-xs px-3 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="SD">Áo sơ mi nam dài tay (SD)</option>
                  <option value="SN">Áo sơ mi nam ngắn tay (SN)</option>
                  <option value="SND">Áo sơ mi nữ dài tay (SND)</option>
                  <option value="SNN">Áo sơ mi nữ ngắn tay (SNN)</option>
                  <option value="Q">Quần tây nam (Q)</option>
                  <option value="QN">Quần tây nữ (QN)</option>
                  <option value="W">Áo Vest nam (W)</option>
                  <option value="WN">Áo Vest nữ (WN)</option>
                  <option value="V">Chân váy / Đầm (V)</option>
                  <option value="AT">Áo thun Polo (AT)</option>
                  <option value="ATN">Áo thun nữ (ATN)</option>
                  <option value="AK">Áo khoác / Jacket (AK)</option>
                  <option value="BD">Bộ bảo hộ lao động nam (BD)</option>
                  <option value="BND">Bộ bảo hộ lao động nữ (BND)</option>
                  <option value="TD">Tạp dề (TD)</option>
                  <option value="KTB">Khăn trải bàn (KTB)</option>
                </select>
              </div>

              <div className="h-9">
                <select
                  id={mayMauId}
                  value={isMayMau ? 'yes' : 'no'}
                  onChange={(e) => setIsMayMau(e.target.value === 'yes')}
                  className={`w-full h-9 text-xs px-3 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium transition-colors cursor-pointer ${
                    isMayMau
                      ? 'border-emerald-400 bg-emerald-50/50 text-emerald-800 font-semibold'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <option value="no">Không (Đơn sản xuất thường, không có -MM)</option>
                  <option value="yes">✓ Xác nhận may mẫu (Tự động thêm đuôi -MM)</option>
                </select>
              </div>

              <div className="h-9">
                <input
                  id={tenCongTyId}
                  type="text"
                  value={tenCongTy}
                  onChange={(e) => setTenCongTy(e.target.value)}
                  placeholder="Ví dụ: BỆNH VIỆN THỦ ĐỨC, KING STYLE, TIMES SQUARE..."
                  className="w-full h-9 text-xs px-3 border border-blue-400 bg-blue-50/30 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-semibold"
                />
              </div>

            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-3 bg-slate-50/60 p-4 flex flex-col justify-center space-y-2.5">
              <div className="text-center pb-1">
                <span className="text-[11px] text-slate-500 font-medium block">Mã đơn tự sinh:</span>
                <span className="font-mono text-sm font-bold text-blue-700 tracking-wide block">{maKetQua}</span>
                <div className="mt-1">
                  {isMayMau ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Có đuôi -MM (May mẫu)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Không có -MM
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Mã Đơn Vào Hệ Thống</span>
              </button>

              {onOpenNewOrderModal && (
                <button
                  type="button"
                  onClick={handleCreateOrderDirectly}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Lập Phiếu YCMM Ngay</span>
                </button>
              )}

              {savedSuccess && (
                <div className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded">
                  ✓ Đã lưu mã đơn thành công!
                </div>
              )}
            </div>

          </div>
        </form>

      </div>

      {/* Historical List matching Image 1: "Danh sách mã đơn đã tạo" */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Danh Sách Các Mã Đơn Đã Tạo & Lịch Sử Sử Dụng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tra cứu nhanh mã đơn, tên công ty, người tạo và trạng thái phê duyệt may mẫu
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {existingOrders.length} mã đơn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã Đơn</th>
                <th className="px-4 py-3">Tên Công Ty Theo Mã Đơn</th>
                <th className="px-4 py-3">Phòng Ban</th>
                <th className="px-4 py-3">Ngày Tạo</th>
                <th className="px-4 py-3">Tên Người Tạo</th>
                <th className="px-4 py-3">Trạng Thái</th>
                <th className="px-4 py-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {existingOrders.slice(0, 10).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {order.maDon}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
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
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      order.status === 'đã hoàn thành' || order.status === 'BGD duyệt'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'chờ BGD duyệt'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'chờ Phụ trách xác nhận'
                        ? 'bg-amber-100 text-amber-800'
                        : order.status === 'Phụ trách xác nhận'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status.includes('không duyệt')
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order.maDon);
                        alert(`Đã chép mã: ${order.maDon}`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      Chép mã
                    </button>
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
