# Kế Hoạch Triển Khai: Nâng Cấp Module Yêu Cầu May Mẫu (PYCMM) - NBT

Kế hoạch này nâng cấp phân hệ **Yêu cầu may mẫu** thuộc hệ thống quản trị Nhà Bè Trading (NBT), chuyển đổi bảng chi tiết mặt hàng sang dạng lưới ô tính Excel tương tác trực tiếp với phân quyền chặt chẽ, tích hợp tính năng Trao đổi / Chat lưu vết lịch sử kèm gắn thẻ `@nhân sự` gửi mail thông báo, và chuẩn hóa 8 trạng thái quy trình phê duyệt.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Toàn bộ các câu hỏi làm rõ đã được người dùng xác nhận:
> - **Chế độ chỉnh sửa**: Chỉnh sửa trực tiếp trên từng ô tính như Excel Sheet (in-cell editing), có nút Thêm dòng, Xoá dòng và Lưu thay đổi.
> - **Phân quyền chỉnh sửa**: Có đúng 2 đối tượng được phép chỉnh sửa: **Người tạo phiếu** và **Người phụ trách** (Trưởng phòng quản lý bộ phận hoặc Admin/BGD). Những người khác chỉ có quyền xem (Read-only).
> - **Hệ thống Chat & @mention gửi Email**: Cho phép gõ `@` để chọn nhân sự liên quan. Khi gửi tin nhắn có `@`, hệ thống sẽ kích hoạt hộp thư gửi email thông báo trực tiếp đến địa chỉ email của nhân sự đó với đầy đủ: Người gửi, Thời gian, Nội dung trao đổi và Link truy cập trang web.
> - **Cấu trúc bảng danh sách**: Loại bỏ 3 cột riêng lẻ (*KD gửi, Phụ trách, BGĐ*). Cột **Trạng thái** sẽ quản lý toàn bộ 8 trạng thái quy trình thống nhất.

---

## 1. Tổng Quan & Mục Tiêu

### A. Vấn đề giải quyết
1. **Lưới mặt hàng may mẫu**: Trước đây chỉ hiển thị xem hoặc mở form thêm đơn giản. Người dùng cần chỉnh sửa trực tiếp từng ô như Excel (Mã hàng, Chủng loại, Kiểu dáng, Thông số, Số lượng, Size, NPL, In/Thêu, Ghi chú, Đơn vị may, Thợ may).
2. **Kiểm soát phân quyền**: Ngăn chặn chỉnh sửa trái phép. Chỉ người tạo bản ghi và Trưởng phòng phụ trách bộ phận mới được mở khóa chế độ chỉnh sửa.
3. **Trao đổi & Lưu vết lịch sử (Audit Trail & Chat)**: Các phòng ban (Kinh doanh, Kế hoạch, Kỹ thuật, Ban Giám Đốc) cần trao đổi trực tiếp trên từng phiếu YCMM, gắn thẻ `@nhân sự` và gửi email thông báo đến hòm thư người được gọi.
4. **Chuẩn hóa 8 trạng thái phê duyệt**:
   1. `KD gửi`
   2. `chờ Phụ trách xác nhận`
   3. `Phụ trách xác nhận`
   4. `Phụ trách không duyệt`
   5. `chờ BGD duyệt`
   6. `BGD duyệt`
   7. `BGD không duyệt`
   8. `đã hoàn thành`

---

## 2. Thiết Kế Trải Nghiệm Người Dùng (UX) & Giao Diện

### Flow 1: Lưới ô tính Excel tương tác trực tiếp (In-Cell Editing)
* **Giao diện bảng tính**: Các ô trong bảng chi tiết mặt hàng hiển thị như Excel Sheet với viền kẻ ô xám nhạt, font chữ dễ đọc, cột số lượng căn giữa font `JetBrains Mono`.
* **Phân quyền tương tác**:
  * Nếu người đăng nhập là **Người tạo** hoặc **Người phụ trách** (`manager` / `admin`): Các ô có thể click vào để nhập dữ liệu trực tiếp, hiển thị nút *Thêm dòng mặt hàng*, *Lưu bảng tính*, *Hoàn tác*.
  * Nếu người đăng nhập **không phải người tạo và không phải phụ trách**: Bảng chuyển sang chế độ **Chỉ xem (Locked)** kèm thông báo trực quan: *"Chỉ người tạo và người phụ trách mới có quyền chỉnh sửa chi tiết mặt hàng này"*.

### Flow 2: Hệ thống Chat nội bộ, Lưu vết lịch sử & @Mention Gửi Mail
* **Tab Trao đổi & Lịch sử trong Modal**:
  * Khung chat hiển thị dòng thời gian (Timeline) các tin nhắn và nhật ký thay đổi trạng thái phiếu.
  * Hộp soạn thảo văn bản hỗ trợ gợi ý nhanh khi gõ ký tự `@` (hiển thị danh sách nhân sự NBT: *Sương Phan, Đinh Thị Thúy Hiệp, Phan Thùy, Nguyễn Thị Lan, Nguyen Le Nhuan Phat, Quách Ngoan, Trần Văn Bình...*).
  * Khi gửi tin nhắn có gắn thẻ `@`:
    * Hệ thống lưu vết vào lịch sử trao đổi.
    * Tự động kích hoạt cơ chế gửi email thông báo trực tiếp đến địa chỉ email nhân sự được gắn thẻ.
    * Bật Popup/Thông báo chi tiết nội dung email đã gửi:
      ```
      ────────────────────────────────────────────────────────
      [NBT - THÔNG BÁO YÊU CẦU MAY MẪU]
      • Người gửi: Nguyen Le Nhuan Phat (IT / Quản trị viên)
      • Người nhận: hiepdt@nbtrade.com.vn (Đinh Thị Thúy Hiệp)
      • Thời gian: 15/10/2026 19:30
      • Nội dung: @Đinh Thị Thúy Hiệp kiểm tra lại định mức vải giúp em
      • Link truy cập: https://ais-dev-...run.app/?order=6TM026626-MM
      ────────────────────────────────────────────────────────
      ```

