# Project Structure

This document provides an overview of the Anudesh-Frontend project structure and organization.

## Overview

Anudesh-Frontend is a Next.js-based web application for annotation, project management, and collaborative data labeling tasks. The project follows a modular architecture with clear separation of concerns.

## Directory Structure


Contribution-toAnudesh-Frontend/
├── Tests/                          # End-to-end tests
├── src/                           # Source code
├── Configuration files            # Root-level config files


## Detailed Structure

### /Tests/
Contains end-to-end testing files using Playwright.
- login.spec.ts - Authentication flow tests

### /src/
Main source directory containing all application code.

#### /src/app/
Next.js App Router directory structure.

##### /src/app/actions/
Server and client-side actions organized by feature domains.

- */api/* - API integration modules
  - *Admin/* - Admin user management (SignUp, EditProfile, UserDetail)
  - *Annotate/* - Annotation workflows (AnnotateAPI, PatchAnnotationAPI, Glossary management)
  - *Dashboard/* - Dashboard operations (Task annotations, User details, Deallocation)
  - *Notification/* - Notification management
  - *Progress/* - Analytics APIs (Task, Meta, Performance analytics for projects and workspaces)
  - *ProjectDetails/* - Project domain management
  - *Projects/* - Project operations (Batch pulling, Task allocation/deallocation, Archive, Export)
  - *UnauthUserManagement/* - Unauthenticated user chat interactions
  - *UserManagement/* - User operations (Languages, Organizations)
  - *dataset/* - Dataset operations (Automation, Upload, AI models, Duplicate removal)
  - *user/* - User profile management (Password, Analytics, Scheduled mails, Manager suggestions)
  - *workspace/* - Workspace management (Members, Projects, Reports, Authentication)

- */apitransport/* - API transport layer utilities
- Configuration files (api.js, constants.js, string.js)

##### /src/app/new-project/
Project creation utilities and models.

##### /src/app/profile/
User profile management.

##### /src/app/progress/
Progress tracking and analytics.

##### /src/app/ui/
UI components and pages.

- */pages/* - Application pages
  - *TextVerification/* - Text verification interface
  - *admin/* - Admin dashboard and user management
  - *change-password/* - Password management
  - *chat/* - Chat and annotation interfaces (Annotate, Review, SuperChecker pages)
  - *dataset/* - Dataset browsing and management
  - *dual-screen-preference-ranking/* - Preference ranking interface
  - *edit-profile/* - Profile editing
  - *forgot-password/* - Password recovery
  - *guest-workspaces/* - Guest workspace access
  - *home/* - Landing page
  - *invite/* - User invitation system
  - *login/* - Authentication
  - *model_response_evaluation/* - Model evaluation interface
  - *multiple-llm-idcp/* - Multi-LLM instruction-driven chat
  - *n-screen-preference-ranking/* - N-screen preference ranking
  - *organizations/* - Organization management
  - *progress/* - Progress analytics views
  - *projects/* - Project listing and details
  - *workspace/* - Workspace management interface

- Layout.js - Main layout component

##### Core App Files
- ErrorBoundary.js - Error handling
- StoreProvider.jsx - Redux store provider
- globals.css, index.css - Global styles
- layout.js, page.js - Next.js app entry points

#### /src/components/
Reusable React components organized by feature.

- *Chat/* - Chat interface components (AudioRecorder, TextArea)
- *GuestWorkspace/* - Guest workspace tables
- *Project/* - Project-related components
  - Settings, filters, task management
  - Member management, reports
  - Export, download, and logging
- *Tabs/* - Tab components for various views
- *Transliteration/* - Indic language transliteration
- *UserManagement/* - User profile and scheduling
- *admin/* - Admin profile management
- *common/* - Shared UI components
  - Buttons, cards, modals, tables
  - Headers, spinners, tooltips
  - Search, filters, pagination
- *datasets/* - Dataset management components
  - Settings, reports, automation
  - Data population, deduplication
  - Project association
- *user/* - User-specific components

#### /src/Lib/
Core business logic and state management.

##### /src/Lib/Features/
Redux feature slices and API integrations.

- *Analytics/* - Analytics data fetching (Meta, Progress, Task analytics)
- *actions/* - Action creators (Domains, Projects, Users, Glossary)
- *datasets/* - Dataset operations (Download, Reports, Types, Members)
- *projects/* - Project operations (Tasks, Reports, Filters, Bookmarks)
- *user/* - User operations (Analytics, Logs, Preferences, Recent tasks)
- Workspace operations, authentication, language support

##### /src/Lib/apiTransport/
API communication layer.

##### Core Lib Files
- Store.js - Redux store configuration
- fetchParams.js - API request parameters

#### /src/Constants/
Application constants and configuration.

- api.js - API endpoints
- constants.js - General constants
- addUserTypes/ - User type definitions

#### /src/IndicTransliterate/
Indic language transliteration support.

#### /src/assets/
Static assets (images, SVGs, logos).

#### /src/config/
Application configuration files.

- apiendpoint.js - API endpoint configurations
- config.js - General app configuration
- dropDownValues.js - Dropdown options
- localisation.js - Localization settings
- PageType.js - Page type definitions

#### /src/styles/
CSS and style configurations.

- Component-specific styles
- Global style definitions
- Landing page styles

#### /src/themes/
Material-UI theme configurations.

- tableTheme.js - Table styling
- theme.js - Global theme

#### /src/utils/
Utility functions and helpers.

- *API_Instance/* - API instance configuration
- *Colors_JSON/* - Color definitions
- *Date_Range/* - Date formatting utilities
- *UserMappedByRole/* - User role mapping utilities
- Helper functions for language codes, roles, task assignment, etc.

#### /src/firebase.js
Firebase configuration and initialization.

## Configuration Files (Root)

- .gitignore - Git ignore rules
- .prettierrc - Code formatting configuration
- README.md - Project documentation
- TESTING.md - Testing documentation
- jsconfig.json - JavaScript configuration
- netlify.toml - Netlify deployment configuration
- next.config.js - Next.js configuration
- package.json - Dependencies and scripts
- playwright.config.ts - Playwright test configuration
- postcss.config.js - PostCSS configuration
- tailwind.config.js - Tailwind CSS configuration

## Key Features by Directory

### Annotation & Review Workflows
- /src/app/actions/api/Annotate/ - Annotation API integrations
- /src/app/ui/pages/chat/ - Annotation, review, and super-checker interfaces
- /src/components/Project/ - Task management components

### Project Management
- /src/Lib/Features/projects/ - Project state management
- /src/app/actions/api/Projects/ - Project operations
- /src/components/Project/ - Project UI components

### Dataset Management
- /src/Lib/Features/datasets/ - Dataset state management
- /src/app/actions/api/dataset/ - Dataset operations
- /src/components/datasets/ - Dataset UI components

### Analytics & Reporting
- /src/Lib/Features/Analytics/ - Analytics data layer
- /src/app/actions/api/Progress/ - Analytics APIs
- /src/app/ui/pages/progress/ - Analytics visualization

### User & Workspace Management
- /src/app/actions/api/workspace/ - Workspace operations
- /src/components/Tabs/ - User and member management tabs
- /src/Lib/Features/user/ - User state management

## Technology Stack

- Framework: Next.js (App Router)
- State Management: Redux
- Styling: Tailwind CSS, Material-UI
- Testing: Playwright
- Language Support: Indic transliteration
- Deployment: Netlify

## Statistics

- Total Directories: 79
- Total Files: 434

## Contributing

When adding new features:
1. Place API integrations in /src/app/actions/api/
2. Add Redux slices to /src/Lib/Features/
3. Create UI components in /src/components/
4. Add pages to /src/app/ui/pages/
5. Update this document accordingly

## Notes

- The project uses both legacy (/src/Lib/) and new (/src/app/actions/) API patterns
- Workspace and organization features support multi-tenant architecture
- Comprehensive analytics support at project, workspace, and organization levels
- Multi-language support with transliteration capabilities
