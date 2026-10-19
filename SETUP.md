# Momotombo Travels - Setup Guide

¡Bienvenido al código fuente de **Momotombo Travels**! Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

## 1. Prerrequisitos
- Node.js 20+ instalado.
- npm 10+.
- Una cuenta de Google Cloud (para Gemini API y Maps API).
- PostgreSQL 15+ (o Docker, para levantarlo con `docker-compose`).

## 2. Instalación de dependencias

Este es un monorepo con npm workspaces y **un único `package-lock.json` en la raíz**. Instala las dependencias **solo desde la raíz del repositorio**:

```bash
npm install
```

No ejecutes `npm install` dentro de `apps/client` ni `apps/server`: la instalación desde la raíz cubre todos los workspaces.

## 3. Configuración del Backend (NestJS)

1.  Configura las variables de entorno:
    - Abre el archivo `.env` en `apps/server/.env`.
    - Pega tu **Gemini API Key** (Obtenla en [Google AI Studio](https://aistudio.google.com/app/apikey)):
      ```env
      GEMINI_API_KEY=tu_api_key_aqui
      PORT=3001
      ```
    - Configura también `DATABASE_URL` apuntando a tu PostgreSQL local (ver sección 5).
2.  Inicia el servidor desde la raíz:
    ```bash
    npm run dev:server
    ```
    (o desde `apps/server` con `npm run start:dev`). El servidor correrá en `http://localhost:3001`.

## 4. Configuración del Frontend (Next.js)

1.  Configura Google Maps (Opcional para ver mapas):
    - Crea un archivo `.env.local` en `apps/client/.env.local`.
    - Agrega tu **Google Maps API Key**:
      ```env
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_maps_api_key_aqui
      ```
2.  Inicia el cliente desde la raíz:
    ```bash
    npm run dev:client
    ```
    (o desde `apps/client` con `npm run dev`). La aplicación estará disponible en `http://localhost:3000`.

## 5. Base de datos

- **Docker**: `docker-compose up -d` levanta PostgreSQL 15 en `127.0.0.1:5432` (credenciales por defecto `momotombo` / `password123`, base `momotombo_travels`; puedes sobrescribirlas con las variables de entorno `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
- **PostgreSQL local**: actualiza `DATABASE_URL` en `apps/server/.env` con tus credenciales.

Luego, desde `apps/server`:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Notas importantes:
- **Bases de datos creadas con `prisma db push`**: si creaste tu base de datos de desarrollo antes de que existieran las migraciones (con `prisma db push`), debes alinearla con el historial de migraciones ejecutando `npx prisma migrate reset` desde `apps/server`. Esto reinicia la base y aplica todas las migraciones (incluye la migración `20261018000001_audit_backfill`, que cubre todo el esquema añadido desde el inicio).
- **`SHADOW_DATABASE_URL` (opcional)**: si la defines en `apps/server/.env`, habilita los comandos de desarrollo `prisma migrate dev` y `prisma migrate diff`. Para desplegar no es necesaria; `prisma migrate deploy` funciona sin ella.

## 6. Uso
- Abre el navegador en `http://localhost:3000`.
- Interactúa con "El Guía Nica".
- Pregunta por destinos (ej: "Plan para un fin de semana en León") y observa las recomendaciones y mapas.

¡Disfruta explorando Nicaragua!
