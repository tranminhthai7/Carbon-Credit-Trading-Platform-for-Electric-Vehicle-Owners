# 📋 Tổng hợp Tài liệu Hướng dẫn

## 🎯 Mục đích
Repository này chứa đầy đủ tài liệu và hướng dẫn cho dự án **Carbon Credit Trading Platform for Electric Vehicle Owners**.

---

## 📚 Danh sách Tài liệu

### 1. README.md
**Mô tả**: Giới thiệu tổng quan dự án  
**Nội dung**:
- Giới thiệu dự án
- Actors & chức năng
- Kiến trúc Microservices
- Tech stack
- Hướng dẫn cài đặt cơ bản
- Timeline

**👉 [Đọc README.md](./README.md)**

---

### 2. TODOLIST.md ⭐ QUAN TRỌNG
**Mô tả**: Danh sách chi tiết tất cả công việc cần làm  
**Nội dung**:
- 190+ tasks được chia thành 4 phases
- Phase 1: Setup & Planning (4 ngày)
- Phase 2: Core Services Development (7 ngày)
- Phase 3: Advanced Features & Frontend (4 ngày)
- Phase 4: Testing & Deployment (4 ngày)
- Phân công công việc cho 4-5 người
- Definition of Done
- Checklist cuối cùng

**👉 [Đọc TODOLIST.md](./TODOLIST.md)**

---

### 3. GITHUB_GUIDE.md ⭐ QUAN TRỌNG
**Mô tả**: Hướng dẫn sử dụng GitHub Issues & Projects  
**Nội dung**:
- Cách tạo GitHub Issues
- Setup GitHub Projects (Kanban board)
- Tạo Milestones (Sprints)
- Git workflow & branch strategy
- Quy trình làm việc hàng ngày
- Phân công công việc
- Link với Confluence

**👉 [Đọc GITHUB_GUIDE.md](./GITHUB_GUIDE.md)**

---

### 4. ARCHITECTURE.md ⭐ QUAN TRỌNG
**Mô tả**: Kiến trúc chi tiết hệ thống Microservices  
**Nội dung**:
- Architecture diagram
- Chi tiết 9 microservices
- Database schema cho từng service
- API endpoints
- Service communication (REST + Message Queue)
- Docker setup
- Security & best practices

**👉 [Đọc ARCHITECTURE.md](./ARCHITECTURE.md)**

---

### 5. DOCKER_GUIDE.md ⭐ BẮT BUỘC
**Mô tả**: Hướng dẫn setup và chạy Docker  
**Nội dung**:
- Cài đặt Docker
- docker-compose.yml đầy đủ (9 services + infrastructure)
- Dockerfile cho từng service
- Environment variables (.env)
- Commands (start, stop, logs)
- Troubleshooting

**👉 [Đọc DOCKER_GUIDE.md](./DOCKER_GUIDE.md)**

---

### 6. CONFLUENCE_TEMPLATE.md ⭐ BẮT BUỘC
**Mô tả**: Template viết tài liệu Confluence  
**Nội dung**:
- Cấu trúc tài liệu Confluence
- 14 sections bắt buộc:
  1. Project Overview
  2. Stakeholders & Actors
  3. System Architecture
  4. Database Design
  5. API Documentation
  6. Business Flows
  7. Testing Strategy
  8. Deployment
  9. Monitoring & Logging
  10. Security
  11. User Manual
  12. Troubleshooting
  13. References
  14. Checklist
- Tips viết Confluence

**👉 [Đọc CONFLUENCE_TEMPLATE.md](./CONFLUENCE_TEMPLATE.md)**

---

### 7. CONTRIBUTING.md
**Mô tả**: Quy trình làm việc và coding standards  
**Nội dung**:
- Git workflow
- Branch naming convention
- Commit message format
- Pull Request process
- Code review checklist
- Testing requirements
- Coding standards (Node.js/Java/Python)
- Security guidelines
- Documentation standards
- Common mistakes to avoid

**👉 [Đọc CONTRIBUTING.md](./CONTRIBUTING.md)**

---

