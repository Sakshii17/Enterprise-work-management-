# Enterprise Work Management Portal (EWMP)

A full-stack enterprise task, timesheet, and productivity tracking system — built to mirror real internal tools used at companies like Accenture, Infosys, and Cognizant, 
where task assignment, radar tracking, timesheets, and productivity reporting are usually scattered across Excel sheets and disconnected tools.

EWMP centralizes all of it: POCs create and assign tasks, Team Leads distribute work, Employees log daily effort, and Managers get real-time visibility into team productivity — all backed by a REST API with JWT authentication and role-based access control.

## Why this project

This system models the actual multi-role task lifecycle used in enterprise delivery teams — including nuances like priority-driven multi-person task assignment (a P0 task might need 4 people, a P3 just one), Radar ID tracking for client escalations, 
and monthly productivity calculations based on real attendance and logged hours. Every business rule here came from refining an initial design against real workplace scenarios, not from a generic tutorial.

## Tech Stack

**Backend**
- Java 17, Spring Boot 4.1
- Spring Security + JWT (stateless authentication)
- Spring Data JPA / Hibernate
- PostgreSQL
- BCrypt password hashing

**Frontend**
- React 18 (Vite)
- Tailwind CSS
- React Router
- Axios

## Core Features

- **Role-based system**: Super Admin, POC, Manager, Team Lead, Employee — each with different permissions and dashboard views
- **Task management** with priority-driven multi-assignee support (`@ManyToMany`), matching real assignment rules (P0 → up to 4 assignees, P3 → 1)
- **Daily Work Log (timesheet)** — supports multiple entries per employee per day (e.g. switching between tasks mid-day), which roll up into monthly totals
- **Radar tracking** — models real escalation workflows (raised by Team Lead, assigned by POC, closed by Employee)
- **Leave management** with approval workflow
- **Productivity Engine** — calculates expected vs. actual monthly hours (working days × 9, minus approved leave), attendance %, and task completion rates
- **Role-based dashboards** — personal dashboard (any role), team-wide dashboard (Manager/Team Lead), and an org-wide monthly productivity summary table (Manager/POC/Team Lead only)
- **JWT authentication** with BCrypt-hashed passwords and endpoint-level role restrictions

## Architecture

Client (React)
│
▼
Controller Layer ← REST endpoints
│
▼
Service Layer ← business logic, calculations
│
▼
Repository Layer ← Spring Data JPA
│
▼
PostgreSQL


Supporting: JWT filter (`OncePerRequestFilter`) for stateless auth, BCrypt for password hashing, DTOs for computed/aggregated responses (dashboards, productivity reports) kept separate from entities.

## Database Design

Key entities: `Role`, `User`, `Team`, `Project`, `Task`, `task_assignment` (join table for multi-assignee tasks), `DailyWorkLog`, `Radar`, `LeaveRequest` — with relationships spanning up to 5 levels deep (e.g. a Daily Work Log traces back through Task → Project → Team → Manager/Lead).

## Getting Started

### Prerequisites
- Java 17+
- PostgreSQL
- Node.js 18+

### Backend
```bash
cd ewmp
# Set your DB password as an environment variable
$env:DB_PASSWORD="yourpassword"    # PowerShell
mvn spring-boot:run
```
Create the database first: `CREATE DATABASE ewmp;`

### Frontend
```bash
cd ewmp-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`, backend API at `http://localhost:8080`.

## Screenshots
<img width="1898" height="953" alt="Screenshot 2026-09-24 221901" src="https://github.com/user-attachments/assets/c442a741-c274-4508-b0e8-acd2f94231c9" />

<img width="1892" height="937" alt="Screenshot 2026-09-24 222022" src="https://github.com/user-attachments/assets/b8eac1f1-37e7-4bc6-a285-b928c8fe28f5" />

<img width="1905" height="908" alt="Screenshot 2026-09-24 222103" src="https://github.com/user-attachments/assets/3d1d0fe5-aa55-43d2-a3e2-7a1a95ad36a5" />

<img width="1900" height="880" alt="Screenshot 2026-09-24 222154" src="https://github.com/user-attachments/assets/bfb79d92-62eb-4566-bc8e-093f4bc15eae" />

_(add a few screenshots here — dashboard, task list, productivity summary)_

