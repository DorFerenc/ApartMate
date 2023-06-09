# Use a base image that includes JDK and Gradle
FROM gradle:jdk17 AS builder

WORKDIR /app

# Copy the build.gradle files
COPY build.gradle .
COPY gradlew.bat .
COPY gradle .

# Copy the source code
COPY src ./src

# Build the application
RUN gradle build

# Use a lightweight base image for the server
FROM openjdk:17

WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/build/libs/apartmate-1.0.0-FINAL_SPRINT.jar /app/

# Expose the necessary ports
EXPOSE 8083

# Set the command to run the application
ENTRYPOINT ["java", "-jar", "/app/apartmate-1.0.0-FINAL_SPRINT.jar"]