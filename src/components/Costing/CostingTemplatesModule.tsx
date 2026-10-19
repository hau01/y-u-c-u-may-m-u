import React, { useState } from 'react';
import { Calculator, Tag, Sparkles, Plus, Edit2, ArrowRight } from 'lucide-react';
import { CostingTemplate } from '../../types';

interface CostingTemplatesModuleProps {
  templates: CostingTemplate[];
}

export const CostingTemplatesModule: React.FC<CostingTemplatesModuleProps> = ({ templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CostingTemplate>(templates[0]);
  const [customQty, setCustomQty] = useState<number>(2);

  const unitFabric = selectedTemplate.fabricCostPerUnit;
  const unitAcc = selectedTemplate.accessoriesCost;
  const unitLabor = selectedTemplate.laborCost;
  const subtotal = unitFabric + unitAcc + unitLabor;
  const sampleUnitCost = Math.round(subtotal * selectedTemplate.sampleCostMultiplier);
  const totalCost = sampleUnitCost * customQty;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-widest">
              ĐỊNH MỨC & DỰ TOÁN MAY MẪU (COSTING_TEMPLATES.JSON)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Cơ cấu định mức NPL & công may mẫu NBT</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Bảng Mẫu Định Mức & Tính Giá May Mẫu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy chuẩn chi phí vải, phụ liệu, công may và hệ số may mẫu cho từng dòng sản phẩm
          </p>
        </div>

        <button 
          onClick={() => alert('Thêm mẫu định mức costing mới')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Định Mức Mới</span>
        </button>
      </div>

      {/* Main Grid: Templates List & Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Templates Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 pb-1">
            <span className="font-semibold uppercase tracking-wider">Thư viện định mức sản phẩm chuẩn ({templates.length})</span>
            <span>Chọn mẫu để tính thử dự toán</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              const baseCost = tpl.fabricCostPerUnit + tpl.accessoriesCost + tpl.laborCost;
              const sampleCost = Math.round(baseCost * tpl.sampleCostMultiplier);

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`border rounded-xl p-4 transition-all cursor-pointer bg-white shadow-xs ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {tpl.category}
                    </span>
                    <span className="font-mono text-rose-700 font-bold">
                      x{tpl.sampleCostMultiplier}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
                    {tpl.name}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Giá thành may mẫu:</span>
                      <strong className="text-slate-900 font-mono">{formatVND(sampleCost)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Thời gian hoàn tất:</span>
                      <span className="font-semibold">{tpl.estimatedDays} ngày</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Calculator */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block mb-0.5">
              Bảng Dự Toán May Mẫu Tức Thì
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {selectedTemplate.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedTemplate.notes}
            </p>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Định mức vải chính & lót:</span>
              <span className="font-mono font-bold text-slate-900">{formatVND(unitFabric)}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Phụ liệu (nút, keo, chỉ, nhãn):</span>
              <span className="font-mono font-bold text-slate-900">{formatVND(unitAcc)}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Công may tiêu chuẩn:</span>
              <span className="font-mono font-bold text-slate-900">{formatVND(unitLabor)}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg text-rose-950 font-semibold">
              <span>Hệ số công may mẫu & làm rập:</span>
              <span className="font-mono font-bold text-rose-700">x{selectedTemplate.sampleCostMultiplier}</span>
            </div>
          </div>

          {/* Quantity adjustment */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số lượng mẫu dự kiến may:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="50"
                value={customQty}
                onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold text-center"
              />
              <span className="text-xs text-slate-500">chiếc (bộ)</span>
            </div>
          </div>

          {/* Total Result */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Đơn giá mẫu 1 chiếc:</span>
              <span className="font-mono font-semibold">{formatVND(sampleUnitCost)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-200">TỔNG CHI PHÍ DỰ TOÁN:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {formatVND(totalCost)}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            * Chi phí may mẫu sẽ được hoàn lại hoặc khấu trừ khi khách hàng ký kết hợp đồng sản xuất đơn hàng đại trà chính thức.
          </div>

        </div>

      </div>

    </div>
  );
};