### 8. SAMPLE_DATA.md
**Mô tả**: Dữ liệu mẫu cho testing  
**Nội dung**:
- Trip data format (CSV & JSON)
- CO2 calculation formula
- Sample monthly/yearly data
- API usage examples
- Real-world examples

**👉 [Đọc SAMPLE_DATA.md](./SAMPLE_DATA.md)**

---

### 9. Đề Bài
**Mô tả**: Requirements gốc từ giảng viên  
**Nội dung**:
- Chức năng cho 4 actors
- Use cases
- Business requirements

**👉 [Đọc Đề Bài](./Đề%20Bài)**

---

## 🎯 Workflow Đề xuất

### Tuần 1 (31/10 - 06/11): Setup & Planning

**Ngày 1-2 (31/10 - 01/11)**:
1. ✅ Đọc tất cả tài liệu (2-3 giờ)
2. ✅ Setup GitHub Issues & Projects (theo GITHUB_GUIDE.md)
3. ✅ Phân công công việc trong team
4. ✅ Setup môi trường dev (Docker, Git, IDE)

**Ngày 3-4 (02/11 - 03/11)**:
1. ✅ Viết tài liệu Confluence (theo CONFLUENCE_TEMPLATE.md) - BẮT BUỘC
2. ✅ Thiết kế Database schema
3. ✅ Setup Docker (theo DOCKER_GUIDE.md)

**Ngày 5-7 (04/11 - 06/11)**:
1. ✅ Phát triển Core services (User, EV Data, Carbon Credit)
2. ✅ Daily standup & update GitHub

---

### Tuần 2 (07/11 - 13/11): Features & Integration

**Ngày 8-10 (07/11 - 09/11)**:
1. ✅ Marketplace, Payment, Verification services
2. ✅ Frontend development bắt đầu
3. ✅ Service integration

**Ngày 11-14 (10/11 - 13/11)**:
1. ✅ Reporting, Notification, AI services
2. ✅ Frontend hoàn thiện
3. ✅ Integration testing

---

### Tuần 3 (14/11 - 18/11): Testing & Deployment

**Ngày 15-16 (14/11 - 15/11)**:
1. ✅ Unit testing (>70% coverage)
2. ✅ Integration testing
3. ✅ E2E testing

**Ngày 17-18 (16/11 - 17/11)**:
1. ✅ Bug fixing
2. ✅ Hoàn thiện tài liệu Confluence - BẮT BUỘC
3. ✅ Update API documentation

**Ngày 19 (18/11)**:
1. ✅ Final review
2. ✅ Demo preparation
3. ✅ Git cleanup & tag release
4. ✅ Submit project

---

## 🔥 Priorities (BẮT BUỘC)

### Must-Have (BẮT BUỘC):
1. ✅ **Microservices Architecture** - Tất cả services phải tách biệt
2. ✅ **Docker** - docker-compose.yml hoạt động đầy đủ
3. ✅ **GitHub** - Toàn bộ code phải trên GitHub
4. ✅ **Confluence Documentation** - Tài liệu đầy đủ theo template
5. ✅ **GitHub Issues/Projects** - Planning & tracking rõ ràng

### Core Features (Priority cao):
1. ✅ User authentication (4 roles)
2. ✅ EV data import & CO2 calculation
3. ✅ Carbon credit wallet
4. ✅ Marketplace (fixed price)
5. ✅ Payment & withdrawal
6. ✅ CVA verification
7. ✅ Basic reports

### Optional Features (Priority thấp):
1. ⭕ Auction mechanism
2. ⭕ AI price suggestion
3. ⭕ Real-time notifications
4. ⭕ Advanced analytics
5. ⭕ Email notifications

---

## 👥 Phân công Đề xuất (4-5 người)

### Team Member 1: Team Lead + Backend (User Service)
**Nhiệm vụ**:
- User Service (Authentication)
- Marketplace Service (partial)
- Notification Service
- Project management
- Documentation coordination

**Skills cần**: Backend, Git, Leadership

---

### Team Member 2: Backend Developer (EV Data)
**Nhiệm vụ**:
- EV Data Service
- AI Service (optional)
- Marketplace Service (partial)

**Skills cần**: Backend, Algorithms (CO2 calculation)

---

