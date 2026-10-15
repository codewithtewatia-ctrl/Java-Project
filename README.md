# ProjectFlow – Online Project Management Tool

**ProjectFlow** is a modern, commercial-grade full-stack Online Project Management Tool designed for high-performance software engineering teams and enterprise organizations. It features Role-Based Access Control (RBAC), real-time progress calculations, interactive graphical analytics, task assignment workflows, and JWT authentication.

---

## 🚀 Key Features

### 👑 Admin Management
- **User Administration**: Create, edit, deactivate, and delete user accounts. Assign roles (`ADMIN`, `PROJECT_MANAGER`, `TEAM_MEMBER`).
- **System Metrics & Analytics**: Monitor total users, active accounts, project status distributions, and task completion velocity via interactive charts.
- **System Settings**: Configure application branding, default project/task statuses, email notifications, and self-registration policies.

### 📊 Project Manager Capabilities
- **Project Lifecycle Management**: Initialize projects with title, description, start/end dates, and status (`PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED`).
- **Task Assignment**: Assign tasks to team members with set priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) and target due dates. Triggers toast notification: *"Task assigned successfully."*
- **Progress Monitoring**: Automatic real-time progress calculation based on task completion (`(completed / total) * 100`).
- **Team Workload Breakdown**: Track individual task allocation and performance across team members.

### 💻 Team Member Features
- **My Tasks Dashboard**: View assigned tasks in a responsive table/card interface with status update dropdowns (`TODO` ➔ `IN_PROGRESS` ➔ `REVIEW` ➔ `COMPLETED`).
- **Overdue Alerts**: Automatic detection and visual highlighting of overdue tasks.
- **Project Information**: Access assigned project timelines, team managers, and completion statistics.
- **Profile Management**: Update personal name, email, and password.

---

## 🔑 Demo Credentials (Ready Out-Of-The-Box)

The application automatically seeds realistic demo data on launch:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@projectflow.com` | `admin123` | Full System & User CRUD, Settings, Metrics |
| **Project Manager** | `manager@projectflow.com` | `manager123` | Project Creation, Task Assignment, Monitoring |
| **Developer (Team Member)** | `developer@projectflow.com` | `dev123` | Assigned Tasks, Task Status Updates |
| **UI/UX Designer (Team Member)**| `designer@projectflow.com` | `design123` | Assigned Tasks, Profile Management |
| **QA Tester (Team Member)** | `tester@projectflow.com` | `test123` | Assigned Tasks, Task Status Updates |

> 💡 *Note: The Login screen includes one-click demo login buttons for instant testing!*

---

## 🛠️ Technology Stack

- **Backend**:
  - Java 17+ / Spring Boot 3.2
  - Spring Security 6 with JWT Authentication & BCrypt Password Hashing
  - Spring Data JPA with H2 / MySQL Relational Databases
  - SpringDoc OpenAPI / Swagger UI (`/swagger-ui.html`)
  - Maven (`mvnw.cmd` wrapper included)

- **Frontend**:
  - React 18 & Vite
  - React Router v6
  - TailwindCSS with Glassmorphism aesthetic & dark/light accents
  - Lucide React Iconography
  - Recharts for Interactive Pie, Bar, and Line Analytics

---

## 📂 Project Structure

```
projectflow/
├── backend/
│   ├── src/main/java/com/projectflow/
│   │   ├── config/          # Security, CORS, Swagger & DataInitializer
│   │   ├── controller/      # REST API Controllers
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── entity/          # JPA Domain Entities (User, Project, Task, etc.)
│   │   ├── exception/       # Global Exception Handler
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # JWT Filter, Token Provider, UserDetails
│   │   └── service/         # Business Logic Services
│   ├── src/main/resources/
│   │   └── application.yml  # Dual H2 + MySQL configuration
│   ├── mvnw.cmd             # Embedded Maven Wrapper
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, Modal, StatusBadge, Toast
│   │   ├── context/         # AuthContext & ToastContext
│   │   ├── layouts/         # Responsive DashboardLayout
│   │   ├── pages/           # Admin, Manager, Member dashboards & modules
│   │   ├── services/        # Axios API Client & Services
│   │   ├── App.jsx          # Protected Routes & RBAC Router
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚡ How to Run the Application

### 1. Start the Java Backend
Open a terminal in the `backend/` directory and run:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```
*(The backend runs on `http://localhost:8080` with auto-seeded H2 file database at `./data/projectflowdb`)*

- **Swagger API Docs**: Navigate to `http://localhost:8080/swagger-ui.html`
- **H2 Database Console**: Navigate to `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/projectflowdb`, Username: `sa`, Password: leave blank).

#### 🛢️ Using MySQL (Optional)
To switch to a local MySQL database, edit `backend/src/main/resources/application.yml` and uncomment the MySQL configuration lines:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/projectflow?createDatabaseIfNotExist=true&useSSL=false
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: your_mysql_password
  jpa:
    database-platform: org.hibernate.dialect.MySQLDialect
```

---

### 2. Start the React Frontend
Open a separate terminal in the `frontend/` directory and run:

```bash
cd frontend
npm run dev
```
*(The frontend runs on `http://localhost:5173` with proxy pre-configured to `http://localhost:8080`)*

---

## 🔄 End-to-End Demonstration Workflow

1. **Admin Login**:
   - Sign in as `admin@projectflow.com` / `admin123`.
   - Access **Admin Dashboard** to view system metrics, user role distribution, and system configuration settings.
   - Create a new Project Manager user account.

2. **Project Manager Login**:
   - Sign in as `manager@projectflow.com` / `manager123`.
   - Access **Manager Dashboard** to view managed projects.
   - Click **Create Project** ➔ Fill details ➔ Receives confirmation: *"Project created successfully."*
   - Click **Assign New Task** ➔ Assign task to Developer/Designer ➔ Receives confirmation: *"Task assigned successfully."*

3. **Team Member Login**:
   - Sign in as `developer@projectflow.com` / `dev123`.
   - Access **Member Dashboard** to view assigned tasks.
   - Change task status from `IN_PROGRESS` ➔ `COMPLETED` using the dropdown.
   - Receives confirmation: *"Task status updated successfully."*

4. **Real-time Metric Calculation**:
   - Switch back to Manager or Admin Dashboard: Notice project progress %, task completion count, and interactive graphs updated automatically.

---

## 📄 License & Presentation Note
Built for 3rd-semester live project demonstration.
