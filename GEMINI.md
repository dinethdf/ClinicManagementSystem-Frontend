# CureGuard Private Clinic - Frontend

This is a comprehensive management system for private clinics, built on the **Next.js Theme**. It utilizes a modern tech stack to provide a robust, scalable, and internationalized user experience.

## Project Overview

*   **Architecture:** Next.js App Router with Internationalization (i18n).
*   **Theme:** Vuexy (MUI-based) with custom layouts and components.
*   **State Management:** Redux Toolkit for global application state.
*   **Data Fetching:** Axios-based `apiClient` with request interceptors for JWT authentication.
*   **Authentication:** NextAuth.js integrated with backend services for session management.
*   **Database:** Purely API-driven; the frontend does not manage a local database. All data persists via the backend services.
*   **Form Handling:** React Hook Form with Valibot for schema validation.
*   **Styling:** MUI (Emotion), TailwindCSS, and PostCSS.
*   **Icons:** Iconify for a vast collection of icons, bundled for performance.

## Key Directories

*   `src/@core`: Core theme components, hooks, and utilities provided by Vuexy.
*   `src/@layouts`: Layout components (Vertical, Horizontal, Blank).
*   `src/app/[lang]`: Main application routes, wrapped in language segments for i18n.
*   `src/components`: Shared UI components, including form components, dialogs, and custom widgets.
*   `src/configs`: Configuration files for the theme, i18n, and project-specific settings.
*   `src/data`: Static data and dictionaries for i18n.
*   `src/fake-db`: Mock database and API handlers for development and prototyping.
*   `src/hocs`: High-Order Components for authentication guards and translation wrapping.
*   `src/redux-store`: Redux slices and store configuration.
*   `src/services`: API service modules organized by domain (patient, doctor, appointment, etc.).
*   `src/remove-translation-scripts`: Custom utilities for managing or removing internationalization features.


## Agentic Development Infrastructure

This project is optimized for agentic development workflows. Private rules, skills, and memory are stored in the `.gemini/` directory (ignored by Git):

*   **Rules:** `.gemini/rules/` - Architectural and UI/UX standards.
*   **Skills:** `.gemini/skills/` - Procedural guidance for common tasks.
*   **Memory:** `.gemini/memory/MEMORY.md` - Project state tracking.

## Building and Running

### Development
```bash
npm run dev
```
Starts the development server with Turbopack enabled.

### Production Build
```bash
npm run build
npm run start
```

### Database Migrations
```bash
npm run migrate
```
Runs Prisma migrations using `dotenv` to load environment variables.

### Icons
```bash
npm run build:icons
```
Bundles Iconify icons into CSS for optimized loading.

### Linting and Formatting
```bash
npm run lint      # Run ESLint
npm run lint:fix  # Fix ESLint issues
npm run format    # Run Prettier
```

## Development Conventions

*   **API Calls:** Always use the `apiClient` from `src/services/api.config.ts` to ensure consistent header management and error handling.
*   **I18n:** Use the translation wrappers and the `[lang]` route segment for any user-facing text.
*   **State Management:** Prefer Redux for global state (e.g., user session, theme settings) and local React state for component-specific logic.
*   **Validation:** Use Valibot schemas located in `src/schemas` for all form validations.
*   **Styling:** Follow the MUI and Vuexy design patterns. Use TailwindCSS utility classes where appropriate, but maintain consistency with the MUI theme.
*   **Type Safety:** Leverage TypeScript strictly. Define types in `src/types` or adjacent to the components/services they serve.
