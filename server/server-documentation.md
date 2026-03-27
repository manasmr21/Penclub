# Penclub Server Documentation

## Overview
The Penclub backend is built using **NestJS**, a progressive Node.js framework. It uses **TypeORM** for database interactions with a **PostgreSQL** database, and implements authentication using **JWT** (JSON Web Tokens).

## Key Technologies
- **Framework**: NestJS (`@nestjs/core`, `@nestjs/common`)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport & JWT
- **Documentation**: Swagger UI
- **File Uploads**: Cloudinary & Multer
- **Emails**: Nodemailer

## Project Structure
- `src/main.ts`: Application entry point. Bootstraps the NestJS app, sets up Swagger documentation at `/api/docs`, configures cookie parsing, and listens on the specified `PORT` (default: 5000).
- `src/app.module.ts`: Root module. Imports configuration (`ConfigModule`), database connection (`TypeOrmModule`), and various feature modules (`AuthorModule`, `ReaderModule`, `BlogModule`, `CloudinaryModule`).
- `src/config/`: Contains database connection settings (`typeorm.config.ts`).
- `src/utils/`: Includes utility modules such as `Cloudinary` for image uploads and a mail module for sending emails via `nodemailer`.
- `src/modules/`: Contains the core domain modules of the application.

## Core Modules

### 1. Author Module (`/authors`)
Handles registration, authentication, and profile management for authors.
- `GET /authors/get-authors`: Get a list of all authors.
- `GET /authors/get-author/:authorId`: Get a specific author's details.
- `POST /authors/create`: Register a new author.
- `POST /authors/login`: Authenticate an author using email/penName and password.
- `POST /authors/logout`: Clear the author's session/cookies.
- `POST /authors/verify-otp`: Verify the author's OTP during registration/login.
- `POST /authors/resend-otp`: Resend the OTP email.
- `PUT /authors/update/:authorId`: Update author profile information.
- `DELETE /authors/delete/:authorId`: Delete an author's account.

### 2. Reader Module (`/readers`)
Handles reader registration, authentication, and profile management.
- `POST /readers/register`: Register a new reader.
- `POST /readers/login`: Authenticate a reader using email/username and password.
- `POST /readers/logout`: Clear the reader's session.
- `POST /readers/verify-email`: Verify reader's email via OTP.
- `POST /readers/verify-otp-only`: Verify an OTP without completing the full registration step.
- `PUT /readers/update/:readerId`: Update reader profile information.
- `DELETE /readers/delete/:readerId`: Delete a reader's account.

### 3. Blog Module (`/blogs`)
Manages the creation, retrieval, and updating of blog posts.
- `GET /blogs`: Get all published blog posts.
- `GET /blogs/fetch/:authorId`: Get all blogs written by a specific author.
- `POST /blogs/create`: Create a new blog post. Expects a `coverImage` file (multipart/form-data).
- `PUT /blogs/update/:blogId`: Update an existing blog. Supports updating the `coverImage` file.
- `DELETE /blogs/delete/:blogId`: Delete a blog post and its associated cover image ID.

### 4. JWT Module
Provides authentication guards (`jwt.guard.ts`) and strategies (`jwt.strategy.ts`) for securing endpoints using JSON Web Tokens.

### 5. Books Module
Currently an empty or reserved module structure for future implementation of book-related features.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Cloudinary Account
- SMTP setup for emails

### Installation & Running
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Set up environments variables in a `.env` file based on `.env.example`.
3. Start the application:
   \`\`\`bash
   npm run start:dev
   \`\`\`
4. Access the API documentation (Swagger) at:
   [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
