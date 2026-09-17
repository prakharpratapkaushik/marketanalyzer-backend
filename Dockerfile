FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/marketanalyzer-backend-1.0.0.jar app.jar

EXPOSE 8080

# Render's database connection string is a postgres:// URI. Convert it to the
# JDBC URL Spring Boot expects, unless a JDBC URL was explicitly supplied.
ENTRYPOINT ["sh", "-c", "if [ -n \"$DATABASE_URL\" ] && [ -z \"$SPRING_DATASOURCE_URL\" ]; then db_endpoint=\"${DATABASE_URL##*@}\"; export SPRING_DATASOURCE_URL=\"jdbc:postgresql://${db_endpoint}\"; fi; exec java -jar /app/app.jar"]
