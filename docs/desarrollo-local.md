# Desarrollo local

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- Cuenta en [Clerk](https://clerk.com) con una aplicación creada
- Base de datos PostgreSQL — se recomienda [Neon](https://neon.tech) (capa gratuita)

## Pasos

### 1. Clonar e instalar

```bash
git clone https://github.com/IAW-2026/proyecto-c-etapa-1-mateandoando.git
cd proyecto-c-buyer2-mateandoando
npm install
```

### 2. Configurar variables de entorno

Crear `.env.local` en la raíz con las siguientes variables:

```env
# Clerk — obtenidas en el panel de Clerk -> API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URLs de redirección de Clerk (no requieren cambios)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Neon PostgreSQL
# Usar la URL del pooler para DATABASE_URL
DATABASE_URL=postgresql://user:password@host-pooler.neon.tech/dbname?sslmode=require

# Usar la URL directa (sin pooler) para migraciones de Prisma
DIRECT_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Tokens de servicio — deben coincidir con los de las otras apps del proyecto
X_SERVICE_TOKEN_PAYMENTS=...
X_SERVICE_TOKEN_SHIPPING=...
X_SERVICE_TOKEN_SELLER=...

# Activar mocks de las APIs externas (Seller, Payments, Shipping)
NEXT_PUBLIC_USE_MOCKS=true
```

> Con `NEXT_PUBLIC_USE_MOCKS=true` la app funciona de forma completamente autónoma, sin necesitar las otras webapps corriendo.

### 3. Aplicar migraciones e iniciar

```bash
npx prisma migrate deploy
npm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).
