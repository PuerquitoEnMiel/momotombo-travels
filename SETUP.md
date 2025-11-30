# Momotombo Travels - Setup Guide

¡Bienvenido al código fuente de **Momotombo Travels**! Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

## 1. Prerrequisitos
- Node.js 18+ instalado.
- Una cuenta de Google Cloud (para Gemini API y Maps API).

## 2. Configuración del Backend (NestJS)

1.  Navega a la carpeta del servidor:
    ```bash
    cd apps/server
    ```
2.  Instala las dependencias (si no lo has hecho):
    ```bash
    npm install
    ```
3.  Configura las variables de entorno:
    - Abre el archivo `.env` en `apps/server/.env`.
    - Pega tu **Gemini API Key** (Obtenla en [Google AI Studio](https://aistudio.google.com/app/apikey)):
      ```env
      GEMINI_API_KEY=tu_api_key_aqui
      PORT=3001
      ```
4.  Inicia el servidor:
    ```bash
    npm run start:dev
    ```
    El servidor correrá en `http://localhost:3001`.

## 3. Configuración del Frontend (Next.js)

1.  Navega a la carpeta del cliente:
    ```bash
    cd apps/client
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Configura Google Maps (Opcional para ver mapas):
    - Crea un archivo `.env.local` en `apps/client/.env.local`.
    - Agrega tu **Google Maps API Key**:
      ```env
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_maps_api_key_aqui
      ```
4.  Inicia el cliente:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## 4. Uso
- Abre el navegador en `http://localhost:3000`.
- Interactúa con "El Guía Nica".
- Pregunta por destinos (ej: "Plan para un fin de semana en León") y observa las recomendaciones y mapas.

¡Disfruta explorando Nicaragua!
