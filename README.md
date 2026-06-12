# 🌿 INNOVACANN — Sitio Web Corporativo

Sitio web oficial de la **Corporación Innovacann** (Valparaíso, Chile), asociación de
usuarios de plantas medicinales sin fines de lucro.

Sitio estático de **una sola página**: sin backend, sin base de datos y sin servicios
de pago. Las inscripciones y consultas llegan directamente por **WhatsApp**.

## 📁 Estructura

```
innovacann-web/
├── index.html       # Página única: inicio, nosotros, proceso, inscripción, contacto
├── style.css        # Estilos (paleta verde institucional, diseño sobrio)
├── script.js        # Lógica: asistente de inscripción, validaciones, autoguardado
├── config.js        # ⭐ Datos de contacto (WhatsApp, Instagram, correo) — EDITA AQUÍ
├── 404.html         # Página de error
├── robots.txt       # Indexación (actualizar dominio)
├── sitemap.xml      # Mapa del sitio (actualizar dominio)
├── vercel.json      # Configuración de despliegue y cabeceras de seguridad
└── assets/          # hero.jpg, about.jpg, favicon.svg
```

## ✏️ Cambiar datos de contacto

Edita **únicamente** [`config.js`](config.js):

```js
whatsapp: '56978900761',   // formato internacional, solo dígitos
instagram: 'innovacann',   // usuario sin @
email: 'corporacioninnovacann@gmail.com',
```

Todos los botones y enlaces del sitio (flotante, contacto, footer y el envío del
formulario) se actualizan automáticamente desde ese archivo.

## 📝 Formulario de inscripción

Asistente de 4 pasos con:

- Autocompletado del navegador (`autocomplete`) en todos los campos.
- Formateo y validación automática de RUT (dígito verificador) y teléfono chileno.
- Verificación de mayoría de edad por fecha de nacimiento.
- **Autoguardado en el navegador**: si la persona abandona, al volver puede retomar donde quedó.
- Paso 3 inteligente: pregunta por salud a pacientes y por áreas de interés a socios.
- Al enviar, se abre WhatsApp con la solicitud formateada; el postulante adjunta
  su carnet y receta médica directamente en el chat.

## 🚀 Despliegue y dominio

**Conectar el repositorio a Vercel (una sola vez):**

1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. **Add New → Project → Import** y elige `corsal2025/innovacann-web`.
3. No cambies nada (es un sitio estático, sin build) y pulsa **Deploy**.

Desde entonces, **cada push a `main` se publica automáticamente**.

**Conectar el dominio:**

1. En Vercel: **Project → Settings → Domains → Add** e ingresa tu dominio.
2. En tu proveedor de dominio, apunta los DNS según indique Vercel
   (registro `A` a `76.76.21.21` o `CNAME` a `cname.vercel-dns.com`).
3. Reemplaza `https://innovacann.cl` por tu dominio real en `robots.txt`, `sitemap.xml`
   y en las etiquetas `og:url` / `og:image` de `index.html`.

> Nota: el workflow anterior de GitHub Actions se eliminó porque nunca tuvo
> configurados los secrets de Vercel y fallaba en cada push. La integración
> nativa de Vercel lo reemplaza sin configuración adicional.

## 🛠️ Desarrollo local

No requiere instalación. Basta servir la carpeta:

```bash
npx serve .          # o
python3 -m http.server 8080
```

## 🗂️ Historial

La versión anterior (tienda con MercadoPago, blog, galería, panel admin y backend
Node/Supabase en Render) fue retirada en la simplificación de junio 2026; todo es
recuperable desde el historial de git si se necesita.
