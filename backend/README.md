# Innovacann Backend API

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales:
   - `MONGODB_URI`: Tu conexión de MongoDB Atlas
   - `JWT_SECRET`: Una clave secreta para JWT
   - `ADMIN_EMAIL`: Email del administrador
   - `ADMIN_PASSWORD`: Contraseña del administrador

## Crear Base de Datos MongoDB

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster (el gratuito está bien)
4. Crea un usuario de base de datos
5. Copia la connection string y pégala en `.env`

## Crear Admin

```bash
node scripts/createAdmin.js
```

## Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere token)
- `GET /api/auth/users` - Listar usuarios (admin)
- `PUT /api/auth/users/:id/approve` - Aprobar membresía (admin)

### Productos
- `GET /api/products/public` - Vista previa pública
- `GET /api/products` - Catálogo completo (miembros)
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Editar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Contenido
- `GET /api/content` - Obtener todo el contenido
- `GET /api/content/:section` - Obtener sección específica
- `PUT /api/content/:section` - Actualizar sección (admin)

## Deploy

### Railway (Recomendado)
1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio GitHub
3. Agrega las variables de entorno
4. Deploy automático

### Render
1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta el repositorio
4. Configura las variables de entorno
