# StaffOS (Staff Engineer Operating System)

[![NPM Version](https://img.shields.io/npm/v/staffos.svg)](https://www.npmjs.com/package/staffos)
[![License](https://img.shields.io/npm/l/staffos.svg)](https://github.com/richtunic/StaffOS/blob/main/LICENSE)

Skill y sistema operativo de trabajo para agentes de IA locales que obliga a programar con criterio profesional de **Staff Engineer**.

Inspirado en la idea de escribir menos código, pero agregando seguridad estricta, validación sistemática, **relevo continuo entre agentes**, **tracking de migraciones de base de datos por ambiente** y una optimización extrema del uso de tokens.

---

## Novedades recientes (v0.4.0)

- **Modern Web Guidance incluida (`skills/modern-web-guidance/SKILL.md`)**: Integra la skill oficial de [GoogleChrome/modern-web-guidance](https://github.com/googlechrome/modern-web-guidance) como paso obligatorio para tareas web (HTML/CSS/JS cliente), reduciendo el AI slop y patrones obsoletos mediante consulta dinámica con `npx -y modern-web-guidance@latest`.
- **Modelos de IA y tarifas actualizadas**: Soporte y estimación de costos con **Claude 5.5**, **Gemini 4 (Hydrogen, Neon, Argon)** y **GPT-6.2 / 6.1**.
- **Cross-Agent Continuity (`docs/HANDOFF.md`)**: Guarda checkpoints continuos de progreso (agente anterior, rama/commit, estado, qué funciona y siguiente paso exacto) para que otro agente (**Antigravity**, **Claude Code**, **Codex**, **Cursor**, **OpenCode**) pueda continuar exactamente donde te quedaste si se agotan los tokens.
- **Database Migrations Tracking (`docs/MIGRATIONS.md`)**: Registro vivo por ambiente (`Local`, `Test`, `Staging`, `Producción`) con estados (`Pendiente`, `Aplicada`, `No aplica`, `Rollback`) para evitar confusiones sobre qué migraciones ya se aplicaron y cuáles faltan en producción.
- **Actualización segura (`npx staffos@latest`)**: Al actualizar StaffOS en un proyecto existente, el CLI actualiza reglas y comandos y crea los documentos nuevos (como `docs/MIGRATIONS.md`) **sin sobrescribir** tus archivos existentes en `docs/`.

---

## Instalación y actualización rápida (NPM)

Para instalar o actualizar StaffOS en cualquier proyecto:

```bash
npx staffos@latest
```

El instalador copiará la estructura automáticamente en tu directorio actual y verificará si existe una versión superior disponible en NPM.

Para **analizar y estimar el ahorro exacto de tokens** y el costo proyectado de tu proyecto actual:

```bash
npx staffos estimate
```

Puedes especificar un modelo de IA en particular mediante el flag `--model`:

```bash
npx staffos estimate --model=gemini-neon
```

---

## Agentes y Modelos de IA Compatibles

### Agentes / IDEs soportados
StaffOS está diseñado para funcionar de forma nativa e intercambiable entre:

- **Antigravity (Antigravity 2.0)**
- **Claude Code**
- **OpenAI Codex**
- **Cursor**
- **OpenCode**

### Modelos de IA soportados para estimación (`--model=`)

Tarifas de referencia por 1M de tokens (Input / Output):

| Flag `--model=` | Modelo | Input / Output (1M) | Entorno principal |
| :--- | :--- | :---: | :--- |
| `claude-sonnet` | **Claude 5.5 Sonnet** *(predeterminado)* | $2.00 / $10.00 | Claude Code / Cursor |
| `claude-opus` | **Claude 5.5 Opus** | $4.00 / $20.00 | Claude Code / Cursor |
| `claude-haiku` | **Claude 5.5 Haiku** | $0.10 / $0.50 | Claude Code / API |
| `gemini-hydrogen` | **Gemini 4 Hydrogen** | $1.50 / $7.50 | Antigravity / OpenCode |
| `gemini-neon` | **Gemini 4 Neon** | $3.00 / $15.00 | Antigravity 2.0 |
| `gemini-argon` | **Gemini 4 Argon / Carbon** | $4.00 / $20.00 | Antigravity / Deep Reasoning |
| `gpt-6-sol` | **GPT-6.2 Sol** | $2.00 / $10.00 | OpenAI Codex |
| `gpt-6-astra` | **GPT-6.2 Astra** | $8.00 / $40.00 | OpenAI Codex / Flagship |
| `gpt-6-terra` | **GPT-6.1 Terra** | $1.00 / $5.00 | OpenAI API |
| `local` | **Modelos locales (Ollama / DeepSeek / Llama)** | $0.00 / $0.00 | Local (sin costo de API) |

---

## Ahorro de Tokens e Impacto

Una de las mayores ventajas de usar **StaffOS** es el drástico ahorro de tokens (entrada/salida) y reducción de costos de API. Los agentes tradicionales suelen leer todo el repositorio e implementar refactorizaciones masivas. **StaffOS** limita esto mediante reglas estrictas de parcheo y la lectura secuencial de documentación viva.

### Tabla Comparativa de Consumo de Tokens

| Métrica / Escenario | Agente Tradicional (Sin restricciones) | Con **StaffOS** | Ahorro Promedio |
| :--- | :--- | :--- | :--- |
| **Escaneo Inicial del Proyecto** | ~35,000 tokens (Lectura completa) | ~1,500 tokens (Docs de contexto) | **~95%** |
| **Generación de Código** | ~4,500 tokens (Refactorizaciones completas) | ~400 tokens (Diff/parche minimalista) | **~90%** |
| **Ciclos de Prueba y Error** | 3 - 5 iteraciones por tarea | 1 iteración (Planificado y validado) | **~75%** |
| **Costo Estimado por Tarea** | $0.25 - $0.80 USD | $0.02 - $0.06 USD | **~85% - 90%** |

### Estrategias Clave de Ahorro y Continuidad

1. **Project Memory Layer (Limitar Lecturas)**: En lugar de escanear el código fuente entero, el agente lee primero `docs/AI_CONTEXT.md`, `docs/PROJECT_OVERVIEW.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md` y `docs/MIGRATIONS.md`.
2. **Cross-Agent Continuity (Relevo sin pérdida)**: Guarda checkpoints continuos en `docs/HANDOFF.md` tras cada avance para cambiar de agente o continuar tras agotar tokens sin repetir trabajo.
3. **Database Migrations Tracking (`docs/MIGRATIONS.md`)**: Registra qué migraciones están aplicadas en `Local`, `Test`, `Staging` y cuáles siguen pendientes en `Producción`.
4. **Minimal Patch Engineering**: Prohíbe reescribir archivos enteros. Al forzar cambios enfocados de pocas líneas, los tokens de salida se reducen al mínimo.
5. **Progressive Implementation Protocol**: Divide las tareas grandes en fases lógicas con validaciones intermedias obligatorias.
6. **Error Loop Mitigation**: Detiene al agente tras 2 fallos consecutivos del mismo error y genera un handoff limpio para reiniciar la sesión sin ruido.

---

## Estructura de Uso

Una vez instalado en tu proyecto local, el agente operará bajo las siguientes directrices:

- **Paso 1**: Leer [`AGENTS.md`](./AGENTS.md) al inicio de la conversación.
- **Paso 2**: Utilizar la skill en [`skills/staffos/SKILL.md`](./skills/staffos/SKILL.md).
- **Paso 3**: Mantener actualizados [`docs/HANDOFF.md`](./docs/HANDOFF.md) y [`docs/MIGRATIONS.md`](./docs/MIGRATIONS.md).

---

## Comandos Disponibles

El agente puede invocar estos comandos de revisión en cualquier fase de su trabajo:

- `staffos-review`: Revisa el diff actual buscando código redundante o abstracciones prematuras.
- `staffos-audit`: Audita la arquitectura del proyecto para evitar sobreingeniería y dependencias innecesarias.
- `staffos-security`: Revisa que no existan credenciales hardcodeadas ni endpoints expuestos.
- `staffos-handoff`: Genera un checkpoint detallado (incluyendo migraciones de DB pendientes) para que el siguiente agente continúe sin perder contexto.
- `staffos-help`: Muestra un menú de ayuda y los modos de operación recomendados (Lite, Full, Ultra).

---

## Licencia

MIT
