# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Project Structure

/src
├── assets/ # Static assets like images, fonts, icons
├── components/ # Highly-reusable, generic UI components (e.g., Button, Input, Card)
│ ├── Button.css
│ ├── Button.jsx
│ ├── DataTable.css
│ └── DataTable.jsx
├── features/ # Code related to specific business domains (e.g., authentication, user profile)
│ ├── Accounts/
│ ├── UserProfile/
│ │ ├── components/
│ │ │ ├── UserProfile.css
│ │ │ └── UserProfile.jsx
│ │ ├── hooks/
│ │ │ └── useProfile.js
│ │ ├── services/ # API calls or other logic specific to this feature
│ │ | └── apiServices.js
│ │ └── types/
│ └── Authentication/
├── hooks/ # Reusable custom hooks used across different features
│ └── useAuth.js
├── layouts/ # Layout components (e.g., Header, Footer, Sidebar, MainLayout)
│ ├── MainLayout.jsx # Wraps main pages and includes Header/Footer
│ └── Header.jsx
├── pages/ # Top-level components mapped to specific routes (e.g., Home, Dashboard, Settings)
│ ├── HomePage.jsx
│ ├── DashboardPage.jsx
│ └── SettingsPage.jsx
├── services/ # Global API services or external integrations (e.g., ApiService.js, AuthService.js)
│ └── apiServices.js
├── store/ # State management files (e.g., Redux, Zustand)
│ └──store.js
├── styles/ # Global styles, themes, or CSS configurations
│ └── Header.css
├── utils/ # Generic utility and helper functions (e.g., formatters, validators)
│ └── commonUtils.js
├── App.jsx # Main application component, often handles routing
└── main.jsx # Entry point of the application

## Added responsive breakpoints to Users.css:

Breakpoint Changes
Mobile ≤ 480px Reduced padding, smaller font, tighter cell padding, word-break for long emails
Tablet ≤ 768px Moderate padding/font reduction
Default Original styles (900px max-width)
Large ≥ 1200px Expanded max-width to 1100px, larger fonts and cell padding
Also added overflow-x: auto on .users-table-wrapper so the table scrolls horizontally on narrow screens instead of breaking layout.

## Installed axios and implemented the hook in hooks/useApiAxios.js. Here's a summary of what's included:

Axios instance & interceptors

Request interceptor — automatically attaches Authorization: Bearer <token> from localStorage if present
Response interceptor — handles 401s globally and distinguishes cancelled requests from real errors
useApiAxios hook

Accepts { url, method, params, body, immediate }
Returns { isPending, isSuccess, isError, error, data, execute }
Uses AbortController to cancel in-flight requests on unmount or when execute is called again before the previous one finishes
Usage examples:

// Auto-fetch on mount (GET)
const { isPending, isError, data } = useApiAxios({
url: 'http://localhost:8000/users',
params: { role: 'admin' },
});

// Manual trigger (POST)
const { isPending, execute } = useApiAxios({
url: 'http://localhost:8000/auth/login',
method: 'POST',
immediate: false,
});

const handleSubmit = () => execute({ username, password });
