import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Printer, 
  Plus, 
  Save, 
  Send, 
  Trash2, 
  Download, 
  Lock, 
  Unlock, 
  MessageSquare, 
  AtSign, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  History, 
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Quote,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  Building2,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  Package,
  Check,
  Circle
} from 'lucide-react';
import { 
  SampleOrder, 
  SampleGarmentItem, 
  UserProfile, 
  ApprovalStatus, 
  ChatMessage, 
  EmailNotification 
} from '../../types';
import { MOCK_USERS } from '../../data/mockData';

interface SampleOrderDetailModalProps {
  order: SampleOrder | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateOrder: (updatedOrder: SampleOrder) => void;
}

export const SampleOrderDetailModal: React.FC<SampleOrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  currentUser,
  onUpdateOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'excel_grid' | 'chat_history' | 'print_preview'>('excel_grid');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true);
  
  // Local editable copy of items
  const [editableItems, setEditableItems] = useState<SampleGarmentItem[]>(order?.items || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Chat state
  const [chatInput, setChatInput] = useState<string>('');
  const [showMentionMenu, setShowMentionMenu] = useState<boolean>(false);
  const [dispatchedEmail, setDispatchedEmail] = useState<EmailNotification | null>(null);
  const [likes, setLikes] = useState<Record<string, boolean>>({ 'chat-446-6': true });
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Reject input
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectBox, setShowRejectBox] = useState<boolean>(false);

  // Update editable items when order changes
  React.useEffect(() => {
    if (order) {
      setEditableItems(order.items || []);
      setHasUnsavedChanges(false);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  // PERMISSION CHECK according to user clarification:
  // "có 2 người được sửa là người tạo và phụ trách"
  const isCreator = 
    currentUser.name.toLowerCase() === order.nguoiTao.toLowerCase() ||
    currentUser.username.toLowerCase() === order.emailNguoiTao.toLowerCase() ||
    (currentUser.email && order.emailNguoiTao && currentUser.email.toLowerCase() === order.emailNguoiTao.toLowerCase());

  const isManagerInCharge = 
    (currentUser.role === 'manager' && (currentUser.department === order.bpYeuCau || currentUser.department === 'BGD')) ||
    currentUser.role === 'admin' ||
    currentUser.department === 'BGD';

  const canEdit = isCreator || isManagerInCharge;

  // In-cell Excel grid updates
  const handleCellChange = (index: number, field: keyof SampleGarmentItem, value: any) => {
    if (!canEdit) return;
    const updated = [...editableItems];
    updated[index] = {
      ...updated[index],
      [field]: field === 'soLuong' ? Math.max(1, Number(value) || 1) : value,
    };
    setEditableItems(updated);
    setHasUnsavedChanges(true);
  };

  const handleAddExcelRow = () => {
    if (!canEdit) return;
    const nextIndex = editableItems.length + 1;
    const newItem: SampleGarmentItem = {
      id: `it-${Date.now()}-${nextIndex}`,
      sampleOrderId: order.id,
      maHang: `${order.maDon}-${nextIndex}`,
      khachHang: order.tenCongTy,
      chungLoai: 'Áo sơ mi nam',
      kieuDang: 'Cổ bẻ tiêu chuẩn, nẹp khuy, măng sét vát góc',
      taiLieuThongSo: 'Theo BTS chuẩn NBT',
      soLuong: 1,
      ngayNhanPYC: order.ngayTao.split(' ')[0] || new Date().toLocaleDateString('vi-VN'),
      ngayYeuCauHoanTat: order.ngayGiaoMau || '30/10/2026',
      nplDung: 'Vải chính kinh doanh cung cấp',
      thieuInTheu: 'Không',
      sizeYeuCau: 'Size 39',
      kdGhiChu: 'May kỹ đẹp để duyệt mẫu',
      donViMay: 'May Mẫu MM',
      nhanVienMayMau: 'C Trang',
      tinhTrangDonHang: 'Chờ duyệt',
    };
    setEditableItems([...editableItems, newItem]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteExcelRow = (index: number) => {
    if (!canEdit) return;
    if (confirm('Bạn có chắc chắn muốn xóa dòng mặt hàng này?')) {
      const updated = editableItems.filter((_, idx) => idx !== index);
      setEditableItems(updated);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveGridChanges = () => {
    if (!canEdit) return;
    const updatedOrder: SampleOrder = {
      ...order,
      items: editableItems,
      chatHistory: [
        ...(order.chatHistory || []),
        {
          id: `sys-${Date.now()}`,
          sampleOrderId: order.id,
          senderName: currentUser.name,
          senderEmail: currentUser.email || `${currentUser.username}@nbtrade.com.vn`,
          senderRole: currentUser.roleLabel,
          timestamp: new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          content: `Đã cập nhật bảng chi tiết mặt hàng (${editableItems.length} sản phẩm) dạng ô tính Excel.`,
          isSystemEvent: true,
        },
      ],
    };
    onUpdateOrder(updatedOrder);
    setHasUnsavedChanges(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Chat & @Mention handling
  const handleInsertMention = (user: UserProfile) => {
    setChatInput((prev) => `${prev} @${user.name} `);
    setShowMentionMenu(false);
  };

  const extractTimeOnly = (timestamp: string): string => {
    if (!timestamp) return '15:51';
    const match = timestamp.match(/(\d{1,2}:\d{2})/);
    return match ? match[1] : '15:51';
  };

  const handleToggleLike = (msgId: string) => {
    setLikes((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === false ? true : !prev[msgId],
    }));
  };

  const handleReplyMessage = (msg: ChatMessage) => {
    setReplyingTo(msg);
  };

  const handleForwardMessage = (msg: ChatMessage) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(msg.content);
    }
    setToastNotice(`Đã sao chép: "${msg.content.slice(0, 35)}..."`);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const renderMessageContent = (content: string) => {
    return content.split(' ').map((word, wIdx) => {
      if (word.startsWith('@')) {
        return (
          <span key={wIdx} className="font-bold text-blue-700 bg-blue-100/60 px-1 py-0.5 rounded border border-blue-200 mr-0.5 inline-block">
            {word}
          </span>
        );
      }
      return word + ' ';
    });
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Detect mentioned users
    const mentionedUsers = MOCK_USERS.filter((u) =>
      chatInput.includes(`@${u.name}`)
    );

    const now = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const finalContent = replyingTo 
      ? `[Trả lời ${replyingTo.senderName}: "${replyingTo.content.slice(0, 30)}..."]\n${chatInput.trim()}`
      : chatInput.trim();

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sampleOrderId: order.id,
      senderName: currentUser.name,
      senderEmail: currentUser.email || `${currentUser.username}@nbtrade.com.vn`,
      senderRole: currentUser.roleLabel,
      timestamp: now,
      content: finalContent,
      mentions: mentionedUsers.map((u) => u.email || `${u.username}@nbtrade.com.vn`),
    };

    const updatedOrder: SampleOrder = {
      ...order,
      chatHistory: [...(order.chatHistory || []), newMsg],
    };

    onUpdateOrder(updatedOrder);

    // If @mentioned, trigger email notification dispatch
    if (mentionedUsers.length > 0) {
      const targetUser = mentionedUsers[0];
      const notification: EmailNotification = {
        id: `email-${Date.now()}`,
        toName: targetUser.name,
        toEmail: targetUser.email || `${targetUser.username}@nbtrade.com.vn`,
        fromName: `${currentUser.name} (${currentUser.department})`,
        fromEmail: currentUser.email || `${currentUser.username}@nbtrade.com.vn`,
        timestamp: now,
        content: chatInput.trim(),
        orderCode: order.maDon,
        webLink: `https://ais-dev-bn4ouupryrj34b6qcfu7qa-588839166366.asia-east1.run.app/?order=${order.maDon}`,
      };
      setDispatchedEmail(notification);
    }

    setChatInput('');
    setReplyingTo(null);
  };

  // Status progression handlers matching the 8 statuses
  const handleChangeStatus = (newStatus: ApprovalStatus, reason?: string) => {
    const now = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const systemLog: ChatMessage = {
      id: `log-${Date.now()}`,
      sampleOrderId: order.id,
      senderName: currentUser.name,
      senderEmail: currentUser.email || `${currentUser.username}@nbtrade.com.vn`,
      senderRole: currentUser.roleLabel,
      timestamp: now,
      content: `Chuyển trạng thái sang [${newStatus}]${reason ? ` - Lý do: ${reason}` : ''}`,
      isSystemEvent: true,
    };

    const updatedOrder: SampleOrder = {
      ...order,
      status: newStatus,
      lyDoTuChoi: reason || (newStatus.includes('không duyệt') ? reason : undefined),
      sendKD: newStatus !== 'KD gửi' || order.sendKD,
      sendTh: newStatus === 'Phụ trách xác nhận' || newStatus === 'chờ BGD duyệt' || newStatus === 'BGD duyệt' || newStatus === 'đã hoàn thành',
      sendBGD: newStatus === 'BGD duyệt' || newStatus === 'đã hoàn thành',
      chatHistory: [...(order.chatHistory || []), systemLog],
    };

    onUpdateOrder(updatedOrder);
    setShowRejectBox(false);
    setRejectReason('');
  };

  const totalQty = (editableItems || []).reduce((acc, it) => acc + (Number(it.soLuong) || 0), 0);

  // Progression states for the 4 workflow stages & 8 statuses
  const getStageState = (stage: 1 | 2 | 3 | 4) => {
    if (stage === 1) {
      return { isCompleted: true, isActive: order.status === 'KD gửi', isRejected: false };
    }
    if (stage === 2) {
      if (order.status === 'Phụ trách không duyệt') {
        return { isCompleted: false, isActive: true, isRejected: true };
      }
      if (order.status === 'KD gửi') {
        return { isCompleted: false, isActive: false, isRejected: false };
      }
      if (order.status === 'chờ Phụ trách xác nhận') {
        return { isCompleted: false, isActive: true, isRejected: false };
      }
      return { isCompleted: true, isActive: false, isRejected: false };
    }
    if (stage === 3) {
      if (order.status === 'BGD không duyệt') {
        return { isCompleted: false, isActive: true, isRejected: true };
      }
      if (order.status === 'BGD duyệt' || order.status === 'đã hoàn thành') {
        return { isCompleted: true, isActive: false, isRejected: false };
      }
      if (order.status === 'chờ BGD duyệt') {
        return { isCompleted: false, isActive: true, isRejected: false };
      }
      return { isCompleted: false, isActive: false, isRejected: false };
    }
    if (stage === 4) {
      if (order.status === 'đã hoàn thành') {
        return { isCompleted: true, isActive: false, isRejected: false };
      }
      if (order.status === 'BGD duyệt') {
        return { isCompleted: false, isActive: true, isRejected: false };
      }
      return { isCompleted: false, isActive: false, isRejected: false };
    }
    return { isCompleted: false, isActive: false, isRejected: false };
  };

  const stage1 = getStageState(1);
  const stage2 = getStageState(2);
  const stage3 = getStageState(3);
  const stage4 = getStageState(4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-3">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-[97vw] 2xl:max-w-[1720px] w-full max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#122b44] text-white font-black text-sm flex items-center justify-center shrink-0">
              NBT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {order.maDon}
                </span>
                <span className="text-xs text-slate-500">
                  Phòng: <strong>{order.bpYeuCau}</strong> · Người tạo: <strong>{order.nguoiTao}</strong>
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5 truncate max-w-md sm:max-w-xl">
                {order.tenCongTy}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Left Sidebar Button */}
            <button
              type="button"
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isLeftPanelOpen 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title={isLeftPanelOpen ? "Thu gọn bảng tổng quan & quy trình" : "Mở bảng tổng quan & quy trình"}
            >
              {isLeftPanelOpen ? <PanelLeftClose className="w-3.5 h-3.5 text-blue-700" /> : <PanelLeftOpen className="w-3.5 h-3.5 text-slate-600" />}
              <span className="hidden sm:inline">{isLeftPanelOpen ? 'Thu gọn bảng quy trình' : 'Bảng quy trình & tổng quan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('print_preview')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">In Phiếu YCMM</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: 2 Columns (Left Panel for Overview & Workflow, Right Area for Work Tabs) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-slate-100/50">
          
          {/* ===================== BẢNG BÊN TRÁI: TỔNG THỂ PHIẾU & QUY TRÌNH TRẠNG THÁI ===================== */}
          {isLeftPanelOpen && (
            <aside className="w-full lg:w-96 xl:w-[410px] 2xl:w-[430px] shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
              
              {/* Left Panel Header */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#122b44] text-white flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Tổng Thể Phiếu & Quy Trình
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs bg-white text-blue-700 border-blue-200">
                  {order.status}
                </span>
              </div>

              <div className="p-4 space-y-4 divide-y divide-slate-100">
                
                {/* 1. THẺ THÔNG TIN TỔNG THỂ PHIẾU */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    Tổng thể phiếu may mẫu
                  </span>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Khách hàng / Công ty:</span>
                      <span className="font-bold text-slate-900 text-[13px] leading-tight block mt-0.5">
                        {order.tenCongTy}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Bộ phận yêu cầu:</span>
                        <span className="font-semibold text-slate-800">{order.bpYeuCau}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Người tạo phiếu:</span>
                        <span className="font-semibold text-slate-800">{order.nguoiTao}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Ngày tạo:</span>
                        <span className="font-mono text-slate-700">{order.ngayTao}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Hạn giao mẫu:</span>
                        <span className="font-mono font-bold text-blue-700">{order.ngayGiaoMau || '30/10/2026'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Quy mô mẫu:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {editableItems.length} chủng loại · {totalQty} cái mẫu
                      </span>
                    </div>

                    {order.items?.[0]?.donViMay && (
                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Đơn vị may mẫu:</span>
                        <span className="font-semibold text-slate-800">{order.items[0].donViMay}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. QUY TRÌNH & TIẾN TRÌNH DUYỆT 8 TRẠNG THÁI */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Quy trình & Tiến trình duyệt
                    </span>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="space-y-0 relative pl-2">
                    
                    {/* Stage 1: KD gửi */}
                    <div className="flex gap-3 pb-4 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs z-10">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <div className="w-0.5 flex-1 bg-emerald-400 my-1" />
                      </div>
                      <div className="pt-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">1. KD Khởi Tạo & Gửi</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Hoàn tất
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stage 2: Xác nhận cấp bộ phận */}
                    <div className="flex gap-3 pb-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs z-10 ${
                          stage2.isCompleted 
                            ? 'bg-emerald-600 text-white' 
                            : stage2.isRejected
                            ? 'bg-red-600 text-white ring-4 ring-red-100'
                            : stage2.isActive
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stage2.isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : stage2.isRejected ? (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : stage2.isActive ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">2</span>
                          )}
                        </div>
                        <div className={`w-0.5 flex-1 my-1 ${stage2.isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      </div>
                      <div className="pt-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">2. Phụ Trách Xác Nhận</span>
                          {stage2.isCompleted && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Đã xác nhận
                            </span>
                          )}
                          {stage2.isRejected && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                              Không duyệt
                            </span>
                          )}
                          {stage2.isActive && !stage2.isRejected && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              Đang chờ duyệt
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stage 3: Ban Giám Đốc phê duyệt */}
                    <div className="flex gap-3 pb-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs z-10 ${
                          stage3.isCompleted 
                            ? 'bg-emerald-600 text-white' 
                            : stage3.isRejected
                            ? 'bg-red-600 text-white ring-4 ring-red-100'
                            : stage3.isActive
                            ? 'bg-purple-600 text-white ring-4 ring-purple-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stage3.isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : stage3.isRejected ? (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : stage3.isActive ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">3</span>
                          )}
                        </div>
                        <div className={`w-0.5 flex-1 my-1 ${stage3.isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      </div>
                      <div className="pt-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">3. Ban Giám Đốc Phê Duyệt</span>
                          {stage3.isCompleted && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              BGD đã duyệt
                            </span>
                          )}
                          {stage3.isRejected && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              BGD không duyệt
                            </span>
                          )}
                          {stage3.isActive && !stage3.isRejected && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                              Đang chờ BGD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stage 4: Hoàn thành sản xuất mẫu */}
                    <div className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs z-10 ${
                          stage4.isCompleted 
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                            : stage4.isActive
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stage4.isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <span className="text-[10px] font-bold">4</span>
                          )}
                        </div>
                      </div>
                      <div className="pt-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">4. May Mẫu & Bàn Giao</span>
                          {stage4.isCompleted ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Đã hoàn thành
                            </span>
                          ) : stage4.isActive ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Đang may mẫu
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              Chờ duyệt xong
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. THAO TÁC DUYỆT NHANH THEO QUYỀN HẠN */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      Thao tác duyệt phiếu
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentUser.roleLabel}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Người thực hiện:</span>
                      <strong className="text-slate-900">{currentUser.name}</strong>
                    </div>

                    {/* Direct action buttons */}
                    <div className="space-y-1.5">
                      {/* KD Action */}
                      {order.status === 'KD gửi' && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus('chờ Phụ trách xác nhận')}
                          className="w-full py-2 px-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Chuyển: chờ Phụ trách xác nhận</span>
                        </button>
                      )}

                      {/* Manager Action */}
                      {order.status === 'chờ Phụ trách xác nhận' && (
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => handleChangeStatus('Phụ trách xác nhận')}
                            className="w-full py-2 px-3 bg-[#122b44] text-white font-bold rounded-lg hover:bg-[#1a3d60] transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Phụ trách xác nhận (Confirm)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRejectBox(true)}
                            className="w-full py-1.5 px-3 bg-red-50 text-red-700 border border-red-200 font-semibold rounded-lg hover:bg-red-100 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Phụ trách không duyệt</span>
                          </button>
                        </div>
                      )}

                      {/* Move to Board */}
                      {order.status === 'Phụ trách xác nhận' && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus('chờ BGD duyệt')}
                          className="w-full py-2 px-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Chuyển lên: chờ BGD duyệt</span>
                        </button>
                      )}

                      {/* Director Action */}
                      {order.status === 'chờ BGD duyệt' && (
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => handleChangeStatus('BGD duyệt')}
                            className="w-full py-2 px-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>BGD Phê Duyệt</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRejectBox(true)}
                            className="w-full py-1.5 px-3 bg-red-50 text-red-700 border border-red-200 font-semibold rounded-lg hover:bg-red-100 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>BGD không duyệt</span>
                          </button>
                        </div>
                      )}

                      {/* Completion */}
                      {order.status === 'BGD duyệt' && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus('đã hoàn thành')}
                          className="w-full py-2 px-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Xác nhận: đã hoàn thành may mẫu</span>
                        </button>
                      )}

                      {/* Re-submit if rejected */}
                      {(order.status === 'Phụ trách không duyệt' || order.status === 'BGD không duyệt') && (
                        <button
                          type="button"
                          onClick={() => handleChangeStatus('KD gửi')}
                          className="w-full py-2 px-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>Sửa xong &rarr; Đặt lại: KD gửi</span>
                        </button>
                      )}

                      {/* Rejection input box */}
                      {showRejectBox && (
                        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg space-y-2 text-xs mt-2">
                          <label className="block font-bold text-red-900">
                            Nhập lý do không duyệt:
                          </label>
                          <textarea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Ghi rõ lý do để Kinh doanh nắm và điều chỉnh..."
                            className="w-full p-2 border border-red-300 rounded bg-white text-xs"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowRejectBox(false)}
                              className="px-2.5 py-1 text-xs border border-slate-300 rounded bg-white hover:bg-slate-50 cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!rejectReason.trim()) {
                                  alert('Vui lòng nhập lý do không duyệt');
                                  return;
                                }
                                const targetStatus = order.status === 'chờ Phụ trách xác nhận' ? 'Phụ trách không duyệt' : 'BGD không duyệt';
                                handleChangeStatus(targetStatus, rejectReason.trim());
                              }}
                              className="px-2.5 py-1 text-xs bg-red-600 text-white font-bold rounded hover:bg-red-700 cursor-pointer"
                            >
                              Xác nhận
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Rejection notice if exists */}
                      {order.lyDoTuChoi && (
                        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-0.5 mt-2">
                          <strong className="block font-bold text-red-900">✕ Ghi chú lý do từ chối:</strong>
                          <p className="italic text-[11px]">{order.lyDoTuChoi}</p>
                        </div>
                      )}

                      {/* Direct Dropdown Switcher for Manager / Admin */}
                      {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1 text-[11px]">
                          <span className="text-slate-500 font-medium">Chuyển nhanh:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleChangeStatus(e.target.value as ApprovalStatus)}
                            className="text-[11px] font-semibold px-2 py-1 border border-slate-300 rounded-md bg-white focus:outline-blue-600"
                          >
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
                      )}

                    </div>
                  </div>
                </div>

              </div>
            </aside>
          )}

          {/* ===================== CỘT BÊN PHẢI: NỘI DUNG CHÍNH (EXCEL, CHAT, MẪU IN) ===================== */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
            
            {/* Status Strip & Tabs Bar for Right Area */}
            <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('excel_grid')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'excel_grid'
                      ? 'bg-[#122b44] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Bảng Mặt Hàng (Excel Sheet)</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat_history')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'chat_history'
                      ? 'bg-[#122b44] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Trao Đổi & Lưu Vết ({(order.chatHistory || []).length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('print_preview')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'print_preview'
                      ? 'bg-[#122b44] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Mẫu In Chuẩn NBT</span>
                </button>
              </div>

            </div>

            {/* Scrollable Work Tab Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: IN-CELL EXCEL SPREADSHEET GRID */}
          {activeTab === 'excel_grid' && (
            <div className="space-y-3">
              
              {/* Action Toolbar */}
              {canEdit && (
                <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleAddExcelRow}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-50 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm dòng mặt hàng</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveGridChanges}
                      disabled={!hasUnsavedChanges}
                      className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white rounded transition-colors shadow-2xs cursor-pointer ${
                        hasUnsavedChanges ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu thay đổi Excel</span>
                    </button>
                  </div>
                )}

              {saveSuccessNotice && (
                <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 p-2.5 rounded text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã lưu thành công toàn bộ thay đổi trên bảng tính Excel vào hệ thống!</span>
                </div>
              )}

              {/* In-Cell Editable Table styled as Excel Sheet */}
              <div className="border border-slate-300 rounded-lg overflow-x-auto bg-white shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f1f5f9] text-slate-700 font-bold border-b border-slate-300 text-[11px] uppercase">
                    <tr>
                      <th className="px-2 py-2 border-r border-slate-300 w-10 text-center">STT</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[150px]">Mã Hàng (Unique)</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[140px]">Chủng Loại</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[200px]">Kiểu Dáng</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[140px]">Tài Liệu / Thông Số</th>
                      <th className="px-2 py-2 border-r border-slate-300 w-16 text-center">SL</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[100px]">Size Y/C</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[160px]">NPL Dùng</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[110px]">In / Thêu</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[180px]">KD Ghi Chú</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[120px]">Đơn Vị May</th>
                      <th className="px-2 py-2 border-r border-slate-300 min-w-[120px]">Thợ May</th>
                      {canEdit && (
                        <th className="px-2 py-2 text-center w-12">Xoá</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {editableItems.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="text-center py-10 text-slate-400">
                          Chưa có dòng mặt hàng nào. Nhấn "+ Thêm dòng mặt hàng" để bắt đầu nhập liệu.
                        </td>
                      </tr>
                    ) : (
                      editableItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/20 group">
                          
                          {/* Row number like Excel */}
                          <td className="px-2 py-1 border-r border-slate-200 text-center font-mono text-slate-500 bg-slate-50">
                            {idx + 1}
                          </td>

                          {/* Mã Hàng */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.maHang}
                                onChange={(e) => handleCellChange(idx, 'maHang', e.target.value)}
                                className="w-full h-full px-2 py-1.5 font-mono font-bold text-blue-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block font-mono font-bold text-blue-700">{item.maHang}</span>
                            )}
                          </td>

                          {/* Chủng loại */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.chungLoai}
                                onChange={(e) => handleCellChange(idx, 'chungLoai', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-900">{item.chungLoai}</span>
                            )}
                          </td>

                          {/* Kiểu dáng */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.kieuDang}
                                onChange={(e) => handleCellChange(idx, 'kieuDang', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-800">{item.kieuDang}</span>
                            )}
                          </td>

                          {/* Tài liệu thông số */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.taiLieuThongSo}
                                onChange={(e) => handleCellChange(idx, 'taiLieuThongSo', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-[11px]"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-700 text-[11px]">{item.taiLieuThongSo}</span>
                            )}
                          </td>

                          {/* Số lượng */}
                          <td className="p-0 border-r border-slate-200 text-center">
                            {canEdit ? (
                              <input
                                type="number"
                                min="1"
                                value={item.soLuong}
                                onChange={(e) => handleCellChange(idx, 'soLuong', e.target.value)}
                                className="w-full h-full px-1 py-1.5 font-mono font-bold text-center text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            ) : (
                              <span className="px-1 py-1.5 block font-mono font-bold text-center text-slate-900">{item.soLuong}</span>
                            )}
                          </td>

                          {/* Size */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.sizeYeuCau}
                                onChange={(e) => handleCellChange(idx, 'sizeYeuCau', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-800">{item.sizeYeuCau}</span>
                            )}
                          </td>

                          {/* NPL Dùng */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.nplDung}
                                onChange={(e) => handleCellChange(idx, 'nplDung', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-[11px]"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-700 text-[11px]">{item.nplDung}</span>
                            )}
                          </td>

                          {/* In / Thêu */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.thieuInTheu}
                                onChange={(e) => handleCellChange(idx, 'thieuInTheu', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-700">{item.thieuInTheu}</span>
                            )}
                          </td>

                          {/* Ghi chú KD */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.kdGhiChu}
                                onChange={(e) => handleCellChange(idx, 'kdGhiChu', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-600 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-[11px]"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-600 text-[11px]">{item.kdGhiChu}</span>
                            )}
                          </td>

                          {/* Đơn vị may */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.donViMay || 'May Mẫu MM'}
                                onChange={(e) => handleCellChange(idx, 'donViMay', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-800 font-medium">{item.donViMay || 'May Mẫu MM'}</span>
                            )}
                          </td>

                          {/* Thợ may mẫu */}
                          <td className="p-0 border-r border-slate-200">
                            {canEdit ? (
                              <input
                                type="text"
                                value={item.nhanVienMayMau || 'C Trang'}
                                onChange={(e) => handleCellChange(idx, 'nhanVienMayMau', e.target.value)}
                                className="w-full h-full px-2 py-1.5 text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                              />
                            ) : (
                              <span className="px-2 py-1.5 block text-slate-800">{item.nhanVienMayMau || 'C Trang'}</span>
                            )}
                          </td>

                          {/* Xoá */}
                          {canEdit && (
                            <td className="px-2 py-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteExcelRow(idx)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                title="Xóa dòng này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: CHAT & AUDIT TRAIL TIMELINE WITH @MENTION AND EMAIL NOTIFICATION */}
          {activeTab === 'chat_history' && (
            <div className="space-y-4">
              
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase">
                  Trao Đổi Nội Bộ & Lưu Vết Lịch Sử (Audit Log)
                </h3>
              </div>

              {/* Modern Chat Messaging Stream (Styled like uploaded screenshot) */}
              <div className="bg-[#edf2f7] border border-slate-300 rounded-xl p-4 sm:p-5 min-h-[380px] max-h-[500px] overflow-y-auto space-y-3 shadow-inner">
                
                {/* Centered Date Pill Header (matching screenshot: 15:51 01/07/2026) */}
                <div className="flex justify-center my-1 select-none">
                  <span className="px-3.5 py-0.5 rounded-full bg-[#94a3b8] text-white font-medium text-[11px] shadow-2xs tracking-wide">
                    15:51 01/07/2026
                  </span>
                </div>

                {toastNotice && (
                  <div className="flex justify-center">
                    <span className="text-[11px] text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 inline-block shadow-2xs">
                      {toastNotice}
                    </span>
                  </div>
                )}

                {(!order.chatHistory || order.chatHistory.length === 0) ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    Chưa có tin nhắn nào. Soạn tin nhắn hoặc gõ @ để gửi thông báo qua email.
                  </div>
                ) : (
                  order.chatHistory.map((msg) => {
                    if (msg.isSystemEvent) {
                      return (
                        <div key={msg.id} className="flex justify-center my-1 select-none">
                          <span className="px-3 py-1 bg-white/90 border border-slate-200 text-slate-600 rounded-full text-[11px] font-medium shadow-2xs flex items-center gap-1.5">
                            <History className="w-3 h-3 text-slate-400" />
                            <span>{msg.content} · <span className="font-mono text-slate-400">{extractTimeOnly(msg.timestamp)}</span></span>
                          </span>
                        </div>
                      );
                    }

                    const isOutgoing = 
                      msg.senderName.toLowerCase() === currentUser.name.toLowerCase() ||
                      msg.senderEmail.toLowerCase() === currentUser.email?.toLowerCase() ||
                      msg.senderEmail.toLowerCase() === `${currentUser.username}@nbtrade.com.vn`.toLowerCase();

                    if (isOutgoing) {
                      return (
                        <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[85%] sm:max-w-[70%] group/msg">
                          <div className="flex items-end justify-end gap-2">
                            
                            {/* Cluster of 3 round action buttons from screenshot: Quote ("), Forward (->), More (...) */}
                            <div className="flex items-center gap-1 opacity-90 group-hover/msg:opacity-100 transition-opacity mb-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleReplyMessage(msg)}
                                title="Trích dẫn / Trả lời"
                                className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-transform hover:scale-105"
                              >
                                <Quote className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleForwardMessage(msg)}
                                title="Chuyển tiếp / Sao chép"
                                className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-transform hover:scale-105"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleLike(msg.id)}
                                title="Thêm phản hồi"
                                className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-transform hover:scale-105"
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Light pastel blue message bubble (matching right bubble in image) */}
                            <div className="relative">
                              <div className="bg-[#e5efff] border border-[#c7ddfc] text-slate-900 rounded-2xl rounded-tr-xs px-4 py-2.5 shadow-2xs">
                                <div className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                                  {renderMessageContent(msg.content)}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1 text-left tabular-nums">
                                  {extractTimeOnly(msg.timestamp)}
                                </div>
                              </div>

                              {/* Thumbs-up badge overlapping bottom right of the bubble (matching screenshot) */}
                              <button
                                type="button"
                                onClick={() => handleToggleLike(msg.id)}
                                title="Thả cảm xúc"
                                className={`absolute -bottom-2 -right-1 bg-white border border-slate-200 shadow-xs rounded-full px-1.5 py-0.5 flex items-center gap-0.5 text-xs transition-transform hover:scale-110 cursor-pointer ${
                                  likes[msg.id] !== false ? 'opacity-100' : 'opacity-40'
                                }`}
                              >
                                <span>👍</span>
                              </button>
                            </div>

                          </div>

                          {msg.mentions && msg.mentions.length > 0 && (
                            <div className="text-[10px] text-emerald-700 flex items-center gap-1 pr-2">
                              <Mail className="w-3 h-3" />
                              <span>Đã gửi email đến: {msg.mentions.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Incoming message from other person (matching white bubble on left in image)
                    return (
                      <div key={msg.id} className="flex flex-col items-start gap-1 max-w-[85%] sm:max-w-[70%] group/msg">
                        {/* Sender name label */}
                        <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-500 font-medium">
                          <span className="font-bold text-slate-800">{msg.senderName}</span>
                          <span className="text-[10px] px-1 py-0.2 bg-white rounded border border-slate-200 text-slate-600">
                            {msg.senderRole}
                          </span>
                        </div>

                        <div className="flex items-end gap-2">
                          {/* White message bubble (matching left bubble in image) */}
                          <div className="bg-white border border-slate-200/90 text-slate-800 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-2xs">
                            <div className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                              {renderMessageContent(msg.content)}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1 text-left tabular-nums">
                              {extractTimeOnly(msg.timestamp)}
                            </div>
                          </div>

                          {/* Action buttons on hover */}
                          <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 mb-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleReplyMessage(msg)}
                              title="Trích dẫn / Trả lời"
                              className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                            >
                              <Quote className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleLike(msg.id)}
                              title="Thả cảm xúc"
                              className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        </div>

                        {msg.mentions && msg.mentions.length > 0 && (
                          <div className="text-[10px] text-emerald-700 flex items-center gap-1 pl-2">
                            <Mail className="w-3 h-3" />
                            <span>Đã gửi email đến: {msg.mentions.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

              </div>

              {/* Input Chat Box with @mention dropdown & reply indicator */}
              <form onSubmit={handleSendChatMessage} className="space-y-2 relative">
                
                {replyingTo && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 shadow-2xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <Quote className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">
                        Đang trả lời <strong>{replyingTo.senderName}</strong>: "{replyingTo.content.slice(0, 45)}..."
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer font-bold ml-2"
                      title="Hủy trả lời"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 relative">
                  
                  {/* Mention @ Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowMentionMenu(!showMentionMenu)}
                      title="Gắn thẻ @nhân sự để gửi email thông báo"
                      className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 flex items-center justify-center transition-colors border border-slate-300 cursor-pointer shadow-2xs"
                    >
                      <AtSign className="w-4 h-4" />
                    </button>

                    {/* Mention popup menu */}
                    {showMentionMenu && (
                      <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-slate-300 rounded-xl shadow-2xl z-30 p-2 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 pb-1 border-b border-slate-100">
                          Chọn nhân sự để thông báo qua email:
                        </span>
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {MOCK_USERS.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => handleInsertMention(u)}
                              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <span className="font-bold text-slate-800 block leading-tight">{u.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{u.email || `${u.username}@nbtrade.com.vn`}</span>
                              </div>
                              <span className="text-[10px] font-semibold px-1 bg-slate-100 rounded text-slate-600">
                                {u.department}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập nội dung trao đổi... (Gõ @ để gắn thẻ gửi email)"
                    className="flex-1 px-4 py-2 text-xs border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white shadow-2xs"
                  />

                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
                    title="Gửi tin nhắn"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>

                </div>
              </form>

              {/* Dispatched Email Notification Toast / Dialog */}
              {dispatchedEmail && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2.5 animate-in slide-in-from-top-2 text-xs text-emerald-950">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold uppercase tracking-wider text-emerald-900">
                        Đã Tự Động Gửi Email Thông Báo Đến Nhân Sự:
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDispatchedEmail(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      ✕ Đóng
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-lg border border-emerald-200">
                    <div>
                      <p><strong>Người gửi:</strong> {dispatchedEmail.fromName}</p>
                      <p><strong>Người nhận (To):</strong> {dispatchedEmail.toName} &lt;<span className="font-mono text-blue-700">{dispatchedEmail.toEmail}</span>&gt;</p>
                      <p><strong>Thời gian:</strong> <span className="font-mono">{dispatchedEmail.timestamp}</span></p>
                    </div>
                    <div>
                      <p><strong>Mã đơn hàng:</strong> <span className="font-mono font-bold text-blue-700">{dispatchedEmail.orderCode}</span></p>
                      <p><strong>Link trang web:</strong> <span className="font-mono text-blue-600 underline truncate block">{dispatchedEmail.webLink}</span></p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Nội dung email gửi đi:</span>
                    <p className="text-slate-800 italic">"{dispatchedEmail.content}"</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: MẪU IN PHIẾU CHUẨN NBT */}
          {activeTab === 'print_preview' && (
            <div className="bg-white border border-slate-300 rounded-lg p-8 shadow-xs text-slate-900 text-xs space-y-6 max-w-4xl mx-auto">
              
              {/* Header Company */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#122b44] text-white font-black text-xl flex items-center justify-center rounded">
                    NBT
                  </div>
                  <div>
                    <h1 className="text-base font-black uppercase text-slate-900">
                      TỔNG CÔNG TY MAY NHÀ BÈ - CTCP
                    </h1>
                    <p className="text-[11px] font-semibold text-slate-600">
                      NHÀ BÈ TRADING · PHÒNG KINH DOANH ({order.bpYeuCau})
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <span className="font-bold text-sm block text-blue-700">{order.maDon}</span>
                  <span>Ngày lập: {order.ngayTao}</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2">
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                  PHIẾU YÊU CẦU MAY MẪU (PYCMM)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Khách hàng: <strong>{order.tenCongTy}</strong>
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded border border-slate-200 text-xs">
                <div>
                  <p><strong>Bộ phận yêu cầu:</strong> {order.bpYeuCau}</p>
                  <p><strong>Người lập phiếu:</strong> {order.nguoiTao}</p>
                  <p><strong>Email:</strong> {order.emailNguoiTao}</p>
                </div>
                <div>
                  <p><strong>Hạn chót hoàn tất:</strong> {order.ngayGiaoMau || 'Đang cập nhật'}</p>
                  <p><strong>Trạng thái:</strong> {order.status}</p>
                  <p><strong>Tập tin hồ sơ:</strong> {order.fileName || 'Form-PYCMM.xlsx'}</p>
                </div>
              </div>

              {/* Items Table for Print */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">STT</th>
                      <th className="p-2 border-r border-slate-300">Mã Hàng</th>
                      <th className="p-2 border-r border-slate-300">Chủng Loại & Kiểu Dáng</th>
                      <th className="p-2 border-r border-slate-300 text-center">SL</th>
                      <th className="p-2 border-r border-slate-300">Size</th>
                      <th className="p-2 border-r border-slate-300">Nguyên Phụ Liệu</th>
                      <th className="p-2">Ghi Chú Kỹ Thuật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((it: SampleGarmentItem, idx: number) => (
                      <tr key={it.id}>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-mono font-bold">{it.maHang}</td>
                        <td className="p-2 border-r border-slate-200">
                          <strong>{it.chungLoai}</strong>
                          <p className="text-[11px] text-slate-600">{it.kieuDang}</p>
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center font-bold font-mono">{it.soLuong}</td>
                        <td className="p-2 border-r border-slate-200">{it.sizeYeuCau}</td>
                        <td className="p-2 border-r border-slate-200 text-[11px]">{it.nplDung}</td>
                        <td className="p-2 text-[11px] text-slate-600">{it.kdGhiChu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-4 gap-4 pt-10 text-center text-xs">
                <div>
                  <span className="font-bold block">NGƯỜI LẬP PHIẾU</span>
                  <span className="text-[10px] text-slate-500 italic block mb-12">(Ký & ghi rõ họ tên)</span>
                  <span className="font-semibold text-slate-800">{order.nguoiTao}</span>
                </div>
                <div>
                  <span className="font-bold block">PHỤ TRÁCH PHÒNG KD</span>
                  <span className="text-[10px] text-slate-500 italic block mb-12">(Ký & ghi rõ họ tên)</span>
                  <span className="font-semibold text-slate-800">
                    {order.status === 'Phụ trách xác nhận' || order.status === 'chờ BGD duyệt' || order.status === 'BGD duyệt' || order.status === 'đã hoàn thành' ? '✓ Đã Xác Nhận' : '(Chờ ký)'}
                  </span>
                </div>
                <div>
                  <span className="font-bold block">BAN GIÁM ĐỐC</span>
                  <span className="text-[10px] text-slate-500 italic block mb-12">(Phê duyệt)</span>
                  <span className="font-semibold text-emerald-700">
                    {order.status === 'BGD duyệt' || order.status === 'đã hoàn thành' ? '✓ ĐÃ PHÊ DUYỆT' : '(Chờ phê duyệt)'}
                  </span>
                </div>
                <div>
                  <span className="font-bold block">PHÒNG KỸ THUẬT</span>
                  <span className="text-[10px] text-slate-500 italic block mb-12">(Tiếp nhận may mẫu)</span>
                  <span className="font-semibold text-slate-800">
                    {order.status === 'đã hoàn thành' ? '✓ Đã Hoàn Thành' : '(Đang triển khai)'}
                  </span>
                </div>
              </div>

            </div>
          )}

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