### Flow 3: Cập nhật Bảng danh sách chính & 8 Trạng Thái Chuẩn
* Bỏ 3 cột cũ: `KD gửi`, `Phụ trách`, `BGĐ duyệt`.
* Bảng danh sách chính giữ các cột:
  1. **STT**
  2. **Mã Đơn Hàng**
  3. **Tên Công Ty Theo Mã Đơn**
  4. **Phòng KD**
  5. **Ngày Tạo**
  6. **Tên Người Tạo**
  7. **Trạng Thái** (8 trạng thái với màu sắc chuyên biệt)
  8. **Thao Tác** (Nút Chi tiết mở modal)
* Badge trạng thái hiển thị rõ nét:
  * `KD gửi` (Xanh dương)
  * `chờ Phụ trách xác nhận` (Vàng cam nhạt)
  * `Phụ trách xác nhận` (Xanh navy đậm)
  * `Phụ trách không duyệt` (Đỏ cảnh báo)
  * `chờ BGD duyệt` (Cam đậm)
  * `BGD duyệt` (Xanh lá thành công)
  * `BGD không duyệt` (Đỏ tươi)
  * `đã hoàn thành` (Xanh lục ngọc)

---

## 3. Kiến Trúc Kỹ Thuật & Sơ Đồ Hệ Thống

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           NAVBAR (NHA BE TRADING)                              │
│  [Tổng quan] [Commercial & CRM] [Mã đơn hàng] [Nhân sự] [Sản xuất] [May mẫu*]  │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│               DANH SÁCH YÊU CẦU MAY MẪU (SampleApprovalModule)                │
│  • Đã bỏ 3 cột cũ (KD gửi, Phụ trách, BGĐ)                                    │
│  • Cột Trạng Thái quản lý 8 trạng thái chuẩn quy trình NBT                    │
│  • Bộ lọc: Tất cả | Của tôi | Phòng tôi | Chờ tôi duyệt | Đang may mẫu         │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │ Mở chi tiết
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                 MODAL CHI TIẾT FORM YCMM (Master-Detail Modal)                 │
│                                                                                │
│  ┌────────────────────────┐  ┌───────────────────────┐  ┌───────────────────┐  │
│  │ Tab 1: Chi Tiết Excel  │  │ Tab 2: Trao Đổi & Chat│  │ Tab 3: Tiến Trình │  │
│  │ • Ô tính chỉnh sửa     │  │ • Lưu vết lịch sử     │  │ • 8 Trạng thái    │  │
│  │ • Phân quyền:          │  │ • @Gắn thẻ nhân sự    │  │ • Duyệt đa cấp    │  │
│  │   Người tạo &          │  │ • Gửi mail thông báo  │  │   theo quyền hạn   │  │
│  │   Phụ trách            │  │   (Popup xem trước)   │  │                   │  │
│  └────────────────────────┘  └───────────────────────┘  └───────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Các Tệp Sẽ Triển Khai Trong Pha Code

1. `src/types.ts`:
   * Mở rộng `ApprovalStatus` thành 8 trạng thái chuẩn tiếng Việt theo yêu cầu.
   * Thêm kiểu dữ liệu `ChatMessage` và `EmailNotification` (người gửi, người nhận, thời gian, nội dung, link web).
2. `src/data/mockData.ts`:
   * Chuyển đổi toàn bộ dữ liệu mẫu hiện tại sang 8 trạng thái chuẩn mới.
   * Cập nhật danh sách người dùng NBT hỗ trợ danh sách `@mention`.
3. `src/components/SampleApproval/SampleApprovalModule.tsx`:
   * Bỏ 3 cột (*KD gửi, Phụ trách, BGĐ duyệt*).
   * Hiển thị bảng gọn gàng, cập nhật bộ lọc Trạng thái với 8 giá trị mới.
4. `src/components/SampleApproval/SampleOrderDetailModal.tsx`:
   * Tái cấu trúc Tab 1 thành bảng tính Excel cho phép chỉnh sửa từng ô trực tiếp (Mã hàng, Chủng loại, Kiểu dáng, Thông số, Số lượng, Size, NPL, In/Thêu, Ghi chú, Đơn vị may, Thợ may).
   * Kiểm tra phân quyền: `isEditable = (currentUser.name === order.nguoiTao || currentUser.role === 'manager' || currentUser.role === 'admin')`.
   * Thêm Tab Chat & Trao đổi nội bộ: Input gắn thẻ `@`, timeline tin nhắn, hộp thoại xem trước email gửi tự động đến nhân sự.
   * Cập nhật logic chuyển đổi giữa 8 trạng thái phê duyệt.
