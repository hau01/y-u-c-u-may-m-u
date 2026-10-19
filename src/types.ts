export type UserRole = 'user' | 'manager' | 'admin';

export type DepartmentCode = 
  | '1TM' 
  | '2TM' 
  | '3TM' 
  | '4TM' 
  | '5TM' 
  | '6TM' 
  | 'KDTM' 
  | 'BGD' 
  | 'IT';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email?: string;
  department: DepartmentCode;
  departmentLabel: string;
  role: UserRole;
  roleLabel: string;
}

export interface CostingTemplate {
  id: string;
  name: string;
  category: string;
  fabricCostPerUnit: number;
  accessoriesCost: number;
  laborCost: number;
  estimatedDays: number;
  sampleCostMultiplier: number;
  notes: string;
}

export interface CRMClient {
  id: string;
  name: string;
  code: string;
  taxId: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
  totalOrders: number;
  assignedKD: string;
  status: 'active' | 'prospect' | 'inactive';
}

// 8 trạng thái chuẩn theo yêu cầu:
// KD gửi, Phụ trách xác nhận, Phụ trách không duyệt, BGD duyệt, BGD không duyệt, chờ Phụ trách xác nhận, chờ BGD duyệt, đã hoàn thành
export type ApprovalStatus = 
  | 'KD gửi'
  | 'chờ Phụ trách xác nhận'
  | 'Phụ trách xác nhận'
  | 'Phụ trách không duyệt'
  | 'chờ BGD duyệt'
  | 'BGD duyệt'
  | 'BGD không duyệt'
  | 'đã hoàn thành';

export interface SampleGarmentItem {
  id: string;
  sampleOrderId: string;
  maHang: string;               // Mã hàng unique (ví dụ: 6TM26626SN-PT, 5TM14426V-MM)
  khachHang: string;            // Tên khách hàng
  chungLoai: string;            // Sơ mi, Quần tây, Vest, Đầm, Áo khoác...
  kieuDang: string;             // Kiểu dáng chi tiết
  taiLieuThongSo: string;       // Bảng thông số kỹ thuật, BTS NBT
  soLuong: number;              // Số lượng may mẫu (1, 2, 5...)
  ngayNhanPYC: string;          // Ngày nhận yêu cầu
  ngayDongBo?: string;          // Ngày đồng bộ NPL
  ngayYeuCauHoanTat: string;    // Hạn chót hoàn tất
  xacNhanNgayGiao?: string;     // Ngày giao xác nhận
  nplDung: string;              // Nguyên phụ liệu dùng
  thieuInTheu: string;          // In/Thêu (Thêu, In, Không)
  sizeYeuCau: string;           // Size (M, L, XL, 39, May đo...)
  kdGhiChu: string;             // Ghi chú phòng KD
  donViMay?: string;            // May Mẫu MM, Xưởng XTM, Mattana...
  nhanVienMayMau?: string;      // Thợ may: C Trang, C Bình, C Khánh, C Hà...
  soLanMayMau?: number;         // 1, 2, 3...
  ketQuaDuyet?: string;         // Đã duyệt mẫu, Chờ sửa, Đã gửi khách
  tinhTrangDonHang: 'Chờ đồng bộ' | 'Đang may' | 'Đã hoàn thành' | 'Chờ duyệt';
}

export interface ChatMessage {
  id: string;
  sampleOrderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  timestamp: string;
  content: string;
  mentions?: string[];          // Danh sách email hoặc họ tên nhân sự được tag @
  isSystemEvent?: boolean;      // Lưu vết thay đổi trạng thái
}

export interface EmailNotification {
  id: string;
  toName: string;
  toEmail: string;
  fromName: string;
  fromEmail: string;
  timestamp: string;
  content: string;
  webLink: string;
  orderCode: string;
}

export interface SampleOrder {
  id: string;
  maDon: string;                // Mã đơn hàng (ví dụ: 6TM026626-MM, 5TM014426-MM)
  tenCongTy: string;            // Tên công ty theo mã đơn
  tenPhieu: string;             // Tên phiếu hiển thị
  bpYeuCau: DepartmentCode;     // Bộ phận yêu cầu: 1TM, 2TM, 3TM, 4TM, 5TM, 6TM, KDTM, BGD, IT
  nguoiTao: string;             // Tên người tạo: Sương Phan, Phan Thùy, Lan Nguyễn...
  emailNguoiTao: string;
  ngayTao: string;              // Ngày tạo: 15/10/2026 1:00 SA
  linkFile: string;             // Link SharePoint / Documents Excel
  fileName?: string;
  status: ApprovalStatus;       // 8 trạng thái chuẩn
  
  // Trạng thái cờ lưu vết:
  sendKD: boolean;
  sendTh: boolean;
  sendBGD: boolean;
  signOffStatus?: string;
  gvApply?: boolean;
  
  ngayGiaoMau?: string;
  ngayTPDuyet?: string;
  ngayBGDDuyet?: string;
  lyDoTuChoi?: string;
  items: SampleGarmentItem[];    // Chi tiết danh sách mặt hàng
  chatHistory?: ChatMessage[];   // Lưu vết lịch sử trao đổi
}
