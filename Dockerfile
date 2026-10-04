# Multi-stage Docker build for RepoMind Spring Boot Backend
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source and package executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN useradd -m -u 1001 repomind
USER repomind

COPY --from=build /app/target/repomind-backend-1.0.0.jar app.jar

ENV SERVER_PORT=8000
EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
