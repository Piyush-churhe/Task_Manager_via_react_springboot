# ✅ Task Manager - Full Stack Web Application

A secure and responsive full-stack Task Manager application built with **Spring Boot** backend and **React** frontend. Features user authentication, role-based access control, and complete task management capabilities.

## 🚀 Live Demo
**Frontend URL:** `https://task-manager-00.onrender.com/`  
**Backend API:** `https://task-manager-0.onrender.com/`

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based user registration and login
- Role-based access control (Admin/User)
- Secure password storage with encryption
- Protected API endpoints

### 📝 Task Management
- **Create, Read, Update, Delete (CRUD)** tasks
- Task attributes: title, description, priority, status, due date
- Filter tasks by status (Pending, In Progress, Completed)
- Search and sort functionality
- Personal task dashboard for users

### 👑 Admin Capabilities
- Admin dashboard with system overview
- Manage all users and tasks
- Assign tasks to specific users
- View system analytics and reports
- User role management

## 🛠️ Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.x**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** relational database
- **Maven** for dependency management
- **RESTful API** architecture

### Frontend
- **React 18** with functional components
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with modern responsive design
- **Context API** for state management

## 📦 Installation & Setup

### Prerequisites
- Java JDK 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### Backend Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/Piyush-churhe/Task_Manager_via_react_springboot.git
   cd Task_Manager_via_react_springboot/backend

2. **Configure MySQL Database**
   ```bash
   CREATE DATABASE task_manager;

3. **Update application properties**
   ```bash
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/task_manager
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   jwt.secret=your_jwt_secret_key

4. **Run the Spring Boot application**
   ```bash
   ./mvnw spring-boot:run


### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd ../frontend

2. **Install dependencies**
   ```bash
   npm install

3. **Start React development server**
   ```bash
   npm start


## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/refresh` - Refresh JWT token

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/tasks` - Get all tasks
- `POST /api/admin/tasks/assign` - Assign task to user


## 👥 Default Users

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `ADMIN`

### Regular User
- Register through the signup form
- Automatic `USER` role assignment

## 🔒 Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based endpoint protection
- CORS configuration
- Input validation and sanitization
- SQL injection prevention

## 🚀 Deployment

### Backend (Spring Boot)
```bash
./mvnw clean package
java -jar target/task-manager-0.0.1-SNAPSHOT.jar
```

### Frontend (React)
```bash
npm run build
```


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Piyush Churhe**
- Email: churhepiyush@gmail.com
- LinkedIn: [Piyush Churhe](https://www.linkedin.com/in/piyush-churhe/)
- GitHub: [Piyush-churhe](https://github.com/Piyush-churhe)
