[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6efcefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Tl5PKMoG)

# MateandoAndo — Buyer App

Aplicación del comprador para el marketplace **MateandoAndo**, desarrollada en el marco del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/).

Permite a los compradores explorar el catálogo de mates y accesorios, gestionar su carrito, realizar compras y hacer seguimiento de sus envíos.

## Deploy

🔗 [https://proyecto-c-buyer2-mateandoando.vercel.app](https://proyecto-c-buyer2-mateandoando.vercel.app)

## Acceso por tipo de usuario

| Rol | Email | Contraseña |
|---|---|---|
| Comprador | buyer+clerktest@iaw.com| `iawuser#` |
| Admin | buyer-admin+clerktest@iaw.com| `iawuser#` |

El **comprador** puede navegar el catálogo, agregar productos al carrito, hacer checkout y consultar el historial y seguimiento de sus compras.

El **administrador** accede al panel `/admin` donde puede ver estadísticas y gestionar los compradores registrados.

## Datos de prueba (seed)

Para poblar la cuenta del comprador con órdenes de ejemplo en distintos estados (APROBADO, RECHAZADO, REEMBOLSADO), hacer un `POST` al endpoint de seed **mientras se está autenticado** como el usuario comprador:

```bash
curl -X POST https://proyecto-c-buyer2-mateandoando.vercel.app/api/dev/seed-orders \
  -H "Cookie: <cookie de sesión de Clerk>"
```

O simplemente abrir la siguiente URL en el navegador con la sesión ya iniciada:

```
POST /api/dev/seed-orders
```

> Se puede usar cualquier cliente HTTP (Insomnia, Postman, Thunder Client) apuntando a `https://proyecto-c-buyer2-mateandoando.vercel.app/api/dev/seed-orders` con método `POST`, siempre que la cookie de sesión esté presente.

El endpoint es idempotente: si se ejecuta más de una vez, limpia los datos anteriores y recrea las órdenes desde cero. Cada ejecución genera IDs con un prefijo único por usuario, por lo que distintos compradores pueden tener sus propios datos de prueba sin colisiones.

## Desarrollo local

### Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- Cuenta en [Clerk](https://clerk.com) con una aplicación creada
- Base de datos PostgreSQL — se recomienda [Neon](https://neon.tech) (capa gratuita)

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd proyecto-c-buyer2-mateandoando
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Clerk — obtenidas en el panel de Clerk → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URLs de redirección de Clerk (no requieren cambios)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Neon PostgreSQL — obtenida en el panel de Neon → Connection string
# Usar la URL del pooler (puerto 5432) para DATABASE_URL
DATABASE_URL=postgresql://user:password@host-pooler.neon.tech/dbname?sslmode=require
# Usar la URL directa (sin pooler) para migraciones de Prisma
DIRECT_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Tokens de servicio — deben coincidir con los configurados en las otras apps del proyecto
X_SERVICE_TOKEN_PAYMENTS=...
X_SERVICE_TOKEN_SHIPPING=...
X_SERVICE_TOKEN_SELLER=...

# Activar mocks de las APIs externas (Seller, Payments, Shipping)
NEXT_PUBLIC_USE_MOCKS=true
```

> Con `NEXT_PUBLIC_USE_MOCKS=true` la app funciona completamente sin necesitar las otras webapps del proyecto corriendo. Poner en `false` solo si se quiere integrar con las APIs reales.

### 4. Aplicar migraciones y generar el cliente Prisma

```bash
npx prisma migrate deploy
npx prisma generate
```

> `migrate deploy` requiere que `DIRECT_URL` esté configurado (la URL sin pooler). Si la base de datos es nueva, esto creará todas las tablas automáticamente.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Genera el cliente Prisma, aplica migraciones y compila para producción |
| `npm run start` | Inicia el servidor en modo producción (requiere `build` previo) |
| `npm run lint` | Análisis estático con ESLint |
| `npx prisma studio` | Interfaz visual para explorar y editar la base de datos |
| `npx prisma migrate dev` | Crea y aplica una nueva migración en desarrollo |
