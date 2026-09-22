# 📰 News Homepage

**🔗 [Demo en vivo](https://news-app-indol-two.vercel.app/)**

Aplicación de noticias en tiempo real construida con **Astro en modo SSR**, **Tailwind CSS v4** y **TypeScript**. Consume la API pública de [NewsAPI.org](https://newsapi.org/) para mostrar titulares actualizados en cada carga de página. La persistencia de datos se maneja con **PostgreSQL** + **Drizzle ORM**, levantado con **Docker**.

> 🚧 **Proyecto en desarrollo activo** — frontend SSR + base de datos relacional en funcionamiento. Próximamente se integrará un backend Fastify propio y autenticación con JWT.

---

## ✨ Features actuales

- **Noticias en tiempo real** — consume `top-headlines` de tecnología directamente desde NewsAPI
- **SSR (Server-Side Rendering)** — cada visita obtiene datos frescos desde el servidor con `@astrojs/node`
- **Responsive design** — layout adaptado para móvil y escritorio con Tailwind CSS v4
- **Tipado completo** — interfaces TypeScript para `Article`, `NewsAPIResponse`, `Category`
- **Manejo de errores** — fallback elegante si la API falla o `urlToImage` es `null`
- **Múltiples secciones** — Hero destacado, bloque "New", lista de artículos con ranking
- **Base de datos relacional** — esquema PostgreSQL con tablas `articles` y `categories`, gestionado con Drizzle ORM
- **Entorno reproducible** — PostgreSQL y pgAdmin levantados con Docker Compose

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Astro](https://astro.build/) con SSR (`output: 'server'`) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Lenguaje | TypeScript |
| Adaptador SSR | `@astrojs/node` |
| API de datos | [NewsAPI.org](https://newsapi.org/) |
| Base de datos | PostgreSQL 16 |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Infraestructura local | Docker + Docker Compose |
| Control de versiones | Git + Conventional Commits |

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Hero.astro          # Artículo destacado con imagen responsiva y fallback
│   ├── New.astro           # Bloque de 3 artículos recientes
│   ├── ArticlesList.astro  # Lista de artículos con ranking numérico
│   ├── Navbar.astro        # Barra de navegación
│   └── NavbarItems.astro   # Items del menú
├── layouts/
│   └── Layout.astro        # Layout base con fuente y estilos globales
├── pages/
│   ├── index.astro         # Home: fetch a NewsAPI + composición de componentes
│   ├── popular.astro       # Noticias populares
│   ├── trending.astro      # Tendencias
│   ├── new.astro           # Artículos nuevos
│   └── categories.astro    # Por categoría
└── types/
    └── news.ts             # Interfaces TypeScript: Article, NewsAPIResponse
```

---

## 🚀 Cómo correrlo localmente

### Prerrequisitos

- Node.js 22 LTS
- Docker Desktop
- Una API key gratuita de [newsapi.org](https://newsapi.org/register)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/news-homepage.git
cd news-homepage

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend/ORM
cd news-api && npm install && cd ..

# Crear archivos de variables de entorno
cp .env.example .env
# → Agregar NEWS_API_KEY en .env
# → Agregar DATABASE_URL en news-api/.env

# Levantar PostgreSQL y pgAdmin con Docker
docker compose up -d

# Correr las migraciones de base de datos
cd news-api && npx drizzle-kit migrate && cd ..

# Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:4321`.
pgAdmin estará disponible en `http://localhost:5050`.

---

## 🔑 Variables de entorno

**Raíz del proyecto** — archivo `.env`:

```env
NEWS_API_KEY=tu_api_key_aquí
```

**Backend** — archivo `news-api/.env`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_bd
```

---

## 🔮 Lo que viene

El proyecto está en crecimiento activo. Las siguientes funcionalidades están planificadas:

- **API REST propia** con Node.js y Fastify como intermediario entre el frontend y la base de datos
- **Autenticación con JWT** — registro, login y sesión segura con cookies `httpOnly`
- **Funcionalidades de usuario** — guardar artículos favoritos, búsqueda por keyword y filtros por categoría
- **Script de sincronización** — poblar la BD automáticamente desde NewsAPI

---

## 🧞 Comandos

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el build de producción en `./dist/` |
| `npm run preview` | Previsualiza el build localmente |

---

## 📝 Licencia

MIT
