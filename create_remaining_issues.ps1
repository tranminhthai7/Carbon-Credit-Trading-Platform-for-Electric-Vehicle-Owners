# PowerShell script to create GitHub issues
Write-Host "Creating issue 7: CVAReportsPage..."
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

Write-Host "Creating issue 8: AdminDashboard..."
gh issue create --title "[Admin] AdminDashboard - Hoàn thiện dashboard (4h)" --body "## 🎯 Mục Tiêu
Hoàn thiện AdminDashboard (sample đã có). Thêm charts thống kê platform, hiển thị recent activities, system alerts.

## 📋 Yêu Cầu Chi Tiết
- [ ] Platform revenue chart (time series)
- [ ] User registration trends
- [ ] System health indicators
- [ ] Recent activities feed
- [ ] Critical alerts section
- [ ] Quick admin actions

## 🔗 API Endpoints Cần Sử Dụng
- \`GET /api/admin/stats\` - Platform stats
- \`GET /api/admin/activities\` - Recent activities
- \`GET /api/admin/health\` - System health

## 🎨 UI/UX Requirements
- Advanced dashboard layout
- Real-time updates
- Alert system
- Action shortcuts

## ✅ Tiêu Chí Hoàn Thành
- [ ] Enhanced charts
- [ ] Activity feed
- [ ] Alert system
- [ ] Admin actions

## 📁 Files Cần Chỉnh Sửa
- \`frontend/src/pages/admin/AdminDashboard.tsx\` (sample có sẵn)

## 📝 Notes
- Build upon existing AdminDashboard
- Add real-time features"