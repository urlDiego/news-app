# 📰 News Homepage

**🔗 [Demo en vivo](https://news-app-indol-two.vercel.app/)**

Aplicación de noticias en tiempo real construida con **Astro en modo SSR**, **Fastify**, **Tailwind CSS v4** y **TypeScript**. La persistencia de datos se gestiona con **PostgreSQL** y **Drizzle ORM**, orquestada localmente mediante **Docker Compose**.

> 🚧 **Proyecto en desarrollo activo** — Frontend SSR, API REST modular con Fastify y base de datos relacional completamente integrados vía CORS. Incluye script de sincronización con NewsAPI e historial/detalle de artículos dinámicos. Próximamente se integrará autenticación con JWT.

---

## ✨ Features actuales

- **Integración Full-Stack Astro ↔ Fastify** — El frontend consume directamente la API propia mediante `PUBLIC_API_URL` con políticas seguras de CORS (`@fastify/cors`).
- **Sincronización ETL e Idempotencia** — Script CLI (`sync-news.ts`) que extrae noticias desde NewsAPI, sanea los datos y los inserta en PostgreSQL asegurando idempotencia con `ON CONFLICT DO NOTHING`.
- **Páginas dinámicas de detalle** — Ruta SSR `/articles/[id]` que consulta y renderiza en tiempo real el contenido completo del artículo con manejo nativo de errores HTTP 404.
- **API REST propia con Fastify** — Servidor backend modular con endpoints para artículos y categorías, paginación con `limit` y `offset`, y control global de errores.
- **SSR (Server-Side Rendering)** — Renderizado bajo demanda en cada visita con datos frescos desde la base de datos mediante `@astrojs/node`.
- **Responsive design** — Layout moderno y accesible adaptado para móvil y escritorio con Tailwind CSS v4.
- **Tipado integral** — Interfaces TypeScript compartidas y validadas en todas las capas del sistema.
- **Manejo de errores resiliente** — Respuestas estructuradas en backend y fallbacks visuales de imágenes en frontend.
- **Múltiples secciones** — Portada (Hero + New + Articles), Noticias Populares, Tendencias y Filtrado por Categorías.
- **Base de datos relacional** — Esquema en PostgreSQL 16 gestionado con migraciones de Drizzle ORM.
- **Entorno reproducible** — PostgreSQL y pgAdmin orquestados para desarrollo con Docker Compose.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | [Astro](https://astro.build/) con SSR (`output: 'server'`) |
| Backend | [Fastify](https://fastify.dev/) + TypeScript |
| CORS | `@fastify/cors` |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Lenguaje | TypeScript |
| Adaptador SSR | `@astrojs/node` |
| Base de datos | PostgreSQL 16 |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Ingesta de datos | [NewsAPI.org](https://newsapi.org/) |
| Contenedores | Docker + Docker Compose |
| Control de versiones | Git + Conventional Commits |

---

## 📁 Estructura del proyecto

```
news-homepage/
├── news-api/                    # Backend API (Fastify)
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts         # Conexión a PostgreSQL con Drizzle ORM
│   │   │   └── schema.ts        # Esquemas de tablas articles y categories
│   │   ├── routes/
│   │   │   ├── articles.ts      # Endpoints de artículos con paginación
│   │   │   └── categories.ts    # Endpoints de categorías
│   │   ├── scripts/
│   │   │   └── sync-news.ts     # Script de sincronización ETL (NewsAPI → PostgreSQL)
│   │   └── index.ts             # Entry point del servidor y middleware CORS
│   ├── drizzle/                 # Migraciones SQL generadas
│   ├── package.json
│   └── tsconfig.json
├── src/                         # Frontend (Astro SSR)
│   ├── components/
│   │   ├── Hero.astro           # Artículo destacado
│   │   ├── New.astro            # Artículos recientes
│   │   ├── ArticlesList.astro   # Lista de artículos con ranking y enlaces a detalle
│   │   ├── Navbar.astro         # Barra de navegación
│   │   └── NavbarItems.astro    # Elementos del menú
│   ├── layouts/
│   │   └── Layout.astro         # Layout base y estilos globales
│   ├── pages/
│   │   ├── index.astro          # Portada principal
│   │   ├── popular.astro        # Noticias populares (consume Fastify API)
│   │   ├── trending.astro       # Tendencias (consume Fastify API)
│   │   ├── new.astro            # Artículos nuevos (consume Fastify API)
│   │   ├── categories.astro     # Secciones por categoría (consume Fastify API)
│   │   └── articles/
│   │       └── [id].astro       # Página de detalle dinámico con SSR y 404
│   └── types/
│       └── news.ts              # Tipos TypeScript
├── docker-compose.yml           # PostgreSQL 16 + pgAdmin
├── package.json
└── astro.config.mjs
```

---

## 🚀 Cómo correrlo localmente

### Prerrequisitos

- Node.js 22 LTS
- Docker Desktop
- Una API key gratuita de [newsapi.org](https://newsapi.org/register)

### Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/news-homepage.git
cd news-homepage

# 2. Instalar dependencias
npm install
cd news-api && npm install && cd ..

# 3. Configurar variables de entorno
# Configurar .env en la raíz y en news-api/.env (ver sección Variables de entorno)

# 4. Iniciar base de datos con Docker
docker compose up -d

# 5. Ejecutar migraciones de base de datos
cd news-api && npx drizzle-kit migrate && cd ..

# 6. (Opcional) Sincronizar noticias iniciales desde NewsAPI
cd news-api && npx tsx src/scripts/sync-news.ts && cd ..

# 7. Iniciar servidores de desarrollo
# En una terminal (Backend Fastify en puerto 3001):
cd news-api && npm run dev

# En otra terminal (Frontend Astro en puerto 4321):
npm run dev
```

---

## 🔑 Variables de entorno

**Frontend (raíz del proyecto)** — `.env`:
```env
PUBLIC_API_URL=http://localhost:3001
NEWS_API_KEY=tu_api_key_aquí
```

**Backend** — `news-api/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/newsdb
NEWS_API_KEY=tu_api_key_aquí
```

---

## 🔮 Próximas funcionalidades

- **Autenticación con JWT**: Registro e inicio de sesión seguro con contraseñas hasheadas con bcrypt.
- **Rutas protegidas y marcadores**: Posibilidad de guardar artículos en favoritos para usuarios autenticados.
- **Despliegue en producción**: Despliegue de la solución full-stack en la nube mediante Railway.

---

## 📝 Licencia

MIT
