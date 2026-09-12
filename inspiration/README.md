# Inspiration

Referencia principal de este proyecto: un demo ya construido en Base44 (**fitness-studio-copy-02c99205.base44.app**) con el copy, estructura y disciplinas ya validados. El objetivo es reproducir este diseño — incluyendo sus animaciones — con nuestro propio stack (HTML + Tailwind + vanilla JS), no rediseñar desde cero.

**Sitio en vivo:** https://fitness-studio-copy-02c99205.base44.app/
**Subpáginas de ejemplo**
    - (detalle de disciplina): https://fitness-studio-copy-02c99205.base44.app/disciplinas/rendimiento
    - (detalle coaches): https://fitness-studio-copy-02c99205.base44.app/instructors
    - (detalle calendario/reservas): https://fitness-studio-copy-02c99205.base44.app/classes?type=Rendimiento
Antes de construir cada sección, visita el sitio en vivo con Playwright (no un fetch plano — es una app en React y necesita que cargue JS). Espera 2-3 segundos después de cargar o de hacer scroll antes de evaluar cualquier sección: tiene animaciones/reveals que no aparecen de inmediato.

## Capturas incluidas
- `Hero`, `Semana_gratis` — sección principal y CTA de primera semana gratis
- `Disciplinas_Rendimiento/Funcional/HYROX/Personalizado` — tarjetas de disciplinas
- `motivos`, `seccion_extra` — sección "Distintos por diseño"
- `coach_diego`, `coach_mariana` — sección de coaches
- `comentarios_clientes` — testimonios
- `espacio_1`, `espacio_2` — galería "El Espacio"
- `conoce_mas_disciplinas_funcional_1/2` — subpágina de detalle de disciplina (patrón a replicar para las 4)
- `reserva_calendario_1/2`, `reserva_seleccion` — flujo de reservar sesión
- `final_pagina` — footer

Si agregas una imagen de referencia específica para una pantalla, dile a Claude Code cuál usar — la regla en `CLAUDE.md` es igualar el diseño de referencia, no "mejorarlo".