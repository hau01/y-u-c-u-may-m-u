import React, { useState } from 'react';
import { SampleApprovalModule } from './components/SampleApproval/SampleApprovalModule';
import { SampleOrderDetailModal } from './components/SampleApproval/SampleOrderDetailModal';
import { NewSampleOrderModal } from './components/SampleApproval/NewSampleOrderModal';
import { WorkflowDiagramModal } from './components/SampleApproval/WorkflowDiagramModal';
import { OrderCodeTool } from './components/OrderCodeGenerator/OrderCodeTool';
import { LoginModal } from './components/Auth/LoginModal';
import { MOCK_ORDERS, MOCK_USERS } from './data/mockData';
import { SampleOrder, UserProfile, DepartmentCode } from './types';
import { FileCheck2 } from 'lucide-react';

export default function App() {
  // Default to the red box module: 'sample_approval' (Yêu cầu may mẫu)
  const [currentTab, setCurrentTab] = useState<string>('sample_approval');
  const [orders, setOrders] = useState<SampleOrder[]>(MOCK_ORDERS);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  
  // Current user from screenshot: Nguyen Le Nhuan Phat (IT / Quản trị viên)
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  
  // Modals
  const [selectedOrder, setSelectedOrder] = useState<SampleOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Prefilled for new order from code tool
  const [prefilledData, setPrefilledData] = useState<{
    code?: string;
    company?: string;
    dept?: DepartmentCode;
  }>({});

  const handleSelectOrder = (order: SampleOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateOrder = (updatedOrder: SampleOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
  };

  const handleAddOrder = (newOrder: SampleOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    alert(`Đã lập thành công Phiếu yêu cầu may mẫu cho: ${newOrder.tenCongTy}!`);
  };

  const handleSaveCodeFromTool = (orderPartial: Partial<SampleOrder>) => {
    const newId = String(Date.now());
    const completeOrder: SampleOrder = {
      id: newId,
      maDon: orderPartial.maDon || `1TM00226-MM`,
      tenCongTy: orderPartial.tenCongTy || 'CÔNG TY MỚI',
      tenPhieu: orderPartial.tenPhieu || `YCMM ${orderPartial.tenCongTy || ''}`,
      bpYeuCau: orderPartial.bpYeuCau || '1TM',
      nguoiTao: orderPartial.nguoiTao || currentUser.name,
      emailNguoiTao: currentUser.username,
      ngayTao: orderPartial.ngayTao || new Date().toLocaleDateString('vi-VN'),
      linkFile: `/sites/NBT_002/Shared Documents/${orderPartial.maDon}.xlsx`,
      fileName: `${orderPartial.maDon}.xlsx`,
      status: 'KD gửi',
      sendKD: false,
      sendTh: false,
      sendBGD: false,
      items: [],
    };
    setOrders((prev) => [completeOrder, ...prev]);
  };

  const handleOpenNewOrderWithPrefill = (
    prefilledCode: string,
    companyName: string,
    dept: DepartmentCode,
    creator: string
  ) => {
    setPrefilledData({
      code: prefilledCode,
      company: companyName,
      dept: dept,
    });
    setIsNewOrderModalOpen(true);
  };

  const handleQuickApprove = (orderId: string, level: 'sales' | 'manager' | 'director') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (level === 'sales') {
          return {
            ...o,
            sendKD: true,
            status: 'chờ Phụ trách xác nhận',
          };
        }
        if (level === 'manager') {
          return {
            ...o,
            sendTh: true,
            ngayTPDuyet: new Date().toLocaleDateString('vi-VN'),
            status: 'Phụ trách xác nhận',
          };
        }
        if (level === 'director') {
          return {
            ...o,
            sendBGD: true,
            ngayBGDDuyet: new Date().toLocaleDateString('vi-VN'),
            status: 'BGD duyệt',
          };
        }
        return o;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans">
      
      {/* Main Viewport Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* Module: Yêu cầu may mẫu */}
        {currentTab === 'sample_approval' && (
          <SampleApprovalModule
            orders={orders}
            currentUser={currentUser}
            onSelectOrder={handleSelectOrder}
            onOpenNewOrderModal={() => {
              setPrefilledData({});
              setIsNewOrderModalOpen(true);
            }}
            onOpenDiagramModal={() => setIsDiagramModalOpen(true)}
            onOpenCodeGenerator={() => setCurrentTab('ma_don_hang')}
            onQuickApprove={handleQuickApprove}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* Công cụ: Tạo mã đơn hàng */}
        {currentTab === 'ma_don_hang' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setCurrentTab('sample_approval')}
                className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
              >
                &larr; Về Yêu Cầu May Mẫu
              </button>
            </div>

            <OrderCodeTool
              onSaveCode={handleSaveCodeFromTool}
              onOpenNewOrderModal={handleOpenNewOrderWithPrefill}
              existingOrders={orders}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Tổng Công Ty May Nhà Bè - CTCP (NBT). Module: <strong>Yêu Cầu May Mẫu (Triển khai may mẫu NBT_002)</strong>.
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Hệ thống phân quyền (1TM - 6TM, KDTM, BGD, IT) · User: {currentUser.name} ({currentUser.department})
          </span>
        </div>
      </footer>

      {/* Modals */}
      <SampleOrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        currentUser={currentUser}
        onUpdateOrder={handleUpdateOrder}
      />

      <NewSampleOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        currentUser={currentUser}
        onAddOrder={handleAddOrder}
        prefilledCode={prefilledData.code}
        prefilledCompany={prefilledData.company}
        prefilledDept={prefilledData.dept}
        orders={orders}
      />

      <WorkflowDiagramModal
        isOpen={isDiagramModalOpen}
        onClose={() => setIsDiagramModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
        onAddUser={(u) => setUsers((prev) => [...prev, u])}
      />

    </div>
  );
}
