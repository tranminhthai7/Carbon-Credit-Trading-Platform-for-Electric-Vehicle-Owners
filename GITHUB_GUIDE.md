# 📚 Hướng dẫn Sử dụng GitHub Issues & Projects

## 🎯 Mục đích
Quản lý công việc, theo dõi tiến độ, và phân công nhiệm vụ cho team 4-5 người.

---

## 📋 Bước 1: Tạo GitHub Issues

### Cách tạo Issue:
1. Vào repository trên GitHub
2. Click tab **Issues** → **New Issue**
3. Điền thông tin:
   - **Title**: [TAG] Mô tả ngắn gọn (VD: [USER-01] Implement User Registration)
   - **Description**: Chi tiết công việc, yêu cầu, acceptance criteria
   - **Labels**: Thêm labels phù hợp
   - **Assignees**: Phân công cho thành viên
   - **Milestone**: Gắn vào Sprint tương ứng
   - **Projects**: Add vào Project board

### Labels cần tạo:
- 🏷️ `feature` - Tính năng mới
- 🏷️ `bug` - Lỗi cần fix
- 🏷️ `documentation` - Viết tài liệu (BẮT BUỘC)
- 🏷️ `enhancement` - Cải thiện
- 🏷️ `high-priority` - Ưu tiên cao
- 🏷️ `medium-priority` - Ưu tiên trung bình
- 🏷️ `low-priority` - Ưu tiên thấp
- 🏷️ `backend` - Backend task
- 🏷️ `frontend` - Frontend task
- 🏷️ `devops` - DevOps/Docker
- 🏷️ `testing` - Testing
- 🏷️ `microservice` - Microservice related (BẮT BUỘC tag này)

### Ví dụ Issue:

```markdown
Title: [USER-01] Implement User Registration API

Description:
## Mô tả
Tạo API đăng ký người dùng cho 4 loại: EV Owner, Buyer, CVA, Admin

## Tasks
- [ ] Tạo endpoint POST /api/users/register
- [ ] Validate input (email, password strength)
- [ ] Hash password với bcrypt
- [ ] Lưu vào database
- [ ] Return JWT token

## Acceptance Criteria
- API trả về 201 Created khi thành công
- API trả về 400 Bad Request nếu data không hợp lệ
- Password được hash trước khi lưu
- Test coverage >= 70%

## Tech Stack
- Node.js/Java/Python
- PostgreSQL
- JWT

Labels: feature, backend, high-priority, microservice
Assignee: @developer1
Milestone: Sprint 1 (31/10-06/11)
```

---

## 📊 Bước 2: Tạo GitHub Projects (Kanban Board)

### Setup Project Board:

1. **Tạo Project**:
   - Vào tab **Projects** → **New Project**
   - Chọn **Board** template
   - Đặt tên: "Carbon Credit Platform - Sprint Board"

2. **Tạo các Columns**:
   ```
   📋 Backlog          → Chưa bắt đầu
   🏗️ To Do            → Chuẩn bị làm
   🚧 In Progress      → Đang làm
   👀 In Review        → Đang review code
   ✅ Done             → Hoàn thành
   ```

3. **Automation**:
   - Auto-move Issue khi status thay đổi
   - Auto-close Issue khi PR merged

---

## 🗓️ Bước 3: Tạo Milestones (Sprints)

### Sprint 1: Setup & Core (31/10 - 06/11)
```
Title: Sprint 1 - Setup & Core Services
Due date: 06/11/2025
Description:
- Project setup
- Database design
- Core authentication
- Basic microservices structure
```

### Sprint 2: Features & Integration (07/11 - 13/11)
```
Title: Sprint 2 - Features & Integration
Due date: 13/11/2025
Description:
- Complete all microservices
- Frontend development
- Service integration
```

### Sprint 3: Testing & Deployment (14/11 - 18/11)
```
Title: Sprint 3 - Testing & Deployment
Due date: 18/11/2025
Description:
- Testing
- Documentation (BẮT BUỘC)
- Docker deployment
- Final review
```

---

## 🔄 Bước 4: Workflow Git

### Branch Strategy:
```
main            → Production-ready code
  ├── develop   → Integration branch
      ├── feature/user-service
      ├── feature/ev-data-service
      ├── feature/marketplace-service
      └── ...
```

### Quy trình làm việc:

1. **Nhận Issue**:
   ```bash
   # Checkout từ develop
   git checkout develop
   git pull origin develop
   
   # Tạo feature branch
   git checkout -b feature/USER-01-user-registration
   ```

2. **Code & Commit**:
   ```bash
   # Code...
   
   # Commit với message có Issue number
   git add .
   git commit -m "[USER-01] Implement user registration API"
   ```

3. **Push & Create PR**:
   ```bash
   git push origin feature/USER-01-user-registration
   ```
   
   - Vào GitHub tạo Pull Request
   - Link Issue trong PR description: `Closes #1`
   - Request review từ team member

4. **Code Review**:
   - Ít nhất 1 người review
   - Approve → Merge vào develop

5. **Update Issue**:
   - Move Issue sang column "Done"
   - Close Issue (hoặc auto-close qua PR)

