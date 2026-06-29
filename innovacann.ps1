# ============================================================
# INNOVACANN — Script de Desarrollo
# Ejecutar desde la carpeta del proyecto
# ============================================================

param(
    [switch]$Install,
    [switch]$Serve,
    [switch]$Deploy,
    [switch]$Design,
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  INNOVACANN — Script de Desarrollo" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# ── Funciones ──────────────────────────────────────────────

function Show-Menu {
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "  1. Instalar dependencias" -ForegroundColor Cyan
    Write-Host "  2. Servidor local (desarrollo)" -ForegroundColor Cyan
    Write-Host "  3. Abrir en navegador" -ForegroundColor Cyan
    Write-Host "  4. Generar script de diseño" -ForegroundColor Cyan
    Write-Host "  5. Deploy a Vercel" -ForegroundColor Cyan
    Write-Host "  6. Ver estructura del proyecto" -ForegroundColor Cyan
    Write-Host "  0. Salir" -ForegroundColor Cyan
    Write-Host ""
}

function Start-LocalServer {
    param([int]$ServerPort = 8080)
    
    Write-Host ""
    Write-Host "Iniciando servidor local en puerto $ServerPort..." -ForegroundColor Green
    Write-Host "URL: http://localhost:$ServerPort" -ForegroundColor Yellow
    Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
    Write-Host ""
    
    # Intentar con npx serve
    try {
        $npx = Get-Command npx -ErrorAction SilentlyContinue
        if ($npx) {
            Write-Host "Usando npx serve..." -ForegroundColor Gray
            Start-Process "http://localhost:$ServerPort"
            & npx serve . -l $ServerPort
            return
        }
    } catch {}
    
    # Intentar con Python
    try {
        $python = Get-Command python -ErrorAction SilentlyContinue
        if ($python) {
            Write-Host "Usando Python HTTP server..." -ForegroundColor Gray
            Start-Process "http://localhost:$ServerPort"
            & python -m http.server $ServerPort
            return
        }
    } catch {}
    
    # Intentar con Python3
    try {
        $python3 = Get-Command python3 -ErrorAction SilentlyContinue
        if ($python3) {
            Write-Host "Usando Python3 HTTP server..." -ForegroundColor Gray
            Start-Process "http://localhost:$ServerPort"
            & python3 -m http.server $ServerPort
            return
        }
    } catch {}
    
    Write-Host "No se encontró npx ni Python. Instala Node.js o Python." -ForegroundColor Red
}

function Show-ProjectStructure {
    Write-Host ""
    Write-Host "Estructura del proyecto:" -ForegroundColor Yellow
    Write-Host ""
    
    $structure = @"
innovacann-web/
├── index.html          # Página principal
├── style.css           # Estilos
├── script.js           # Lógica del sitio
├── config.js           # Configuración de contacto
├── 404.html            # Página de error
├── robots.txt          # SEO
├── sitemap.xml         # Sitemap
├── vercel.json         # Config Vercel
├── assets/
│   ├── hero.jpg        # Imagen hero
│   ├── about.jpg       # Imagen nosotros
│   └── favicon.svg     # Favicon
└── design/
    ├── design.md       # Documento de diseño
    └── screenshots/    # Capturas de pantalla
"@
    
    Write-Host $structure -ForegroundColor Gray
}

function New-DesignScript {
    $designDir = Join-Path $ProjectRoot "design"
    if (!(Test-Path $designDir)) {
        New-Item -ItemType Directory -Path $designDir | Out-Null
    }
    
    $screenshotsDir = Join-Path $designDir "screenshots"
    if (!(Test-Path $screenshotsDir)) {
        New-Item -ItemType Directory -Path $screenshotsDir | Out-Null
    }
    
    Write-Host ""
    Write-Host "Generando script de diseño..." -ForegroundColor Green
    
    $designScript = @"
# ============================================================
# INNOVACANN — Script de Diseño
# Ejecutar desde la carpeta design/
# ============================================================

## Paleta de Colores
- Verde institucional: #2D5A3D
- Verde claro: #3D7A52
- Verde oscuro: #1E3F2B
- Fondo: #F8F9FA
- Texto: #1A1A2E

## Tipografía
- Headings: Outfit (600-700)
- Body: Inter (400-500)

## Secciones a Rediseñar

### 1. Hero
- Gradiente más dramático
- Animación sutil en badge
- Elemento flotante decorativo

### 2. Nosotros
- Grid 2x2 mejorado
- Hover effects en stats

### 3. Proceso (3 pasos)
- Línea conectora visual
- Cards con elevación

### 4. Testimonios (NUEVA)
- Fondo gradiente verde
- 3 tarjetas glassmorphism
- Stats strip

### 5. Wizard
- Transiciones suaves
- Progress bar animado
- Error shake animation

### 6. Contacto
- Cards con hover lift
- Iconos animados

### 7. Footer
- Logo mejorado
- Social links animados

## Imágenes Necesarias
- hero.jpg (1200x600)
- about.jpg (600x400)
- testimonials/ (avatars)
- team/ (fotos equipo)

## Anotaciones para OpenPencil
- Usar #2D5A3D como color principal
- Border-radius: 12-16px
- Sombras suaves
- Transiciones 0.25s cubic-bezier
- Responsive: 920px, 768px, 480px
"@
    
    $designScript | Out-File -FilePath (Join-Path $designDir "design-spec.md") -Encoding UTF8
    
    Write-Host "Script de diseño creado en: design/design-spec.md" -ForegroundColor Green
    Write-Host ""
}

function Push-ToVercel {
    Write-Host ""
    Write-Host "Desplegando a Vercel..." -ForegroundColor Green
    
    try {
        $vercel = Get-Command vercel -ErrorAction SilentlyContinue
        if ($vercel) {
            & vercel --prod
            Write-Host "Deploy completado!" -ForegroundColor Green
        } else {
            Write-Host "Vercel CLI no instalado. Instala con: npm i -g vercel" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error al desplegar: $_" -ForegroundColor Red
    }
}

# ── Modo directo ───────────────────────────────────────────

if ($Install) {
    Write-Host "Instalando dependencias..." -ForegroundColor Green
    npm install
    exit 0
}

if ($Serve) {
    Start-LocalServer -ServerPort $Port
    exit 0
}

if ($Design) {
    New-DesignScript
    exit 0
}

if ($Deploy) {
    Push-ToVercel
    exit 0
}

# ── Menú interactivo ───────────────────────────────────────

$running = $true
while ($running) {
    Show-Menu
    $choice = Read-Host "Selecciona una opcion"
    
    switch ($choice) {
        "1" {
            Write-Host "Instalando..." -ForegroundColor Green
            npm install 2>$null
            Write-Host "Listo!" -ForegroundColor Green
        }
        "2" {
            Start-LocalServer -ServerPort $Port
        }
        "3" {
            Start-Process "http://localhost:$Port"
        }
        "4" {
            New-DesignScript
        }
        "5" {
            Push-ToVercel
        }
        "6" {
            Show-ProjectStructure
        }
        "0" {
            $running = $false
        }
        default {
            Write-Host "Opcion no valida" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Pause
    Clear-Host
}

Write-Host "Hasta luego!" -ForegroundColor Green
