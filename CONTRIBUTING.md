# 🤝 Contributing Guidelines

## 📋 Quy trình Làm việc

### 1. Setup môi trường

```powershell
# Clone repository
git clone https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners.git

# Checkout develop branch
cd Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners
git checkout develop

# Install dependencies (nếu có)
# npm install / mvn install / pip install -r requirements.txt
```

---

## 🌳 Git Workflow

### Branch Strategy

```
main (production-ready)
  └── develop (integration)
       ├── feature/USER-01-user-registration
       ├── feature/EV-02-trip-import
       ├── feature/MKT-03-marketplace
       └── bugfix/payment-issue
```

### Branch Naming Convention

- **Feature**: `feature/<ISSUE-ID>-<short-description>`
  - Example: `feature/USER-01-user-registration`
  
- **Bugfix**: `bugfix/<ISSUE-ID>-<short-description>`
  - Example: `bugfix/PAY-05-payment-error`

- **Hotfix**: `hotfix/<description>`
  - Example: `hotfix/security-patch`

---

## 📝 Commit Message Format

### Template:
```
[ISSUE-ID] <type>: <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples:

```
[USER-01] feat: Implement user registration API

- Add POST /api/users/register endpoint
- Validate email and password
- Hash password with bcrypt
- Return JWT token

Closes #1
```

```
[EV-02] fix: Fix CO2 calculation formula

- Update conversion rate from 0.15 to 0.10
- Add unit tests for edge cases

Fixes #15
```

---

## 🔄 Pull Request Process

### 1. Create Feature Branch

```powershell
# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/USER-01-user-registration
```

### 2. Code & Commit

```powershell
# Make changes...

# Stage changes
git add .

# Commit with proper message
git commit -m "[USER-01] feat: Implement user registration API"

# Push to remote
git push origin feature/USER-01-user-registration
```

### 3. Create Pull Request

1. Vào GitHub repository
2. Click "Compare & pull request"
3. **Base**: `develop` ← **Compare**: `feature/USER-01-user-registration`
4. Điền thông tin PR:

```markdown
## Description
Implement user registration API for all 4 roles (EV Owner, Buyer, CVA, Admin)

## Changes
- [x] Add POST /api/users/register endpoint
- [x] Validate input (email, password strength)
- [x] Hash password with bcrypt
- [x] Store user in PostgreSQL
- [x] Return JWT token
- [x] Add unit tests (80% coverage)

## Testing
- Unit tests: ✅ Passed
- Integration tests: ✅ Passed
- Manual testing: ✅ Tested with Postman

## Screenshots
(If applicable)

## Related Issues
Closes #1
```

### 4. Code Review

- **Ít nhất 1 người review** trước khi merge
- Address review comments
- Update code nếu cần

### 5. Merge

- Sau khi approved → Merge vào `develop`
- **Squash commits** (optional, để history sạch hơn)
- Delete feature branch sau khi merge

---

## 👀 Code Review Checklist

### Reviewer phải check:

- [ ] Code follows project structure
- [ ] No hardcoded values (use env variables)
- [ ] Error handling implemented
- [ ] Input validation present
- [ ] Tests included and passing
- [ ] No console.log / System.out.println (use logger)
- [ ] Code is readable and well-commented
- [ ] API documentation updated
- [ ] No merge conflicts
- [ ] No security vulnerabilities

### Comments:

- **Approve** ✅ - Code good to merge
- **Request changes** 🔴 - Must fix before merge
- **Comment** 💬 - Suggestions (optional)

---

## 🧪 Testing Requirements

### Before creating PR:

1. **Unit Tests**:
   ```powershell
   # Node.js
   npm test
   
   # Java
   mvn test
   
   # Python
   pytest
   ```

2. **Code Coverage**:
   - Minimum: **70%**
   - Check với: `npm run test:coverage`

3. **Linting**:
   ```powershell
   # Node.js
   npm run lint
   
   # Python
   flake8 .
   ```

4. **Integration Tests**:
   - Test API endpoints với Postman
   - Check database connections

---

## 📂 Project Structure

### Backend Service Structure:

```
services/user-service/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Auth, validation, etc.
│   ├── utils/             # Helper functions
│   └── config/            # Configuration
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── package.json
└── README.md
```

### Frontend Structure:

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API calls
│   ├── store/             # State management
│   ├── utils/
│   └── App.js
├── public/
├── Dockerfile
└── package.json
```

---

## 📖 Coding Standards

### Node.js (JavaScript/TypeScript):

```javascript
// Use async/await instead of callbacks
async function getUser(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
}

// Use descriptive variable names
const userId = req.params.id; // Good
const x = req.params.id;      // Bad

// Use const/let, not var
const MAX_RETRIES = 3;
let retryCount = 0;
```