### Team Member 3: Backend Developer (Carbon Credit & Payment)
**Nhiệm vụ**:
- Carbon Credit Service
- Payment Service
- Integration với Marketplace

**Skills cần**: Backend, Payment systems

---

### Team Member 4: Backend Developer (Verification & Reporting)
**Nhiệm vụ**:
- Verification Service (CVA)
- Reporting Service
- Admin features

**Skills cần**: Backend, Data analytics

---

### Team Member 5: Frontend Developer
**Nhiệm vụ**:
- Frontend development (React/Vue)
- UI/UX design
- API integration
- Frontend documentation

**Skills cần**: Frontend, UI/UX

---

### DevOps: (Team Member 1 hoặc người có kinh nghiệm)
**Nhiệm vụ**:
- Docker & docker-compose setup
- API Gateway configuration
- CI/CD (optional)

**Skills cần**: Docker, Nginx

---

## 📊 Tracking Progress

### Daily:
- [ ] Update GitHub Project board
- [ ] Comment progress vào Issues
- [ ] Commit & push code

### Weekly (Sprint Review):
- [ ] Demo completed features
- [ ] Update Confluence documentation
- [ ] Plan next week tasks
- [ ] Resolve blockers

---

## ⚠️ Common Mistakes to Avoid

1. ❌ **Không đọc tài liệu** → Làm sai hướng
   ✅ Đọc kỹ tất cả docs trước khi bắt đầu

2. ❌ **Không dùng Git properly** → Merge conflicts, mất code
   ✅ Follow CONTRIBUTING.md, tạo feature branches

3. ❌ **Hardcode secrets** → Security issues
   ✅ Dùng .env file

4. ❌ **Không test** → Bugs ở production
   ✅ Unit tests + integration tests

5. ❌ **Viết docs cuối cùng** → Không kịp deadline
   ✅ Viết docs song song với code (BẮT BUỘC)

6. ❌ **Không communication** → Duplicate work, blockers
   ✅ Daily updates, ask questions

7. ❌ **Làm monolith thay vì microservices** → Không đáp ứng yêu cầu
   ✅ Tách service ngay từ đầu

---

## 🆘 Help & Support

### Nếu gặp vấn đề:

1. **Check documentation first**:
   - README.md
   - ARCHITECTURE.md
   - DOCKER_GUIDE.md
   - CONTRIBUTING.md

2. **Search existing Issues**:
   - Có thể đã có người gặp vấn đề tương tự

3. **Ask team**:
   - Team chat (Discord/Slack/Zalo)
   - GitHub Discussions

4. **Create Issue**:
   - Label: `question` hoặc `help-wanted`
   - Tag relevant members

---

## ✅ Final Checklist (18/11/2025)

### Code:
- [ ] Tất cả services hoạt động
- [ ] Docker compose up thành công
- [ ] 4 actors có thể sử dụng hệ thống
- [ ] Unit tests passed (>70% coverage)
- [ ] Integration tests passed
- [ ] No critical bugs

### Documentation:
- [ ] README.md hoàn chỉnh
- [ ] Confluence documentation đầy đủ (BẮT BUỘC)
- [ ] API documentation (Postman collection)
- [ ] ARCHITECTURE.md updated
- [ ] User manual với screenshots

### GitHub:
- [ ] All code on GitHub (BẮT BUỘC)
- [ ] GitHub Issues created & tracked
- [ ] GitHub Projects board updated
- [ ] All PRs merged
- [ ] Release v1.0.0 tagged

### Docker:
- [ ] docker-compose.yml works (BẮT BUỘC)
- [ ] All services containerized
- [ ] .env.example provided
- [ ] Docker documentation complete

### Demo:
- [ ] Demo video/slides prepared
- [ ] Seed data ready
- [ ] Demo script written
- [ ] All features demoed

---

## 🎓 Learning Resources

### Microservices:
- [Microservices.io](https://microservices.io/)
- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)

### Docker:
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

### REST API:
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

### Git:
- [Git Book](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 📧 Contact

- **Repository**: https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
- **Issues**: https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues
- **Confluence**: [Your Confluence link here]

---

**Deadline: 18/11/2025** ⏰

**Chúc team thành công! 🚀**
