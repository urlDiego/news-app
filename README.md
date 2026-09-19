# 📰 News Homepage

Aplicación de noticias en tiempo real construida con **Astro en modo SSR**, **Tailwind CSS v4** y **TypeScript**. Consume la API pública de [NewsAPI.org](https://newsapi.org/) para mostrar titulares actualizados en cada carga de página.

> 🚧 **Proyecto en desarrollo activo** — actualmente en el Bloque C (Astro SSR + NewsAPI). Las próximas fases incorporarán un backend propio con Fastify, base de datos PostgreSQL, autenticación con JWT y deploy completo con Docker.

---

## ✨ Features actuales

- **Noticias en tiempo real** — consume `top-headlines` de tecnología directamente desde NewsAPI
- **SSR (Server-Side Rendering)** — cada visita obtiene datos frescos desde el servidor con `@astrojs/node`
- **Responsive design** — layout adaptado para móvil y escritorio con Tailwind CSS v4
- **Tipado completo** — interfaces TypeScript para `Article` y `NewsAPIResponse`
- **Manejo de errores** — fallback elegante si la API falla o `urlToImage` es `null`
- **Múltiples secciones** — Hero destacado, bloque "New", lista de artículos con ranking

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Astro](https://astro.build/) con SSR (`output: 'server'`) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Lenguaje | TypeScript |
| Adaptador SSR | `@astrojs/node` |
| API de datos | [NewsAPI.org](https://newsapi.org/) |
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
- Una API key gratuita de [newsapi.org](https://newsapi.org/register)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/news-homepage.git
cd news-homepage

# Instalar dependencias
npm install

# Crear el archivo de variables de entorno
cp .env.example .env
# → Editar .env y agregar tu NEWS_API_KEY

# Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:4321`.

---

## 🔑 Variables de entorno

Crear un archivo `.env` en la raíz basándose en `.env.example`:

```env
NEWS_API_KEY=tu_api_key_aquí
```

---

## 🗺️ Roadmap

| Bloque | Estado | Descripción |
|---|---|---|
| A — Responsive Design | ✅ Completado | Layout adaptado con Tailwind |
| B — Preparación | ✅ Completado | Node, Docker, Git configurados |
| C — Astro SSR + NewsAPI | ✅ Completado | SSR activado, datos reales de NewsAPI |
| D — Docker + PostgreSQL | 🔜 Próximo | BD con Docker Compose |
| E — Drizzle ORM | 🔜 Pendiente | Schema y migraciones |
| F — Fastify Backend | 🔜 Pendiente | API REST propia con Node.js |
| G — CORS + Integración | 🔜 Pendiente | Astro consumiendo la API propia |
| H — Auth + Features | 🔜 Pendiente | JWT, bookmarks, búsqueda |
| I — Docker Full Stack | 🔜 Pendiente | Todo el stack en contenedores |
| J — Deploy | 🔜 Pendiente | Railway / Render |

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
