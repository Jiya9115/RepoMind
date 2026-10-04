# Stage 1: Build with Maven and Java 21
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production artifact
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime with lightweight Java 21 JRE
FROM eclipse-temurin:21-jre
WORKDIR /app

# Create non-root system user for security
RUN useradd -m -u 1001 repomind
USER repomind

# Copy executable jar from build stage
COPY --from=build /app/target/repomind-backend-1.0.0.jar app.jar

ENV SERVER_PORT=8000
EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
