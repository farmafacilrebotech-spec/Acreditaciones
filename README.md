# VIP Cards API + Frontend

Backend en Node.js/Express para generar carnets VIP con QR a partir de Excel.

## Requisitos
- Node.js 20+
- npm

## Configuracion
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar variables de entorno:
   ```bash
   copy .env.example .env
   ```
3. Ejecutar backend:
   ```bash
   npm run dev:api
   ```
4. (Opcional) Ejecutar frontend:
   ```bash
   npm run dev
   ```

## Endpoints
Base URL: `http://localhost:3001`

### POST /api/parse-excel
`multipart/form-data` con `file=<excel>`

Respuesta:
```json
{
  "members": [{ "nombre": "Juan Perez", "generar": true }],
  "columnsDetected": ["Nombre", "Generar"]
}
```

### POST /api/upload-logo
`multipart/form-data` con `file=<png/jpg>`

Respuesta:
```json
{ "logoId": "uuid" }
```

### POST /api/upload-background
`multipart/form-data` con `file=<png/jpg>`

Respuesta:
```json
{ "backgroundId": "uuid" }
```

### POST /api/generate-pdf
Body JSON:
```json
{
  "members": [{ "nombre": "Juan Perez", "generar": true }],
  "logoId": "uuid",
  "backgroundId": "uuid",
  "titleText": "VIP FALLAS 2026",
  "footerText": "FALLA ALEMANIA - EL BACHILLER"
}
```

Respuesta: PDF descargable.

### POST /api/generate-one
Body JSON:
```json
{
  "nombre": "Juan Perez",
  "logoId": "uuid",
  "backgroundId": "uuid",
  "titleText": "VIP FALLAS 2026",
  "footerText": "FALLA ALEMANIA - EL BACHILLER"
}
```

Respuesta: PDF descargable (1 tarjeta).

## Ejemplos con curl

### parse-excel
```bash
curl -X POST http://localhost:3001/api/parse-excel ^
  -F "file=@C:\ruta\members.xlsx"
```

### upload-logo
```bash
curl -X POST http://localhost:3001/api/upload-logo ^
  -F "file=@C:\ruta\logo.png"
```

### upload-background
```bash
curl -X POST http://localhost:3001/api/upload-background ^
  -F "file=@C:\ruta\fondo.jpg"
```

### generate-pdf
```bash
curl -X POST http://localhost:3001/api/generate-pdf ^
  -H "Content-Type: application/json" ^
  -d "{\"members\":[{\"nombre\":\"Juan Perez\",\"generar\":true}],\"logoId\":\"<LOGO_ID>\",\"backgroundId\":\"<BG_ID>\",\"titleText\":\"VIP FALLAS 2026\",\"footerText\":\"FALLA ALEMANIA - EL BACHILLER\"}" ^
  --output vip-cards.pdf
```

### generate-one
```bash
curl -X POST http://localhost:3001/api/generate-one ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Juan Perez\",\"logoId\":\"<LOGO_ID>\",\"backgroundId\":\"<BG_ID>\",\"titleText\":\"VIP FALLAS 2026\",\"footerText\":\"FALLA ALEMANIA - EL BACHILLER\"}" ^
  --output vip-card.pdf
```

## Pruebas manuales basicas
- Subir un Excel con columnas `Nombre` y `Generar`.
- Verificar que solo `Generar=SI` (cualquier mayus/minus) produce tarjetas.
- Subir logo PNG/JPG y reutilizar el `logoId`.
- Subir imagen de fondo PNG/JPG y reutilizar el `backgroundId`.
- Generar PDF y abrirlo para revisar layout 3x3 en A4.

## QR y fotos (nuevo flujo)
1. Coloca las fotos en `/public/fotos/` (ej: `/public/fotos/cromo_131.png`).
2. En el Excel, añade la columna `Foto` con el nombre del archivo (ej: `cromo_131.png`).
3. En la app, pulsa **Descargar members.json** y copia el archivo a `/public/members.json` antes de desplegar.
4. Para producción, define `VITE_PUBLIC_URL` en `.env` si quieres que los QRs apunten a tu dominio público.

# Acreditaciones
