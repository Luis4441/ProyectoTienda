# 🛒 Tienda — Sistema Comercial

Dashboard administrativo web para gestionar usuarios, clientes, proveedores, productos, ventas y reportes de una tienda.


-

## 🚀 Características Principales

- 🔐 **Autenticación con JWT**: el token se guarda en `localStorage`; sin token, redirige a `/login`.
- 👑 **Roles**: el módulo *Usuarios* solo es visible para el super admin (`admininicial`).
- 🧭 **Navegación SPA ligera**: paneles intercambiables desde un sidebar, sin recargar página.
- 👥 **CRUD de usuarios** con modal de crear/editar y confirmación de eliminación.
- ✅ **Validación en tiempo real** (`oninput` / `onblur`) con reglas espejo del backend.
- 🔎 **Búsqueda instantánea** por nombre, usuario, cédula o correo.
- 📱 **Responsive**: el sidebar se colapsa a iconos en pantallas ≤ 768 px.
- 🎨 **UI cuidada**: tema azul, animaciones suaves, estados vacíos y spinners de carga.

---

## 📦 Estructura del Proyecto

```
tienda/
├── dashboard.html        # Dashboard (HTML + CSS + JS embebidos)
├── clientes.html         # Módulo Clientes  → ruta /clientes
├── proveedores.html      # Módulo Proveedores → ruta /proveedores
├── productos.html        # Módulo Productos → ruta /productos
├── ventas.html           # Módulo Ventas → ruta /ventas
├── reportes.html         # Módulo Reportes → ruta /reportes
├── login.html            # Inicio de sesión → ruta /login
└── backend/              # API REST (/api/usuarios, ...)
```

---

## 📊 Funcionalidades del Dashboard

### Inicio
Pantalla de bienvenida personalizada con el nombre del usuario y accesos rápidos (chips) a cada módulo. El super admin ve además el chip **Usuarios**.

### Barra lateral
| Sección | Módulo | Comportamiento |
|---|---|---|
| General | Inicio | Panel de bienvenida |
| Personas | Usuarios | Solo `admininicial`; CRUD en el propio dashboard |
| Personas | Clientes | Redirige a `/clientes` |
| Personas | Proveedores | Panel con acceso a `/proveedores` |
| Inventario & Ventas | Productos | Panel con acceso a `/productos` |
| Inventario & Ventas | Ventas | Panel con acceso a `/ventas` |
| Análisis | Reportes | Panel con acceso a `/reportes` |

### Topbar
Título y badge dinámicos según el módulo activo, y fecha actual en formato `es-CO`.

### Módulo Usuarios
- **Tabla**: cédula, nombre completo, usuario, correo, rol y acciones; contador de resultados.
- **Rol**: `Admin` o `Admin Inicial`. El usuario `admininicial` está **protegido** (no se edita ni elimina).
- **Crear**: todos los campos + contraseña. **Editar**: sin contraseña.
- **Eliminar**: modal de confirmación.

### Reglas de validación

| Campo | Regla |
|---|---|
| Cédula | Solo dígitos, 5–15 |
| Nombre completo | 3–150 caracteres; letras, espacios, `-`, `'`, `.` |
| Usuario | 3–30 caracteres; letras, números, `_`, `.`, `-` |
| Correo | Formato válido, máx. 254 |
| Contraseña | 6–100 caracteres (solo al crear) |

### API consumida

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/api/usuarios` | Listar usuarios |
| `POST` | `/api/usuarios` | Crear usuario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |

Todas envían `Authorization: Bearer <token>`. Los errores múltiples del backend llegan separados por `" | "`.

---

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (variables, Grid/Flexbox, animaciones), JavaScript vanilla (ES6+, `fetch`, async/await)
- **Tipografía**: Google Fonts — Nunito y Pacifico
- **Iconos**: SVG inline
- **Autenticación**: JWT en `localStorage`
