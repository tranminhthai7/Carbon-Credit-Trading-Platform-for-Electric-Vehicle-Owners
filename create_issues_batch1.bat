@echo off
REM Batch script to create GitHub issues

echo Creating issue 5: OrdersPage...
gh issue create --title "[Buyer] OrdersPage - Quản lý đơn hàng (4h)" --body "## 🎯 Mục Tiêu
Tạo OrdersPage hiển thị tất cả đơn hàng của buyer. Bao gồm: danh sách orders với trạng thái, chi tiết đơn hàng, lịch sử thanh toán, và chức năng hủy đơn.

## 📋 Yêu Cầu Chi Tiết
- [ ] DataGrid với cột: Order ID, Date, Total Amount, Status, Actions
- [ ] Status chips: PENDING, COMPLETED, CANCELLED
- [ ] Chi tiết đơn hàng khi click vào row
- [ ] Lịch sử thanh toán cho mỗi order
- [ ] Nút Cancel Order (chỉ cho PENDING orders)
- [ ] Filter theo status và date range
- [ ] Export orders to CSV

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/listings/orders\` - Lấy tất cả orders
- \`GET /api/orders/:id\` - Chi tiết order
- \`DELETE /api/orders/:id\` - Hủy order
- \`GET /api/orders/:id/payments\` - Lịch sử thanh toán

## 🎨 UI/UX Requirements
- Master-detail layout
- Expandable rows cho chi tiết
- Action buttons với confirm dialogs
- Status-based styling
- Search và filter controls

## ✅ Tiêu Chí Hoàn Thành
- [ ] Full CRUD cho orders
- [ ] Detail view hoàn chỉnh
- [ ] Payment history
- [ ] Cancel functionality với confirmation
- [ ] Export feature

## 📁 Files Cần Tạo
- \`frontend/src/pages/buyer/OrdersPage.tsx\`

## 📝 Notes
- Sử dụng marketplaceService.getMyOrders()
- Implement optimistic updates"

echo Creating issue 6: CertificatesPage...
gh issue create --title "[Buyer] CertificatesPage - Quản lý chứng chỉ (4h)" --body "## 🎯 Mục Tiêu
Tạo CertificatesPage để quản lý carbon credit certificates. Hiển thị danh sách certificates với thông tin chi tiết, tải xuống PDF, chia sẻ certificates.

## 📋 Yêu Cầu Chi Tiết
- [ ] Grid hiển thị certificates với thumbnail
- [ ] Chi tiết: Certificate Number, Issue Date, Credit Amount, PDF URL
- [ ] Nút Download PDF cho mỗi certificate
- [ ] Nút Share certificate (copy link)
- [ ] Filter theo date range và status
- [ ] Search theo certificate number
- [ ] Certificate verification (QR code hoặc link)

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/certificates\` - Lấy certificates của user
- \`GET /api/certificates/:id/pdf\` - Download PDF
- \`POST /api/certificates/:id/share\` - Tạo share link

## 🎨 UI/UX Requirements
- Card-based layout cho certificates
- PDF viewer hoặc download
- Share functionality với copy-to-clipboard
- Certificate verification
- Mobile-friendly design

## ✅ Tiêu Chí Hoàn Thành
- [ ] Certificate display hoàn chỉnh
- [ ] PDF download hoạt động
- [ ] Share functionality
- [ ] Search và filter
- [ ] Verification feature

## 📁 Files Cần Tạo
- \`frontend/src/pages/buyer/CertificatesPage.tsx\`

## 📝 Notes
- Implement PDF download
- Add share functionality
- Certificate verification logic"

echo Creating issue 7: CVAReportsPage...
gh issue create --title "[CVA] CVAReportsPage - Báo cáo xác minh (5h)" --body "## 🎯 Mục Tiêu
Tạo CVAReportsPage cho việc tạo báo cáo xác minh. Bao gồm: báo cáo theo thời gian, theo khu vực, thống kê hiệu suất CVA, xuất báo cáo.

## 📋 Yêu Cầu Chi Tiết
- [ ] Date range picker cho báo cáo
- [ ] Filter theo region/area
- [ ] Charts: Verification volume, Approval rates, Performance metrics
- [ ] Export to PDF/Excel
- [ ] Summary statistics
- [ ] Detailed breakdown tables

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/reports/verifications\` - Dữ liệu báo cáo
- \`POST /api/reports/generate\` - Tạo báo cáo

## 🎨 UI/UX Requirements
- Report builder interface
- Charts và tables
- Export functionality
- Date range controls

## ✅ Tiêu Chí Hoàn Thành
- [ ] Report generation
- [ ] Charts và visualizations
- [ ] Export features
- [ ] Filter controls

## 📁 Files Cần Tạo
- \`frontend/src/pages/cva/CVAReportsPage.tsx\`

## 📝 Notes
- Complex reporting interface
- Multiple chart types
- Export capabilities"