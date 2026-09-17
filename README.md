# MarketAnalyzer

Single Spring Boot 3 / Java 17 Maven application serving the HTML/CSS/JS frontend and its API. User accounts, login sessions, and saved analyses are persisted in PostgreSQL.

## Run locally

Start PostgreSQL with Docker Compose, then open the project as a Maven project with Java 17 and run `com.marketanalyzer.MarketAnalyzerApplication`. Visit http://localhost:8080/.

```powershell
docker compose up -d
```

The database is persisted in the Docker volume `marketanalyzer-postgres-data`, so accounts and analyses are retained across container restarts. The development defaults are database `marketanalyzer`, user `marketanalyzer`, and password `marketanalyzer_dev_password`. Before deployment, set `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` for Compose and the matching `SPRING_DATASOURCE_*` variables for the app.

From a terminal, you can also run `mvn spring-boot:run`. Flyway automatically creates the local database tables on first startup.

The built-in demo sign-in is `demo@marketanalyzer.com` / `demo123`.

## Available API

* `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`
* `POST /api/analysis/request`, `GET /api/analysis/{id}`, `GET /api/analysis/user`
* `POST /api/predict` and `GET /api/predict/health`
* `GET /actuator/health`

## Model note

The included `random_forest_model.pkl` and `scaler.pkl` are Python pickle files. Java/Spring Boot cannot safely execute pickle files, so the application currently uses the documented `heuristic-v1` scorer in `ModelLoader`. To run the trained model in Java, export it to a Java-compatible format (for example PMML or ONNX) and replace the scorer with a compatible inference library. The rest of the API already has a stable feature-vector interface for that replacement.

The current frontend and API routes are unchanged; they are served by the Spring Boot application from `src/main/resources/static`.

## Deploy to Render

This repository contains a `render.yaml` Blueprint. In Render, choose **New +** → **Blueprint**, connect this GitHub repository, and approve the proposed web service and PostgreSQL database. Render builds the included `Dockerfile`, creates the database, injects its connection settings, and starts the application. The Docker entrypoint converts Render's `postgres://` URL to the JDBC URL required by Spring Boot; the database username and password are injected separately.

Before sharing the public URL, change the generated `APP_AUTH_DEMO_PASSWORD` value in the Render service environment settings. The service uses its assigned `PORT`; its deployment health check is `/actuator/health`.

The frontend and API are deliberately served from the same Render service, so the browser automatically calls the deployed service's own `/api` routes. No `YOUR-DOMAIN-HERE` replacement is needed.
