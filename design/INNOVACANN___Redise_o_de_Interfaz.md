# INNOVACANN — Rediseño de Interfaz

## Paleta de Colores

### Primarios
- **Verde institucional**: `#2D5A3D` (principal)
- **Verde claro**: `#3D7A52` (hover)
- **Verde oscuro**: `#1E3F2B` (hover states)
- **Gradiente**: `linear-gradient(135deg, #2D5A3D 0%, #4A8C63 100%)`

### Neutros
- **Fondo principal**: `#F8F9FA`
- **Fondo secundario**: `#FFFFFF`
- **Fondo acento**: `#F0F7F2`
- **Texto principal**: `#1A1A2E`
- **Texto secundario**: `#5A6275`
- **Texto claro**: `#8E95A5`
- **Bordes**: `#E8ECF0`

### Funcionales
- **WhatsApp**: `#25D366`
- **Instagram**: `#C13584`
- **Error**: `#C0392B`
- **Éxito**: `#1E8E5A`

## Tipografía

- **Headings**: Outfit (600-700 weight)
- **Body**: Inter (400-500 weight)
- **Tamaños**: H1 clamp(2.2rem, 5vw, 3.5rem), H2 clamp(1.8rem, 3.5vw, 2.5rem)

## Secciones del Sitio

### 1. Navegación (Navbar)
- Logo a la izquierda con ícono verde
- Links: Nosotros, Cómo funciona, Contacto
- Botón CTA: "Inscríbete" con gradiente verde
- Fixed position, backdrop blur al scroll

### 2. Hero Section
- Layout: 2 columnas (60% texto / 40% imagen)
- Badge superior: "Corporación sin fines de lucro"
- Título con gradiente verde en texto destacado
- Subtítulo descriptivo
- 2 botones: "Quiero inscribirme" (primario) + "Conócenos" (secundario)
- Trust signals: checkmarks con beneficios
- Imagen con bordes redondeados y sombra
- Elemento flotante decorativo (stats)

### 3. Nosotros
- Layout: 2 columnas (60% contenido / 40% imagen)
- Tag de sección: "Nosotros"
- Título: "¿Quiénes somos?"
- 2 párrafos descriptivos
- Grid 2x2 de estadísticas con íconos
- Imagen del equipo con borde decorativo

### 4. Cómo funciona (Proceso)
- Layout: 3 columnas con línea conectora
- Tag: "Proceso"
- Título: "¿Cómo hacerse socio?"
- 3 tarjetas numeradas (01, 02, 03)
- Cada tarjeta: ícono, título, descripción
- Hover: elevación + borde verde

### 5. Testimonios (NUEVA)
- Fondo: gradiente verde oscuro
- 3 tarjetas de testimonios
- Cada una: estrellas, texto, avatar, nombre
- Stats strip: 4 números destacados
- Efecto glassmorphism en tarjetas

### 6. Inscripción (Wizard)
- Formulario de 4 pasos con barra de progreso
- Paso 1: Selección de tipo (Paciente/Socio/Ambos)
- Paso 2: Datos personales (nombre, RUT, email, teléfono, fecha, comuna)
- Paso 3: Salud o participación según tipo
- Paso 4: Resumen y consentimiento
- Envío por WhatsApp
- Autoguardado en localStorage

### 7. Contacto
- Layout: 3 columnas
- Tarjetas: WhatsApp, Instagram, Email
- Cada tarjeta: ícono grande, nombre, dato, CTA
- Horario de atención

### 8. Footer
- Fondo oscuro (#0F1713)
- Logo + RUT
- Links sociales
- Copyright + disclaimer

## Estilos de Componentes

### Botones
- **Primario**: Gradiente verde, texto blanco, border-radius 50px
- **Secundario**: Borde verde, texto verde, fill al hover
- **WhatsApp**: Verde WhatsApp (#25D366)
- **Hover**: Elevación + sombra accent

### Tarjetas
- Border-radius: 12-16px
- Sombra suave
- Hover: elevación + borde verde
- Transiciones suaves (0.25s cubic-bezier)

### Formularios
- Inputs: border 2px, border-radius 10px
- Focus: borde verde + glow ring
- Labels: bold, 0.9rem
- Hints: italic, color claro

### Wizard
- Progress bar con gradiente
- Dots de paso con animación
- Transición entre pasos: fade + slide
- Error messages: shake animation

## Animaciones

- **Entrada**: fade-in + slide-up (0.6s)
- **Hover**: transform translateY(-4px)
- **Modal**: slide-up + scale
- **Success**: pop + bounce
- **Float**: translateY alternante (3s)

## Responsive

- **920px**: Stack grid a 1 columna
- **768px**: Menú hamburguesa, forms monocolumno
- **480px**: Botones full-width, tipografía reducida

## Iconos

- Fuente: Font Awesome 6.5.1
- Estilo: Solid + Brands
- Tamaño base: 1rem
- Color: hereda del contexto

## Imágenes

- **hero.jpg**: Hero section, 460px height, object-fit cover
- **about.jpg**: Sección nosotros, 480px height
- **favicon.svg**: Logo SVG

## Estructura HTML

```
- Modal edad (verificación)
- Navbar fixed
- Mobile menu
- Hero
- Nosotros
- Proceso (3 pasos)
- Testimonios (NUEVA)
- Inscripción (wizard 4 pasos)
- Contacto
- Footer
- WhatsApp float
```

## Archivos del Proyecto

- `index.html` - Estructura principal
- `style.css` - Estilos completos
- `script.js` - Lógica del sitio
- `config.js` - Configuración de contacto
- `design/design.md` - Este archivo de diseño
- `innovacann.ps1` - Script de desarrollo
