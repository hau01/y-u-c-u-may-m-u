import React from 'react';
import { X, CheckCircle2, ArrowRight, FileText, Send, UserCheck, ShieldCheck, Cpu, ClipboardList, Scissors, HelpCircle } from 'lucide-react';

interface WorkflowDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightStatus?: string;
}

export const WorkflowDiagramModal: React.FC<WorkflowDiagramModalProps> = ({
  isOpen,
  onClose,
  highlightStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-0.5">
              Sơ Đồ Hệ Thống Chuẩn NBT
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Quy Trình Tạo Và Duyệt Yêu Cầu May Mẫu (PYCMM)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 text-xs text-blue-900 flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Mô tả cách hoạt động quy trình số hóa: </span>
              Kinh doanh thu thập yêu cầu &rarr; Tạo mã đơn hàng tự động &rarr; Điền Form YCMM chuẩn.xlsx &rarr; Bấm "Kinh doanh Xác nhận" &rarr; Trưởng phòng duyệt cấp 1 &rarr; Hệ thống gửi mail thông báo Ban Giám Đốc duyệt cấp 2 &rarr; Chuyển tiếp Phòng Kế hoạch & Phòng Kỹ thuật triển khai may mẫu.
            </div>
          </div>

          {/* Swimlane Columns Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-3">
            
            {/* Lane 1: Khách hàng */}
            <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 text-center border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  1. Khách Hàng
                </span>
                <span className="text-[10px] text-slate-500">Đối tác / Doanh nghiệp</span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 text-center">
                  <span className="font-semibold block text-slate-900 mb-1">1. Cung cấp thông tin</span>
                  Thông số, hình ảnh thiết kế, loại vải hoặc áo mẫu gốc cho PKD
                </div>
                <div className="flex justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                </div>
              </div>
            </div>

            {/* Lane 2: Phòng Kinh Doanh */}
            <div className="flex flex-col bg-white border border-blue-200 rounded-lg shadow-xs overflow-hidden">
              <div className="bg-blue-100 px-3 py-2 text-center border-b border-blue-200">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                  2. Phòng Kinh Doanh
                </span>
                <span className="text-[10px] text-blue-700">KD01 - KD06, KDTM, KDXK</span>
              </div>
              <div className="p-2.5 flex-1 space-y-2.5 text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900">2. Thu thập thông tin</span>
                  Tổng hợp số đo, kiểu dáng, số lượng mẫu
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900">
                  <span className="font-semibold block">3. Truy cập ứng dụng & Tạo mã</span>
                  Dùng công cụ tạo mã đơn tự động (Mã phòng + Tên + Năm 26)
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900">4. Tải Form YCMM chuẩn</span>
                  Điền các mã hàng con (Unique không trùng)
                </div>
                <div className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-900">
                  <span className="font-semibold block">5. Bấm "Xác nhận gửi"</span>
                  Hệ thống ghi nhận và chuyển Trưởng phòng
                </div>
                <div className="p-2 bg-purple-50 border border-purple-200 rounded text-purple-900">
                  <span className="font-semibold block">6. Trưởng phòng phê duyệt</span>
                  Đã xác nhận &rarr; Chuyển BGĐ
                  <br />
                  <span className="text-[10px] text-red-600 font-medium">Nếu từ chối: Yêu cầu sửa</span>
                </div>
              </div>
            </div>

            {/* Lane 3: Hệ thống Hệ Thống / SharePoint */}
            <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 text-center border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  3. Hệ Thống NBT
                </span>
                <span className="text-[10px] text-slate-500">Tự động hóa & Thông báo</span>
              </div>
              <div className="p-2.5 flex-1 space-y-2.5 text-[11px] flex flex-col justify-around">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900">5.1 Nhận dạng dữ liệu</span>
                  Kiểm tra tính hợp lệ & gửi mail thông báo
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900">Cập nhật trạng thái</span>
                  Ghi nhận timestamp, người gửi và lịch sử
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900">7.1 Chuyển mail BGĐ</span>
                  Gửi link phiếu yêu cầu chờ giám đốc duyệt
                </div>
              </div>
            </div>

            {/* Lane 4: Ban Giám Đốc */}
            <div className="flex flex-col bg-white border border-amber-200 rounded-lg shadow-xs overflow-hidden">
              <div className="bg-amber-100 px-3 py-2 text-center border-b border-amber-200">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                  4. Ban Giám Đốc
                </span>
                <span className="text-[10px] text-amber-800">Phê duyệt cấp 2 (Tối cao)</span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center space-y-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 text-center">
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1.5 text-amber-700" />
                  <span className="font-bold block mb-1">Giám đốc Phê Duyệt</span>
                  Bấm trạng thái:
                  <div className="mt-2 space-y-1 font-semibold text-[11px]">
                    <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white rounded">
                      ✓ DUYỆT
                    </span>
                    <span className="block text-red-600">
                      ✗ Không duyệt / Huỷ bỏ
                    </span>
                  </div>
                </div>
                <div className="flex justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                </div>
              </div>
            </div>

            {/* Lane 5: Phòng Kế hoạch */}
            <div className="flex flex-col bg-white border border-teal-200 rounded-lg shadow-xs overflow-hidden">
              <div className="bg-teal-100 px-3 py-2 text-center border-b border-teal-200">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                  5. Phòng Kế Hoạch
                </span>
                <span className="text-[10px] text-teal-700">Đồng bộ NPL & Điều phối</span>
              </div>
              <div className="p-2.5 flex-1 space-y-2 text-[11px]">
                <div className="p-2.5 bg-teal-50/60 border border-teal-200 rounded text-teal-950">
                  <ClipboardList className="w-4 h-4 text-teal-700 mb-1" />
                  <span className="font-bold block text-slate-900 mb-1">Tiếp nhận thông tin</span>
                  Kiểm tra tiến độ đơn hàng sau khi BGĐ duyệt.
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900 mb-0.5">Đồng bộ NPL</span>
                  Cập nhật ngày đồng bộ vải, phụ liệu, bán thành phẩm (BTP).
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600">
                  Tổng hợp File tổng liên phòng ban.
                </div>
              </div>
            </div>

            {/* Lane 6: Phòng Kỹ thuật */}
            <div className="flex flex-col bg-white border border-indigo-200 rounded-lg shadow-xs overflow-hidden">
              <div className="bg-indigo-100 px-3 py-2 text-center border-b border-indigo-200">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                  6. Phòng Kỹ Thuật
                </span>
                <span className="text-[10px] text-indigo-700">Làm rập & May mẫu</span>
              </div>
              <div className="p-2.5 flex-1 space-y-2 text-[11px]">
                <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded text-indigo-950">
                  <Scissors className="w-4 h-4 text-indigo-700 mb-1" />
                  <span className="font-bold block text-slate-900 mb-1">Tiếp nhận kỹ thuật</span>
                  Nghiên cứu rập, thông số kỹ thuật (BTS), tài liệu kỹ thuật (TLKT).
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-700">
                  <span className="font-semibold block text-slate-900 mb-0.5">Phân công may mẫu</span>
                  Chỉ định đơn vị may (May Mẫu MM, XTM, Mattana) và thợ may phụ trách.
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[10px] text-emerald-800 font-medium">
                  Kiểm duyệt ngoại quan & bàn giao mẫu cho KD gửi khách.
                </div>
              </div>
            </div>

          </div>

          {/* Step legend */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-xs">
            <h4 className="font-bold text-slate-900 mb-2">Quy Định Các Trạng Thái Phê Duyệt Của Phiếu YCMM:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-700">
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="font-semibold text-slate-900 block mb-0.5">1. Mới tạo (Draft)</span>
                KD đang thu thập thông tin và soạn thảo các mặt hàng may mẫu.
              </div>
              <div className="p-2.5 bg-white border border-blue-200 rounded-md">
                <span className="font-semibold text-blue-800 block mb-0.5">2. Chờ Trưởng Phòng Duyệt</span>
                Kinh doanh đã bấm "Xác nhận gửi", chờ Trưởng phòng phụ trách duyệt.
              </div>
              <div className="p-2.5 bg-white border border-amber-200 rounded-md">
                <span className="font-semibold text-amber-800 block mb-0.5">3. Chờ Ban Giám Đốc Duyệt</span>
                Trưởng phòng đã xác nhận, hệ thống gửi thông báo lên Ban Giám Đốc.
              </div>
              <div className="p-2.5 bg-white border border-emerald-200 rounded-md">
                <span className="font-semibold text-emerald-800 block mb-0.5">4. Đã Duyệt &rarr; Sản Xuất Mẫu</span>
                BGĐ duyệt, Kế hoạch và Kỹ thuật lập tức tiếp nhận may mẫu thực tế.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng sơ đồ
          </button>
        </div>

      </div>
    </div>
  );
};
