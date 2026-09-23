# 📰 News App — Fullstack News Platform

[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Plataforma fullstack de noticias moderna, construida con arquitectura desacoplada, renderizado del lado del servidor (**Astro SSR**), API REST de alto rendimiento (**Fastify**), base de datos relacional (**PostgreSQL**) gestionada con **Drizzle ORM**, autenticación segura con **JWT** y sistema personalizado de **Marcadores / Favoritos**.

---

## 🌐 Enlaces en Producción

| Servicio | Entorno | URL |
|---|---|---|
| 🚀 **Frontend Web** | Vercel (Producción) | [https://news-app-indol-two.vercel.app/](https://news-app-indol-two.vercel.app/) |
| ⚡ **Backend REST API** | Railway (Producción) | [https://news-app-production-4339.up.railway.app/](https://news-app-production-4339.up.railway.app/) |
| 💾 **API Health Check** | Railway | [`GET /`](https://news-app-production-4339.up.railway.app/) |

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una arquitectura híbrida de microservicios desacoplados:

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR / CLIENTE                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
               HTTPS Requests  │  SSR Page Loads
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND: Astro 4+ (Modo SSR)                 │
│                 Alojado en Vercel Edge Server               │
│      - Componentes modulares (Hero, New, ArticlesList)      │
│      - Páginas dinámicas (/articles/[id], /bookmarks)       │
│      - Tailwind CSS v4 & Tipado TypeScript estricto         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                REST API Calls │ (Bearer JWT / JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND: Fastify + TypeScript               │
│                  Alojado en Railway Cloud                   │
│      - Enrutamiento modular (/api/articles, /auth, etc.)    │
│      - Autenticación JWT (@fastify/jwt + bcryptjs)          │
│      - CORS configurado (@fastify/cors)                     │
│      - Error Handler estructurado                           │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
  Consultas SQL│ (Drizzle ORM)                │ Pipeline ETL
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      BASE DE DATOS:          │ │        INGESTA ETL:        │
│      PostgreSQL 16           │ │       NewsAPI.org          │
│  (Railway en Producción /    │ │  Script de sincronización  │
│   Docker en Local)           │ │    idempotente en CLI      │
│  Tablas: articles,           │ │  (sync-news.ts con         │
│  categories, users,          │ │   ON CONFLICT DO NOTHING)  │
│  bookmarks                   │ └────────────────────────────┘
└──────────────────────────────┘
```

---

## ✨ Características Principales

- **📰 Portada Inteligente y Hero Resiliente**:
  - Algoritmo que selecciona automáticamente como noticia principal (`Hero`) el artículo más reciente.
  - Deduplicación automática para asegurar que el artículo destacado en Hero no se repita en las secciones laterales (`New`) ni inferiores (`ArticlesList`).
  - Fallbacks visuales nativos (`onerror`) con imágenes Web3 en caso de fallos de red en recursos externos.

- **📑 Sistema de Marcadores y Favoritos (Bookmarks)**:
  - Funcionalidad interactiva para usuarios autenticados: botón para guardar o eliminar noticias de favoritos con feedback inmediato.
  - Vista dedicada en `/bookmarks` que lista en tiempo real los artículos guardados del usuario actual.
  - Endpoints REST protegidos mediante hooks `preHandler` que verifican la validez del token JWT.

- **🔐 Autenticación Robusta con JWT y Bcrypt**:
  - Registro de usuarios con validación de credenciales y hashing unidireccional de contraseñas mediante `bcryptjs` (salt rounds: 10).
  - Inicio de sesión con generación de tokens JWT firmados (`@fastify/jwt`) con expiración de 7 días.
  - Endpoint `/auth/me` para verificar la identidad y estado de sesión.
  - Vistas dedicadas de inicio de sesión (`/login`) y registro (`/register`) integradas con validación accesible.

- **⚡ Server-Side Rendering (SSR)**:
  - Renderizado bajo demanda con `@astrojs/node` que asegura que el contenido siempre esté actualizado al recargar la página.
  - Páginas dinámicas `/articles/[id]` con lectura de parámetros de ruta y renderizado completo del contenido o respuesta HTTP 404 si el recurso no existe.

- **🔄 Pipeline ETL de Sincronización con NewsAPI**:
  - Script CLI (`sync-news.ts` y `seed-and-sync.ts`) que consulta noticias globales de NewsAPI, las sanea y las almacena en PostgreSQL.
  - Operaciones idempotentes con `ON CONFLICT (url) DO NOTHING` para evitar duplicidad de registros en ejecuciones repetidas.
  - Preservación íntegra de URLs de imágenes largas sin truncamiento mediante tipos de datos `text` en base de datos.

- **🎨 Diseño Responsivo y Accesible**:
  - Adaptabilidad total de pantallas móviles a monitores de escritorio.
  - Estilizado con la versión más reciente de **Tailwind CSS v4**.
  - Menú lateral interactivo para dispositivos móviles y navegación semántica con contraste WCAG AA.

---

## 🛠️ Stack Tecnológico

| Dominio | Tecnología | Justificación / Propósito |
|---|---|---|
| **Frontend Framework** | [Astro](https://astro.build/) | SSR nativo, cero JavaScript innecesario por defecto, alto rendimiento. |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilidades CSS modernas, compatibilidad con temas y diseño responsivo fluido. |
| **Backend Framework** | [Fastify](https://fastify.dev/) | Uno de los frameworks Node.js más rápidos y con menor sobrecarga. |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | Tipado estático y robusto compartido entre cliente y servidor. |
| **Base de Datos** | [PostgreSQL 16](https://www.postgresql.org/) | Motor relacional estándar de la industria, íntegro y escalable. |
| **ORM & Migraciones** | [Drizzle ORM](https://orm.drizzle.team/) | Consultas tipadas tipo SQL, migraciones seguras con Drizzle Kit sin bloatware. |
| **Autenticación** | `@fastify/jwt` + `bcryptjs` | Tokens firmados sin estado (stateless) y hashing seguro de contraseñas. |
| **CORS** | `@fastify/cors` | Control de acceso seguro entre orígenes de frontend y backend. |
| **Entorno Local** | Docker & Docker Compose | Contenedorización de PostgreSQL y pgAdmin para desarrollo reproducible. |
| **Despliegue Frontend** | Vercel Edge Server | Infraestructura global para aplicaciones Astro SSR. |
| **Despliegue Backend & DB** | Railway Cloud | Despliegue continuo de Fastify y PostgreSQL gestionado en la nube. |

---

## 📁 Estructura del Repositorio

```
news-homepage/
├── news-api/                        # Servidor Backend (Fastify)
│   ├── drizzle/                     # Migraciones SQL generadas por Drizzle Kit
│   │   └── meta/                    # Snapshots del esquema relacional
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts             # Conexión pooling con PostgreSQL (postgres.js + Drizzle)
│   │   │   └── schema.ts            # Definición de tablas: articles, categories, users, bookmarks
│   │   ├── routes/
│   │   │   ├── articles.ts          # Endpoints de noticias, paginación y filtros
│   │   │   ├── auth.ts              # Endpoints de registro, login y /me
│   │   │   ├── bookmarks.ts         # Endpoints de marcadores protegidos con JWT
│   │   │   └── categories.ts        # Endpoints de categorías temáticas
│   │   ├── scripts/
│   │   │   ├── sync-news.ts         # Pipeline ETL de ingesta NewsAPI → PostgreSQL
│   │   │   └── seed-and-sync.ts     # Script de inicialización de categorías y sincronización
│   │   └── index.ts                 # Servidor Fastify, middleware CORS, plugin JWT
│   ├── drizzle.config.ts            # Configuración de Drizzle Kit
│   ├── package.json                 # Dependencias del backend
│   └── tsconfig.json                # Configuración TypeScript del backend
├── src/                             # Aplicación Frontend (Astro SSR)
│   ├── assets/
│   │   └── images/                  # Imágenes Web3 y recursos SVG estáticos
│   ├── components/
│   │   ├── Hero.astro               # Noticia principal con selección inteligente de imagen
│   │   ├── New.astro                # Columna de noticias recientes
│   │   ├── ArticlesList.astro       # Listado numerado con ranking de artículos
│   │   ├── Navbar.astro             # Barra de navegación principal y responsive drawer
│   │   └── NavbarItems.astro        # Enlaces de navegación con detección de sesión
│   ├── layouts/
│   │   └── Layout.astro             # Layout principal HTML5 con metas SEO y tipografías
│   ├── pages/
│   │   ├── index.astro              # Portada principal unificada
│   │   ├── popular.astro            # Sección de artículos populares
│   │   ├── trending.astro           # Sección de tendencias
│   │   ├── new.astro                # Sección de novedades
│   │   ├── categories.astro         # Vista de exploración por categorías
│   │   ├── bookmarks.astro          # Marcadores personales guardados
│   │   ├── login.astro              # Vista de autenticación
│   │   ├── register.astro           # Vista de registro de usuarios
│   │   └── articles/
│   │       └── [id].astro           # Detalle dinámico del artículo con botón de favorito
│   ├── types/
│   │   └── news.ts                  # Interfaces TypeScript del dominio de noticias
│   └── styles/
├── docker-compose.yml               # Orquestación de PostgreSQL 16 y pgAdmin 4 local
├── package.json                     # Dependencias del frontend
├── astro.config.mjs                 # Configuración de Astro con adapter SSR
└── README.md                        # Documentación técnica del proyecto
```

---

## 📡 Documentación de la API REST

Base URL en producción: `https://news-app-production-4339.up.railway.app`  
Base URL en local: `http://localhost:3001`

### Artículos y Contenido

| Método | Endpoint | Auth | Descripción |
|---|---|:---:|---|
| `GET` | `/api/articles` | No | Lista artículos con paginación (`?page=1&limit=10&sort=new\|popular\|trending`). |
| `GET` | `/api/articles/:id` | No | Retorna un artículo por su ID numérico (404 si no existe). |
| `GET` | `/api/articles/category/:slug` | No | Retorna artículos filtrados por categoría (ej. `technology`, `business`). |
| `GET` | `/api/categories` | No | Lista todas las categorías temáticas registradas. |

### Autenticación de Usuarios

| Método | Endpoint | Auth | Descripción | Payload esperado |
|---|---|:---:|---|---|
| `POST` | `/auth/register` | No | Registra un nuevo usuario en PostgreSQL. | `{ "email": "user@example.com", "password": "secretpassword" }` |
| `POST` | `/auth/login` | No | Autentica credenciales y emite token JWT. | `{ "email": "user@example.com", "password": "secretpassword" }` |
| `GET` | `/auth/me` | Bearer JWT | Retorna los datos del usuario autenticado. | Header: `Authorization: Bearer <token>` |

### Marcadores / Favoritos

| Método | Endpoint | Auth | Descripción | Payload esperado |
|---|---|:---:|---|---|
| `GET` | `/api/bookmarks` | Bearer JWT | Lista todos los artículos guardados por el usuario. | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/bookmarks/check/:articleId` | Bearer JWT | Verifica si un artículo ya fue marcado como favorito. | — |
| `POST` | `/api/bookmarks` | Bearer JWT | Guarda un artículo en la lista de favoritos. | `{ "articleId": 12 }` |
| `DELETE` | `/api/bookmarks/:articleId` | Bearer JWT | Elimina un artículo de favoritos. | — |

---

## 💻 Instalación y Configuración Local

### 1. Prerrequisitos
- [Node.js](https://nodejs.org/) v20+ o v22 LTS
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Una API Key gratuita de [NewsAPI.org](https://newsapi.org/register)

### 2. Clonar el Repositorio
```bash
git clone https://github.com/urlDiego/news-app.git
cd news-app
```

### 3. Instalar Dependencias
```bash
# Frontend
npm install

# Backend
cd news-api
npm install
cd ..
```

### 4. Configurar Variables de Entorno

Crear el archivo `.env` en la raíz (Frontend):
```env
PUBLIC_API_URL=http://localhost:3001
NEWS_API_KEY=tu_api_key_de_newsapi
```

Crear el archivo `news-api/.env` (Backend):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/newsdb
NEWS_API_KEY=tu_api_key_de_newsapi
JWT_SECRET=super_secret_jwt_key_para_desarrollo_local_123
FRONTEND_URL=http://localhost:4321
PORT=3001
```

### 5. Levantar Base de Datos con Docker
```bash
docker compose up -d
```
> Esto iniciará:
> - **PostgreSQL 16** en el puerto `5432` (`postgres:postgres`)
> - **pgAdmin 4** en `http://localhost:5050` (`admin@admin.com` / `admin`)

### 6. Ejecutar Migraciones de Base de Datos
```bash
cd news-api
npx drizzle-kit migrate
cd ..
```

### 7. Sincronizar Artículos Iniciales (ETL)
```bash
cd news-api
npx tsx src/scripts/seed-and-sync.ts
cd ..
```

### 8. Iniciar Entorno de Desarrollo
En una terminal (Backend Fastify):
```bash
cd news-api
npm run dev
```

En otra terminal (Frontend Astro):
```bash
npm run dev
```

Abre en tu navegador:
- Frontend: [http://localhost:4321](http://localhost:4321)
- Backend API: [http://localhost:3001](http://localhost:3001)

---

## ☁️ Configuración de Despliegue en Producción

### Frontend (Vercel)
1. Conectar el repositorio de GitHub en [Vercel](https://vercel.com/).
2. Framework preset: **Astro**.
3. Definir la variable de entorno de producción:
   - `PUBLIC_API_URL`: `https://news-app-production-4339.up.railway.app`
4. Deploy automático en cada push a la rama `main`.

### Backend & Base de Datos (Railway)
1. Crear proyecto en [Railway](https://railway.app/).
2. Añadir servicio **PostgreSQL** administrado.
3. Desplegar el servicio de Node.js apuntando al subdirectorio `news-api/`:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Variables de entorno en Railway:
   - `DATABASE_URL`: URL provista por el plugin PostgreSQL de Railway.
   - `JWT_SECRET`: Secreto criptográfico seguro.
   - `NEWS_API_KEY`: API key de NewsAPI.
   - `FRONTEND_URL`: `https://news-app-indol-two.vercel.app`
   - `PORT`: `${{PORT}}`

---

## 🧪 Estándares de Código y Buenas Prácticas

- **Seguridad**:
  - Hashing seguro de contraseñas con `bcryptjs`.
  - CORS configurado con lista blanca estricta de orígenes.
  - Queries parametrizadas mediante Drizzle ORM para prevención total de inyección SQL.
- **Resiliencia de Datos**: URLs e información descriptiva almacenada en campos `text` ilimitados para evitar truncamiento de metadatos.
- **Tipado Integral**: Interfaces de TypeScript en todas las capas del sistema y documentación JSDoc en funciones críticas del backend.

---

## 📄 Licencia

Este proyecto se encuentra distribuido bajo la licencia [MIT](LICENSE).

Desarrollado por [Diego](https://github.com/urlDiego).
