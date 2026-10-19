# Matriz de Control de Vistas — Momotombo Travels

Documento maestro de seguimiento para el inventario de vistas, estado de implementación en Next.js, integración con el backend NestJS y trazabilidad de diseño en **Google Stitch** (Proyecto: `14965205256228060440` - *Momotombo Travels UI*).

---

## 1. Resumen Ejecutivo de Estado

| Métrica | Cantidad |
|---|---|
| **Vistas Totales Activas en el Sistema** | **24 Rutas** |
| **Vistas Implementadas en Código (100% Funcionales)** | **24 Rutas** |
| **Vistas con Pantalla Diseñada en Google Stitch** | **14 (Home Page, /explorar, /explorar/[slug], /planificar, /perfil, /itinerarios, /checkout/[bookingId], /bookings/[id]/confirmation, /auth/login, /auth/registro, /auth/recuperar, /auth/reset-password, /blog, /blog/[slug])** |
| **Vistas Pendientes de Pantalla en Google Stitch** | **10 Rutas** |

---

## 2. Inventario Maestro de Vistas

### A. Exploración y Públicas (5 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/` | `apps/client/src/app/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`e7e3ed76cbf84adb8c552462b707b2d5`) | `GET /destinations` |
| `/explorar` | `apps/client/src/app/explorar/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`6c76d1987e194e37aadca63dec8db65b`) | `GET /destinations`, `GET /categories` |
| `/explorar/[slug]` | `apps/client/src/app/explorar/[slug]/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`f6fb4c293bed4720a0bb64b042d69c41`) | `GET /destinations/:slug`, `POST /bookings` |
| `/blog` | `apps/client/src/app/blog/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`7dce52d8411a48ff8edeba2ae195f5ec`) | `GET /blogs`, `GET /tags` |
| `/blog/[slug]` | `apps/client/src/app/blog/[slug]/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`f3ec0d0f02374d2c973b05bbb69656f2`) | `GET /blogs/:slug`, `POST /comments` |

---

### B. Planificación con IA & Social (3 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/planificar` | `apps/client/src/app/planificar/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`f6afdf2e014d490da928b7e203656693`) | `POST /itineraries/generate` (Gemini) |
| `/planificar/[id]` | `apps/client/src/app/planificar/[id]/page.tsx` | Implementada (100%) | Pendiente Stitch | `GET /itineraries/:id`, `PATCH /itineraries/:id` |
| `/itinerarios/[id]/compartir` | `apps/client/src/app/itinerarios/[id]/compartir/page.tsx` | **Implementada (100%)** | Pendiente Stitch | `GET /itineraries/:id` |

---

### C. Área Privada del Viajero (2 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/itinerarios` | `apps/client/src/app/itinerarios/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`ac6a84d3c0d14243b96d4507a1c517c6`) | `GET /itineraries/my-itineraries` |
| `/perfil` | `apps/client/src/app/perfil/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`ec29bced410e4d1ea2e10b0de28558e7`) | `GET /auth/me`, `GET /bookings/my-bookings`, `GET /gamification/badges` |

---

### D. Flujo Transaccional & Pagos Stripe (2 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/checkout/[bookingId]` | `apps/client/src/app/checkout/[bookingId]/page.tsx` | **Implementada (100%)** | **Diseñada en Stitch** (`0b28db72274e49a68589782d0db5fafb`) | `POST /stripe/create-checkout-session`, `POST /coupons/validate` |
| `/bookings/[id]/confirmation` | `apps/client/src/app/bookings/[id]/confirmation/page.tsx` | **Implementada (100%)** | **Diseñada en Stitch** (`4230d32c5ecd44229b0b2fe6e083d236`) | `GET /bookings/:id`, `GET /stripe/create-checkout-session` |

---

### E. Autenticación y Seguridad (4 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/auth/login` | `apps/client/src/app/auth/login/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`b82886325de4490da7e32da70aae1465`) | `POST /auth/login`, `GET /auth/google` |
| `/auth/registro` | `apps/client/src/app/auth/registro/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`538b3c6739014f6dbfe1150fd6472978`) | `POST /auth/register` |
| `/auth/recuperar` | `apps/client/src/app/auth/recuperar/page.tsx` | Implementada (100%) | **Diseñada en Stitch** (`6d8e51c814f44b69820097fd41fe6c55`) | `POST /auth/forgot-password` |
| `/auth/reset-password` | `apps/client/src/app/auth/reset-password/page.tsx` | **Implementada (100%)** | **Diseñada en Stitch** (`7a87b4f065204120ad3e638f5124e8cc`) | `POST /auth/reset-password` |

---

### F. Administración del Sistema (2 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/admin` | `apps/client/src/app/admin/page.tsx` | Implementada (100%) | Pendiente Stitch | `GET /admin/dashboard`, `GET /admin/users` |
| `/admin/destinos` | `apps/client/src/app/admin/destinos/page.tsx` | **Implementada (100%)** | Pendiente Stitch | `GET /destinations`, `POST /destinations`, `DELETE /destinations/:id` |

---

### G. Portal de Guías y Proveedores (2 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/proveedores` | `apps/client/src/app/proveedores/page.tsx` | Implementada (100%) | Pendiente Stitch | `GET /auth/me`, `GET /activities/provider` |
| `/proveedores/actividades/nueva` | `apps/client/src/app/proveedores/actividades/nueva/page.tsx` | **Implementada (100%)** | Pendiente Stitch | `POST /activities`, `GET /destinations` |

---

### H. Institucionales y Legales (4 Vistas)

| Ruta | Archivo / Componente | Estado Código | Estado Stitch | Conexión Backend |
|---|---|---|---|---|
| `/institucional/quienes-somos` | `apps/client/src/app/institucional/quienes-somos/page.tsx` | Implementada (100%) | Pendiente Stitch | Contenido estático / Editorial |
| `/institucional/contacto` | `apps/client/src/app/institucional/contacto/page.tsx` | Implementada (100%) | Pendiente Stitch | `POST /contact` |
| `/terminos` | `apps/client/src/app/terminos/page.tsx` | Implementada (100%) | Pendiente Stitch | Legal estático |
| `/privacidad` | `apps/client/src/app/privacidad/page.tsx` | Implementada (100%) | Pendiente Stitch | Legal estático |

---

### I. Páginas Especiales de Sistema (Next.js)

| Archivo | Estado Código | Propósito |
|---|---|---|
| `apps/client/src/app/not-found.tsx` | Implementada (100%) | Pantalla de Error 404 personalizada |
| `apps/client/src/app/error.tsx` | Implementada (100%) | Pantalla de Error 500 / Fallback global |
| `apps/client/src/app/loading.tsx` | Implementada (100%) | Fallback global de carga / Suspense |
