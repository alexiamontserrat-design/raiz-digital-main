# 01. Arquitectura Nueva — Raíz Digital Fase 2

## Stack Tecnológico

### Frontend
- **React 18** + **TypeScript**
- **Vite** como bundler/dev server
- **React Router v6** para enrutamiento
- **React Context** para estado global (auth, residente seleccionado)
- **CSS Modules / CSS reutilizable** para estilos
- Estructura por módulos funcionales

### Backend
- **Node.js** + **TypeScript**
- **Express** como framework HTTP
- **Prisma** como ORM
- **SQLite** como base de datos de desarrollo (migrable a PostgreSQL)
- **bcrypt** para hashing de contraseñas
- **jsonwebtoken** para autenticación JWT
- **Zod** para validación de entrada
- **cors** para comunicación frontend↔backend

### Base de Datos
- **SQLite** (desarrollo inmediato)
- **Prisma** permite cambiar a PostgreSQL modificando únicamente `datasource` en `schema.prisma`

## Diagrama de Arquitectura

```text
Frontend (React + Vite)          Backend (Node + Express)
http://localhost:5173             http://localhost:3000

┌──────────────────────┐         ┌──────────────────────┐
│  React Components    │         │  Express Routes      │
│  ├─ Pages            │  REST   │  ├─ Controllers      │
│  ├─ Components       │ ──API─→ │  ├─ Services         │
│  ├─ Services (fetch) │  JSON   │  ├─ Repositories     │
│  ├─ Context (auth)   │         │  └─ Middleware        │
│  └─ Hooks            │         │      ├─ auth          │
└──────────────────────┘         │      ├─ validation    │
                                 │      └─ error handler │
                                 └──────────┬───────────┘
                                            │
                                     ┌──────┴──────┐
                                     │   Prisma    │
                                     │   ORM       │
                                     └──────┬──────┘
                                            │
                                     ┌──────┴──────┐
                                     │   SQLite    │
                                     │ (→ Postgres)│
                                     └─────────────┘
```

## Estructura del Proyecto

```
raiz-digital-main/
├── frontend-raiz-digital/       ← React + Vite + TypeScript
│   ├── src/
│   │   ├── components/          ← Componentes reutilizables
│   │   ├── pages/               ← Páginas (Login, Dashboards, etc.)
│   │   ├── layouts/             ← Layout principal con sidebar/header
│   │   ├── routes/              ← Configuración React Router
│   │   ├── services/            ← Llamadas API (fetch)
│   │   ├── hooks/               ← Custom hooks
│   │   ├── context/             ← AuthContext, ResidentContext
│   │   ├── types/               ← Interfaces TypeScript
│   │   ├── utils/               ← Utilidades
│   │   ├── assets/              ← Imágenes, iconos
│   │   └── styles/              ← CSS global y variables
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend-raiz-digital/        ← Node + Express + TypeScript
│   ├── src/
│   │   ├── config/              ← Configuración (DB, env, cors)
│   │   ├── routes/              ← Definición de rutas
│   │   ├── controllers/         ← Controladores HTTP
│   │   ├── services/            ← Lógica de negocio
│   │   ├── repositories/        ← Acceso a datos via Prisma
│   │   ├── middleware/          ← Auth, validación, errores
│   │   ├── types/               ← Interfaces TypeScript
│   │   ├── utils/               ← Utilidades
│   │   └── app.ts               ← Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma        ← Modelo de datos reconstruido
│   │   ├── seed.ts              ← Datos demo
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/
│   ├── auditoria/               ← 17 documentos de auditoría (existentes)
│   └── fase2/                   ← Documentación de la migración
│
├── legacy/                      ← Código PHP original (preservado)
│   └── (archivos .php/.html/.css originales)
│
└── README.md
```

## Decisiones Técnicas

### Autenticación: JWT con HTTP-only cookies
- bcrypt para hash de contraseñas
- JWT firmado con secret en .env
- Middleware `authMiddleware` en cada ruta protegida
- Token enviado en header `Authorization: Bearer <token>`

### Estado Global: React Context
- `AuthContext`: usuario autenticado, rol, token
- `ResidentContext`: residente seleccionado (equivalente a `$_SESSION['id_residente']`)
- Sin Redux — innecesario para este tamaño de proyecto

### Validación: Zod
- Schemas de validación en backend para cada endpoint
- Validación de body, params, query
- El frontend también valida pero el backend es la fuente de verdad

### Seguridad (correcciones vs legacy)
- ✅ Contraseñas hasheadas con bcrypt (corrige SEG-02)
- ✅ Consultas parametrizadas via Prisma (corrige SEG-01)
- ✅ Validación de ownership residente↔usuario (corrige SEG-03)
- ✅ Middleware centralizado de autorización (corrige SEG-04)
- ✅ JWT con expiración (corrige SEG-05)
- ✅ Validación de entrada con Zod (corrige SEG-06)

## Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 5173   | http://localhost:5173 |
| Backend  | 3000   | http://localhost:3000 |
