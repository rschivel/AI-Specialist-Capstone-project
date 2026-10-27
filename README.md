# AI Front-End Development Specification

## Project Overview

This project uses AI-assisted development to generate a complete, production-ready front-end application from a collection of UI reference images.

The UI screenshots located in the project directory are the primary source of truth for all application design decisions.

The AI must analyze the provided images and generate a fully functional React application using modern architecture, responsive design principles, reusable components, accessibility standards, and clean coding practices.

---

# Project Location

Analyze all PNG files found in:

```text
C:\Users\RicardoSchivel\Documents\AI-Specialist-Capstone-project
```

The screenshots must be treated as the authoritative UI specification for the generated application.

---

# Primary Objective

Create a complete front-end application that:

- Matches the UI represented in the screenshots.
- Uses reusable React components.
- Supports responsive layouts.
- Follows modern engineering standards.
- Is maintainable and scalable.
- Is ready for backend integration.
- Supports future enhancements with minimal refactoring.

---

# Technology Stack

## Mandatory Technologies

- React (latest stable version)
- Vite
- TypeScript (preferred)
- Tailwind CSS
- React Router
- React Hooks
- ESLint
- Prettier

## Optional Technologies

- React Query (TanStack Query)
- Zustand
- Axios
- Framer Motion
- React Hook Form
- Zod

---

# Image Analysis Instructions

Before generating code:

1. Analyze every PNG file.
2. Identify all pages and screens.
3. Identify navigation patterns.
4. Identify reusable components.
5. Identify user workflows.
6. Identify forms and validation requirements.
7. Identify data presentation components.
8. Infer responsive behavior.
9. Infer application purpose.
10. Identify common design patterns.

Screenshots are the primary source of truth.

Do not create arbitrary layouts when information exists in the images.

---

# Design Requirements

## User Experience

The generated application must:

- Look modern and professional.
- Provide intuitive navigation.
- Follow common UX patterns.
- Maintain consistent interactions.
- Support accessibility requirements.

---

# API Integration Standards

- Use Axios.
- Create a service abstraction layer.
- Never call APIs directly from UI components.

---

# Testing Requirements

Use:

- Vitest
- React Testing Library

Generate:

- Component tests
- Form validation tests
- Utility tests

---

# Step 7: Git Check-in

1. Create feature branch
2. Stage files
3. Commit changes
4. Push branch
5. Create Pull Request for review

---

# Final AI Instruction

Treat all PNG screenshots as the authoritative source of truth.
Generate a production-ready enterprise React application.
