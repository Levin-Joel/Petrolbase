# Petrolbase Backend

Spring Boot REST API for account registration, login, password changes, account deletion, and session lookup. It uses the existing `BENUTZER` table and its `BENUTZER_ID`, `NAME`, `EMAIL`, and `PASSWORT` columns in the hosted H2 database at `jdbc:h2:tcp://localhost:9092/~/test` by default. Hibernate schema creation and updates are disabled; the backend does not create tables. Passwords are stored as BCrypt hashes. The HTTP session is kept in an HttpOnly cookie.

## Run

Use Java 21 or newer and Maven:

```powershell
mvn spring-boot:run
```

In IntelliJ IDEA, first import `Backend/pom.xml` as a Maven project (right-click the file and choose **Add as Maven Project**, or reload it from the Maven tool window). This loads the module's source folders and dependency classpath. Then select **Start Backend** and click **Run**. Its Spring Boot main class is `com.petrolbase.backend.PetrolbaseBackendApplication`.

The API listens on `http://localhost:8080`. The Vite development server forwards `/api` requests to it.

The database URL and credentials can be overridden with the `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` environment variables. The defaults are the JDBC URL above, user `sa`, and an empty password. Configure the credentials to match the H2 server before starting the backend if they differ. The database server must be running and reachable by the backend.

## API

- `POST /api/auth/register` — `{ "name", "email", "password" }`
- `POST /api/auth/login` — `{ "email", "password" }`
- `GET /api/auth/me` — current session account
- `POST /api/auth/change-password` — `{ "email", "currentPassword", "newPassword" }`
- `POST /api/auth/logout`
- `DELETE /api/auth/account` — authenticated account deletion

Passwords must contain at least eight characters. Password changes require the current password.
