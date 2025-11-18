# Use an official Java 17 image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy everything inside backend
COPY . .

# Build the Spring Boot jar
RUN ./mvnw clean package -DskipTests

# Run the backend
CMD ["java", "-jar", "target/task-manager-1.0.0.jar"]