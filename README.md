# StaffOS (Staff Engineer Operating System)

[![NPM Version](https://img.shields.io/npm/v/staffos.svg)](https://www.npmjs.com/package/staffos)
[![License](https://img.shields.io/npm/l/staffos.svg)](https://github.com/richtunic/StaffOS/blob/main/LICENSE)

Skill para agentes de IA locales que obliga a programar con criterio profesional de Staff Engineer. 

Inspirado en la idea de escribir menos código, pero agregando seguridad estricta, validación sistemática, documentación continua y una optimización extrema del uso de tokens.

---

## Objetivo

Evitar que los agentes de IA produzcan código inflado (*slop*), inseguro, o que consuman miles de tokens innecesariamente leyendo archivos irrelevantes del proyecto.

---

## Instalación rápida (NPM)

Puedes instalar e inicializar todas las reglas, comandos y plantillas directamente en cualquier proyecto ejecutando:

```bash
npx staffos
```

El instalador copiará la estructura automáticamente en tu directorio actual. Además, cuenta con un comprobador de actualizaciones asíncrono e integrado que te avisará si hay una versión superior disponible en NPM.

Para **analizar y estimar el ahorro exacto de tokens** y el costo proyectado de tu proyecto actual, ejecuta:

```bash
npx staffos estimate
```

Puedes especificar un modelo de IA en particular mediante el flag `--model` para obtener estimaciones de costos exactas basadas en las tarifas de 2026:

```bash
npx staffos estimate --model=gemini-pro
```

Los modelos de IA soportados son:
* `claude-sonnet` (Claude 4.8 Sonnet - predeterminado)
* `claude-opus` (Claude 4.8 Opus)
* `gemini-pro` (Gemini 3.1 Pro)
* `gemini-flash` (Gemini 3.5 Flash)
* `gpt-5.5` (GPT 5.5)
* `local` (Modelos locales de Ollama/Llama sin costo de API)

Este comando escaneará la base de código de tu proyecto local y generará una tabla detallada con los cálculos en tiempo real.

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

### Tres Estrategias Clave de Ahorro:
1. **Project Memory Layer (Limitar Lecturas)**: En lugar de escanear el código fuente entero, el agente está obligado a leer primero `AI_CONTEXT.md` y `HANDOFF.md`. Si es suficiente, no lee nada más.
2. **Minimal Patch Engineering**: Prohíbe reescribir archivos enteros. Al forzar cambios enfocados de pocas líneas, los tokens de salida de la API se reducen al mínimo.
3. **Progressive Implementation Protocol**: Divide las tareas grandes en fases lógicas con validaciones intermedias obligatorias. Esto evita que el agente falle al final y tenga que repetir toda la tarea desde cero.

---

## Estructura de Uso

Una vez instalado en tu proyecto local, el agente operará bajo las siguientes directrices:

* **Paso 1**: Leer [AGENTS.md](file:///Users/richtunic/Documents/Proyectos/Agent%20Skill/AGENTS.md) al inicio de la conversación.
* **Paso 2**: Utilizar la skill en [skills/staffos/SKILL.md](file:///Users/richtunic/Documents/Proyectos/Agent%20Skill/skills/staffos/SKILL.md).
* **Paso 3**: Utilizar las herramientas de comandos de revisión integradas.

---

## Comandos Disponibles

El agente puede invocar estos comandos de revisión en cualquier fase de su trabajo:

* `staffos-review`: Revisa el diff actual buscando código redundante o abstracciones prematuras.
* `staffos-audit`: Audita la arquitectura del proyecto para evitar sobreingeniería y dependencias innecesarias.
* `staffos-security`: Revisa que no existan credenciales hardcodeadas ni endpoints expuestos.
* `staffos-handoff`: Genera un informe detallado para que el siguiente agente pueda continuar el trabajo sin perder contexto.
* `staffos-help`: Muestra un menú de ayuda y los modos de operación recomendados (Lite, Full, Ultra).

---

## Licencia

MIT
