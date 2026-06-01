[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6efcefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Tl5PKMoG)

# MateandoAndo — Buyer App

🔗 **[https://proyecto-c-buyer2-mateandoando.vercel.app](https://proyecto-c-buyer2-mateandoando.vercel.app)**

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Comprador-admin | buyer+clerktest@iaw.com| `iawuser#` |

---

## Instrucciones para evaluar la aplicación

**Como comprador**:
1. Navegá el catálogo desde la página de inicio — explorá por categoría o ingresá al detalle de un producto.
2. Agregá productos al carrito y realizá el checkout ingresando una dirección. El código postal autocompleta la ciudad y provincia automáticamente.
3. El pago es simulado: siempre se aprueba.
4. Desde **Mis compras** se puede ver el historial de órdenes y el seguimiento de cada paquete.

**Para ver órdenes en distintos estados** (APROBADO, RECHAZADO, REEMBOLSADO), ejecutar el seed con una petición `POST` desde el navegador o cualquier cliente HTTP (Insomnia, Postman, etc.) mientras la sesión está activa:

```
POST https://proyecto-c-buyer2-mateandoando.vercel.app/api/dev/seed-orders
```

El endpoint es idempotente: se puede ejecutar varias veces sin problema.

**Como administrador**:
- Accedé al panel `/admin` para ver estadísticas y gestionar los compradores registrados.

> Para correr el proyecto localmente: [docs/desarrollo-local.md](docs/desarrollo-local.md)

---

## Descripción del proyecto

MateandoAndo es un marketplace especializado en mates y accesorios. Esta aplicación corresponde al lado del comprador: permite explorar el catálogo de productos, gestionar un carrito de compras, realizar el checkout con dirección de envío y hacer seguimiento de los paquetes.

El proyecto está desarrollado con Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS v4. La autenticación está a cargo de Clerk y la base de datos es PostgreSQL sobre Neon, accedida mediante Prisma. El deploy corre en Vercel.

Todas las integraciones externas (Seller App, Payments App, Shipping App) están abstraídas detrás de una capa de servicios que se puede alternar entre implementaciones reales y mocks mediante la variable de entorno `NEXT_PUBLIC_USE_MOCKS`. En el entorno de producción y evaluación la app corre íntegramente con mocks.

---

## Notas

- **API externa real:** se integra la API pública de [Nominatim (OpenStreetMap)](https://nominatim.org/) para autocompletar ciudad y provincia a partir del código postal durante el checkout. El resultado se cachea 24 horas en el servidor con `next: { revalidate: 86400 }`.
- **Estrategia de mocks:** cada servicio externo tiene su implementación mock en `/src/mocks/` y su implementación real en `/src/services/`. El switch se hace en tiempo de ejecución con una variable de entorno, sin tocar el código de los componentes.
- **Panel de administrador:** se puede acceder en `/admin`. Incluye estadísticas de compradores y listado con detalles individual.
- **Seed de órdenes:** el endpoint `/api/dev/seed-orders` genera órdenes con IDs prefijados por usuario, permite que múltiples cuentas tengan sus propios datos de prueba sin colisiones en la base de datos.
