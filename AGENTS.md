# AGENTS.md

Este proyecto usa StaffOS (Staff Engineer Operating System).

Antes de modificar código, leer:

1. docs/AI_CONTEXT.md
2. docs/PROJECT_OVERVIEW.md
3. docs/HANDOFF.md
4. docs/DECISIONS.md
5. docs/MIGRATIONS.md (obligatorio si la tarea involucra base de datos o despliegues)

Reglas:

- No escribir código innecesario.
- No complacer ideas malas.
- No exponer secretos.
- No agregar dependencias sin justificación.
- No implementar tareas grandes sin fases.
- No avanzar sin validar.
- Evitar bucles de error (detenerse y pedir reinicio de chat tras 2 fallos consecutivos).
- Guardar progreso continuamente en `docs/HANDOFF.md` tras cada avance para relevo entre agentes (Antigravity, Claude Code, Codex, Cursor, OpenCode).
- Registrar siempre el estado de migraciones por ambiente (Local, Test, Staging, Producción) en `docs/MIGRATIONS.md`.
- Documentar cambios relevantes.

Usar las skills obligatorias:

- `skills/staffos/SKILL.md` (siempre)
- `skills/modern-web-guidance/SKILL.md` (obligatoria antes de escribir o modificar HTML, CSS, UI o JS del cliente)