### Java (Spring Boot):

```java
// Use @Service, @Repository, @Controller annotations
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(UserDto dto) {
        // Validate input
        if (dto.getEmail() == null) {
            throw new ValidationException("Email is required");
        }
        
        // Business logic
        User user = new User();
        user.setEmail(dto.getEmail());
        
        return userRepository.save(user);
    }
}
```

### Python (FastAPI):

```python
# Use type hints
from typing import List, Optional

async def get_users(skip: int = 0, limit: int = 100) -> List[User]:
    """Get list of users with pagination"""
    users = await User.query.offset(skip).limit(limit).gino.all()
    return users

# Use Pydantic models for validation
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole
```

---

## 🔒 Security Guidelines

### 1. Never commit sensitive data:
```
# ❌ Bad
const DB_PASSWORD = "secret123";

# ✅ Good
const DB_PASSWORD = process.env.DB_PASSWORD;
```

### 2. Always validate input:
```javascript
// Validate email format
if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email format');
}

// Sanitize user input
const cleanInput = sanitize(userInput);
```

### 3. Use parameterized queries:
```javascript
// ❌ Bad (SQL injection)
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

### 4. Hash passwords:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 📝 Documentation

### Code Comments:

```javascript
/**
 * Calculate CO2 savings from trip data
 * 
 * @param {number} distanceKm - Distance traveled in kilometers
 * @param {number} energyKwh - Energy consumed in kWh
 * @returns {number} CO2 saved in kilograms
 */
function calculateCO2Savings(distanceKm, energyKwh) {
  const GASOLINE_EMISSION = 0.12; // kg CO2 per km
  const EV_EMISSION = 0.02;       // kg CO2 per km
  
  return (GASOLINE_EMISSION - EV_EMISSION) * distanceKm;
}
```

### API Documentation:

```javascript
/**
 * @api {post} /api/users/register Register new user
 * @apiName RegisterUser
 * @apiGroup User
 * 
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password (min 8 chars)
 * @apiParam {String} role User role (EV_OWNER, BUYER, CVA, ADMIN)
 * 
 * @apiSuccess {String} token JWT token
 * @apiSuccess {Object} user User object
 * 
 * @apiError (400) ValidationError Invalid input
 * @apiError (409) EmailExists Email already registered
 */
```

---

## 🐛 Bug Report Format

### GitHub Issue Template:

```markdown
## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Screenshots
If applicable.

## Environment
- OS: Windows 10
- Browser: Chrome 120
- Node version: 18.17.0

## Additional Context
Any other relevant information.
```

---

## ✅ Definition of Done

Một task được coi là "Done" khi:

- [ ] Code written và hoạt động đúng
- [ ] Unit tests viết và passed (>70% coverage)
- [ ] Integration tests passed
- [ ] Code được review và approved
- [ ] No linting errors
- [ ] API documentation updated
- [ ] Merge conflicts resolved
- [ ] Merged vào develop branch
- [ ] Issue closed/updated trên GitHub

---

## 🚫 Common Mistakes to Avoid

### 1. Không test trước khi push
❌ Push code chưa test → CI fails → blocking team

✅ Test locally → Push → CI passes

### 2. Commit trực tiếp vào develop/main
❌ `git commit -m "fix" && git push origin develop`

✅ Luôn tạo feature branch → PR → Review → Merge

### 3. Commit messages không rõ ràng
❌ `git commit -m "fix bug"`

✅ `git commit -m "[USER-01] fix: Validate email format before registration"`

### 4. Không update branch trước khi tạo PR
❌ Feature branch lạc hậu → Merge conflicts

✅ `git checkout develop && git pull && git checkout feature/xxx && git merge develop`

### 5. Hardcode sensitive data
❌ `const API_KEY = "abc123"`

✅ `const API_KEY = process.env.API_KEY`

---

## 🆘 Getting Help

### If stuck:
1. Check documentation (README, ARCHITECTURE, etc.)
2. Search existing Issues
3. Ask in team chat
4. Create Question Issue với label `question`

### If found bug:
1. Check if already reported
2. Create Bug Issue với đầy đủ thông tin
3. Tag relevant team members

---

## 📊 Team Workflow

### Daily:
- Update GitHub Project board
- Comment progress vào Issues
- Sync với team về blockers

### Weekly:
- Sprint review meeting
- Demo completed features
- Plan next sprint

---

## 🎓 Resources

- [Git Best Practices](https://git-scm.com/book/en/v2)
- [REST API Design](https://restfulapi.net/)
- [Docker Documentation](https://docs.docker.com/)
- [Microservices Patterns](https://microservices.io/)

---

**Hãy đọc kỹ guidelines này trước khi contribute!** 📚

Deadline: 18/11/2025 ⏰

Good luck! 🚀
