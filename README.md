# Web Project Template

Plantilla base para empezar proyectos web nuevos con Claude Code (escalando de HTML/Tailwind → React → Next.js según se necesite).

## Uso

1. Copia esta carpeta completa a la ubicación de tu nuevo proyecto y renómbrala.
2. Llena `business_info/`, `brand_assets/` e `inspiration/` con lo que tengas disponible (puedes dejarlas vacías si el proyecto no lo requiere).
3. Instala dependencias:
   ```
   npm install
   npx playwright install chromium
   ```
4. Instala el skill de diseño ui-ux-pro-max en este proyecto (una sola vez por proyecto, no viene incluido en la plantilla):
   ```
   npx ui-ux-pro-max-cli init --ai claude
   ```
   Requiere Python 3.x instalado (lo usan sus scripts de búsqueda).
5. Abre el proyecto en Claude Code. `CLAUDE.md` ya tiene configuradas las reglas de stack, diseño y el flujo de screenshots.

## Comandos disponibles

- `npm run serve` — levanta un servidor local en `http://localhost:3000` (sirve la raíz del proyecto)
- `npm run screenshot -- http://localhost:3000 [label]` — toma una captura de pantalla y la guarda en `temporary-screenshots/`