---

## 📝 Bước 5: Tạo Issues từ TODOLIST.md

### Script tạo Issues hàng loạt (dùng GitHub CLI):

```bash
# Install GitHub CLI
# Windows: winget install --id GitHub.cli

# Login
gh auth login

# Tạo Issue từ template
gh issue create --title "[SETUP-01] Tạo repository structure" \
                --body "Chi tiết trong TODOLIST.md" \
                --label "feature,devops,high-priority" \
                --milestone "Sprint 1" \
                --assignee "@me"
```

### Hoặc tạo thủ công:
Tham khảo TODOLIST.md và tạo từng Issue theo format trên.

---

## 👥 Bước 6: Phân công Công việc

### Team Structure (4-5 người):

#### **@member1 - Team Lead + Backend**
- Issues: USER-01 đến USER-04
- Issues: MKT-01, MKT-06
- Issues: NOTIF-01, NOTIF-02
- Responsible: Project management, documentation

#### **@member2 - Backend Developer**
- Issues: EV-01 đến EV-04
- Issues: AI-01
- Issues: MKT-03 đến MKT-05

#### **@member3 - Backend Developer**
- Issues: CC-01 đến CC-03
- Issues: PAY-01 đến PAY-03

#### **@member4 - Backend Developer**
- Issues: CVA-01 đến CVA-03
- Issues: RPT-01 đến RPT-03

#### **@member5 - Frontend Developer**
- Issues: FE-01 đến FE-07
- Issues: INT-01

**DevOps**: @member1 hoặc người có kinh nghiệm
- Issues: SETUP-02, SETUP-03
- Issues: DEPLOY-01 đến DEPLOY-03

---

## 🎯 Bước 7: Daily Standup (Optional)

### Format ngắn gọn (5-10 phút):
1. **Yesterday**: Làm được gì?
2. **Today**: Sẽ làm gì?
3. **Blockers**: Có vấn đề gì cần hỗ trợ?

### Update trên GitHub:
- Comment vào Issue đang làm
- Update status trên Project board
- Tag người cần hỗ trợ

---

## 📊 Bước 8: Tracking Progress

### Weekly Review:
- Check Sprint progress
- Count: Issues Done / Total Issues
- Identify blockers
- Re-prioritize if needed

### Metrics quan trọng:
- ✅ Issues completed
- 🚧 Issues in progress
- ⏰ Issues overdue
- 🔴 High-priority pending

---

## 🔧 Bước 9: Sử dụng GitHub Projects (Advanced)

### Custom Fields:
- **Priority**: High, Medium, Low
- **Effort**: 1, 2, 3, 5, 8 (story points)
- **Service**: User, EV Data, Marketplace, etc.

### Filters:
```
assignee:@me is:open label:high-priority
milestone:"Sprint 1" is:open
label:backend -label:documentation
```

### Views:
- **Board View**: Kanban board
- **Table View**: Spreadsheet với custom fields
- **Roadmap View**: Timeline

---

## 📚 Bước 10: Tài liệu Confluence (BẮT BUỘC)

### Nội dung cần viết:

1. **Architecture Document**:
   - System overview
   - Microservices diagram
   - Database schema
   - Technology stack

2. **API Documentation**:
   - All endpoints
   - Request/Response examples
   - Authentication
   - Error codes

3. **User Guide**:
   - How to use (cho 4 actors)
   - Screenshots
   - Troubleshooting

4. **Development Guide**:
   - Setup local environment
   - Git workflow
   - Coding standards
   - Testing guidelines

5. **Deployment Guide**:
   - Docker setup
   - Environment variables
   - Production checklist

### Link Confluence với GitHub:
- Add Confluence link vào README.md
- Reference GitHub Issues trong Confluence docs
- Cross-link documentation

---

## ✅ Checklist Setup

- [ ] Tạo GitHub repository
- [ ] Enable Issues
- [ ] Tạo Project board với 5 columns
- [ ] Tạo 3 Milestones (Sprint 1, 2, 3)
- [ ] Tạo Labels (feature, bug, documentation, etc.)
- [ ] Tạo tất cả Issues từ TODOLIST.md
- [ ] Assign Issues cho team members
- [ ] Setup branch protection rules (develop, main)
- [ ] Invite team members
- [ ] Setup Confluence workspace
- [ ] Create initial documentation structure

---

## 🔗 Links hữu ích

- **GitHub Issues**: https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues
- **GitHub Projects**: https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/projects
- **Confluence**: [Your Confluence link]
- **TODOLIST**: [TODOLIST.md](./TODOLIST.md)

---

## 💡 Tips

1. **Tạo Issue templates** để dễ dàng tạo Issue mới
2. **Use GitHub CLI** để tạo Issues nhanh hơn
3. **Automate** với GitHub Actions (auto-label, auto-assign)
4. **Regular updates** - Comment vào Issues thường xuyên
5. **Link PRs với Issues** - Dùng keywords: Closes #1, Fixes #2
6. **Documentation first** - Viết docs song song với code (BẮT BUỘC)

---

**Deadline: 18/11/2025** ⏰

Good luck! 🚀
