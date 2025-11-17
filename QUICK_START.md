# 🚀 Quick Start Guide

## ⚡ Setup trong 30 phút

### Bước 1: Clone Repository (2 phút)
```powershell
git clone https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners.git
cd Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
```

---

### Bước 2: Đọc Tài liệu Quan trọng (15 phút)

**BẮT BUỘC đọc**:
1. ✅ [README.md](./README.md) - 3 phút
2. ✅ [TODOLIST.md](./TODOLIST.md) - 5 phút  
3. ✅ [ARCHITECTURE.md](./ARCHITECTURE.md) - 5 phút
4. ✅ [GITHUB_GUIDE.md](./GITHUB_GUIDE.md) - 2 phút

**Đọc sau khi setup**:
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)
- [CONFLUENCE_TEMPLATE.md](./CONFLUENCE_TEMPLATE.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

---

### Bước 3: Setup GitHub (10 phút)

1. **Tạo GitHub Issues** (5 phút):
   ```powershell
   # Option 1: Thủ công
   # Vào https://github.com/your-repo/issues
   # Click "New Issue"
   # Copy tasks từ TODOLIST.md
   
   # Option 2: Dùng GitHub CLI (nếu có)
   gh issue create --title "[SETUP-01] Tạo repository structure" ^
                    --label "feature,high-priority" ^
                    --milestone "Sprint 1"
   ```

2. **Tạo GitHub Project** (3 phút):
   - Vào tab "Projects" → "New Project"
   - Chọn template "Board"
   - Tạo columns: Backlog, To Do, In Progress, Review, Done

3. **Tạo Milestones** (2 phút):
   - Sprint 1: 31/10 - 06/11
   - Sprint 2: 07/11 - 13/11
   - Sprint 3: 14/11 - 18/11

---

### Bước 4: Phân Công Công việc (3 phút)

Assign Issues cho team members:

**@member1** (Team Lead + Backend):
- USER-01 to USER-04
- MKT-01, MKT-06
- NOTIF-01, NOTIF-02

**@member2** (Backend):
- EV-01 to EV-04
- AI-01
- MKT-03 to MKT-05

**@member3** (Backend):
- CC-01 to CC-03
- PAY-01 to PAY-03

**@member4** (Backend):
- CVA-01 to CVA-03
- RPT-01 to RPT-03

**@member5** (Frontend):
- FE-01 to FE-07
- INT-01

---

## 🔥 First Tasks (Day 1)

### Task 1: Setup Project Structure (1 giờ)

```powershell
# Tạo folders
mkdir services
cd services
mkdir user-service, ev-data-service, carbon-credit-service
mkdir marketplace-service, payment-service, verification-service
mkdir notification-service, reporting-service, ai-service

cd ..
mkdir api-gateway, frontend, docs
```

### Task 2: Viết Confluence Documentation (2-3 giờ)

1. Tạo Confluence workspace
2. Copy nội dung từ [CONFLUENCE_TEMPLATE.md](./CONFLUENCE_TEMPLATE.md)
3. Điền thông tin team
4. Add architecture diagrams

### Task 3: Setup Docker (2 giờ)

1. Install Docker Desktop
2. Create `.env` file:
   ```env
   POSTGRES_USER=admin
   POSTGRES_PASSWORD=secret123
   JWT_SECRET=your-secret-key
   ```
3. Copy [docker-compose.yml](./DOCKER_GUIDE.md#docker-composeyml) from DOCKER_GUIDE.md

---

## 📝 Daily Workflow

### Morning (30 phút):
1. Check GitHub notifications
2. Review assigned Issues
3. Update Project board
4. Comment plan for the day

### Coding (5-6 giờ):
1. Create feature branch: `git checkout -b feature/USER-01`
2. Code + commit frequently
3. Write unit tests
4. Update API docs

### Evening (30 phút):
1. Push code: `git push origin feature/USER-01`
2. Create PR if done
3. Update Issue status
4. Comment progress

---

## ⚠️ Red Flags - Cần báo ngay!

🚨 **Cảnh báo nếu**:
- Stuck quá 2 giờ → Ask for help
- Merge conflict → Resolve immediately
- Docker không chạy → Check logs
- Test fails → Debug before moving on
- Lạc hậu > 2 days so với sprint → Re-plan

---

## 🎯 Success Metrics

### Week 1 (06/11):
- [ ] 40+ Issues created
- [ ] 20+ Issues done
- [ ] 3 core services working (User, EV Data, Carbon Credit)
- [ ] Docker setup complete
- [ ] Confluence docs 50% done

### Week 2 (13/11):
- [ ] All 9 services working
- [ ] Frontend 80% done
- [ ] Integration complete
- [ ] Confluence docs 80% done

### Week 3 (18/11):
- [ ] All tests passed
- [ ] Documentation 100%
- [ ] Demo ready
- [ ] GitHub clean

---

## 🔗 Quick Links

- 📚 [GUIDE_SUMMARY.md](./GUIDE_SUMMARY.md) - Tổng hợp tài liệu
- 📋 [TODOLIST.md](./TODOLIST.md) - Chi tiết tasks
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc hệ thống
- 🐳 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Setup Docker
- 📖 [CONFLUENCE_TEMPLATE.md](./CONFLUENCE_TEMPLATE.md) - Viết docs
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Quy trình làm việc

---

## ✅ Checklist Ngày Đầu

- [ ] Clone repository
- [ ] Đọc README, TODOLIST, ARCHITECTURE (15 phút)
- [ ] Setup GitHub Issues & Projects (10 phút)
- [ ] Phân công công việc (5 phút)
- [ ] Tạo project structure (1 giờ)
- [ ] Install Docker (30 phút)
- [ ] Bắt đầu viết Confluence docs (2 giờ)
- [ ] Team meeting - sync up (30 phút)

**Total: ~5 giờ**

---

**Let's go! 🚀**

Deadline: 18/11/2025 ⏰
