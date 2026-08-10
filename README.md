# Open Arena Frontend

## API setup

Copy `.env.example` to `.env` when local overrides are needed. The shared API client uses
`/api/v1` by default and the Vite dev server proxies `/api` requests to the backend.

- API client: `src/api/axiosInstance.js`
- API configuration: `src/api/config.js`
- Normalized error: `src/api/errors.js`
- Connection checks: `src/api/systemApi.js`

Authentication uses HTTP-only session cookies. Mutating requests automatically copy the readable
CSRF cookie to the `X-CSRF-Token` header. Feature API modules still use local mock data and can be
migrated one at a time.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
