# 📰 News Homepage

**🔗 [Demo en vivo](https://news-app-indol-two.vercel.app/)**

Aplicación de noticias en tiempo real construida con **Astro en modo SSR**, **Fastify**, **Tailwind CSS v4** y **TypeScript**. La persistencia de datos se gestiona con **PostgreSQL** y **Drizzle ORM**, orquestada localmente mediante **Docker Compose**.

> 🚧 **Proyecto en desarrollo activo** — Frontend SSR, API REST modular con Fastify y base de datos relacional en funcionamiento. Próximamente se integrará la conexión cliente-servidor directa, sincronización automatizada de noticias y autenticación con JWT.

---

## ✨ Features actuales

- **Noticias en tiempo real** — consume `top-headlines` de tecnología directamente desde NewsAPI
- **API REST propia con Fastify** — servidor backend modular con endpoints para artículos y categorías, paginación con `limit` y `offset`, y control global de errores
- **SSR (Server-Side Rendering)** — cada visita obtiene datos frescos desde el servidor con `@astrojs/node`
- **Responsive design** — layout adaptado para móvil y escritorio con Tailwind CSS v4
- **Tipado integral** — interfaces TypeScript compartidas para artículos, respuestas de API y categorías
- **Manejo de errores resiliente** — respuestas estructuradas en backend y fallbacks en frontend
- **Múltiples secciones** — Hero destacado, bloque "New", lista de artículos con ranking numérico
- **Base de datos relacional** — esquema relacional en PostgreSQL gestionado con migraciones de Drizzle ORM
- **Entorno reproducible** — PostgreSQL y pgAdmin listos para desarrollo con Docker Compose

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | [Astro](https://astro.build/) con SSR (`output: 'server'`) |
| Backend | [Fastify](https://fastify.dev/) + TypeScript |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Lenguaje | TypeScript |
| Adaptador SSR | `@astrojs/node` |
| Base de datos | PostgreSQL 16 |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| API externa | [NewsAPI.org](https://newsapi.org/) |
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
│   │   └── index.ts             # Entry point del servidor y error handler global
│   ├── drizzle/                 # Migraciones SQL generadas
│   ├── package.json
│   └── tsconfig.json
├── src/                         # Frontend (Astro SSR)
│   ├── components/
│   │   ├── Hero.astro           # Artículo destacado
│   │   ├── New.astro            # Artículos recientes
│   │   ├── ArticlesList.astro   # Lista de artículos con ranking
│   │   ├── Navbar.astro         # Barra de navegación
│   │   └── NavbarItems.astro    # Elementos del menú
│   ├── layouts/
│   │   └── Layout.astro         # Layout base y estilos globales
│   ├── pages/
│   │   ├── index.astro          # Portada principal
│   │   ├── popular.astro        # Noticias populares
│   │   ├── trending.astro       # Tendencias
│   │   ├── new.astro            # Artículos nuevos
│   │   └── categories.astro     # Filtrado por categoría
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
cp .env.example .env
# Configurar NEWS_API_KEY en .env y DATABASE_URL en news-api/.env

# 4. Iniciar base de datos con Docker
docker compose up -d

# 5. Ejecutar migraciones de base de datos
cd news-api && npx drizzle-kit migrate && cd ..

# 6. Iniciar servidores de desarrollo
# En una terminal (Backend Fastify en puerto 3001):
cd news-api && npm run dev

# En otra terminal (Frontend Astro en puerto 4321):
npm run dev
```

---

## 🔑 Variables de entorno

**Frontend (raíz del proyecto)** — `.env`:
```env
NEWS_API_KEY=tu_api_key_aquí
```

**Backend** — `news-api/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/newsdb
```

---

## 🔮 Próximas funcionalidades

- **Integración Astro ↔ API**: Conexión directa del frontend con los endpoints del backend propio
- **Sincronización automatizada de noticias**: Script para ingesta continua desde la API externa hacia PostgreSQL
- **Páginas dinámicas de detalle**: Renderizado dinámico de artículos individuales con rutas por slug
- **Autenticación con JWT**: Registro e inicio de sesión seguro con contraseñas hasheadas con bcrypt
- **Despliegue en producción**: Despliegue de la solución full-stack en la nube mediante Railway

---

## 📝 Licencia

MIT
