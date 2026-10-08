# Spring Boot backend image. Frontend has its own Dockerfile at the repo root
# (Vercel in prod); this one is for the API + H2/Postgres wherever you run it.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd -m app && mkdir -p /var/lib/travelmind && chown app:app /var/lib/travelmind
USER app
COPY --from=build /app/target/travelmind-backend-*.jar /app/backend.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]
