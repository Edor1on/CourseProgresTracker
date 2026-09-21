# Course Progress Tracker

A simple full-stack application for tracking progress in courses. Built as a test task: users can create courses, add lessons, mark lessons as completed, and see course progress.

## How to Run

### Requirements
- Docker Desktop (with Docker Compose)

### Run with Docker Compose

```bash
git clone https://github.com/Edor1on/CourseProgresTracker.git
cd course-progress-tracker
docker compose up --build
```

This starts three services:

| Service  | URL                          |
|----------|-------------------------------|
| Frontend | http://localhost:3000         |
| Backend  | http://localhost:4000         |
| Swagger  | http://localhost:4000/swagger |
| Database | localhost:5432                |

Database tables are created automatically on backend startup (EF Core migrations are applied via `Database.Migrate()` — no manual migration step needed).

### Run locally without Docker (optional)

**Backend:**
```bash
cd backend/CourseTracker/CourseTracker.Api
dotnet run
```
Requires a local PostgreSQL instance and a `DefaultConnection` string in `appsettings.json`.

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
ng serve
```
Opens on http://localhost:4200.

> Note: `--legacy-peer-deps` is required due to an npm dependency-resolution bug (`Arborist edgesOut`) encountered with the current Angular/npm versions on this machine.

---

## Technologies Used

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core + Npgsql (PostgreSQL provider)
- Swagger / OpenAPI (via Swashbuckle)

**Frontend**
- Angular 21 (standalone components, no router — single-page layout)
- TypeScript
- RxJS (HttpClient / Observables)

**Database**
- PostgreSQL 16

**Infrastructure**
- Docker & Docker Compose (backend, frontend, and database all containerized)

---

## API Endpoints

### Courses
| Method | Endpoint         | Description                              |
|--------|------------------|-------------------------------------------|
| GET    | `/courses`       | List all courses (with lesson counts)    |
| GET    | `/courses/{id}`  | Get a single course by id                |
| POST   | `/courses`       | Create a new course                      |
| DELETE | `/courses/{id}`  | Delete a course (cascades to its lessons)|

**POST /courses** body:
```json
{ "title": "string (required)", "description": "string (optional)" }
```

### Lessons
| Method | Endpoint                        | Description                        |
|--------|----------------------------------|-------------------------------------|
| GET    | `/courses/{courseId}/lessons`   | List lessons for a course          |
| POST   | `/courses/{courseId}/lessons`   | Add a lesson to a course           |
| PATCH  | `/lessons/{id}`                 | Update a lesson (title/isCompleted)|
| DELETE | `/lessons/{id}`                 | Delete a lesson                    |

**POST /courses/{courseId}/lessons** body:
```json
{ "title": "string (required)", "description": "string (optional)" }
```

**PATCH /lessons/{id}** body (any subset):
```json
{ "title": "string", "isCompleted": true }
```

### Validation
- `course.title` is required (400 if missing/blank)
- `lesson.title` is required (400 if missing/blank)
- `isCompleted` is a boolean
- Creating a lesson for a non-existent course returns 404

### Progress calculation
Done on the backend, returned as `totalLessons` and `completedLessons` on each course:
```
progress % = completedLessons / totalLessons * 100
```
(0 total lessons → 0%, handled explicitly to avoid division by zero.)

---

## Database

Two tables, one-to-many relationship (`Course` → `Lesson`), enforced via foreign key with cascade delete.

**courses**
| Column      | Type      |
|-------------|-----------|
| id          | serial PK |
| title       | text      |
| description | text (nullable) |
| created_at  | timestamp |

**lessons**
| Column       | Type      |
|--------------|-----------|
| id           | serial PK |
| course_id    | int (FK → courses.id, ON DELETE CASCADE) |
| title        | text      |
| description  | text (nullable) |
| is_completed | boolean   |
| created_at   | timestamp |

Schema is managed by EF Core Migrations (`Migrations/` folder in the backend project). Applied automatically at container startup.

---

## Docker

- **postgres**: official `postgres:16` image, exposes `5432`, data persisted in a named volume (`pgdata`), includes a healthcheck (`pg_isready`)
- **backend**: multi-stage Dockerfile (`dotnet/sdk:10.0` → `dotnet/aspnet:10.0`), exposes `8080` internally, mapped to host `4000`; waits for postgres to be healthy before starting; applies EF Core migrations automatically on startup
- **frontend**: multi-stage Dockerfile (`node:20-alpine` build → `nginx:alpine` runtime), serves the built Angular app, exposes `80` internally, mapped to host `3000`

Run everything with:
```bash
docker compose up --build
```

---

## What Is Completed

- Full CRUD for courses (create, list, delete; get-by-id as a bonus)
- Full CRUD for lessons (create, list, update `isCompleted`/title, delete)
- Progress percentage calculated and displayed per course
- Basic validation (required titles, course existence check)
- CORS configured for the frontend
- PostgreSQL persistence (not in-memory)
- Full Docker Compose setup (backend, frontend, and database all containerized)
- Automatic database migrations on backend startup
- Loading and error states in the UI

## What Is Not Completed

- Editing course/lesson text after creation is not implemented (explicitly marked optional in the task)
- No automated tests (unit/integration)
- No authentication/authorization (out of scope for the task)
- Minimal styling — functional but not visually polished
- No pagination (not needed at this data scale)

---

## AI Usage Report

- **AI tool used:**
- **What I used AI for:**
- **2–3 example prompts:**
- **What I changed manually:**
- **What was difficult:**
