# 🎓 ClassCraft - University Management System

ClassCraft is a modern, full-stack web application designed to streamline university academic management. It provides a comprehensive solution for administrators, professors, and students to manage and access academic information, schedules, and resources in real-time.

## ✨ Key Features

### 👥 User Management
- Role-based access control (Admin, Professor, Student)
- Secure JWT authentication
- User profile management
- Password recovery system

### 📚 Academic Management
- Department and Program (Filiere) management
- Course and module organization
- Student group management
- Professor assignment to courses

### 📅 Scheduling System
- Interactive timetable management
- Classroom allocation
- Conflict detection and prevention
- Real-time schedule updates

### 📊 Reporting & Exports
- Generate PDF reports and timetables
- Export data to Excel
- Customizable report templates
- Batch export capabilities

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Security:** Spring Security with JWT
- **Database:** MySQL 8+
- **ORM:** Spring Data JPA (Hibernate)
- **Build Tool:** Maven
- **Java Version:** 17+

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **UI Components:** Material-UI
- **State Management:** React Query
- **HTTP Client:** Axios
- **PDF Generation:** @react-pdf/renderer, jsPDF
- **Excel Export:** xlsx
- **Styling:** Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Java Development Kit (JDK) 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.8+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ME17FD/Class-Craft.git
   cd Class-Craft
   ```

2. **Configure Database**
   - Create a MySQL database named `classcraftdb`
   - Update `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/classcraftdb
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Build and Run**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   The backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📝 API Documentation

- API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend
- Includes detailed endpoint descriptions, request/response examples, and authentication requirements

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Password encryption using BCrypt
- CORS configuration for secure frontend-backend communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mehdi FAID** - *Initial work* - [ME17FD](https://github.com/ME17FD)

## 🙏 Acknowledgments

- Special thanks to all contributors who have helped shape ClassCraft
- Built with inspiration from modern educational management systems
- Powered by the Spring Boot and React communities

---

For additional information or support, please open an issue in the repository.







