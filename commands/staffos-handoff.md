# StaffOS Handoff

Actualiza el estado del proyecto para que otro agente (Antigravity, Claude Code, Codex, Cursor, OpenCode) pueda retomar el progreso inmediatamente sin perder contexto si se agotan los tokens.

Actualizar:

- `docs/HANDOFF.md`
- `docs/CHANGELOG_AI.md`
- `docs/MIGRATIONS.md` (si hubo cambios de base de datos o migraciones aplicadas/pendientes)
- `docs/DECISIONS.md` (si hubo decisiones técnicas relevantes)
- `docs/AI_CONTEXT.md` (si cambió arquitectura o stack)

`docs/HANDOFF.md` debe incluir:

```txt
Último agente / herramienta:
Fecha y hora:
Rama / Commit base:
Estado de la tarea:
Última tarea:
Progreso completado (Checkpoint):
Archivos modificados:
Qué funciona:
Qué falta (Siguiente paso exacto):
Migraciones de DB pendientes (Test / Staging / Producción):
Riesgos pendientes:
Notas para el siguiente agente:
```
